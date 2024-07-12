import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import {
  DELETE_MOTEL,
  GET_MOTEL_LIST,
  GET_JOBS,
  DELETE_JOB,
  GET_PROFILE,
} from './constants';
import { urlLink } from '../../helper/route';
import {
  deleteMotelSuccess,
  deleteMotelFail,
  getMotelListSuccess,
  getMotelListFail,
  getMotelList,
  getJobsSuccess,
  getJobsFail,
  deleteJobSuccess,
  deleteJobFail,
  getJobs,
  getProfileSuccess,
  getProfileFail,
  clearProfile,
  clearProfileSuccess,
  clearProfileFail,
} from './actions';
import { loadRepos, reposLoaded } from '../App/actions';

export function* apiGetProfile(id) {
  const userId = id.payload;

  if (userId) {
    const requestUrl =
      urlLink.api.serverUrl + urlLink.api.getNotification + userId;

    yield put(loadRepos());

    try {
      const response = yield axios.get(requestUrl);
      yield put(getProfileSuccess(response.data.data));
    } catch (error) {
      yield put(getProfileFail(error.response.data));
    } finally {
      yield put(reposLoaded());
    }
  } else {
    console.log('User ID is undefined, skipping API call.');
  }
}

// Individual exports for testing
export default function* profileSaga() {
  yield takeLatest(GET_PROFILE, apiGetProfile);
}
