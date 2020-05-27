import * as R from 'ramda';

const MSGS = {
    'ADD_CITY': 'ADD_CITY',
    'INPUT_CITY_NAME': 'INPUT_CITY_NAME',
    'DELETE_CITY': 'DELETE_CITY',
    'HTTP_SUCCESS': 'HTTP_SUCCESS'
}

const API_KEY = '9879a5db906e2899bc512227960719bc';

function weatherURL(city) {
    return `api.openweathermap.org/data/2.5/weather?q=${encodeURI(city)}&appid=${API_KEY}`;
}

export const addCityMsg = {
    type: MSGS.ADD_CITY
}

export function inputCityMsg(name) {
    return {
        type: MSGS.INPUT_CITY_NAME,
        name
    }
}

export function deleteCityMsg(id) {
    return {
        type: MSGS.DELETE_CITY,
        id
    }
}

export function httpSuccessMsg(id, response) {
    return {
        type: MSGS.HTTP_SUCCESS,
        id,
        response
    }
}

function deleteCity(model, id) {
    const cities = R.reject(c => c.id === id, model.cities);
    return {...model, cities};
}

function updateTemps(model, id, response) {
    const {cities} = model;
    const {temp, temp_low, temp_max} = R.pathOr({}, ['data', 'main'], response);

    const updatedCities = R.map(city => {
        if(city.id === id){
            return {
                ...city,
                temp: Math.round(temp),
                low: Math.round(temp_low),
                high: Math.round(temp_max),
            }
        }
        return city;
    }, cities);

    return {...model, cities: updatedCities}
}

function update(model, action) {
    switch (action.type) {
        case MSGS.INPUT_CITY_NAME:
            const {name} = action;
            return {...model, name};
        case MSGS.ADD_CITY:
            const {cities, next_id} = model;
            if(!model.name) {
                return model;
            }
            const newCity = {
                id: next_id,
                name: model.name,
                temp: '?',
                low: '?',
                high: '?'
            }
            return {name: '', next_id: next_id+1, cities: [...cities, newCity]};
        case MSGS.DELETE_CITY:
            const {id} = action;
            return deleteCity(model, id);
        case MSGS.HTTP_SUCCESS:
            const {idUpdate, response} = action;
            console.log(response);
            return updateTemps(model, idUpdate, response);
    }
}

export default update;