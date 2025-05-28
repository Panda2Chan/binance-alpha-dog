import StorageUtils from "./storage";
import TransactionUtils from "./transaction";

/**
 * API相关工具函数
 */
export default class ApiUtils {
    static BSC_SCAN_API_URL = 'https://api.bscscan.com/api';
    static BINANCE_API_URL = 'https://api.binance.com/api/v3/ticker/price';
    static TARGET_CONTRACT = '0xb300000b72DEAEb607a12d5f54773D1C19c7028d'.toLowerCase();
    // 价格缓存
    static priceCache = new Map();
    static cacheExpiry = new Map();
    static CACHE_DURATION = 60 * 1000; // 1分钟缓存


    // 添加正在请求的Promise缓存
    static pendingRequests = new Map();

    /**
     * 从BSCScan API获取交易
     * @param {string} address - 地址
     * @param {string} action - 操作类型 (txlist, txlistinternal, tokentx)
     * @param {string} apiKey - BSCScan API密钥
     * @returns {Promise<Array>} 交易列表
     */
    static async fetchTransactions(address, action, apiKey = null) {
        // 如果未提供API密钥，则从本地存储获取
        const key = apiKey  || StorageUtils.loadApiKey() ;

        while (true) {

            try {
                const url = `${this.BSC_SCAN_API_URL}?module=account&action=${action}&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${key}`;

                const response = await fetch(url);
                const data = await response.json();

                if (data.status === '1') {
                    return data.result || [];
                } else if (data.status === "0" && data.message === "No transactions found") {
                    return [];
                } else if (data.status === "0" && data.message == "NOTOK") {

                    console.log(address, action, data)
                    console.warn(`获取${action}时API返回错误:`, data.message);
                    return [];
                }
            } catch (error) {
                console.error(`获取${action}时出错:`, error);
                throw new Error(`获取${action}数据失败`);
            }
        }
    }


    /**
     * 批量获取多个地址的交易数据
     * @param {Array} addresses - 地址列表
     * @param {Function} progressCallback - 进度回调函数
     * @returns {Promise<Object>} 地址交易数据映射
     */
    static async fetchMultipleAddressesData(addresses, progressCallback = null) {
        const transactionsData = {};
        let completed = 0;

        for (const address of addresses) {
            try {
                const transactions = await this.fetchAddressData(address);
                transactionsData[address] = transactions;

                completed++;
                if (progressCallback) {
                    progressCallback(completed, addresses.length);
                }
            } catch (error) {
                console.error(`获取地址 ${address} 的交易数据失败:`, error);
                // 继续处理其他地址
            }
        }

        return transactionsData;
    }

    static async fetchTokenPrice(symbol) {
        // 特殊处理的代币，使用本地配置
        const localPriceTokens = ['USDC', 'BSC-USD', 'USDT'];
        if (localPriceTokens.includes(symbol)) {
            const tokenPrices = StorageUtils.loadTokenPrices();
            return parseFloat(tokenPrices[symbol] || '1');
        }

        // 检查缓存
        const cacheKey = symbol.toUpperCase();
        const now = Date.now();

        // 如果缓存存在且未过期，直接返回缓存值
        if (this.priceCache.has(cacheKey) &&
            this.cacheExpiry.has(cacheKey) &&
            this.cacheExpiry.get(cacheKey) > now) {
            return this.priceCache.get(cacheKey);
        }

        // 如果正在请求中，等待现有请求完成
        if (this.pendingRequests.has(cacheKey)) {
            return await this.pendingRequests.get(cacheKey);
        }

        // 创建新的请求Promise并缓存
        const requestPromise = this.fetchTokenPriceFromAPI(symbol, cacheKey, now);
        this.pendingRequests.set(cacheKey, requestPromise);

        try {
            const price = await requestPromise;
            return price;
        } finally {
            // 请求完成后清除pending状态
            this.pendingRequests.delete(cacheKey);
        }
    }

