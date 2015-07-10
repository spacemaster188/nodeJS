var emptyStr = '';
var editIdTmp;
var sortByDefault = true;
var sortByLetter = false;
var sortByDate = false;
var fix = false;
var nonfix = false;
var tasksAll = true;
var taskString;
var dateString;
var tasksTmp = emptyStr;
var tasksField;
var maxLength = 32;
var taskArr = [];
var preparedTaskArr = [];
var selected = [];
/* Update table by pressing Enter*/
document.onkeyup = function (e) {
    e = e || window.event;
    if (e.keyCode === 13) {
        onAdd();
    }
    return false;
}
/* Get tasks */
function getTasks() {
    $.ajax({
        url: "/task",
        type: "GET"
    }).done(function(data){
        taskArr = data;
        showTasks();
    });
}
/*Setting default string for date field */
function setDefaultDateField() {
  var ld = new Date();
  document.getElementById("datestr").value = ld.toLocaleDateString();
}
/* Sorting by task (increasing)*/
function byTask(a, b) {
  if (a.task > b.task){	
     return 1;
  }else{
    if (a.task < b.task){
       return -1;
    }else{
       return 0;
    }
  }
}
/* Sorting by date (increasing) */
function byDate(a, b) {
  if (a.date > b.date){	
     return 1;
  }else{ 
	  if (a.date < b.date){
         return -1;
	  }else{
         return 0;
	  }
  }
}
/*Add new task */
function addElement(fixed, task, dateStr) {
    var addJsonObj = {isCompleted: fixed, task: task, date: dateStr};
    $.ajax({
        type: 'POST',
        url: '/task',
        processData: false,
        contentType: 'application/json',
        data: JSON.stringify(addJsonObj)
    }).done(function(data){
        taskArr = data;
        showTasks();
    });
}

/*Add element to service array */
function addElementToArray(element, mas) {
    mas.push(element);
}
/* Modify task */
function taskArrModifyItem() {
    var jsonArrSelected = [];
    var tmpEl = {"id":editIdTmp, "task":taskString, "date":dateString};
    jsonArrSelected.push(tmpEl);
    var tmpEl2 = {"id":null, "task":null, "date":"editFlag"};
    jsonArrSelected.push(tmpEl2);
    $.ajax({
        type: 'PUT',
        url: '/task',
        processData: false,
        contentType: 'application/json',
        data: JSON.stringify(jsonArrSelected)
    }).done(function(data){
        taskArr = data;
        showTasks();
    });
}
/* Trim task for optomal window view */
function taskTrim(tskStr){
  var trimmedTask = tskStr;
  if (trimmedTask.length > maxLength) {
     return trimmedTask.slice(0, maxLength);
  }else{
     return trimmedTask;
  }
}

function showTask(idx) {
  document.getElementById('taskstr').value = taskArr[Number(idx)].task;
}

function onAdd() {
    taskString = document.getElementById('taskstr').value;
    dateString = document.getElementById('datestr').value;

    if(taskString.trim() && dateString.trim()){
        addElement(false, taskString, dateString);
    }
    document.getElementById('taskstr').value = emptyStr;
    setDefaultDateField();
    selected = [];
}

function showTasks() {
    tasksField = document.getElementById('tasks');
    var editBtnLink = document.getElementById('editBtn');
    if(tasksAll){
        proceedAll4ShowTasks();
    }else{
        if(fix){
            proceedFixed4ShowTasks();
        }else{
            proceedNonFixed4ShowTasks();
        }
    }
    if(!sortByDefault){
        if(sortByLetter && preparedTaskArr.length>1){
            preparedTaskArr.sort(byTask);
        }
        if(sortByDate && preparedTaskArr.length>1){
            preparedTaskArr.sort(byDate);
        }
    }
    tasksTmp = generateHtml();
    tasksField.innerHTML = tasksTmp;
    tasksTmp = emptyStr;
    preparedTaskArr = [];
    editBtnLink.style.display = "none";
}

