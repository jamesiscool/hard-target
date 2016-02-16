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
                })
            }
        case Action.NEXT_TASK:
            const newSetSizePool = state.setSizePool.map((setSize) => {
                const occurrencesLeft = setSize.size === action.setSize ? --setSize.occurrencesLeft : setSize.occurrencesLeft;
                return {
                    ...setSize,
                    occurrencesLeft: occurrencesLeft
                }
            })
            return {
                ...state,
                setSizePool: newSetSizePool,
                appState: AppStates.TESTING,
                currentTask: {
                    targetPresent: action.targetPresent,
                    startTime: action.startTime,
                    setSize: action.setSize
                }
            }
        case Action.ADD_RESPONSE_TO_STATE:
            return {
                ...state,
                results: [...state.results,
                    {
                        responseTime: action.finishTime - state.currentTask.startTime,
                        correct: state.currentTask.targetPresent === action.targetPresent
                    }]
            }
        default:
            return state
    }
}

