import * as R from 'ramda';

const MSGS = {
    'ADD_CITY': 'ADD_CITY',
    'INPUT_CITY_NAME': 'INPUT_CITY_NAME',
    'DELETE_CITY': 'DELETE_CITY',
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

function deleteCity(model, id) {
    console.log('delete city');
    const cities = R.reject(c => c.id === id, model.cities);
    return {...model, cities};
}

function update(model, action) {
    switch (action.type) {
        case MSGS.INPUT_CITY_NAME:
            const {name} = action;
            return {...model, name};
        case MSGS.ADD_CITY:
            const {cities, next_id} = model;
            const newCity = {
                id: next_id,
                name: model.name,
                temp: null,
                low: null,
                high: null
            }
            return {name: '', next_id: next_id+1, cities: [...cities, newCity]};
        case MSGS.DELETE_CITY:
            const {id} = action;
            return deleteCity(model, id);
    }
}

export default update;