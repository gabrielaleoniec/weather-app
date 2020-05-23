import app from './App';
import initModel from './Model';
import update from './Update';
import view from './View';

const node = document.getElementById('app');

app(initModel, update, view, node);