import {createSlice} from '@reduxjs/toolkit';
import setAuthToken from '../../utils/setAuthToken';
import axios from 'axios';

export const matchSlice = createSlice({
  name: 'match',
  initialState: {
    detail: {},
    loaded: false,
    code: -1,
  },
  reducers: {
    matchLoaded: (state, action) => {
      state.detail = action.payload.detail;
      state.loaded = true;
      state.code = action.payload.detail.code;
    },
  },
});

export const {
  matchLoaded,
} = matchSlice.actions;

// THUNKS

/**
 * Take token from localstorage to perform authenticating
 * @param {Number} code match's code
 * @return {*} nothing
 */
export const loadMatchByCode = (code) => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get('/api/admin/matches/' + code);
    dispatch(matchLoaded({detail: res.data}));
  } catch (error) {
    // dispatch(removeAuth());
  }
};

export const selectMatch = (state) => state.match;

export default matchSlice.reducer;
