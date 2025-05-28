import ApiUtils from "./api";
import StorageUtils from "./storage";

/**
 * 交易处理工具函数
 */
export default class TransactionUtils {
    /**
     * 处理和合并交易数据
     * @param {string} userAddress - 用户地址
     * @param {Array} normalTxList - 普通交易列表
     * @param {Array} internalTxList - 内部交易列表
     * @param {Array} tokenTxList - 代币交易列表
     * @returns {Array} 处理后的交易列表
     */
    static processTransactions(userAddress, normalTxList, internalTxList, tokenTxList) {
        // 创建交易映射，以哈希为键
        const txMap = new Map();

        // 处理普通交易
        normalTxList.forEach(tx => {
            const bnbToken = 'BNB';
            const tokens = new Map();

            // 初始化BNB代币流向
            tokens.set(bnbToken, { inflow: 0, outflow: 0 });

            // 计算BNB流入/流出
            if (tx.value && parseFloat(tx.value) > 0) {
                const bnbValue = parseFloat(tx.value) / 1e18; // 转换为BNB

                if (tx.to.toLowerCase() === userAddress.toLowerCase()) {
                    // BNB流入用户地址
                    if (tx.isError === '0') {
                        tokens.get(bnbToken).inflow += bnbValue;
                    }
                } else if (tx.from.toLowerCase() === userAddress.toLowerCase()) {
                    // BNB从用户地址流出
                    if (tx.isError === '0') {
                        tokens.get(bnbToken).outflow += bnbValue;
                    }
                }
            }

            txMap.set(tx.hash, {
                hash: tx.hash,
                timeStamp: tx.timeStamp,
                from: tx.from,
                to: tx.to,

                value: tx.value, // BNB值（以wei为单位）
                gasPrice: tx.gasPrice,
                gasUsed: tx.gasUsed,
                status: tx.isError === '0' ? '成功' : '失败',
                tokens: tokens, // 将存储所有相关代币流向
                gasFee: (parseFloat(tx.gasUsed) * parseFloat(tx.gasPrice)) / 1e18 // 单位转换为BNB
            });
        });

        // 添加内部交易信息
        internalTxList.forEach(tx => {
            // 确保交易是与用户相关的
            const isUserInvolved = tx.from.toLowerCase() === userAddress.toLowerCase() ||
                tx.to.toLowerCase() === userAddress.toLowerCase();

            if (!isUserInvolved) {
                return;
            }

            if (txMap.has(tx.hash)) {
                // 如果已存在，更新BNB值
                const existingTx = txMap.get(tx.hash);

                // 添加或更新BNB代币流向
                const bnbToken = 'BNB';
                if (!existingTx.tokens.has(bnbToken)) {
                    existingTx.tokens.set(bnbToken, { inflow: 0, outflow: 0 });
                }

                const bnbValue = parseFloat(tx.value) / 1e18; // 转换为BNB
                if (tx.to.toLowerCase() === userAddress.toLowerCase()) {
                    // 流入用户地址

                    existingTx.tokens.get(bnbToken).inflow += bnbValue;
                } else if (tx.from.toLowerCase() === userAddress.toLowerCase()) {
                    // 从用户地址流出
                    existingTx.tokens.get(bnbToken).outflow += bnbValue;
                }
            } else {
                // 如果不存在，添加新交易
                const bnbToken = 'BNB';
                const bnbValue = parseFloat(tx.value) / 1e18; // 转换为BNB

                const tokenMap = new Map();
                tokenMap.set(bnbToken, {
                    inflow: tx.to.toLowerCase() === userAddress.toLowerCase() ? bnbValue : 0,
                    outflow: tx.from.toLowerCase() === userAddress.toLowerCase() ? bnbValue : 0
                });

                txMap.set(tx.hash, {
                    hash: tx.hash,
                    timeStamp: tx.timeStamp,
                    from: tx.from,
                    to: tx.to,
                    value: tx.value,
                    gasPrice: '0', // 内部交易没有单独的gas费用
                    gasUsed: '0',
                    status: '成功', // 内部交易通常是成功的
                    tokens: tokenMap,
                    gasFee: 0
                });
            }
        });

        // 添加代币交易信息
        tokenTxList.forEach(tx => {
            // 确保交易是与用户相关的
            const isUserInvolved = tx.from.toLowerCase() === userAddress.toLowerCase() ||
                tx.to.toLowerCase() === userAddress.toLowerCase();

            if (!isUserInvolved) {
                return;
            }

            const txKey = tx.hash;
            const tokenSymbol = tx.tokenSymbol || 'Unknown';
            const tokenAddress = tx.contractAddress || '';
            const tokenValue = parseFloat(tx.value) / Math.pow(10, parseInt(tx.tokenDecimal));
            const isInflow = tx.to.toLowerCase() === userAddress.toLowerCase();
            const isOutflow = tx.from.toLowerCase() === userAddress.toLowerCase();

            if (txMap.has(txKey)) {
                // 如果已存在，更新代币流向
                const existingTx = txMap.get(txKey);

                if (!existingTx.tokens.has(tokenSymbol)) {
                    existingTx.tokens.set(tokenSymbol, {
                        inflow: 0,
                        outflow: 0,
                        address: tokenAddress
                    });
                }

                if (isInflow) {
                    existingTx.tokens.get(tokenSymbol).inflow += tokenValue;
                }

                if (isOutflow) {
                    existingTx.tokens.get(tokenSymbol).outflow += tokenValue;
                }
            } else {
                // 如果不存在，添加新交易
                const tokenMap = new Map();
                tokenMap.set(tokenSymbol, {
                    inflow: isInflow ? tokenValue : 0,
                    outflow: isOutflow ? tokenValue : 0,
                    address: tokenAddress
                });

                txMap.set(txKey, {
                    hash: tx.hash,
                    timeStamp: tx.timeStamp,
                    from: tx.from,
                    to: tx.to,
                    value: '0', // 代币交易本身没有BNB转账
                    gasPrice: '0',
                    gasUsed: '0',
                    status: '成功',
                    tokens: tokenMap,
                    gasFee: 0
                });
            }
        });

        // 将Map对象转换为普通对象以便进行JSON序列化
        return Array.from(txMap.values()).map(tx => {
            const tokensObj = {};
            tx.tokens.forEach((value, key) => {
                tokensObj[key] = value;
            });
            return {
                ...tx,
                tokens: tokensObj
            };
        }).sort((a, b) => b.timeStamp - a.timeStamp);
    }

