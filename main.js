const weatherApiKey = '1c53b7c5b06b4fd2b55153200232506';
// const weatherRequest = 'http://api.weatherapi.com/v1/current.json?key=1c53b7c5b06b4fd2b55153200232506&q=London';
const weatherBody = document.querySelector('.weather');
const weatherForm = document.querySelector('#weather-form');
const weatherInput = document.querySelector('#weather-input');
let city;

// Event submit

weatherForm.addEventListener('submit', (e) => {
  e.preventDefault();

  city = weatherInput.value.trim();
  getWeatherData();
  // weatherInput.value = '';
});

// get data from server

async function getWeatherData() {

  const responseWeatherData = await fetch(`http://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${city}`);
  const weatherData = await responseWeatherData.json();
  console.log(weatherData);
  createWeatherCard(weatherData);
  return weatherData;

};

// create card with data from server

function createWeatherCard(weatherData) {

  if (weatherData.error) {
    removePreviouseCard();
    createErrorCard(weatherData);

    if (weatherInput.value == '') {
      removePreviouseCard();
      createEmptyCard(weatherBody);
    }

  } else {

    removePreviouseCard();

    const fullDate = weatherData.location.localtime;
    const date = fullDate.substring(0, 10);
    const time = fullDate.substring(10, 16);



    const weatherCard = `
        <ul class="weather__list">
          <li  class="weather__list-item"><span class="weather__list-title">Country:</span>${weatherData.location.country}</li>
          <li  class="weather__list-item"><span class="weather__list-title">City:</span>${weatherData.location.name}</li>
          <li  class="weather__list-item"><span class="weather__list-title">Date:</span>${date}</li>
          <li  class="weather__list-item"><span class="weather__list-title">Time:</span>${time}</li>
          <li  class="weather__list-item"><span class="weather__list-title">Temperature:</span>${weatherData.current.temp_c}°C</li>
          <li  class="weather__list-item"><span class="weather__list-title">Feels like:</span>${weatherData.current.feelslike_c} °C</li>
          <li  class="weather__list-item"><span class="weather__list-title">Wind:</span>${weatherData.current.wind_kph} km/ph</li>
          <li  class="weather__list-item"><span class="weather__list-title">Gusts of wind:</span>${weatherData.current.gust_kph} km/ph</li>
          <li  class="weather__list-item"><span class="weather__list-title">Wind direction:</span>${weatherData.current.wind_dir}</li>
          <li  class="weather__list-item">
          <span class="weather__list-title"> ${weatherData.current.condition.text}</span>
          <img class="weather__list-img" src="${weatherData.current.condition.icon}">
          </li>
        </ul>
          `;
    weatherBody.insertAdjacentHTML('beforeend', weatherCard);

  }
  weatherInput.value = '';
}


// function remove previous card

function removePreviouseCard() {

  const prevWeatherCard = document.querySelector('.weather__list');
  if (prevWeatherCard) {
    prevWeatherCard.remove();
  }

}

// function  create error card 

function createErrorCard(weatherData) {

  const errorCard = `
    <ul class="weather__list" id="error">
      <li  class="weather__list-item error-item">${weatherData.error.message}</li>
    </ul>
    `;
  weatherBody.insertAdjacentHTML('beforeend', errorCard);
}

// function  create error card for the empty input

function createEmptyCard() {

  const emptyCard = `
    <ul class="weather__list" id="empty">
      <li  class="weather__list-item error-item">Enter city name</li>
    </ul>
    `;
  weatherBody.insertAdjacentHTML('beforeend', emptyCard);
}



//  function get user IP

async function getUserIp() {

  const responseIp = await fetch(`https://api.db-ip.com/v2/free/self`);
  const ip = await responseIp.json();
  console.log(ip.city);
  return ip.city;

};

//  get data from server where city was got from user IP

async function getWeatherDataIp() {
 
  const responseWeatherData = await fetch(`http://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${await getUserIp()}`);
  const weatherData = await responseWeatherData.json();
  createWeatherCard(weatherData);
  return weatherData;

};

//  function create weather card on load

function createWeatherCardOnLoad() {

  window.addEventListener('load', () => {
    getWeatherDataIp()
  });

}
createWeatherCardOnLoad();