function generateHtml() {
  var tmp = '';
  if(preparedTaskArr.length!=0){
     for(var i=0; i<preparedTaskArr.length; i++) {
	    if(preparedTaskArr[i].isCompleted){
           tmp+= '<div class="task-wr" id="div' + preparedTaskArr[i].idx 
           + '"><div class="task-left">' + preparedTaskArr[i].date + '</div>' 
           + '<div class="task-chbox-right"><input type="checkbox" id="' 
           + preparedTaskArr[i].idx + '" onclick="chkBx(' + preparedTaskArr[i].idx 
           + ')"/></div>' + '<div class="task-right" onclick="showTask('+ i +')"><s>'
           + taskTrim(preparedTaskArr[i].task) + '</s></div></div>';		
        }else{
           tmp+= '<div class="task-wr" id="div' + preparedTaskArr[i].idx
           + '"><div class="task-left">' + preparedTaskArr[i].date + '</div>'
           + '<div class="task-chbox-right"><input type="checkbox" id="'
           + preparedTaskArr[i].idx + '" onclick="chkBx('
           + preparedTaskArr[i].idx + ')"/></div>'
           + '<div class="task-right" onclick="showTask('+ i
           +')">' + taskTrim(preparedTaskArr[i].task) + '</div></div>';   
		}
     }
  }
  return tmp;
}
/*proceed all tasks list */
function proceedAll4ShowTasks() {
  for(var i=0; i<taskArr.length; i++) {
     addElementToArray(
        {
         idx: i,
         isCompleted: taskArr[i].isCompleted,
         task: taskArr[i].task,
         date: taskArr[i].date
        }, preparedTaskArr);
  }
}
/*proceed fixed list */
function proceedFixed4ShowTasks() {
  for(var i=0; i<taskArr.length; i++) {
     if(taskArr[i].isCompleted) {
        addElementToArray(
        {
         idx: i,
		 isCompleted: taskArr[i].isCompleted,
		 task: taskArr[i].task,
		 date: taskArr[i].date},
		 preparedTaskArr);
		}
     }
  }
/*proceed nonfixed list */
function proceedNonFixed4ShowTasks() {
  for(var i=0; i<taskArr.length; i++) {
     if(!taskArr[i].isCompleted){
        addElementToArray(
           {
            idx: i,
            isCompleted: taskArr[i].isCompleted,
            task: taskArr[i].task,
            date: taskArr[i].date
           }, preparedTaskArr);
        }
  }
}

function chkBx(id) {
  var selector = document.getElementById(id);
  if (selector.checked) {
     selected.push(Number(id));
     document.getElementById('div' + id).style.backgroundColor = "#EEFFFE";
  } else {
     var tmpIdx = selected.indexOf(Number(id));
     selected.splice(tmpIdx, 1);
     if(Number(id % 2)==0){ 
        document.getElementById('div' + id).style.backgroundColor = "#F9F9F9";
     }else{ 
        document.getElementById('div' + id).style.backgroundColor = "#FFFFFF";
     } 
  }
}

function fixTasks() {
    if(selected.length>0){
        selected.sort();
        var jsonArrSelected = [];
        var tmpEl = '';
        for (var i=0; i<selected.length; i++) {
            tmpEl = {"id":selected[i], "task":taskArr[Number(selected[i])].task, "date":taskArr[Number(selected[i])].date};
            jsonArrSelected.push(tmpEl);
        }
        var tmpEl2 = {"id":null, "task":null, "date":"fixFlag"};
        jsonArrSelected.push(tmpEl2);
        $.ajax({
            type: 'PUT',
            url: '/task',
            processData: false,
            contentType: 'application/json',
            data: JSON.stringify(jsonArrSelected)
        }).done(function(data){
            taskArr = data;
            showTasks();
        });
    }
    selected = [];
  }

function editTask() {
  if(selected.length!=1){
     alert('JUST SELECT ONLY ONE TASK TO EDIT PLEASE ..');
  }else{
     editIdTmp = selected[0];
     editBtnLink = document.getElementById('editBtn');
     tasksTmp = taskArr[Number(editIdTmp)].task;
     document.getElementById('taskstr').value = tasksTmp;
     document.getElementById('datestr').value = taskArr[Number(editIdTmp)].date;
     editBtnLink.style.display = "block";
  }
}

function applyEditedTask() {
  taskString = document.getElementById('taskstr').value;
  dateString = document.getElementById('datestr').value;
  if(taskString.trim() && dateString.trim()){
     taskArrModifyItem();
  }
  document.getElementById('taskstr').value = emptyStr;
  setDefaultDateField();
  selected = [];

  taskString.innerHTML = tasksTmp;
  setDefaultDateField();
  tasksTmp = emptyStr;
  editIdTmp = emptyStr;
}

function deleteTasks() {
  if(selected.length>0){
     selected.sort();
     var jsonArrSelected = [];
     var tmpEl;
     for (var i=0; i<selected.length; i++) {
         tmpEl = {"id":selected[i]};
         jsonArrSelected.push(tmpEl);
     }
      taskArr = [];
      $.ajax({
          type: 'DELETE',
          url: '/task',
          processData: false,
          contentType: 'application/json',
          data: JSON.stringify(jsonArrSelected)
      }).done(function(data){
          taskArr = data;
          showTasks();
      });
  }
  selected = [];
}

function getAllTasks() {
  tasksAll = true;
  fix = false;
  nonfix = false;
  showTasks();
}

function getFixedTasks() {
  fix = true;
  tasksAll = false;
  nonfix = false;
  showTasks();
}

function getNonFixedTasks() {
  nonfix = true;
  fix = false;
  tasksAll = false;
  showTasks();
}

function setSortByTasks() {
  sortByDefault = false;
  sortByDate = false;
  sortByLetter = true;
  showTasks();
}

function setSortByDate() {
  sortByDefault = false;
  sortByLetter = false;
  sortByDate = true;
  showTasks();
}