import {configureStore} from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';
import authReducer from '../features/login/loginSlice';
import listMatchesReducer from '../features/list-matches/listMatchesSlice';

export default configureStore({
  reducer: {
    counter: counterReducer,
    auth: authReducer,
    listMatches: listMatchesReducer,
  },
});
