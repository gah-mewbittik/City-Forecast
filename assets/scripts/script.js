
var cityInput = document.querySelector('.city-input');
var citySearchBtn = document.querySelector('.searchButton');
var currentDate = new Date();

var daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var resultsContainer = document.querySelector('.results-container');

var formSubmit = document.querySelector('.formSubmit');

var fiveDayDisplay = document.querySelector('.fiveDayDisplay');

//list of cities
var theCitiesList = [];
var cityList = document.getElementById('city-list');

//scan through the index of dayOfWeek
function scanDays(i){
 return (currentDate.getDay() + i) % 7;
}

function getCityEntry(event){
    event.preventDefault();

    //GeoCoding Api for city
    var geoApiUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityInput.value + '&appid=e5814fee5eda4d4a8e524afc1139e11e';

    
                //
    fetch(geoApiUrl)
    .then(function(response){
         return response.json();     
    })
    .then(function(data){
        var city = data[0];
        var lat = city.lat;
        var lon = city.lon;
        //5-day WeatherForecast API
        var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=e5814fee5eda4d4a8e524afc1139e11e';
        fetch(apiUrl)
        .then(function(response){
          return response.json();
        })
        .then(function(data){
          showForecast(data);
        })
        
    })
}

function showForecast(data){
    fiveDayDisplay.innerHTML = '';

    if(!data){
        resultsContainer.textContent = 'City not found.';
        return;
    }

    for(var i = 0; i < 5; i++){

            //  creates weather day card
            var cardContainer_El = document.createElement('div');
            cardContainer_El.classList = 'weatherCardContainer';
            //cardContainer_El.setAttribute('id', 'weatherCard');
            fiveDayDisplay.appendChild(cardContainer_El);

            //create paragraph for weekday
            var weekDay_El = document.createElement('p');
            weekDay_El.classList = 'weekDay';
            weekDay_El.setAttribute('id', 'day');
            weekDay_El.textContent = daysOfWeek[(currentDate.getDay() + i) % 7]; // review if currentDate needs to be added

            cardContainer_El.appendChild(weekDay_El);

            // Create paragraph for current date
            var currentDate_El = document.createElement('p');
            currentDate_El.setAttribute('id', 'currentDateID');
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

// The City List ---- REVIEW THIS 
function storeCities() {
    localStorage.setItem("theCitiesList", JSON.stringify(theCitiesList));
    
  }
  
  function renderCityList() {
    cityList.innerHTML = "";
    
    for (var i = 0; i < theCitiesList.length; i++) {
      var addCity = theCitiesList[i];
  
      var li = document.createElement("li");
      li.textContent = addCity;
      li.setAttribute("data-index", i);
  
      cityList.appendChild(li);
    }
  }
  
  function init() {
    
    var storedCity = JSON.parse(localStorage.getItem("theCitiesList"));
    
    if (storedCity !== null) {
      theCitiesList = storedCity;
    }
    renderCityList();
  }
  
  init();
  
  document.querySelector('.formSubmit').addEventListener('submit', getCityEntry);

///TODO: 
  // Current day's Temp
  // start 5 day forecast tomorrow
  // fix date to increment
  // create city history "clickable"
  // clear input on submit and refresh