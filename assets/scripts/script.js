// City input
var cityInput = document.querySelector('.city-input');
var citySearchBtn = document.querySelector('.searchButton');
var currentDate = new Date();


var resultsContainer = document.querySelector('.results-container');

//Form class
var formSubmit = document.querySelector('.formSubmit');
//current forecast display 
var dayDisplay = document.querySelector('.dayDisplay');
//fiv day forecast display
var fiveDayDisplay = document.querySelector('.fiveDayDisplay');
//Header for 5-day
var fiveDayHeader = document.getElementById('fiveDayHeader');

// array for list of cities 
var theCitiesList = [];
var cityList = document.getElementById('city-list');
//array for city links lat and lon
var cityLinks = [];

//scan through the index of dayOfWeek
function scanDays(i){
 return (currentDate.getDay() + i) % 7;
}
//function that gets city entry and its weather data
function getCityEntry(event){
    event.preventDefault();

    //alert if null or undefined
    if(!cityInput.value){ 
      alert("Please, Enter a City.")
      return;
    }

    //GeoCoding Api for city
    var geoApiUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=' + cityInput.value + '&appid=e5814fee5eda4d4a8e524afc1139e11e';

                
    fetch(geoApiUrl)
    .then(function(response){
         return response.json();     
    })
    .then(function(data){
        var city = data[0];
        var lat = city.lat;
        var lon = city.lon;
        //pushing user input to theCitiesList array.
        theCitiesList.push(cityInput.value);
        //5-day WeatherForecast API
        var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=e5814fee5eda4d4a8e524afc1139e11e';
        
        //push city lat and lon
        cityLinks.push(lat, lon); 

        fetch(apiUrl)
        .then(function(response){
          return response.json();
        })
        .then(function(data){
          //Function calls
          curForecast(data);
          showForecast(data);
          storeCities();
          renderCityList();
          cityInput.value = ""; // clear input
          
        })
        
    })
}

//Function to generate weather card
function showForecast(data){
    fiveDayDisplay.innerHTML = '';
   
    // resets the dates everytime function is called
    var currentDate = new Date();
    
    for(var i = 0; i < 5; i++){

            //  creates weather day card
            var cardContainer_El = document.createElement('div');
            cardContainer_El.classList = 'weatherCardContainer';
            //cardContainer_El.setAttribute('id', 'weatherCard');
            fiveDayDisplay.appendChild(cardContainer_El);

            ////

            // Create paragraph for current date
            var currentDate_El = document.createElement('p');
            currentDate_El.setAttribute('id', 'currentDateID');
            currentDate.setDate(currentDate.getDate() + 1); 
            currentDate_El.textContent = currentDate.toDateString();
            cardContainer_El.appendChild(currentDate_El);

            // create div for icon
            var weatherImg = document.createElement('img');
            weatherImg.setAttribute('src', 'http://openweathermap.org/img/wn/'+data.list[i].weather[0].icon+'.png');
            cardContainer_El.appendChild(weatherImg);
            
            //create paragraph for Temperature
            var temp_El = document.createElement('p');
            temp_El.setAttribute('id', 'temp');
            temp_El.textContent = "Temp: " + Number(data.list[i].main.temp - 273.15).toFixed(2) + ' °' + 'C';
            cardContainer_El.appendChild(temp_El);

            //create paragraph for wind
            var wind_El = document.createElement('p');
            wind_El.setAttribute('id', 'wind');
            wind_El.textContent = "Wind: " + Number(data.list[i].wind.speed * (18/5)).toFixed(2) + ' km/h';
            cardContainer_El.appendChild(wind_El);

            //create paragraph for humidity
            var humid_El = document.createElement('p');
            humid_El.setAttribute('id', 'humid');
            humid_El.textContent = "Humidity: " + Number(data.list[i].main.humidity);
            cardContainer_El.appendChild(humid_El);

    }
    
}
// function Showing current forecast 
function curForecast(data){
  var i = 0;
  dayDisplay.innerHTML = '';

  if(!data){
      resultsContainer.textContent = 'City not found.';
      return;
  }
   //  creates weather day card
   var curContainer_El = document.createElement('div');
   curContainer_El.classList = 'curCardContainer';
   //cardContainer_El.setAttribute('id', 'weatherCard');
   dayDisplay.appendChild(curContainer_El);


   // Create paragraph for current date
   var curDate_El = document.createElement('p');
   curDate_El.setAttribute('id', 'curDateID');
   curDate_El.textContent = currentDate.toDateString();
   curContainer_El.appendChild(curDate_El);

   // create div for icon
   var weatherImg = document.createElement('img');
   weatherImg.classList = 'curImg';
   weatherImg.setAttribute('src', 'http://openweathermap.org/img/wn/'+data.list[i].weather[0].icon+'.png');
   curContainer_El.appendChild(weatherImg);
   
   //create paragraph for Temperature
   var temp_El = document.createElement('p');
   temp_El.setAttribute('id', 'temp');
   temp_El.textContent = "Temp: " + Number(data.list[i].main.temp - 273.15).toFixed(2) + ' °' + 'C';
   curContainer_El.appendChild(temp_El);

   //create paragraph for wind
   var wind_El = document.createElement('p');
   wind_El.setAttribute('id', 'wind');
   wind_El.textContent = "Wind: " + Number(data.list[i].wind.speed * (18/5)).toFixed(2) + ' km/h';
   curContainer_El.appendChild(wind_El);

   //create paragraph for humidity
   var humid_El = document.createElement('p');
   humid_El.setAttribute('id', 'humid');
   humid_El.textContent = "Humidity: " + Number(data.list[i].main.humidity);
   curContainer_El.appendChild(humid_El);

}
// function storing cities and lat and lon
function storeCities() {
    localStorage.setItem("theCitiesList", JSON.stringify(theCitiesList));
    //NEW
    localStorage.setItem('cityLinks', JSON.stringify(cityLinks));
  }
  
  //function generating list of cities entered
  function renderCityList() {
    cityList.innerHTML = "";
    
    for (var i = 0; i < theCitiesList.length; i++) {
      var addCity = theCitiesList[i];
      
  
      var li = document.createElement("li");
      li.classList = 'historicList';
      li.textContent = addCity;
      li.setAttribute("data-index", i);

      li.addEventListener('click', function(event){
        var index = event.target.getAttribute('data-index');
        showHistoricalWeather(index);
        
      });

      cityList.appendChild(li);

    }

  }
  
  //function retrieving historical data
  function showHistoricalWeather(index){
      var cityName = theCitiesList[index];

      var latIndex = index * 2;
      var lonIndex = latIndex + 1;

      var lat = cityLinks[latIndex];
      var lon = cityLinks[lonIndex];

      var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=e5814fee5eda4d4a8e524afc1139e11e';
      
      fetch(apiUrl)
        .then(function(response){
          return response.json();
        })
        .then(function(data){
          curForecast(data);
          showForecast(data);
          storeCities();
          
          renderCityList();
          cityInput.value = ""; // clear input
          
        })
  }
  // function init
  function init() {
    
    var storedCity = JSON.parse(localStorage.getItem("theCitiesList"));
    
    if (storedCity !== null) {
      theCitiesList = storedCity;
    }
    //NEW
    var storedLink = JSON.parse(localStorage.getItem("cityLinks"));
    if(storedLink !== null){
      cityLinks = storedLink;
    }
    
    renderCityList();
  }
  
  
  // event listener for function getCityEntry()
  document.querySelector('.formSubmit').addEventListener('submit', getCityEntry);
  
  init();

