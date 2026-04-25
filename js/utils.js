/**
 * 海草房可视化 - 工具函数模块
 */

const HaicaofangUtils = {
    /**
     * 格式化数字（添加千位分隔符）
     * @param {number} num - 要格式化的数字
     * @returns {string} 格式化后的字符串
     */
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    /**
     * 格式化百分比
     * @param {number} value - 值
     * @param {number} total - 总数
     * @param {number} decimals - 小数位数
     * @returns {string} 百分比字符串
     */
    formatPercent(value, total, decimals = 1) {
        if (total === 0) return '0%';
        return ((value / total) * 100).toFixed(decimals) + '%';
    },

    /**
     * 防抖函数
     * @param {Function} func - 要执行的函数
     * @param {number} wait - 等待时间（毫秒）
     * @returns {Function} 防抖后的函数
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * 节流函数
     * @param {Function} func - 要执行的函数
     * @param {number} limit - 时间限制（毫秒）
     * @returns {Function} 节流后的函数
     */
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * 平滑滚动到元素
     * @param {string} selector - 元素选择器
     * @param {number} offset - 偏移量（默认80px）
     */
    scrollToElement(selector, offset = 80) {
        const element = document.querySelector(selector);
        if (element) {
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    },

    /**
     * 检测元素是否在视口中
     * @param {HTMLElement} element - 要检测的元素
     * @param {number} offset - 偏移量（默认0）
     * @returns {boolean} 是否在视口中
     */
    isInViewport(element, offset = 0) {
        if (!element) return false;

        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;

        return (
            rect.top <= windowHeight - offset &&
            rect.bottom >= offset
        );
    },

    /**
     * 动态加载脚本
     * @param {string} url - 脚本URL
     * @param {Function} callback - 加载完成回调
     */
    loadScript(url, callback) {
        const script = document.createElement('script');
        script.src = url;
        script.onload = callback;
        document.head.appendChild(script);
    },

    /**
     * 动态加载样式
     * @param {string} url - 样式URL
     */
    loadCSS(url) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        document.head.appendChild(link);
    },

    /**
     * 获取URL参数
     * @param {string} name - 参数名
     * @returns {string|null} 参数值
     */
    getUrlParam(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    },

    /**
     * 设置本地存储
     * @param {string} key - 键
     * @param {any} value - 值
     */
    setStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.warn('存储失败:', e);
        }
    },

    /**
     * 获取本地存储
     * @param {string} key - 键
     * @returns {any} 存储的值
     */
    getStorage(key) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (e) {
            console.warn('读取失败:', e);
            return null;
        }
    },

    /**
     * 深拷贝对象
     * @param {Object} obj - 要拷贝的对象
     * @returns {Object} 拷贝后的对象
     */
    deepClone(obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    /**
     * 生成随机颜色
     * @returns {string} 随机颜色值
     */
    randomColor() {
        return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
    },

    /**
     * 格式化日期
     * @param {Date} date - 日期对象
     * @param {string} format - 格式字符串（YYYY-MM-DD）
     * @returns {string} 格式化后的日期
     */
    formatDate(date, format = 'YYYY-MM-DD') {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return format
            .replace('YYYY', year)
            .replace('MM', month)
            .replace('DD', day);
    },

    /**
     * 下载数据为JSON文件
     * @param {Object} data - 要下载的数据
     * @param {string} filename - 文件名
     */
    downloadJSON(data, filename = 'data.json') {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    },

    /**
     * 复制文本到剪贴板
     * @param {string} text - 要复制的文本
     * @returns {Promise} 复制结果
     */
    copyToClipboard(text) {
        return navigator.clipboard.writeText(text);
    },

    /**
     * 检测设备类型
     * @returns {string} 'mobile' | 'tablet' | 'desktop'
     */
    getDeviceType() {
        const ua = navigator.userAgent;
        if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
            return 'tablet';
        }
        if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
            return 'mobile';
        }
        return 'desktop';
    },

    /**
     * 检测浏览器是否支持WebGL
     * @returns {boolean} 是否支持
     */
    isWebGLSupported() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext &&
                (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }
};

// 导出工具函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HaicaofangUtils;
}