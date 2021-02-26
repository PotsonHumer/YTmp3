import ytdl from 'ytdl-core'
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'
import Ffmpeg from 'fluent-ffmpeg'

Ffmpeg.setFfmpegPath(ffmpegInstaller.path)

// 單檔案下載
export default async (req, res) => {
  const {
    body: { url: youtubeUrl },
    method
  } = req

  if (youtubeUrl === '' || youtubeUrl === null) {
    res.status(400).end('Youtube url not found !')
  } else if (method === 'POST') {
    // const youtubeUrl = `https://www.youtube.com/watch?v=${id}`

    const stream = ytdl(youtubeUrl)
    const ytInfo = await ytdl.getInfo(youtubeUrl)

    const title = ytInfo.videoDetails.media.song || ytInfo.videoDetails.title
    const urlEncodeTitle = encodeURIComponent(title)

    res.setHeader('Content-disposition', `attachment; filename=${urlEncodeTitle}.mp3`)
    res.setHeader('Content-type', 'audio/mpeg')
    res.setHeader('X-ENCODE-FILE-NAME', urlEncodeTitle)

    new Ffmpeg({ source: stream })
      .withAudioCodec('libmp3lame')
      .toFormat('mp3')
      .on('error', error => {
        res.setHeader('X-STREAM-ERROR', error.message)
      })
      .output(res)
      .run()
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}
