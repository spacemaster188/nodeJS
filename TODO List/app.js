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
  readJsonContent();
  tasksJsonArray.push(newJsonTask);
  var tasksJsonArrStr = JSON.stringify(tasksJsonArray);
  fs.writeFileSync(tasks, tasksJsonArrStr, encoding = utf8);
  console.log('Sending response with tasks array : ' + JSON.stringify(tasksJsonArray));
  res.json(tasksJsonArray);
});
/* delete tasks */
app.delete('/task', function (req, res) {
  selectedJsonArr = req.body;
  readJsonContent();
  for (var i=(selectedJsonArr.length-1); i>=0; i--) {
    tasksJsonArray.splice(Number(selectedJsonArr[i].id),1);
  }
  var tasksJsonArrStr = JSON.stringify(tasksJsonArray);
  fs.writeFileSync(tasks, tasksJsonArrStr, encoding = utf8);
  console.log('Sending response with tasks array : ' + JSON.stringify(tasksJsonArray));
  res.json(tasksJsonArray);
});
/* fix tasks */
app.post('/fixTasks', function (req, res) {
  selectedJsonArr = req.body;
  readJsonContent();
  for (var i=(selectedJsonArr.length-1); i>=0; i--) {
    tasksJsonArray[Number(selectedJsonArr[i].id)].isCompleted = true;
  }
  var tasksJsonArrStr = JSON.stringify(tasksJsonArray);
  fs.writeFileSync(tasks, tasksJsonArrStr, encoding = utf8);
  console.log('Sending response with tasks array : ' + JSON.stringify(tasksJsonArray));
  res.json(tasksJsonArray);
});
/* edit task */
app.put('/task', function (req, res) {
  var editedId = req.body.id;
  readJsonContent();
  tasksJsonArray[Number(editedId)].task = req.body.task;
  tasksJsonArray[Number(editedId)].date = req.body.date;
  var tasksJsonArrStr = JSON.stringify(tasksJsonArray);
  fs.writeFileSync(tasks, tasksJsonArrStr, encoding = utf8);
  res.json(tasksJsonArray);
});
/* get tasks array */
app.get('/task', function (req, res) {
  readJsonContent();
  res.json(tasksJsonArray);
});

app.use(express.static('public'));
/* starting server */
var server = app.listen(port, ip, function () {
  console.log('App listening at ' + ip + ':' + port);
});
