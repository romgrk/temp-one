import { combineReducers } from 'redux';

import {
} from './actions';
import {
  createDefaultUI
} from './models';

function uiReducer(state = createDefaultUI(), action) {
  switch (action.type) {
    default:
      return state;
  }
}

export const rootReducer = combineReducers({
    ui: uiReducer
})
