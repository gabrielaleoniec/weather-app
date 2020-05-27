const axios = require ('axios');

const API_KEY = '9879a5db906e2899bc512227960719bc';

function weatherURL(city) {
    return `api.openweathermap.org/data/2.5/weather?q=${encodeURI(city)}&appid=${API_KEY}`;
}

function success(response) {
    console.log(JSON.stringify(response, null, 2));
}

function failure(err) {
    console.log(JSON.stringify(err, null, 2));
}

const url = weatherURL('Madrid');

const request = {url};

axios(request).then(success, failure);
