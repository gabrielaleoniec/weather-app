import * as R from 'ramda';

const MSGS = {
    'ADD_CITY': 'ADD_CITY',
    'INPUT_CITY_NAME': 'INPUT_CITY_NAME',
    'DELETE_CITY': 'DELETE_CITY',
    'DELETE_ERROR': 'DELETE_ERROR',
    'HTTP_SUCCESS': 'HTTP_SUCCESS',
    'HTTP_FAILURE' : 'HTTP_FAILURE'
}

const API_KEY = '9879a5db906e2899bc512227960719bc';

function weatherURL(city) {
    return `https://api.openweathermap.org/data/2.5/weather?q=${encodeURI(city)}&units=metric&appid=${API_KEY}`;
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

export function deleteCityMsg(idDelete) {
    return {
        type: MSGS.DELETE_CITY,
        idDelete
    }
}

export function deleteErrorMsg(id) {
    return {
        type: MSGS.DELETE_ERROR,
        id
    }
}

const httpSuccessMsg = R.curry((idUpdate, response) => ({
        type: MSGS.HTTP_SUCCESS,
        idUpdate,
        response
    }
))

const httpFailureMsg = R.curry((idError, error) => ({
        type: MSGS.HTTP_FAILURE,
        idError,
        error
    }
))

function deleteCity(model, id) {
    const cities = R.reject(c => c.id === id, model.cities);
    return {...model, cities};
}

function deleteError(model, id) {
    const errors = R.reject(c => c.id === id, model.errors);
    return {...model, errors};
}

function updateTemps(model, id, response) {
    const {cities} = model;
    const {temp, temp_min, temp_max} = R.pathOr({}, ['data', 'main'], response);

    const updatedCities = R.map(city => {
        if(city.id === id){
            return {
                ...city,
                temp: Math.round(temp),
                low: Math.round(temp_min),
                high: Math.round(temp_max),
            }
        }
        return city;
    }, cities);

    return {...model, cities: updatedCities}
}

function handleError(model, id, errorResponse) {
    const {errors} = model;
    const name = R.pathOr('', ['cities', id, 'name'], model);
    const error =  {
        id,
        msg: `Temperature could not be retrieved for the city: ${name}`,
        errorResponse
    };
    return {...model, errors: [...errors, error]}
}

function addCity(model){
    const {cities, next_id, name} = model;
    if(!model.name) {
        return model;
    }
    const newCity = {
        id: next_id,
        name,
        temp: '?',
        low: '?',
        high: '?'
    }
    return [{
            ...model,
            name: '',
            next_id: next_id+1,
            cities: [...cities, newCity]
        },
        {
            request: {url: weatherURL(name)},
            successMsg: httpSuccessMsg(next_id),
            failureMsg: httpFailureMsg(next_id)
        }
    ];
}

function update(model, action) {
    switch (action.type) {
        case MSGS.INPUT_CITY_NAME:
            const {name} = action;
            return {...model, name};
        case MSGS.ADD_CITY:
            return addCity(model);
        case MSGS.DELETE_CITY:
            const {idDelete} = action;
            const updatedModel = deleteError(model, idDelete);
            return deleteCity(updatedModel, idDelete);
        case MSGS.DELETE_ERROR:
            const {id} = action;
            return deleteError(model, id);
        case MSGS.HTTP_SUCCESS:
            const {idUpdate, response} = action;
            return updateTemps(model, idUpdate, response);
        case MSGS.HTTP_FAILURE:
            const {idError, error} = action;
            return handleError(model, idError, error);
    }
}

export default update;