import React, {Component, PropTypes} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {start} from '../actions/actions'
import {TASK_TYPES} from '../constants/Task'

class Setup extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            participantId: this.props.participantId || '',
            taskTypes: TASK_TYPES.map((taskType) => {
                return {...taskType, selected: true}
            })
        }
    }

    handleSubmit() {
        this.props.start(this.state.participantId.trim(), this.state.taskTypes.filter((taskType) => {
            return taskType.selected
        }))
    }

    handleParticipantIdOnKeyDown(e) {
        if (e.which === 13) {
            this.handleSubmit()
        }
    }

    handleParticipantIdOnChange(e) {
        this.setState({participantId: e.target.value})
    }

    changeTaskTypeSelection(id) {
        var taskTypes = this.state.taskTypes.map(function (taskType) {
            return {
                ...taskType,
                selected: (taskType.id === id ? !taskType.selected : taskType.selected)
            };
        });
        this.setState({taskTypes: taskTypes});
    }

    render() {
        var checks = this.state.taskTypes.map(function (taskType) {
            return (
                <div className="checkbox" key={taskType.id}>
                    <label>
                        <input type="checkbox" checked={taskType.selected} onChange={this.changeTaskTypeSelection.bind(this, taskType.id)}/>
                        {taskType.title}
                        <br />
                    </label>
                </div>
            )
        }.bind(this));

        return (
            <div className="container">
                <div className="row vertical-center">
                    <div className="col-xs-12 col-sm-8 col-md-6 col-sm-offset-2 col-md-offset-3">
                        <h2>Setup</h2>
                        <div className="form-group">
                            <label htmlFor="participantId">Participant Id </label>
                            <input
                                id="participantId"
                                type="text"
                                autoFocus="true"
                                value={this.state.participantId}
                                onChange={this.handleParticipantIdOnChange.bind(this)}
                                onKeyDown={this.handleParticipantIdOnKeyDown.bind(this)}
                                className="form-control"/>
                        </div>
                        <div className="form-group">
                            <label>Task Types</label>
                            {checks}
                        </div>
                        <div className="form-group">
                            <button className="btn btn-info" onClick={this.handleSubmit.bind(this)}>Start</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

Setup.propTypes = {
    participantId: PropTypes.string,
    start: PropTypes.func
}

export default connect(
    null,
    {start}
)(Setup)
