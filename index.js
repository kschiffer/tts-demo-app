const express = require('express')
const axios = require('axios')
const { Server } = require('socket.io')

const API_KEY = process.env.TTN_API_KEY
const APP_ID = process.env.TTN_APP_ID
const WEBHOOK_ID = process.env.TTN_WEBHOOK_ID
const DEVICE_ID = process.env.TTN_DEVICE_ID

const webhookUri = `https://tti.eu1.cloud.thethings.industries/api/v3/as/applications/${APP_ID}/webhooks/${WEBHOOK_ID}/devices/${DEVICE_ID}/down/replace`

let values = []
let isOn = true

const app = express()

app.use(express.json())
app.use(express.static('public'))

const render = content =>
  `<html>
   <header>
     <title>Kevin's Awesome TTS App 🚀</title>
   </header>
   <body style="text-align: center; font-family: 'Source Sans Pro';">
     <h1 style="margin-top: 2rem">Kevin's Room Climate Tracker 🚀</h1>
     <hr style="width: 40rem; margin-top: 1rem;"/>
     <div id="content">
     ${content}
     </div>
     <div id="chart"></div>
   <body>
   <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
   <script src="/socket.io/socket.io.js"></script>
   <script type="text/javascript" src="/main.js"></script>
</html>`

app.get('/', (req, res) => {
  if (values.length === 0) {
    return res.send(render('<h2 style="margin-top: 2rem">No data received yet 🙁</h2>'))
  }

  res.send(
    render('<h2 style="margin-top: 2rem;">Loading data…</h2>'),
  )
})

app.post('/webhooks', (req, res) => {
  // Update chart
  const value = req.body.uplink_message.decoded_payload
  values.push(value)
  io.emit('data', value)

  // Switch busylight
  if (API_KEY && value && value.button_press) {
    isOn = !isOn
    const payload = Buffer.from(isOn ? new Uint8Array([255, 255, 255, 255, 0]) : new Uint8Array([255, 255, 255, 0, 255])).toString('base64')

    axios({
      method: 'post',
      url: webhookUri,
      headers: { Authorization: `Bearer ${API_KEY}` },
      data: {
        downlinks: [{
          frm_payload: payload,
          f_port: 15
        }]
      }
    })
  }

  res.send()
})

const server = app.listen(process.env.PORT || 3000)
const io = new Server(server)

io.on('connection', socket => {
  // Send the initial data to the client
  socket.emit('initial', values)
})
