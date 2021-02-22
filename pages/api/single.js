import ytdl from 'ytdl-core'
import ffmpeg from 'fluent-ffmpeg'

// 單檔案下載
export default (req, res) => {
  const {
    body: { id },
    method,
  } = req

  if (method === 'POST') {
    res.setHeader('Content-disposition', `attachment; filename=test.mp3`);
    res.setHeader('Content-type', 'audio/mpeg');

    const stream = ytdl(`https://www.youtube.com/watch?v=${id}`)

    const proc = new ffmpeg({ source: stream })
      .withAudioCodec('libmp3lame')
      .toFormat('mp3')
      .output(res)
      .run()

    // res.status(200).json({ id })
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${method} Not Allowed`)
  }
}