    /**
     * 按日期分组交易
     * @param {Array} transactions - 交易列表
     * @returns {Object} 按日期分组的交易
     */
    static groupTransactionsByDay(transactions) {
        // 创建日期映射，以UTC日期为键
        const dayMap = new Map();

        transactions.forEach(tx => {
            // 将时间戳转换为UTC日期 (YYYY-MM-DD格式)
            const date = new Date(parseInt(tx.timeStamp) * 1000);
            const utcDate = date.toISOString().split('T')[0];

            if (!dayMap.has(utcDate)) {
                dayMap.set(utcDate, {
                    date: utcDate,
                    transactions: [],
                    tokenStats: {},
                    totalBnb: 0
                });
            }

            // 将交易添加到对应的日期
            const dayData = dayMap.get(utcDate);
            dayData.transactions.push(tx);
            dayData.totalBnb += parseFloat(tx.gasFee);

            // 更新该日期的代币统计
            Object.entries(tx.tokens).forEach(([tokenSymbol, tokenData]) => {
                if (!dayData.tokenStats[tokenSymbol]) {
                    dayData.tokenStats[tokenSymbol] = {
                        inflow: 0,
                        outflow: 0,
                        address: tokenData.address || ''
                    };
                }

                // 累加流入和流出
                dayData.tokenStats[tokenSymbol].inflow += tokenData.inflow;
                dayData.tokenStats[tokenSymbol].outflow += tokenData.outflow;
            });
        });

        // 按日期排序（从新到旧）
        return Array.from(dayMap.entries())
            .sort((a, b) => new Date(b[0]) - new Date(a[0]));
    }

