import React, {Component, PropTypes} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {userReady} from '../actions/actions'

class Ready extends Component {
    constructor(props, context) {
        super(props, context)
    }

    handelOnKeyPress(e) {
        if (e.keyCode == 47 || e.keyCode == 122) {
            this.props.userReady()
        }
    }

    componentDidMount() {
        document.onkeypress = this.handelOnKeyPress.bind(this)
    }

    componentWillUnmount() {
        document.onkeypress = null;
    }

    render() {
        return (
            <div className="container">
                <div className="row vertical-center">
                    <div className="col-xs-12 col-sm-8 col-md-8 col-sm-offset-2 col-md-offset-2">
                        <h2>{this.props.taskTitle}</h2>
                        <h3>Instructions</h3>
                        <div dangerouslySetInnerHTML={{__html: this.props.taskInstructions}}></div>
                    </div>
                </div>
            </div>
        )
    }
}

Ready.propTypes = {
    taskInstructions: PropTypes.string,
    userReady: PropTypes.func.isRequired
}

export default connect(
    state => ({
        taskTitle: state.taskType.title,
        taskInstructions: state.taskType.instructions
    }),
    {userReady}
)(Ready)
