async function fetchWeatherData(location) {
  let BASE_URL
  if (!location) {
    BASE_URL = "https://api.weatherapi.com/v1/current.json?key=1db180f23cb943889dd53144252707&q=delhi";
  }
  else {
    BASE_URL = "https://api.weatherapi.com/v1/current.json?key=1db180f23cb943889dd53144252707&q="
    + location;
  }
  const response = await fetch(BASE_URL);
  const data = await response.json();
  return data;
}

async function renderWeather(location) {
  try {
    const data = await fetchWeatherData(location);

    let weatherHTML = '';
    const name = data.location.name;
    const country = data.location.country
    const temp_c = data.current.temp_c;
    const condition = data.current.condition.text;
    const image = data.current.condition.icon;
    const wind_kph = data.current.wind_kph;
    const humidity = data.current.humidity;
    const last_updated = data.current.last_updated;

    weatherHTML += `
  <div class="header">
    <input class="input-bar" type="text" placeholder="Search city (e.g. Delhi)" />
    <div class="location-name">📍 ${name}, ${country}</div>
  </div>
  <div class="weather-content">
    <div class="left-section">
      <div class="temperature">${temp_c}°C</div>
      <div class="weather-condition">${condition}</div>
      <div class="other-weather-details">
        <p>Wind:${wind_kph}km/h <br>Humidity:${humidity}% <br>Last updated: ${last_updated}</p>
      </div>
    </div>
    <div class="right-section">
      <img id="weather-icon" src="${image}" alt="Weather Icon">
    </div>
  </div>`

    document.querySelector('.weatherContainer').innerHTML = weatherHTML;
    updateWeather();
  } catch (err) {
    renderErrorUi();
    updateWeather();
  }
}

function updateWeather() {
  let inputValue = document.querySelector('.input-bar');
  inputValue.addEventListener('keydown', async (event) => {
    if (event.key == 'Enter') {
      const city = inputValue.value.trim();
      inputValue.value = ''
      if(city){
        renderWeather(city);
      }
    }
  })
};

renderWeather();

function renderErrorUi() {
  let erroredHTML = `
    <div class="header">
      <input
        class="input-bar"
        type="text"
        placeholder="Search city (e.g. Delhi)"
      />
      <div class="location-name">📍 undefined</div>
    </div>
    <div class="weather-content">
      <div class="left-section">
        <div class="temperature">Undefined</div>
        <div class="weather-condition">404</div>
        <div class="other-weather-details">
          <p>Wind:unable <br>Humidity:to<br>Last updated: fetch data</p>
        </div>
      </div>
      <div class="right-section">
        <img id="weather-icon" src="" alt="Weather Icon">
      </div>
    </div>
  `;
  document.querySelector('.weatherContainer').innerHTML = erroredHTML;
}