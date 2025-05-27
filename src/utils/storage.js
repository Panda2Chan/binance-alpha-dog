/**
 * 本地存储工具函数
 */
export default class StorageUtils {


    static DB_NAME = 'TransactionDB';
    static DB_VERSION = 1;
    static STORE_NAME = 'transactions';

    // 存储键名常量
    static KEYS = {
        ADDRESSES: 'bsc_manager_addresses',
        TRANSACTIONS: 'bsc_manager_transactions',
        TOKEN_PRICES: 'bsc_token_prices',
        API_KEY: 'bscscan_api_key',
        SEEN_COVER: 'bsc_analyzer_has_seen_cover_20250524_2',
        SEEN_COVER_X: 'bsc_analyzer_has_seen_cover',
        ADDRESS_NOTES: 'bsc_address_notes' // 新增这一行
    };

    /**
     * 保存地址列表到本地存储
     * @param {Array} addresses - 地址列表
     */
    static saveAddresses(addresses) {
        if (!Array.isArray(addresses)) {
            console.error('保存地址列表失败：不是数组');
            return;
        }
        localStorage.setItem(this.KEYS.ADDRESSES, JSON.stringify(addresses));
    }


    // IndexedDB 有更大的存储限制（通常几百MB到几GB）
    static async openDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('MyDB', 1);

            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains('data')) {
                    db.createObjectStore('data', { keyPath: 'id' });
                }
            };

            request.onsuccess = (e) => resolve(e.target.result);
            request.onerror = (e) => reject(e);
        });
    }

    static async storeData(key, value) {
        const db = await openDB();
        const transaction = db.transaction(['data'], 'readwrite');
        const store = transaction.objectStore('data');
        store.put({ id: key, data: value });
    }

    static async readData(key) {
        const db = await openDB();
        const transaction = db.transaction(['data'], 'readwrite');
        const store = transaction.objectStore('data');
        store.put({ id: key, data: value });
    }
    /**
     * 从本地存储加载地址列表
     * @returns {Array} 地址列表
     */
    static loadAddresses() {
        const addresses = localStorage.getItem(this.KEYS.ADDRESSES);
        return addresses ? JSON.parse(addresses) : [];
    }

    /**
     * 保存交易数据到本地存储
     * @param {Object} transactions - 交易数据对象
     */
    static saveTransactions(transactions) {
        if (!transactions || typeof transactions !== 'object') {
            console.error('保存交易数据失败：无效数据格式');
            return;
        }

        localStorage.removeItem(this.KEYS.TRANSACTIONS)
        localStorage.setItem(this.KEYS.TRANSACTIONS, JSON.stringify(transactions));
    }

    /**
     * 从本地存储加载交易数据
     * @returns {Object} 交易数据对象
     */
    static loadTransactions() {
        const transactions = localStorage.getItem(this.KEYS.TRANSACTIONS);
        return transactions ? JSON.parse(transactions) : {};
    }

    /**
     * 保存代币价格到本地存储
     * @param {Object} tokenPrices - 代币价格对象
     */
    static saveTokenPrices(tokenPrices) {
        if (!tokenPrices || typeof tokenPrices !== 'object') {
            console.error('保存代币价格失败：无效数据格式');
            return;
        }
        localStorage.setItem(this.KEYS.TOKEN_PRICES, JSON.stringify(tokenPrices));
    }

    /**
     * 从本地存储加载代币价格
     * @returns {Object} 代币价格对象
     */
    static loadTokenPrices() {
        const tokenPrices = localStorage.getItem(this.KEYS.TOKEN_PRICES);

        if (tokenPrices) {
            try {
                return JSON.parse(tokenPrices);
            } catch (error) {
                console.error('解析代币价格时出错:', error);
            }
        }

        // 默认价格
        const defaultPrices = {
            "USDC": "1",
            "BNB": "600",
            "BSC-USD": "1",
            "USDT": "1"
        };

        // 保存默认价格
        this.saveTokenPrices(defaultPrices);

        return defaultPrices;
    }

    /**
     * 保存API密钥到本地存储
     * @param {string} apiKey - BSCScan API密钥
     */
    static saveApiKey(apiKey) {
        if (!apiKey || typeof apiKey !== 'string') {
            console.error('保存API密钥失败：无效数据格式');
            return;
        }
        localStorage.setItem(this.KEYS.API_KEY, apiKey);
    }

    /**
     * 从本地存储加载API密钥
     * @returns {string} API密钥
     */
    static loadApiKey() {
        return localStorage.getItem(this.KEYS.API_KEY) || 'JWEWSTSQ61Q83KS8ZHP5M95596WZWU5NYM';
    }

    /**
     * 保存任意数据到本地存储
     * @param {string} key - 存储键名
     * @param {any} value - 要存储的值
     */
    static save(key, value) {
        if (typeof value === 'object') {
            localStorage.setItem(key, JSON.stringify(value));
        } else {
            localStorage.setItem(key, value);
        }
    }

    /**
     * 从本地存储加载数据
     * @param {string} key - 存储键名
     * @param {boolean} parseJson - 是否解析为JSON
     * @returns {any} 加载的数据
     */
    static load(key, parseJson = false) {
        const data = localStorage.getItem(key);

        if (parseJson && data) {
            try {
                return JSON.parse(data);
            } catch (error) {
                console.error(`解析 ${key} 时出错:`, error);
                return null;
            }
        }

        return data;
    }

    /**
     * 从本地存储中删除数据
     * @param {string} key - 存储键名
     */
    static remove(key) {
        localStorage.removeItem(key);
    }

    /**
     * 清除所有相关的本地存储数据
     */
    static clearAll() {
        Object.values(this.KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
    }


    // 在 StorageUtils 类中添加以下方法
    /**
     * 保存地址备注到本地存储
     * @param {Object} addressNotes - 地址备注对象
     */
    static saveAddressNotes(addressNotes) {
        if (!addressNotes || typeof addressNotes !== 'object') {
            console.error('保存地址备注失败：无效数据格式');
            return;
        }
        localStorage.setItem(this.KEYS.ADDRESS_NOTES, JSON.stringify(addressNotes));
    }

    /**
     * 从本地存储加载地址备注
     * @returns {Object} 地址备注对象
     */
    static loadAddressNotes() {
        const addressNotes = localStorage.getItem(this.KEYS.ADDRESS_NOTES);
        return addressNotes ? JSON.parse(addressNotes) : {};
    }

    /**
     * 获取指定地址的备注
     * @param {string} address - 地址
     * @returns {Object|null} 地址备注对象或null
     */
    static getAddressNote(address) {
        if (!address) return null;

        const addressNotes = this.loadAddressNotes();
        const formattedAddress = address.toLowerCase();

        return addressNotes[formattedAddress] || null;
    }



    // ============ IndexedDB 扩展方法 ============

    /**
     * 初始化 IndexedDB
     * @returns {Promise<IDBDatabase>}
     */
    static async initIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

            request.onerror = () => {
                console.error('IndexedDB 初始化失败:', request.error);
                reject(request.error);
            };

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // 如果对象存储不存在，创建它
                if (!db.objectStoreNames.contains(this.STORE_NAME)) {
                    const store = db.createObjectStore(this.STORE_NAME, {
                        keyPath: 'id'
                    });

                    // 创建索引用于查询
                    store.createIndex('timestamp', 'timestamp', { unique: false });
                }
            };
        });
    }

    /**
     * 从 IndexedDB 读取交易数据，如果没有则从 LocalStorage 读取并迁移
     * @returns {Promise<Object>}
     */
    static async loadTransactionsExtended() {
        try {
            // 首先尝试从 IndexedDB 读取
            const db = await this.initIndexedDB();
            const transaction = db.transaction([this.STORE_NAME], 'readonly');
            const store = transaction.objectStore(this.STORE_NAME);

            return new Promise((resolve, reject) => {
                const request = store.get('main');

                request.onsuccess = async () => {
                    if (request.result && request.result.data) {
                        console.log('从 IndexedDB 读取交易数据');
                        console.log(request.result.data)
                        resolve(request.result.data);
                    } else {
                        // IndexedDB 中没有数据，从 LocalStorage 读取并迁移
                        console.log('IndexedDB 中无数据，从 LocalStorage 读取并迁移');
                        const localData = this.loadTransactions();

                        if (Object.keys(localData).length > 0) {
                            // 将 LocalStorage 数据迁移到 IndexedDB
                            await this.saveTransactionsToIndexedDB(localData);
                            console.log('数据已从 LocalStorage 迁移到 IndexedDB');
                        }

                        resolve(localData);
                    }
                };

                request.onerror = () => {
                    console.error('从 IndexedDB 读取失败:', request.error);
                    // 出错时回退到 LocalStorage
                    const localData = this.loadTransactions();
                    resolve(localData);
                };
            });
        } catch (error) {
            console.error('IndexedDB 操作失败，回退到 LocalStorage:', error);
            return this.loadTransactions();
        }
    }

    /**
     * 保存交易数据到 IndexedDB
     * @param {Object} transactions - 交易数据对象
     * @returns {Promise<boolean>}
     */
    static async saveTransactionsToIndexedDB(transactions) {
        if (!transactions || typeof transactions !== 'object') {
            console.error('保存到 IndexedDB 失败：无效数据格式');
            return false;
        }

        try {
            const db = await this.initIndexedDB();
            const transaction = db.transaction([this.STORE_NAME], 'readwrite');
            const store = transaction.objectStore(this.STORE_NAME);

            const dataToSave = {
                id: 'main',
                data: transactions,
                timestamp: Date.now(),
                version: this.DB_VERSION
            };

            return new Promise((resolve, reject) => {
                const request = store.put(dataToSave);

                request.onsuccess = () => {
                    console.log('交易数据已保存到 IndexedDB');
                    resolve(true);
                };

                request.onerror = () => {
                    console.error('保存到 IndexedDB 失败:', request.error);
                    resolve(false);
                };
            });
        } catch (error) {
            console.error('IndexedDB 保存操作失败:', error);
            return false;
        }
    }

    /**
     * 扩展的保存方法 - 同时保存到 LocalStorage 和 IndexedDB
     * @param {Object} transactions - 交易数据对象
     */
    static async saveTransactionsExtended(transactions) {
        if (!transactions || typeof transactions !== 'object') {
            console.error('保存交易数据失败：无效数据格式');
            return;
        }

        // 保存到 LocalStorage（保持原有逻辑）
        //this.saveTransactions(transactions);

        // 异步保存到 IndexedDB
        try {
            await this.saveTransactionsToIndexedDB(transactions);
        } catch (error) {
            console.warn('IndexedDB 保存失败，但 LocalStorage 保存成功:', error);
        }
    }

    /**
     * 清理 IndexedDB 中的数据
     * @returns {Promise<boolean>}
     */
    static async clearIndexedDBTransactions() {
        try {
            const db = await this.initIndexedDB();
            const transaction = db.transaction([this.STORE_NAME], 'readwrite');
            const store = transaction.objectStore(this.STORE_NAME);

            return new Promise((resolve) => {
                const request = store.clear();

                request.onsuccess = () => {
                    console.log('IndexedDB 交易数据已清空');
                    resolve(true);
                };

                request.onerror = () => {
                    console.error('清空 IndexedDB 失败:', request.error);
                    resolve(false);
                };
            });
        } catch (error) {
            console.error('IndexedDB 清空操作失败:', error);
            return false;
        }
    }

    /**
     * 获取存储使用情况统计
     * @returns {Promise<Object>}
     */
    static async getStorageStats() {
        const stats = {
            localStorage: {
                size: 0,
                available: false,
                data: null
            },
            indexedDB: {
                size: 0,
                available: false,
                data: null,
                timestamp: null
            }
        };

        // LocalStorage 统计
        try {
            const localData = this.loadTransactions();
            stats.localStorage.data = localData;
            stats.localStorage.size = JSON.stringify(localData).length * 2; // UTF-16
            stats.localStorage.available = true;
        } catch (error) {
            console.error('LocalStorage 统计失败:', error);
        }

        // IndexedDB 统计
        try {
            const db = await this.initIndexedDB();
            const transaction = db.transaction([this.STORE_NAME], 'readonly');
            const store = transaction.objectStore(this.STORE_NAME);

            await new Promise((resolve) => {
                const request = store.get('main');

                request.onsuccess = () => {
                    if (request.result) {
                        stats.indexedDB.data = request.result.data;
                        stats.indexedDB.size = JSON.stringify(request.result.data).length * 2;
                        stats.indexedDB.timestamp = request.result.timestamp;
                        stats.indexedDB.available = true;
                    }
                    resolve();
                };

                request.onerror = () => {
                    console.error('IndexedDB 统计失败:', request.error);
                    resolve();
                };
            });
        } catch (error) {
            console.error('IndexedDB 统计操作失败:', error);
        }

        return stats;
    }
}