//importing required libraries and express and intializing variables and environment for Express framework
const express = require('express')
const router = express.Router()
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express()
const port = 3000
app.use(express.static("public"))
router.use(bodyParser.json());
app.use(bodyParser.json());
app.set("view engine","ejs")

//rendering Home HTML file when user goes to server
app.get('/', (req, res) => {
  res.render("home.ejs")
})

//Defining GET Request for JSON data
app.get('/data', (req, res) => {
    //reading and sending data  to user and response in JSON Format
    let JSONdata = fs.readFileSync('data.json');
    res.send(JSONdata)
})

//Defining POST Request that will update JSON file with new data from Request
app.post('/updateData', (req, res) => {
    //Deleting Old Data.json file
    fs.unlinkSync('data.json');

    //Creating new File with new data in JSON format and sending success message to client
    fs.writeFileSync('data.json', JSON.stringify(req.body));
    res.send(res.json("Added data successfully"))
  })

//Required for Express app server
app.listen(port, () => {
  console.log(`APP LISTENING ON PORT ${port}`)
})




