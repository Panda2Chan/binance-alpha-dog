/**
 * 验证工具函数
 */
export default class ValidationUtils {
    /**
     * 验证地址是否是有效的BSC地址
     * @param {string} address - 要验证的地址
     * @returns {boolean} 是否是有效地址
     */
    static isValidAddress(address) {
        if (!address || typeof address !== 'string') {
            return false;
        }
        
        // 简单的BEP20地址格式验证
        return /^(0x)?[0-9a-fA-F]{40}$/.test(address);
    }
    
    /**
     * 验证JSON字符串是否有效
     * @param {string} jsonString - 要验证的JSON字符串
     * @returns {boolean} 是否是有效的JSON
     */
    static isValidJson(jsonString) {
        try {
            JSON.parse(jsonString);
            return true;
        } catch (e) {
            return false;
        }
    }
    
    /**
     * 验证并格式化BSC地址
     * @param {string} address - 要验证的地址
     * @returns {string|null} 格式化后的地址或null（如果无效）
     */
    static formatAddress(address) {
        if (!address || typeof address !== 'string') {
            return null;
        }
        
        const trimmedAddress = address.trim();
        if (!this.isValidAddress(trimmedAddress)) {
            return null;
        }
        
        // 确保地址小写并以0x开头
        let formattedAddress = trimmedAddress.toLowerCase();
        if (!formattedAddress.startsWith('0x')) {
            formattedAddress = '0x' + formattedAddress;
        }
        
        return formattedAddress;
    }
    
    /**
     * 验证并截断交易哈希以显示
     * @param {string} hash - 交易哈希
     * @param {number} length - 显示的长度
     * @returns {string} 截断后的哈希
     */
    static formatTransactionHash(hash, length = 10) {
        if (!hash || typeof hash !== 'string') {
            return '';
        }
        
        if (hash.length <= length * 2) {
            return hash;
        }
        
        return `${hash.substring(0, length)}...${hash.substring(hash.length - length)}`;
    }
    
    /**
     * 格式化代币数量，处理小数位数
     * @param {number} amount - 代币数量
     * @param {number} decimals - 小数位数
     * @returns {string} 格式化后的数量
     */
    static formatTokenAmount(amount, decimals = 6) {
        if (typeof amount !== 'number') {
            return '0';
        }
        
        // 检查是否接近零（避免显示极小值）
        if (Math.abs(amount) < 1e-10) {
            return '0';
        }
        
        return amount.toFixed(decimals);
    }
}