export const TASK_TYPES = [{
    id: 1,
    title: 'Conjunction Search',
    instructions: 'You will now be shown a number of screens with a combination of red vertical bars and green horizontal bars.<br/>' +
    'The aim of this task is to identify whether or not a <strong>red horizontal</strong> bar is present.<br/>' +
    'If the bar is present, please press the <kbd>/</kbd> key. If the bar is not present, please press the <kbd>z</kbd> key.<br/>' +
    'Please try and respond to each screen as quickly and as accurately as possible. ' +
    'Prior to each screen you will be shown a screen with a white fixation cross. This will indicate that a new screen is about to appear.<br/>' +
    'Press either <kbd>/</kbd> or <kbd>z</kbd> to begin.<br/>',
    longLength: 80,
    shortLength: 15
}, {
    id: 2,
    title: 'Spatial-configuration Search',
    instructions: 'You will now be shown a number of screens with the number 5 scattered randomly.<br/>' +
    'The aim of this task is to identify whether or not a <strong>number 2</strong> is present.<br/>' +
    'If the number 2 is present, please press the <kbd>/</kbd> key. If the number 2 is not present, please press the <kbd>z</kbd> key.<br/>' +
    'Please try and respond to each screen as quickly and as accurately as possible. ' +
    'Prior to each screen you will be shown a screen with a white fixation cross. This will indicate that a new screen is about to appear.<br/>' +
    'Press either <kbd>/</kbd> or <kbd>z</kbd> to begin.<br/>',
    elementWidth: 30,
    elementHeight: 46
}]
export const SET_SIZES = [10, 20, 30, 40]
export const TRIALS_PER_SESSION = 4
export const FIXATION_DURATION= 500 //ms