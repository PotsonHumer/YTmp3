import { cloneDeep, concat, every, map } from 'lodash'

/**
 * 預設狀態
 */
const initialState = {
  youtubeUrls: [''],
  progress: 0,
  complete: [{ result: false, finish: false, message: '' }],
  sending: false
}

/**
 * Youtube 下載 reducer
 */
const youtubeReducer = (state = initialState, action) => {
  const cloneState = cloneDeep(state)
  let newState = {}

  /**
   * 寫入 Youtube 網址至狀態
   * @param {String} url Youtube 網址
   * @param {Number} index 索引
   */
  const setUrl = (url, index) => {
    cloneState.youtubeUrls[index] = url
    return cloneState
  }

  /**
   * 增加 Youtube 網址欄位
   */
  const addUrl = () => {
    cloneState.youtubeUrls = concat(cloneState.youtubeUrls, [''])
    cloneState.complete.push({ result: false, finish: false, message: '' })
    return cloneState
  }

  /**
   * 設定 Youtube 下載完成狀態
   * @param {Object} attributes {
   *     @var {Number} index 完成項目索引
   *     @var {Boolean} result 下載是否成功狀態
   *     @var {Boolean} finish 下載是否完成狀態
   *     @var {String} message 下載訊息; 錯誤訊息
   * }
   */
  const completeSet = attributes => {
    cloneState.complete[attributes.index] = attributes
    if (every(cloneState.complete, { finish: true })) {
      cloneState.sending = false
    }
    return cloneState
  }

  /**
   * 送出下載請求
   */
  const clear = () => {
    return initialState
  }

  /**
   * 更新全部狀態
   * @param {Object} newState 更新的狀態
   * @returns {Object}
   */
  const stateChange = newState => {
    return Object.assign({}, state, newState)
  }

  /**
   * ACTION
   */
  switch (action.type) {
    case 'YOUTUBE_SET_SENDING':
      cloneState.sending = action.sending
      cloneState.complete = map(cloneState.complete, attr => {
        return Object.assign({}, attr, { finish: false, result: false })
      })
      newState = cloneState
      break

    case 'YOUTUBE_SET_URL':
      newState = setUrl(action.url, action.index)
      break

    case 'YOUTUBE_ADD_URL':
      newState = addUrl()
      break

    case 'YOUTUBE_COMPLETE_SET':
      delete action.type
      newState = completeSet({ ...action })
      break

    case 'YOUTUBE_CLEAR':
      newState = clear()
      break

    default:
      newState = cloneState
      break
  }

  return stateChange(newState)
}

export default youtubeReducer
