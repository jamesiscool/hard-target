import {TRIALS_PER_SESSION} from '../constants/Task'
import * as AppStates from '../constants/AppStates'
import {randomIntFromInterval} from '../utils/util'
var path = require('path')
var fs = require('fs')

export const START = 'START'
export function start(participantId, selectedTaskTypes) {
    return {
        type: START,
        participantId,
        selectedTaskTypes
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
        }, 5)
    }
}

export const NEXT_TASK = 'NEXT_TASK'
export function nextTask(setSize) {
    return {
        type: NEXT_TASK,
        targetPresent: Math.random() < .5,
        startTime: Date.now(),
        setSize: setSize
    }
}

export function finishFixation() {
    return (dispatch, getState) => {
        const state = getState()
        const stillAvailableSetSizes = state.setSizePool.filter((setSize) => {
            return setSize.occurrencesLeft > 0
        })
        const setSize = stillAvailableSetSizes[randomIntFromInterval(0, stillAvailableSetSizes.length - 1)].size
        dispatch(nextTask(setSize))
    }
}


function logResponsesToFile(state) {
    var data = '';
    state.results.forEach(result => {
        data = data + state.participantId + ',' + state.taskType + ',' + new Date() + ',' + result.responseTime + ',' + result.correct + ',' + result.targetPresent + ',' + result.setSize + '\n'
    });
    if (global.window.nwDispatcher) {
        var nwPath = process.execPath;
        var nwDir = path.dirname(nwPath)
        fs.appendFile(nwDir + '\\data.csv', data, function (err) {
            console.log(err)
        })
    } else {
        console.log("Log to file:")
        console.log(data)
    }
}


export function response(targetPresent) {
    return (dispatch, getState) => {
        dispatch(addResponseToState(targetPresent))
        const state = getState();
        if (state.results.length >= TRIALS_PER_SESSION) {
            logResponsesToFile(state)
            if (state.taskTypesToTest.indexOf(state.taskType) < state.taskTypesToTest.length - 1) {
                dispatch(nextTaskType())
                dispatch(setAppState(AppStates.READY))
            } else {
                dispatch(setAppState(AppStates.SETUP))
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