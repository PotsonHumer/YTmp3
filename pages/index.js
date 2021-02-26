import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faDownload, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { useSelector, useDispatch } from 'react-redux'
import { map, reduce, every } from 'lodash'
import Head from 'next/head'

import { send } from '../events/youtube'

const Index = props => {
  const {
    youtubeUrls,
    sending,
    complete
  } = useSelector(({ youtube }) => youtube)
  const dispatch = useDispatch()

  /**
   * 欄位顯示迴圈
   */
  const inputLoop = () => map(youtubeUrls, inputField)

  /**
   * Youtube 網址輸入欄位
   * @param {String} url Youtube 網址
   * @param {Number} index 索引
   */
  const inputField = (url, index) => (
    <div className="col-12 mb-3" key={`youtube_url_feild_${index}`}>
      <div className="form-floating">
        <input
          type="text"
          className="form-control"
          id="ytId"
          placeholder="輸入 Youtube 網址"
          value={url}
          onChange={e => dispatch({ type: 'YOUTUBE_SET_URL', url: e.target.value, index })}
        />
        <label htmlFor="ytId">輸入 Youtube 網址</label>
      </div>
    </div>
  )

  /**
   * 下載進度條
   */
  const progressBar = () => {
    if (!(sending || every(complete, { finish: true }))) return null

    const totalCount = complete.length
    const finishCount = reduce(complete, (carry, n) => {
      return n.finish ? carry + 1 : carry
    }, 0)

    const progress = Math.round((finishCount / totalCount * 100))

    return (
      <div className="col-12">
        <div className="progress">
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${progress}%` }}
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {`${progress}%`}
          </div>
        </div>
      </div>
    )
  }

  /**
   * render
   */
  return (
    <React.Fragment>
      <Head>
        <title>YTmp3</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container">
        <div className="row pt-3 pb-3">
          <div className="col-12">
            <h1>Youtube to mp3</h1>
          </div>
          {inputLoop()}
          {progressBar()}
          <div className="col-6 mt-3">
            <button className="btn btn-success" onClick={() => dispatch({ type: 'YOUTUBE_ADD_URL' })}>
              <FontAwesomeIcon icon={faPlus} style={{ marginRight: '0.5em' }} />
              <span>增加網址</span>
            </button>
          </div>
          <div className="col-6 mt-3 text-end">
            <button
              className="d-inline-block btn btn-primary"
              disabled={sending}
              onClick={() => dispatch(send(youtubeUrls))}
            >
              <FontAwesomeIcon
                icon={sending ? faSpinner : faDownload}
                spin={sending}
                style={{ marginRight: '0.5em' }}
              />
              <span>開始下載</span>
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Index
