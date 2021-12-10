import { Slide } from 'platform/store';

export const SET_DIRECTION = 'SET_DIRECTION';

export type SlideAction = { type: typeof SET_DIRECTION; payload: Slide };

export const setSlideDirection = (dir: Slide): SlideAction => ({
	type: SET_DIRECTION,
	payload: dir
});
