import {patch, diff} from 'virtual-dom';
import createElement  from 'virtual-dom/create-element';

function app(initModel, update, view, node){
    let model = initModel;
    let currentView = view(dispatch, model);
    let rootNode = createElement(currentView);
    node.appendChild(rootNode);

    function dispatch(action) {
        model = update(model, action);
        const updatedView = view(dispatch, model);
        const patches = diff(currentView, updatedView);
        rootNode = patch(rootNode, patches);

        currentView = updatedView;
    }
}

export default app;