import hh from 'hyperscript-helpers';
import {h} from 'virtual-dom';

import * as R from 'ramda';

import {inputCityMsg, addCityMsg, deleteCityMsg, httpSuccessMsg} from './Update';

const {pre, div, h1, h2, input, button, label, i} = hh(h);

function displayCell(label, value) {
    return div([
        h2({className: 'f6 ma2 mt3'}, label),
        div({className: 'f4 ma2'}, value)
    ]);
}

function displayCity(dispatch, city) {
    return div({
        className: 'flex bg-light-blue mv3'
    }, [
        div({
            className: 'w-50'
        },
            displayCell('Location', city.name),
        ),
        div({
            className: 'w-50 flex justify-between'
        }, [
            displayCell('Temp', city.temp),
            displayCell('Low', city.low),
            displayCell('High', city.high)
        ]),
        i({
            className: 'fa fa-trash pa2 pointer',
            onclick: e => dispatch(deleteCityMsg(city.id))
        })
    ]);
}

function displayList(dispatch, model) {
    return R.map(city => displayCity(dispatch, city), model.cities);
}

function displayForm(dispatch, model) {
    return div([
        label({
            className: 'db mv2',
            for: 'city'
            },
            'Location'
        ),
        input({
            className: 'pv1 ph2',
            id: 'city',
            value: model.name,
            oninput: e => dispatch(inputCityMsg(e.target.value)),
            onchange: e => dispatch(addCityMsg),
        }),
        button({
            className: 'pv1 ph2 bg-green white ba b--dark-green pointer grow',
            type: 'submit',
            onclick: e => dispatch(addCityMsg)
        }, 'Add')
    ]);
}

function displayError(model) {
    const {error} = model;
    if(!R.isEmpty(error)) {
        return div({className: 'pa2 mv3 bg-red white'}, [
            div(R.pathOr('', ['msg'], error)),
            div(R.pathOr('', ['errorResponse', 'message'], error))
        ]);
    }
    return null;
}

function view(dispatch, model) {
    return div({
            className: 'avenir w-50 mw6 center'
        },
        [
            h1({className: 'bb'}, 'Weather APP'),
            displayForm(dispatch, model),
            displayError(model),
            displayList(dispatch, model),
        ]
    );
}

export default view;