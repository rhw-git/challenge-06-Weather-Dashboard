// set global variables
var citiesListArr = [];
var numOfCities = 3;
// select from html element
var searchCityForm = $("#searchCityForm");
var searchedCities = $("#searchedCityLi");
//-------------------------- get weather info from OpenWeather starts here ------------------------------//
var getCityWeather = function (searchCityName) {
  // formate the OpenWeather api url
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    searchCityName +
    "&APPID=264dbcaa3899de05eeadc78d68ba06dc";
  // make a request to url
  fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      console.log(response.main.temp);
      console.log(response.main.humidity);
      console.log(response.wind.speed);
    });
};
//-------------------------- get weather info from OpenWeather ends here ------------------------------//
//---------------------- load saved citeis names from localStorage starts here ------------------------//
var loadSavedCity = function () {
  citiesListArr = JSON.parse(localStorage.getItem("weatherInfo"));
  if (citiesListArr == null) {
    citiesListArr = [];
  }
  for (var i = 0; i < citiesListArr.length; i++) {
    var cityNameBtn = $("<button>")
      .text(citiesListArr[i])
      .addClass("list-group-item list-group-item-action");
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
    var cityNameBtn = $("<button>")
      .text(citiesListArr)
      .addClass("list-group-item list-group-item-action");
    searchedCities.prepend(cityNameBtn);
  } else {
    searchedCities[0].removeChild(searchedCities[0].lastChild);
    var cityNameBtn = $("<button>")
      .text(citiesListArr)
      .addClass("list-group-item list-group-item-action");
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
//--------------------------- event handler from submit form ends here ------------------------------//
//------------------------ call functions with submit button starts here ----------------------------//
$("#searchCityForm").on("submit", function () {
  formSubmitHandler(event);
});
//-------------------------- call functions with submit button ends here ----------------------------//
