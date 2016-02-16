import {TRIALS_PER_SESSION, FIXATION_DURATION} from '../constants/Task'
import * as AppStates from '../constants/AppStates'
import {randomIntFromInterval} from '../utils/util'
var path = require('path')
var fs = require('fs')

function setFullscreen(fullscreen) {
    if (global.window.nwDispatcher) {
        var nw = global.window.nwDispatcher.requireNwGui();
        var win = nw.Window.get();
        win.isFullscreen = fullscreen
    }
}

export const START = 'START'
export function start(participantId, selectedTaskTypes) {
    setFullscreen(true);
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
        }, FIXATION_DURATION)
    }
}

export const NEXT_TASK = 'NEXT_TASK'
export function nextTask(setSize, targetPresent) {
    return {
        type: NEXT_TASK,
        targetPresent: targetPresent,
        startTime: Date.now(),
        setSize: setSize
    }
}

export const FINISH_RENDERING = 'FINISH_RENDERING'
export function finishRendering() {
    return {
        type: FINISH_RENDERING,
        startTime: Date.now()
    }
}

export function finishFixation() {
    return (dispatch, getState) => {
        const state = getState()
        const stillAvailableSetSizes = state.setSizePool.filter((setSize) => {
            return setSize.occurrencesLeft > 0
        })
        const setSize = stillAvailableSetSizes[randomIntFromInterval(0, stillAvailableSetSizes.length - 1)].size

        const stillAvailableTargetPresents = state.targetPresentPool.filter((targetPresent) => {
            return targetPresent.occurrencesLeft > 0
        })
        const targetPresent = stillAvailableTargetPresents[randomIntFromInterval(0, stillAvailableTargetPresents.length - 1)].present

        dispatch(nextTask(setSize, targetPresent))
    }
}


function logResponsesToFile(state) {
    const header = 'Participant Id,TaskType,Set Completion DateTime,Response Time,Correct Response,Target Present,Set Size\n'
    var data = '';
    state.results.forEach(result => {
        data = data + state.participantId + ',' + state.taskType.title + ',' + new Date() + ',' + result.responseTime + ',' + result.correct + ',' + result.targetPresent + ',' + result.setSize + '\n'
    });
    console.log("Write to data file:")
    console.log(data)
    if (global.window.nwDispatcher) {
        var nwPath = process.execPath;
        var nwDir = path.dirname(nwPath);
        const dataPath = nwDir + '\\data.csv'
        fs.access(dataPath, fs.F_OK, function (err) {
            if (err) {
                data = header + data
            }
            fs.appendFile(dataPath, data, function (appendErr) {
                console.log(appendErr)
            })
        });

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
                setFullscreen(false)
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