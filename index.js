import 'babel-core/polyfill'
import React from 'react'
import {render} from 'react-dom'
import {Provider} from 'react-redux'
import App from './containers/App'
import configureStore from './store/configureStore'
import './css/bootstrap.css'
import './css/index.css'

const store = configureStore();

render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);
if (global.window.nwDispatcher) {
    var nw = global.window.nwDispatcher.requireNwGui();
    var win = nw.Window.get();
    win.show();
    win.maximize();
}
document.onkeydown = (e) => {
    if (e.keyCode == 27) {
        var nw = global.window.nwDispatcher.requireNwGui();
        var win = nw.Window.get();
        win.isFullscreen = !win.isFullscreen
    }
}