    /**
     * 计算交易统计数据
     * @param {Array} transactions - 交易列表
     * @param {Object} tokenPriceMap - 代币价格映射
     * @returns {Object} 统计数据
     */
    static async calculateStatistics(transactions, customPriceMap = null) {
        // 创建代币统计映射
        const tokenStats = {};
        let totalBnb = 0;
        let totalOutflowValue = 0;

        // 收集所有涉及的代币符号
        const allTokenSymbols = new Set();

        transactions.forEach(tx => {
            // 计算gas费
            totalBnb += parseFloat(tx.gasFee);

            // 处理每种代币
            Object.entries(tx.tokens).forEach(([tokenSymbol, tokenData]) => {
                if (!tokenStats[tokenSymbol]) {
                    tokenStats[tokenSymbol] = {
                        inflow: 0,
                        outflow: 0,
                        address: tokenData.address || ''
                    };
                }

                // 累加流入和流出
                tokenStats[tokenSymbol].inflow += tokenData.inflow;
                tokenStats[tokenSymbol].outflow += tokenData.outflow;

                // 如果有流出，添加到代币符号集合
                if (tokenData.outflow > 0) {
                    allTokenSymbols.add(tokenSymbol);
                }

            });



        });


        // 获取价格映射
        let priceMap = {};
        if (customPriceMap) {
            priceMap = customPriceMap;
        } else {
            // 获取实时价格
            try {
                priceMap = await ApiUtils.fetchMultipleTokenPrices(Array.from(allTokenSymbols));
            } catch (error) {
                console.warn('获取实时价格失败，使用本地配置:', error);
                priceMap = StorageUtils.loadTokenPrices();
            }
        }

        console.log("priceMap", priceMap)

        // 计算总流出价值
        Object.entries(tokenStats).forEach(([tokenSymbol, stats]) => {
            // 尝试通过代币符号或地址查找价格
            let tokenPrice = 0;

            if (priceMap[tokenSymbol] !== undefined) {
                tokenPrice = parseFloat(priceMap[tokenSymbol]);
            } else if (stats.address && priceMap[stats.address] !== undefined) {
                tokenPrice = parseFloat(priceMap[stats.address]);
            }

            if (tokenPrice > 0) {
                totalOutflowValue += stats.outflow * tokenPrice;
            }

        });

        return {
            totalBnb,
            tokenStats,
            totalOutflowValue,
            transactionCount: transactions.length
        };
    }

    /**
     * 查找不平衡的代币（流入流出不相等）
     * @param {Object} tokenStats - 代币统计数据
     * @returns {Array} 不平衡的代币列表
     */
    static findImbalancedTokens(tokenStats) {
        const imbalancedTokens = [];

        Object.entries(tokenStats).forEach(([symbol, stats]) => {
            const netFlow = stats.inflow - stats.outflow;
            // 如果净流动量不为零且数值有一定意义（避免显示极小数值）
            if (Math.abs(netFlow) > 0.000001) {
                imbalancedTokens.push({
                    symbol: symbol,
                    inflow: stats.inflow,
                    outflow: stats.outflow,
                    netFlow: netFlow,
                    address: stats.address || ''
                });
            }
        });

        // 按照绝对净流量大小降序排序
        return imbalancedTokens.sort((a, b) => Math.abs(b.netFlow) - Math.abs(a.netFlow));
    }

    /**
     * 获取所有有流出值的代币
     * @param {Object} tokenStats - 代币统计数据
     * @returns {Array} 有流出值的代币列表
     */
    static getOutflowTokens(tokenStats) {
        const outflowTokens = [];

        Object.entries(tokenStats).forEach(([symbol, stats]) => {
            if (stats.outflow > 0.000001) {
                outflowTokens.push({
                    symbol: symbol,
                    outflow: stats.outflow,
                    address: stats.address || ''
                });
            }
        });

        // 按照流出量大小降序排序
        return outflowTokens.sort((a, b) => b.outflow - a.outflow);
    }

    /**
     * 计算代币价值
     * @param {string} symbol - 代币符号
     * @param {number} amount - 代币数量
     * @param {Object} tokenPriceMap - 代币价格映射
     * @returns {number} 代币价值
     */
    static calculateTokenValue(symbol, amount, tokenPriceMap) {
        if (tokenPriceMap[symbol] !== undefined) {
            return amount * parseFloat(tokenPriceMap[symbol]);
        }

        // 找不到价格
        return 0;
    }

    /**
     * 计算积分
     * @param {number} outflowValue - 流出价值
     * @returns {number} 积分
     */
    static calculatePoints(outflowValue) {
        if (outflowValue <= 0) return 0;

        // 积分计算逻辑：1 + log2(流出价值)
        const points = Math.floor(Math.log2(outflowValue));
        return points > 0 ? points : 0;
    }
}