import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { setParticipantId } from '../actions/actions'

class IdInput extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            text: this.props.text || ''
        }
    }

    handleSubmit(e) {
        const text = e.target.value.trim()
        if (e.which === 13) {
            this.props.setParticipantId(text)
        }
    }

    handleChange(e) {
        this.setState({text: e.target.value})
    }

    render() {
        const { actions } = this.props
        return (
            <div><input
                type="text"
                autoFocus="true"
                value={this.state.text}
                onChange={this.handleChange.bind(this)}
                onKeyDown={this.handleSubmit.bind(this)}/></div>
        )
    }
}

IdInput.propTypes = {
    text: PropTypes.string,
    setParticipantId: PropTypes.func
}

export default connect(
    null,
    {setParticipantId}
)(IdInput)
