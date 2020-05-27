import {patch, diff} from 'virtual-dom';
import createElement  from 'virtual-dom/create-element';
import axios from 'axios';
import * as R from 'ramda';

function httpEffects(dispatch, command) {
    if(command === null) {
        return;
    }
    const {request, successMsg, failureMsg} = command;
    axios(request).then(response => dispatch(successMsg(response))).catch(error => dispatch(failureMsg(error)));
}

function app(initModel, update, view, node){
    let model = initModel;
    let currentView = view(dispatch, model);
    let rootNode = createElement(currentView);
    node.appendChild(rootNode);

    function dispatch(action) {
        const updates = update(model, action);
        const isArray = R.type(updates) === 'Array';
        model = isArray ? updates[0] : updates;
        const command = isArray ? updates[1] : null;
        httpEffects(dispatch, command);
        const updatedView = view(dispatch, model);
        const patches = diff(currentView, updatedView);
        rootNode = patch(rootNode, patches);

        currentView = updatedView;
    }
}

export default app;