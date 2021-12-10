import { createStore } from 'redux';
import { SET_DIRECTION, SlideAction } from './actions';

export interface IWebUIStore {
	slide: Slide;
}

export enum Slide {
	LEFT = 'left',
	RIGHT = 'right'
}

function webUIReducer(
	state = {
		slide: Slide.RIGHT
	},
	action: SlideAction
) {
	switch (action.type) {
		case SET_DIRECTION:
			return {
				...state,
				slide: action.payload
			};
		default:
			return state;
	}
}

const webUIStore = createStore(webUIReducer);

export default webUIStore;