    // 新增实际的API请求方法
    static async fetchTokenPriceFromAPI(symbol, cacheKey, now) {
        try {
            // 构建Binance交易对符号
            let tradingPair = `${symbol.toUpperCase()}USDT`;

            // 特殊处理一些代币符号
            if (symbol.toUpperCase() === 'BNB') {
                tradingPair = 'BNBUSDT';
            } else if (symbol.toUpperCase() === 'ETH') {
                tradingPair = 'ETHUSDT';
            } else if (symbol.toUpperCase() === 'BTC') {
                tradingPair = 'BTCUSDT';
            }

            const url = `${this.BINANCE_API_URL}?symbol=${tradingPair}`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.price) {
                const price = parseFloat(data.price);

                // 缓存价格
                this.priceCache.set(cacheKey, price);
                this.cacheExpiry.set(cacheKey, now + this.CACHE_DURATION);

                return price;
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            console.warn(`获取 ${symbol} 价格失败:`, error.message);

            // 如果API失败，尝试从本地配置获取
            const tokenPrices = StorageUtils.loadTokenPrices();
            if (tokenPrices[symbol]) {
                const price = parseFloat(tokenPrices[symbol]);
                // 缓存本地价格
                this.priceCache.set(cacheKey, price);
                this.cacheExpiry.set(cacheKey, now + this.CACHE_DURATION);
                return price;
            }

            // 如果都失败，返回0并缓存
            this.priceCache.set(cacheKey, 0);
            this.cacheExpiry.set(cacheKey, now + this.CACHE_DURATION);
            return 0;
        }
    }

    /**
     * 批量获取代币价格
     * @param {Array} symbols - 代币符号数组
     * @returns {Promise<Object>} 代币价格映射
     */
    static async fetchMultipleTokenPrices(symbols) {
        const priceMap = {};
        const uniqueSymbols = [...new Set(symbols)];

        // 并发获取价格，但限制并发数量以避免API限制
        const BATCH_SIZE = 5;
        for (let i = 0; i < uniqueSymbols.length; i += BATCH_SIZE) {
            const batch = uniqueSymbols.slice(i, i + BATCH_SIZE);
            const pricePromises = batch.map(async symbol => {
                try {
                    const price = await this.fetchTokenPrice(symbol);
                    return { symbol, price };
                } catch (error) {
                    console.warn(`获取 ${symbol} 价格失败:`, error);
                    return { symbol, price: 0 };
                }
            });

            const results = await Promise.all(pricePromises);
            results.forEach(({ symbol, price }) => {
                priceMap[symbol] = price;
            });

            // 添加小延迟以避免API限制
            if (i + BATCH_SIZE < uniqueSymbols.length) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }

        return priceMap;
    }

    /**
     * 获取地址的所有交易数据
     * @param {string} address - 地址
     * @param {string} apiKey - BSCScan API密钥
     * @returns {Promise<Array>} 交易列表
     */
    static async fetchAddressData(address) {
        try {
            // 获取外部交易
            const normalTxList = await this.fetchTransactions(address, 'txlist');
            // 获取内部交易
            const internalTxList = await this.fetchTransactions(address, 'txlistinternal');
            // 获取代币交易
            const tokenTxList = await this.fetchTransactions(address, 'tokentx');

            // 合并和处理交易数据
            const allTransactions = TransactionUtils.processTransactions(address, normalTxList, internalTxList, tokenTxList);
           
            // 筛选与目标合约的交易
            const filteredTransactions = allTransactions.filter(tx =>
                tx.to.toLowerCase() === this.TARGET_CONTRACT ||
                tx.from.toLowerCase() === this.TARGET_CONTRACT
            );
         
            console.log(address, filteredTransactions.length)
            return filteredTransactions.slice(0, 15 * 100);
        } catch (error) {
            console.error(`获取地址 ${address} 的交易数据时出错:`, error);
            throw error;
        }
    }

    /**
   * 清除价格缓存
   */
    static clearPriceCache() {
        this.priceCache.clear();
        this.cacheExpiry.clear();
    }

    /**
     * 获取缓存统计信息
     * @returns {Object} 缓存统计
     */
    static getCacheStats() {
        const now = Date.now();
        let validCacheCount = 0;
        let expiredCacheCount = 0;

        this.cacheExpiry.forEach((expiry, symbol) => {
            if (expiry > now) {
                validCacheCount++;
            } else {
                expiredCacheCount++;
            }
        });

        return {
            totalCached: this.priceCache.size,
            validCache: validCacheCount,
            expiredCache: expiredCacheCount
        };
    }
}