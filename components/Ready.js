import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { userReady } from '../actions/actions'

class Ready extends Component {
    constructor(props, context) {
        super(props, context)
    }

    handelOnKeyPress(e) {
        console.log(e);
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
            <div>Blah blah to press the "/" key for "yes" and the "z" key for "no." When you are ready to start press the "/" or "z" key</div>
        )
    }
}

Ready.propTypes = {
    userReady: PropTypes.func.isRequired
}

export default connect(
    null,
    {userReady}
)(Ready)
