// MODULES
express = require('express')
request = require('request')

app = express()

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/data'))
app.set('views', __dirname + '/views')
app.set('view engine', 'pug')

app.get('/', (req, res) => {
  info = {}
  res.render('amiibo', info=info)
})

app.get('/amiibo', (req, res) => {
  res.render('amiibo')
})

app.get('/info/:id', (req, res) => {
  var playerID = req.params.id
  var options = {
    "url": "https://api.opendota.com/api/players/"+ playerID +"/matches"
  }
  request(options, (error, response, body) => {
    if (error) throw  error;
    var data = JSON.parse(body)
    var sum = 0
    data.forEach(function(item){
      sum = item.duration + sum
    })
    hours = sum/3600
    minutes = sum / 60
    info={}
    info.spielzeit=(Math.round(hours*100))/100
    info.matches = data.length
    info.durchschnitt = Math.round( minutes/data.length*100)/100
    res.render('info', info=info)
  })
})

app.listen(app.get('port'), () => {
  console.log('Node app is running on port', app.get('port'))
})
setInterval(()=>{
  request('https://nerodota.herokuapp.com/')
  console.log('Ping!')
},1200000)
