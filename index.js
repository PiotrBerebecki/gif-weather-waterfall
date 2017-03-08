// **********
// APP
// **********
waterfall({}, [getLocation, getWeather, getImage], renderData);


function waterfall(appData, tasks, show) {
  if (tasks.length === 0) {
    return show(null, appData);
  }

  tasks[0](appData, function(err, res) {
    if (err) {
      return show(err);
    }
    waterfall(res, tasks.slice(1), show);
  });
}



// **********
// LOCATION
// **********
function getLocation(appData, cb) {
  var locationUrl = 'https://geoip.nekudo.com/api/';
  fetch('GET', locationUrl, function(err, responseObject) {
    cb(null, processLocation(appData, responseObject));
  });
}

function processLocation(appData, responseObject) {
  appData.latitude = responseObject.location.latitude;
  appData.longitude = responseObject.location.longitude;
  return appData;
}



// **********
// WEATHER
// **********
function getWeather(appData, cb) {
  var weatherUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${appData.latitude}&lon=${appData.longitude}&units=metric&APPID=93b0b9be965a11f0f099c8c7f74afa63`
  fetch('GET', weatherUrl, function(err, responseObject) {
    cb(null, processWeather(appData, responseObject))
  });
}

function processWeather(appData, responseObject) {
  appData.description = responseObject.weather[0].description;
  appData.temperature = responseObject.main.temp;
  return appData;
}



// **********
// IMAGES
// **********
function getImage(appData, cb) {
  var imageUrl = `http://api.giphy.com/v1/gifs/search?q=${encodeURIComponent(appData.description)}&api_key=dc6zaTOxFJmzC`
  fetch('GET', imageUrl, function(err, responseObject) {
    cb(null, processImage(appData, responseObject))
  });
}

function processImage(appData, responseObject) {
  // console.log(responseObject.data[0].images.fixed_height_small.url);
  appData.image = responseObject.data[0].images.fixed_height_small.url;
  return appData;
}



// **********
// FETCH
// **********
function fetch(method, url, cb) {
  var xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4 && xhr.status === 200) {
      cb(null, JSON.parse(xhr.responseText));
    }
  }

  xhr.send();
}



// **********
// VIEW
// **********
function renderData(err, data) {
  console.log(data.description, data.image);
  for (key in data) {
    if (key === 'image') {
      document.querySelector(`.${key}`).src = data[key];
    } else {
      document.querySelector(`.${key}`).textContent = data[key];
    }
  }
}
