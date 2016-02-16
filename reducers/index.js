import * as Action from '../actions/actions'
import * as AppStates from '../constants/AppStates'
import {TASK_TYPES, SET_SIZES, TRIALS_PER_SESSION} from '../constants/Task'

const initialState = {
    appState: AppStates.SETUP
}
const newSetSizePool = SET_SIZES.map((setSize) => {
    return {size: setSize, occurrencesLeft: TRIALS_PER_SESSION / SET_SIZES.length}
})

/*
 const devInitialStateTest = {
 appState: AppStates.TESTING,
 taskType: TASK_TYPES[0],
 currentTask: {
 targetPresent: Math.random() < .5,
 startTime: Date.now()
 },
 results: []
 }

 const devInitialStateReady = {
 appState: AppStates.READY,
 taskType: TASK_TYPES[0],
 currentTask: {
 targetPresent: Math.random() < .5,
 startTime: Date.now()
 },
 results: []
 }
 */

export default function reducers(state = initialState, action) {
    switch (action.type) {
        case Action.START:
            return {
                appState: AppStates.READY,
                participantId: action.participantId,
                taskTypesToTest: action.selectedTaskTypes,
                taskType: action.selectedTaskTypes[0],
                setSizePool: SET_SIZES.map((setSize) => {
                    return {size: setSize, occurrencesLeft: TRIALS_PER_SESSION / SET_SIZES.length}
                }),
                targetPresentPool: [{present: true, occurrencesLeft: TRIALS_PER_SESSION / 2}, {present: false, occurrencesLeft: TRIALS_PER_SESSION / 2}],
                results: []
            }
        case Action.SET_APP_STATE:
            return {
                ...state,
                appState: action.state
            }
        case Action.NEXT_TASK_TYPE:
            return {
                ...state,
                taskType: state.taskTypesToTest[state.taskTypesToTest.indexOf(state.taskType) + 1],
                results: [],
                setSizePool: SET_SIZES.map((setSize) => {
                    return {size: setSize, occurrencesLeft: TRIALS_PER_SESSION / SET_SIZES.length}
                }),
                targetPresentPool: [{present: true, occurrencesLeft: TRIALS_PER_SESSION / 2}, {present: false, occurrencesLeft: TRIALS_PER_SESSION / 2}],
            }
        case Action.NEXT_TASK:
            return {
                ...state,
                setSizePool: state.setSizePool.map((setSize) => {
                    return {
                        ...setSize,
                        occurrencesLeft: setSize.size === action.setSize ? --setSize.occurrencesLeft : setSize.occurrencesLeft
                    }
                }),
                targetPresentPool: state.targetPresentPool.map((targetPresent) => {
                    return {
                        ...targetPresent,
                        occurrencesLeft: targetPresent.present === action.targetPresent ? --targetPresent.occurrencesLeft : targetPresent.occurrencesLeft
                    }
                }),
                appState: AppStates.TESTING,
                currentTask: {
                    targetPresent: action.targetPresent,
                    startTime: action.startTime,
                    setSize: action.setSize
                }
            }
        case Action.FINISH_RENDERING:
            return {
                ...state,
                currentTask: {
                    ...state.currentTask,
                    startTime: action.startTime
                }
            }
        case Action.ADD_RESPONSE_TO_STATE:
            return {
                ...state,
                results: [...state.results,
                    {
                        responseTime: action.finishTime - state.currentTask.startTime,
                        correct: state.currentTask.targetPresent === action.targetPresent,
                        targetPresent: state.currentTask.targetPresent,
                        setSize: state.currentTask.setSize
                    }]
            }
        default:
            return state
    }
}

