import * as Action from '../actions/actions'
import * as AppStates from '../constants/AppStates'
import {TASK_TYPE_ORDER} from '../constants/TaskTypes'

const initialState = {
    appState: AppStates.ID_INPUT
}

const initialStateTest = {
    appState: AppStates.TESTING,
    taskType: TASK_TYPE_ORDER[0],
    currentTask: {
        targetPresent: Math.random() < .5,
        startTime: Date.now()
    },
    results: []
}


export default function reducers(state = initialState, action) {
    switch (action.type) {
        case Action.SET_PARTICIPANT_ID:
            return {
                appState: AppStates.READY,
                participantId: action.participantId,
                taskType: null
            }
        case Action.SET_APP_STATE:
            return {
                ...state,
                appState: action.state
            }
        case Action.NEXT_TASK_TYPE:
            return {
                ...state,
                taskType: TASK_TYPE_ORDER[TASK_TYPE_ORDER.indexOf(state.taskType) + 1],
                results: []
            }
        case Action.FINISH_FIXATION:
            return {
                ...state,
                appState: AppStates.TESTING,
                currentTask: {
                    targetPresent: action.targetPresent,
                    startTime: action.startTime
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

