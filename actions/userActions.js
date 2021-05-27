/* global chrome */

import { login, callApi, postMessageOnSlack } from 'services/api/api';
import { getLoggedInLinkedinUser } from 'services/extension/backgroundScript';

import { startLoading, endLoading, openWelcomeModal, showSuccessToast, showInfoToast, showErrorToast } from './uiActions';
import { getAllTags } from 'store/actions/tagsActions';
import { backgroundUpdate } from './connectionsActions';

export const USER_LOGIN = 'USER_LOGIN';
export const USER_LOGOUT = 'USER_LOGOUT';
export const SET_FIRST_TIME_LOGIN = 'SET_FIRST_TIME_LOGIN';
export const SET_LAST_SYNC_AT = 'SET_LAST_SYNC_AT';
export const CSRF_TOKEN_SET = 'CSRF_TOKEN_SET';
export const LINKEDIN_USER_LOGIN = 'LINKEDIN_USER_LOGIN';

export const setCSRFtoken = value => ({ type: CSRF_TOKEN_SET, payload: { csrfToken: value } });
export const loginToRedux = () => ({
    type: USER_LOGIN,
})
export const setFirstTimeLogin = value => ({ type: SET_FIRST_TIME_LOGIN, payload: { value } });
export const setLastSyncAt = lastSyncAt => ({ type: SET_LAST_SYNC_AT, payload: { lastSyncAt } })
export const userLogin = () => async (dispatch) => {
    dispatch(startLoading());
    try {
        const response = await login();

        dispatch({
            type: CSRF_TOKEN_SET,
            payload: { csrfToken: response.token }
        });

        dispatch({
            type: SET_LAST_SYNC_AT,
            payload: { lastSyncAt: response.lastSyncAt }
        });

        let promiseArray = []

        if (!response.newUser) {
            promiseArray.push(dispatch(getAllTags()));
        }

        promiseArray.push(dispatch(linkedinUserLogin()));

        let allSettledResult = await Promise.allSettled(promiseArray);

        /// DO THIS!!!
        if (!response.newUser) { dispatch(backgroundUpdate()) }
        dispatch(endLoading());
        
        if (response.newUser) {
            if (allSettledResult[0].status === 'fulfilled') {
                dispatch(setFirstTimeLogin(true));
                dispatch(openWelcomeModal());
            }
        }

        dispatch({
            type: USER_LOGIN,
        });
    } catch (error) {
        dispatch(endLoading());
        dispatch(showErrorToast('There was a problem logging in. Please try again later.'));
    }
}
export const userLogout = () => async (dispatch, getState) => {
    dispatch(startLoading());
    try {
        await new Promise((resolve, _) => {
            chrome.identity.getAuthToken({ interactive: true }, async token => {
                await fetch(`https://accounts.google.com/o/oauth2/revoke?token=${token}`);

                chrome.identity.removeCachedAuthToken({ token: token }, () => {
                    dispatch({
                        type: USER_LOGOUT,
                    });

                    chrome && chrome.storage.sync.set({ userLoggedIn: false });

                    dispatch(showInfoToast('We are sorry to see you go.'));

                    resolve(true);
                });
            })
        })
    } catch (error) {
        
    } finally {
        dispatch(endLoading());
    }
}
export const linkedinUserLogin = () => async (dispatch, getState) => {
    dispatch(startLoading());
    try {
        const linkedinUser = await getLoggedInLinkedinUser();
        linkedinUser && dispatch({ type: LINKEDIN_USER_LOGIN, payload: linkedinUser });
    } catch (error) {
        throw error;
    } finally {
        dispatch(endLoading());
    }
}
export const leaveFeedback = feedback => async (dispatch, getState) => {
    dispatch(startLoading());

    try {
        const csrfToken = getState().user.csrfToken;

        await callApi('user/leaveFeedback', 'POST', { feedback }, csrfToken);
        await postMessageOnSlack(feedback);

        dispatch(showSuccessToast('Thank you for your feedback!'));
    } catch (error) {
        dispatch(showErrorToast('There was a problem with posting your feedback.'));
    } finally {
        dispatch(endLoading());
    }
}
