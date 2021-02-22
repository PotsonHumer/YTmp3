import React, { useState } from 'react'
import axios from 'axios'
import FileDownload from 'js-file-download'
import Head from 'next/head'

export default props => {
  const [youtubeId, setYoutubeId] = useState('')

  /**
   * 下載單個 mp3
   * @param {Number} youtubeId Youtube id
   */  
  const single = async () => {
    const response = await axios({
      method: 'POST',
      url: 'api/single',
      data: {
        id: youtubeId,
      },
      responseType: 'blob'
    })

    FileDownload(response.data, 'test.mp3')
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
      <div>
        <input type="text" value={youtubeId} onChange={e => setYoutubeId(e.target.value)} />
        <button type="button" onClick={() => single()}>API Test</button>
      </div>
    </React.Fragment>
  )
}
