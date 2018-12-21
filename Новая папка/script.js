$(document).ready(function(){
  getCurrentPrice();
  getLastMonth();
});

let currentUSD = document.getElementById("currentUSD");
let currentEUR = document.getElementById("currentEUR");
let currentGBP = document.getElementById("currentGBP");

function getCurrentPrice(){
	$.get(
		"https://api.coindesk.com/v1/bpi/currentprice.json",
		function(data){
          data = JSON.parse(data);
          currentUSD.innerHTML = "Current USD price: " + Math.round(data.bpi.USD.rate_float) + " &#36;";
          currentEUR.innerHTML = "Current EUR price: " + Math.round(data.bpi.EUR.rate_float) + " &euro;";
          currentGBP.innerHTML = "Current GBP price: " + Math.round(data.bpi.GBP.rate_float) + " &pound;";
		}
	);
}

let labelsMonth = [];
let mydataMonth = [];

function getLastMonth(){
  $.getJSON("https://api.coindesk.com/v1/bpi/historical/close.json",
    function(data) {
      jsonfile = data;
        for (var key in data.bpi) {
          var value = data.bpi[key];
          labelsMonth.push(key);
          mydataMonth.push(value);
        }	
    });
    setTimeout(function() {
      let chart = new Chart(ctx, config2);
    }, 100)
}

let labels = [];
let mydata = []; 
let mydata2 = []; 
let today = new Date();
let dd = today.getDate();
let mm = today.getMonth()+1; //January is 0!
let yyyy = today.getFullYear();
if(dd<10) {
    dd = '0'+dd
} else if(mm<10) {
    mm = '0'+mm
} 

let now = yyyy + "-" + mm + "-" + dd;

function buildChart() {
  if($('#date1').val() >= $('#date2').val()) {
    alert("Вы ввели некоректные данные!");
    $('#date1').val('');
    $('#date2').val('');
  }else if(($('#date1').val() || $('#date2').val()) > now) {
    alert("Вы ввели некоректные данные! Выбранные даты не могут быть больше сегодняшнего числа");
  } else {
      getHistoryRate();
  }
}



function getHistoryRate(){
    $.getJSON("https://api.coindesk.com/v1/bpi/historical/close.json?currency=USD",
      {
        "start" : $('#date1').val(),
        "end" : $('#date2').val()
      },
      function(data) {
        jsonfile = data;
          for (let key in data.bpi) {
            let value = data.bpi[key];
            labels.push(key);
            mydata.push(value);
          }	
      });
  
      $.getJSON("https://api.coindesk.com/v1/bpi/historical/close.json?currency=EUR",
      {
        "start" : $('#date1').val(),
        "end" : $('#date2').val()
      },
     function(data) {
      jsonfile2 = data;
        for (let key in data.bpi) {
          let value2 = data.bpi[key];
          mydata2.push(value2);
        }
      });
  
    setTimeout(function() {
      let chart = new Chart(ctx, config);
    }, 500)
}

let ctx = canvas.getContext('2d');
let config = {
  type: 'line',
  data: {
    labels: labels,
    datasets: [{
      label: 'Chart of bitcoin price in Dollars for a selected period of time',// + start.value;
      data: mydata,
      backgroundColor: 'rgba(0, 119, 204, 0.3)'
    },{
      label: 'Chart of bitcoin price in Euro for a selected period of time', //+ start.value,
      data: mydata2,
      backgroundColor: 'rgba(0, 119, 204, 0.3)'
    }]
  }
};

let config2 = {
  type: 'line',
  data: {
    labels: labelsMonth,
    datasets: [{
      label: 'Bitcoin price chart for the last month',
      data: mydataMonth,
      backgroundColor: 'rgba(0, 119, 204, 0.3)'
    }]
  }
};