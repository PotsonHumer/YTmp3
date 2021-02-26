import axios from 'axios'
import FileDownload from 'js-file-download'
import { map } from 'lodash'

import Common from '../helper/common'

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

  await Common.delay(3000 * (index + 1))

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
}

const send = urls => {
  return async dispatch => {
    dispatch({ type: 'YOUTUBE_SET_SENDING', sending: true })
    map(urls, (url, index) => single(url, index, dispatch))
  }
}

export { single, send }
