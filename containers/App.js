import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import IdInput from '../components/IdInput'
import Ready from '../components/Ready'
import Task from '../components/Task'
import Fixation from '../components/Fixation'
import * as AppStates from '../constants/AppStates'

class App extends Component {
    render() {
        const { appState } = this.props
        var component
        switch (appState) {
            case AppStates.ID_INPUT:
                component = <IdInput/>;
                break;
            case AppStates.READY:
                component = <Ready/>;
                break;
            case AppStates.FIXATION:
                component = <Fixation/>;
                break;
            case AppStates.TESTING:
                component = <Task/>;
                break;
            default:
                component = <div>No app state</div>
        }
        return (component)
    }
}

App.propTypes = {
    appState: PropTypes.string.isRequired
}

function mapStateToProps(state) {
    return {
        appState: state.appState
    }
}

export default connect(mapStateToProps)(App)
