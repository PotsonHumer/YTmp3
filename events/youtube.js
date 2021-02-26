import axios from 'axios'
import FileDownload from 'js-file-download'

/**
 * 下載單個 mp3
 * @param {String} url Youtube 網址
 * @param {Number} index 索引
 * @param {Function} dispatch 狀態發布
 */
const single = async (url, index, dispatch) => {
  if (url === '') {
    return false
  }

  const response = await axios({
    method: 'POST',
    url: 'api/single',
    data: { url },
    responseType: 'blob'
  })

  if (typeof response.headers['x-stream-error'] === 'undefined') {
    const title = decodeURIComponent(response.headers['x-encode-file-name'])
    FileDownload(response.data, `${title}.mp3`)

    dispatch({
      type: 'YOUTUBE_COMPLETE_SET',
      index,
      result: true,
      finish: true,
      message: ''
    })
  } else {
    const message = response.headers['x-stream-error']

    dispatch({
      type: 'YOUTUBE_COMPLETE_SET',
      index,
      result: false,
      finish: true,
      message: message
    })
  }

  return true
}

/**
 * 下載自呼叫方法; 用於限制一次只下載一個檔案
 * @param {Array} urls Youtube 網址陣列
 * @param {Function} dispatch redux 狀態發佈
 * @param {Number} index 自迴圈索引
 */
const oneAtATime = async (urls, dispatch, index = 0) => {
  const url = urls[0]
  const nextIndex = index + 1

  await single(url, index, dispatch)
  if (typeof urls[nextIndex] !== 'undefined') {
    oneAtATime(urls, dispatch, nextIndex)
  }
}

/**
 * 處理送出下載請求方法
 * @param {Array} urls Youtube 網址陣列
 */
const send = urls => {
  return async dispatch => {
    dispatch({ type: 'YOUTUBE_SET_SENDING', sending: true })
    oneAtATime(urls, dispatch)
  }
}

export { single, send }
