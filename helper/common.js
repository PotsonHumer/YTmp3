/**
 * 延遲程式執行
 * @param {Number} ms 延遲微秒; 預設 1000
 */
const delay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms))

export default { delay }
