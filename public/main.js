var options = {
  series: [{
    name: "Temperature",
    data: []
  },
  {
    name: "Humidity",
    data: []
  }],
  chart: {
    height: 400,
    type: 'line',
    zoom: {
      enabled: false
    }
  },
  stroke: {
    curve: 'straight'
  },
  title: {
    text: 'Temperature and humidity',
    align: 'left'
  },
  grid: {
    row: {
      colors: ['#f3f3f3', 'transparent'],
      opacity: 0.5
    },
  },
  yaxis: [
  {
    title: {
      text: 'Temperature'
    },

  }, {
    opposite: true,
    title: {
      text: 'Humidity'
    }
  }
  ]
}

var socket = io()

const renderLastValue = data => {
  if (data) {
  document.querySelector('#content').innerHTML = 
    `<h2 style="margin-top: 2rem; font-weight: normal;">The current temperature is: <b>${data.temperature}°C</b><br/>The current humidity is: <b>${data.humidity}%</b></h2>`
  }
}

socket.on('data', data => {
  chart.appendData([{ data: [data.temperature] }, { data: [data.humidity] }])
  renderLastValue(data)
})

socket.on('initial', data => {
  const cleanedData = data.filter(d => d && 'temperature' in d && 'humidity' in d)
  chart.appendData([{ data: cleanedData.map(d => d.temperature) }, { data: cleanedData.map(d => d.humidity) }])
  renderLastValue(data[data.length-1])
})

var chart = new ApexCharts(document.querySelector("#chart"), options)
chart.render()
