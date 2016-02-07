import {TASK_TYPE_ORDER} from '../constants/TaskTypes'
import * as AppStates from '../constants/AppStates'
var fs = require('fs')

export const SET_PARTICIPANT_ID = 'SET_PARTICIPANT_ID'
export function setParticipantId(participantId) {
    return {
        type: SET_PARTICIPANT_ID,
        participantId
    }
}
export const SET_APP_STATE = 'SET_APP_STATE'
export function setAppState(state) {
    return {
        type: SET_APP_STATE,
        state
    }
}

export function userReady() {
    return dispatch => {
        dispatch(nextTaskType())
        dispatch(startFixation())
    }
}

export const NEXT_TASK_TYPE = 'NEXT_TASK_TYPE';
export function nextTaskType() {
    return {
        type: NEXT_TASK_TYPE
    }
}

export function startFixation() {
    return dispatch => {
        dispatch(dispatch(setAppState(AppStates.FIXATION)))
        setTimeout(() => {
            dispatch(finishFixation());
        }, 500)
    }
}

export const FINISH_FIXATION = 'FINISH_FIXATION'
export function finishFixation() {
    return {
        type: FINISH_FIXATION,
        targetPresent: Math.random() < .5,
        startTime: Date.now()
    }
}


function logResponsesToFile(state) {
    console.log("Log to file:")
    console.log(state)
    var data = '';
    state.results.forEach(result => {
        data = data + state.participantId + ',' + state.taskType + ',' + new Date() + ',' + result.responseTime + ',' + result.correct + '\n'
    });
    console.log(data)
    fs.appendFile('data.csv', data, function (err) {

    });
}

const trialsPerSession = 20
export function response(targetPresent) {
    return (dispatch, getState) => {
        const state = getState();
        dispatch(addResponseToState(targetPresent))
        if (state.results.length === trialsPerSession) {
            logResponsesToFile(state)
            if (TASK_TYPE_ORDER.indexOf(state.taskType) + 1 < TASK_TYPE_ORDER.length) {
                dispatch(setAppState(AppStates.READY))
            } else {
                dispatch(setAppState(AppStates.ID_INPUT))
            }
        } else {
            dispatch(startFixation())
        }

    }
}

export const ADD_RESPONSE_TO_STATE = 'ADD_RESPONSE_TO_STATE'
export function addResponseToState(targetPresent) {
    return {
        type: ADD_RESPONSE_TO_STATE,
        finishTime: Date.now(),
        targetPresent
    }
}