/* eslint-disable import/prefer-default-export */

const initialState = {
  show: false,
};

export function loadingReducer(state = initialState, action) {
  if (action.type.includes('REQUEST')) {
    return {
      show: true,
    };
  }
  return {
    show: false,
  };
}
