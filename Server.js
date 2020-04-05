const express    = require('express')
const papa       = require('papaparse')
const bodyParser = require("body-parser");
const app        = express()
const fs         = require('fs')
const port       = 3000
let currId       = 1001

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//clear file on server start
fs.writeFile('collectedinfo.csv', '', (err) => { 
  // In case of a error throw err. 
  if (err) throw err; 
}) 

//start server
app.use(express.static('src'))

//get request from client side for the id of the user
app.get('/id', function(req, res){
  res.send(JSON.stringify(currId))
  currId ++;
});

//post request for data collected by page
app.post('/finish', function(req, res){
  let info = JSON.parse(req.body.logs)
  let csvData = papa.unparse(info)

  //add to csv file
  fs.appendFile('collectedinfo.csv', csvData + '\n', (err) => { 
    // In case of a error throw err. 
    if (err) throw err; 
  }) 
  res.end()
});

//listen for server requests
app.listen(port, (error) => {
  if (error)
    return console.log(error)
  console.log(`Server is listening on PORT ${port} CNTL-C to quit`)
  console.log(`To Test:`)
  console.log(`http://localhost:3000/`)
})