import * as types from './types';

export function subjectRequest(params) {
  return {
    type: types.SUBJECT_REQUEST,
    params,
  };
}

export function subjectFailed(error) {
  return {
    type: types.SUBJECT_FAILED,
    error,
  };
}

export function subjectSuccess(response) {
  return {
    type: types.SUBJECT_SUCCESS,
    response,
  };
}
