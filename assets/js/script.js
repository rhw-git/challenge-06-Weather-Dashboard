// set global variables
var citiesListArr = [];
var numOfCities = 9;
var personalAPIKey = "appid=264dbcaa3899de05eeadc78d68ba06dc";

var dailyWeatherApiStarts =
  "https://api.openweathermap.org/data/2.5/weather?q=";
var dailyUVIndexApiStarts = "http://api.openweathermap.org/data/2.5/uvi?";
// select from html element
var searchCityForm = $("#searchCityForm");
var searchedCities = $("#searchedCityLi");
//-------------------------- get weather info from OpenWeather starts here ------------------------------//
var getCityWeather = function (searchCityName) {
  // formate the OpenWeather api url
  var apiUrl = dailyWeatherApiStarts + searchCityName + "&" + personalAPIKey;
  // make a request to url
  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      $("#cityName").html(response.name);
      // display weather icon
      weatherIncoUrl =
        "http://openweathermap.org/img/wn/" +
        response.weather[0].icon +
        "@2x.png";
      $("#weatherIconToday").attr("src", weatherIncoUrl);
      $("#tempToday").html(response.main.temp + " \u00B0F");
      $("#humidityToday").html(response.main.humidity + " %");
      $("#windSpeedToday").html(response.wind.speed + " MPH");
      // return coordinate for getUVIndex to call
      var lat = response.coord.lat;
      var lon = response.coord.lon;
      getUVIndex(lat, lon);
    });
};

var getUVIndex = function (lat, lon) {
  // formate the OpenWeather api url
  var apiUrl =
    dailyUVIndexApiStarts + personalAPIKey + "&lat=" + lat + "&lon=" + lon;
  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      $("#UVIndexToday").html(response.value);
      if (response.value < 3) {
        $("#UVIndexToday").addClass("p-1 rounded bg-success text-white");
      } else if (response.value < 8) {
        $("#UVIndexToday").addClass("p-1 rounded bg-warning text-white");
      } else {
        $("#UVIndexToday").addClass("p-1 rounded bg-danger text-white");
      }
    });
};

//-------------------------- get weather info from OpenWeather ends here ------------------------------//
//-------------------------------------- create button starts  ----------------------------------------//
var creatBtn = function (btnText) {
  var btn = $("<button>")
    .text(btnText)
    .addClass("list-group-item list-group-item-action")
    .attr("type", "submit");
  return btn;
};
//-------------------------------------- create button ends  ------------------------------------------//
//---------------------- load saved citeis names from localStorage starts here ------------------------//
var loadSavedCity = function () {
  citiesListArr = JSON.parse(localStorage.getItem("weatherInfo"));
  if (citiesListArr == null) {
    citiesListArr = [];
  }
  for (var i = 0; i < citiesListArr.length; i++) {
    var cityNameBtn = creatBtn(citiesListArr[i]);
    searchedCities.prepend(cityNameBtn);
  }
};
//---------------------- load saved citeis names from localStorage ends here ------------------------//
//----------------------- save searched city in to local storage starts here --------------------------//
var saveCityName = function (searchCityName) {
  citiesListArr = JSON.parse(localStorage.getItem("weatherInfo"));
  if (citiesListArr == null) {
    citiesListArr = [];
    citiesListArr.unshift(searchCityName);
  } else if (citiesListArr.length < numOfCities) {
    // create object
    citiesListArr.unshift(searchCityName);
  } else {
    // control the length of the array. do not allow to save more than 10 cities
    citiesListArr.pop();
    citiesListArr.unshift(searchCityName);
  }
  localStorage.setItem("weatherInfo", JSON.stringify(citiesListArr));
  return citiesListArr;
};
//------------------------ save searched city in to local storage ends here ---------------------------//
//-------------------------- create button with searched city starts here -----------------------------//
var createCityNameBtn = function (citiesListArr) {
  if (searchedCities[0].childElementCount < numOfCities) {
    var cityNameBtn = creatBtn(citiesListArr);
    searchedCities.prepend(cityNameBtn);
  } else {
    searchedCities[0].removeChild(searchedCities[0].lastChild);
    var cityNameBtn = creatBtn(citiesListArr);
    searchedCities.prepend(cityNameBtn);
  }
};
//------------------------------------- call functions directly ---------------------------------------//
loadSavedCity();
//-------------------------- create button with searched city ends here -------------------------------//
//--------------------------- event handler from submit form starts here ------------------------------//
var formSubmitHandler = function (event) {
  event.preventDefault();
  // name of the city
  var searchCityName = $("#searchCity").val().trim();
  if (searchCityName) {
    saveCityName(searchCityName);
    createCityNameBtn(searchCityName);
    getCityWeather(searchCityName);
  } else {
    alert("please enter a city name!");
  }
};
var BtnClickHandler = function (event) {
  event.preventDefault();
  // name of the city
  var searchCityName = event.target.textContent.trim();
  getCityWeather(searchCityName);
};
//--------------------------- event handler from submit form ends here ------------------------------//
//------------------------ call functions with submit button starts here ----------------------------//
$("#searchCityForm").on("submit", function () {
  formSubmitHandler(event);
});
$(":button.list-group-item-action").on("click", function () {
  BtnClickHandler(event);
});
//-------------------------- call functions with submit button ends here ----------------------------//
