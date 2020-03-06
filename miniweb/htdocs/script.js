var condition = null;

async function EventUpdate() {
	await deleteAllRow();
	await objUpdate();
	nowEvent();
}

function nowEvent() {
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = today.getFullYear();
	var h = 17 //today.getHours();
	var m = 34 //today.getMinutes();
	
	for (i=0;i<events.length;i++) {
		let tempDateStart = parseToDate(events[i].start_date).split('.') // [0] - yyyy ; [1] - mm; [2] - dd
		let tempTimeStart = parseToTime(events[i].start_date).split(':') // [0] - hh; [1] - mm
		let tempTimeEnd = parseToTime(events[i].end_date).split(':') // [0] - hh; [1] - mm
		if (tempDateStart[0] == yyyy && tempDateStart[1] == mm &&tempDateStart[2] == dd) {
			if (tempTimeStart[0] == h) {
				if (m == (tempTimeStart[1]-5)) {
					document.getElementById(events[i].id).classList.add("warning")
					condition = "warning"
				} else if (m == tempTimeStart[1]){
					document.getElementById(events[i].id).classList.remove("warning")
					document.getElementById(events[i].id).classList.add("active")
					condition = "active"
				} else if (m > tempTimeEnd[1]) {
					document.getElementById(events[i].id).classList.remove("warning")
					document.getElementById(events[i].id).classList.remove("active")
					events.shift();
				}
			}
		}
	}
}

var events = [
  /*{
	"id": "genEventId()",
    "start_date": "2020,02,29;8,30",
    "end_date": "2020,02,29;12,30",
    "event_name": "Meeting",
    "event_location": "LA"
  }*/
]; // start_date:"",end_date:"",event_name:"",event_location:""
function objUpdate() {
  getJSON('https://my-json-server.typicode.com/gartou/db/events',
  function(err, data) {
    if (err !== null) {
      console.log('Something went wrong: ' + err);
    } else {
	  
	  for (i=0;i < data.length || 8; i++) {
		events.push({
			id: genEventId(parseToTime(data[i].start_date),data[i].event_name,data[i].event_location),
			start_date:data[i].start_date,
			end_date:data[i].end_date,
			event_name:data[i].event_name,
			event_location:data[i].event_location,
	    });
		newRow('eventTable', parseToTime(events[i].start_date)+"-"+parseToTime(events[i].end_date), events[i].event_name, events[i].event_location);
	  }
    }
  });
}

var newRow = function(tableName, first, second, third) {
  var tableRef = document.getElementById(tableName).getElementsByTagName('tbody')[0];
  var newRow   = tableRef.insertRow(tableRef.rows.length);
  
  var newCell  = newRow.insertCell(0);
  var newText  = document.createTextNode(first)
  newCell.appendChild(newText);
  
  var newCell  = newRow.insertCell(1);
  var newText  = document.createTextNode(second)
  newCell.appendChild(newText);
  
  var newCell  = newRow.insertCell(2);
  var newText  = document.createTextNode(third)
  newCell.appendChild(newText);
}

// parseToTime(events[i].start_date), events[i].event_name, events[i].event_location
function genEventId(first, second, third) {
	var genID = null;
	genID = first.split(':')[0]+second.charAt(getRndInteger(0,second.length+1))+third.charAt(getRndInteger(0,third.length+1))+third.charAt(getRndInteger(0,third.length+1))+getRndInteger(0,10)
	return genID;
}

function parseToTime(date) {
	var res = date.split(';')[1].split(',');
	var hh = res[0]
	var mm = res[1]
	return hh+":"+mm;
}

function parseToDate(date) {
	var res = date.split(';')[0].split(',');
	var yyyy = res[0];
	var mm = res[1];
	var dd = res[2];
	return yyyy+"."+mm+"."+dd;
}

function deleteAllRow() {
	var new_tbody = document.createElement('tbody');
	new_tbody.id = "events"
	var old_tbody = document.getElementById('events');
	old_tbody.parentNode.replaceChild(new_tbody,old_tbody);
}

function deleteRowIfModified() {
	var new_tbody = document.createElement('tbody');
	new_tbody.id = "events"
	var old_tbody = document.getElementById('events');
	old_tbody.parentNode.replaceChild(new_tbody,old_tbody);
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status === 200) {
        callback(null, xhr.response);
      } else {
        callback(status, xhr.response);
      }
    };
    xhr.send();
};