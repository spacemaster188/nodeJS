var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var config = JSON.parse(fs.readFileSync("config.json"));
var ip = config.ip;
var port = config.port;
var tasks = config.tasks;
var tasksJsonArray = [];
var selectedJsonArr = [];
var utf8 = 'utf-8';

function readJsonContent() {
  try{
    tasksJsonArray = JSON.parse(fs.readFileSync(tasks, utf8));
    console.log('Main array: ' + JSON.stringify(TasksJsonArray));
  }catch (err) {
  }
}

var app = express();
app.use(bodyParser.json());
var value = 'Initial';
/* tracking ip/port changes */
fs.watchFile("config.json", function(){
  config = JSON.parse(fs.readFileSync("config.json"));
  server.close();
  ip = config.ip;
  port = config.port;
  tasks = config.tasks;
  server.listen(port, ip, function(){
  console.log("Listen: " + ip + ":" + port);
  });
});
/* add new task */
app.post('/task', function (req, res) {
  newIsCompleted = req.body.isCompleted;
  newTask = req.body.task;
  newDate = req.body.date;
  console.log('Incoming new task : ' + newTask + ' : ' + newDate);
  var newJsonTask = {isCompleted: newIsCompleted, task: newTask, date: newDate};
  tasksJsonArray.push(newJsonTask);
  var tasksJsonArrStr = JSON.stringify(tasksJsonArray);
  fs.writeFileSync(tasks, tasksJsonArrStr, encoding = utf8);
  console.log('Sending response with tasks array : ' + JSON.stringify(tasksJsonArray));
  res.json(tasksJsonArray);
});
/* delete tasks */
app.delete('/task', function (req, res) {
  selectedJsonArr = req.body;
  for (var i=(selectedJsonArr.length-1); i>=0; i--) {
    tasksJsonArray.splice(Number(selectedJsonArr[i].id),1);
  }
  var tasksJsonArrStr = JSON.stringify(tasksJsonArray);
  fs.writeFileSync(tasks, tasksJsonArrStr, encoding = utf8);
  console.log('Sending response with tasks array : ' + JSON.stringify(tasksJsonArray));
  res.json(tasksJsonArray);
});
/* edit and fix task */
app.put('/task', function (req, res) {
  var modifyJsonArr = [];
  modifyJsonArr = req.body;

  if(modifyJsonArr[1].date == "editFlag"){
    tasksJsonArray[Number(modifyJsonArr[0].id)].task = modifyJsonArr[0].task;
    tasksJsonArray[Number(modifyJsonArr[0].id)].date = modifyJsonArr[0].date;
  }else{
    for (var i=0; i<(modifyJsonArr.length-1); i++) {
      tasksJsonArray[Number(modifyJsonArr[i].id)].isCompleted = true;
    }
  }
  var tasksJsonArrStr = JSON.stringify(tasksJsonArray);
  fs.writeFileSync(tasks, tasksJsonArrStr, encoding = utf8);
  res.json(tasksJsonArray);
});
/* get tasks array */
app.get('/task', function (req, res) {
  res.json(tasksJsonArray);
});

app.use(express.static('public'));
/* starting server */
var server = app.listen(port, ip, function () {
  console.log('App listening at ' + ip + ':' + port);
  readJsonContent();
});
