/* global chrome */
import { callApi } from 'services/api/api';
import {
    getLinkedinConnections,
    messageProfile,
    disconnectProfile,
    visitProfile
} from 'services/extension/backgroundScript';

import { setLastSyncAt } from './userActions';
import { startLoading, endLoading, showSuccessToast, showWarningToast, backgroundUpdateLoaderSet } from './uiActions';

import moment from 'moment';

export const CONNECTIONS_LOAD = 'CONNECTIONS_GET';

export const CONNECTIONS_SYNC = 'CONNECTIONS_SYNC';

export const SET_FILTER_DEFAULT_VALUES = 'SET_DEFAULT_FILTER_VALUES';
export const SET_FILTER_SELECT_VALUE = 'SET_FILTER_SELECT_VALUE';

export const UPDATE_CONNECTION = 'UPDATE_CONNECTION';
export const SET_CONNECTION_LOADING_START = 'SET_CONNECTION_LOADING_START';
export const SET_CONNECTION_LOADING_END = 'SET_CONNECTION_LOADING_END';

export const setDefaultFilterValues = () => ({ type: SET_FILTER_DEFAULT_VALUES });
export const setFilterSelectValue = (type, value) => ({ type: SET_FILTER_SELECT_VALUE, payload: { type, value } });

export const setConnectionLoadingStart = (profileId) => ({ type: SET_CONNECTION_LOADING_START, payload: { profileId } });
export const setConnectionLoadingEnd = (profileId) => ({ type: SET_CONNECTION_LOADING_END, payload: { profileId } });

export const loadConnections = () => async (dispatch, getState) => {
    dispatch(startLoading());

    try {
        const csrfToken = getState().user.csrfToken;
        const connections = await callApi('profiles', 'GET', null, csrfToken);

        dispatch({
            type: CONNECTIONS_LOAD,
            payload: { connections }
        });
    } catch (error) {
        
    } finally {
        dispatch(endLoading());
    }
}

export const syncConnections = () => async (dispatch, getState) => {
    dispatch(startLoading());
    try {
        const linkedinConnections = await getLinkedinConnections();
        const csrfToken = getState().user.csrfToken;
        
        await callApi('profiles', 'POST', { profiles: linkedinConnections }, csrfToken);

        await dispatch(loadConnections());
        dispatch(setLastSyncAt(moment()));
        
        dispatch(showSuccessToast('Connections are successfully synchronized.'));
    } catch (error) {
        
    } finally {
        dispatch(endLoading());
    }
}

export const visitConnection = (profileId) => async (dispatch, getState) => {
    dispatch(startLoading());
    try {
        const csrfToken = getState().user.csrfToken;

        await visitProfile(profileId);

        let date = new Date();
        let dateString = date.toISOString();

        let response = await callApi(`profiles/${profileId}`, 'PATCH', { lastVisitedAt: dateString }, csrfToken);
        dispatch({
            type: 'UPDATE_CONNECTION',
            payload: { profileId, response }
        })
    } catch (error) {

    } finally {
        dispatch(endLoading());
    }
}

export const addNoteToConnection = (profileId, text, update) => async (dispatch, getState) => {
    dispatch(startLoading());
    try {
        const csrfToken = getState().user.csrfToken;

        let date = new Date();
        let dateString = date.toISOString();

        await callApi(`profiles/${profileId}`, 'PATCH', { note: { text: text, lastUpdatedAt: update === 'delete' ? '' : dateString } }, csrfToken);
        dispatch(endLoading());
        if(update === 'update') {
            dispatch(showSuccessToast('Note successfully updated.'));
        } else if(update === 'add') {
            dispatch(showSuccessToast('Note successfully added.'));
        } else if(update === 'delete') {
            dispatch(showSuccessToast('Note successfully deleted.'));
        }
    } catch (error) {
        dispatch(endLoading());
    }
}

export const messageConnection = (profileId, message, connectionId) => async (dispatch, getState) => {
    dispatch(startLoading());
    try {
        const csrfToken = getState().user.csrfToken;

        await messageProfile(profileId, message);
        await callApi(`profiles/${connectionId}`, 'PATCH', { message: message }, csrfToken);
        dispatch(showSuccessToast('Message successfully sent.'));
    } catch (error) {
        
    } finally {
        dispatch(endLoading());
    }
}

export const toggleHideConnections = (profileIds, value, onSuccessAction) => async (dispatch, getState) => {
    dispatch(startLoading());
    try {
        const csrfToken = getState().user.csrfToken;

        let promiseArray = [];

        profileIds.forEach(profileId => {
            promiseArray.push(callApi(`profiles/${profileId}`, 'PATCH', { isHidden: value }, csrfToken));
        })

        await Promise.allSettled(promiseArray);
        onSuccessAction && await dispatch(onSuccessAction());

        profileIds.length === 1
            ?
            dispatch(showSuccessToast(value ? 'Connection hidden.' : 'Connection unhidden.'))
            :
            dispatch(showSuccessToast(value ? 'Connections hidden.' : 'Connections unhidden.'));
    } catch (error) {

    } finally {
        dispatch(endLoading());
    }
}

export const disconnect = (profileId, connectionId) => async (dispatch, getState) => {
    dispatch(startLoading());
    try {
        const csrfToken = getState().user.csrfToken;

        await disconnectProfile(profileId);
        await callApi(`profiles/${connectionId}`, 'DELETE', null, csrfToken);

        dispatch(showSuccessToast('Connections(s) successfully removed.'));
    } catch (error) {

    } finally {
        dispatch(endLoading());
    }
}

// CONNECTIONS UPDATE //

export const updateConnection = profileId => async (dispatch, getState) => {
    dispatch(setConnectionLoadingStart(profileId));

    const csrfToken = getState().user.csrfToken;
    
    let canUpdate = await callApi('user/auto-update/increment', 'POST', null, csrfToken);
    if(canUpdate.autoUpdate.count < 400) {
        try {
            let profileContactInfo = await new Promise((resolve, reject) => {
                chrome.runtime.sendMessage({ linkedinAction: 'getProfileContactInfo', profileId: profileId }, response => {
                    resolve(response);
                });
            });
            let profileDetails = await new Promise((resolve, reject) => {
                chrome.runtime.sendMessage({ linkedinAction: 'getProfileView', profileId: profileId }, response => {
                    resolve(response);
                });
            });
            let profileData = {
                ...profileContactInfo.result,
                ...profileDetails.result
            };
            let updatedProfileData = await callApi(`profiles/${profileId}/update`, 'PUT', profileData, csrfToken);
            dispatch({
                type: 'UPDATE_CONNECTION',
                payload: { profileId, updatedProfileData }
            })
            dispatch(showSuccessToast('Successfully updated profile.'));
        } catch (error) {
    
        } finally {
            dispatch(setConnectionLoadingEnd(profileId));
        }
    } else {
        dispatch(setConnectionLoadingEnd(profileId));
        dispatch(showWarningToast("You've reached your daily data update limit."));
    }
}

export const backgroundConnectionUpdate = (profileId) => async (dispatch, getState) => {
    dispatch(setConnectionLoadingStart(profileId));
    try {
        const csrfToken = getState().user.csrfToken;
        let profileContactInfo = await new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({ linkedinAction: 'getProfileContactInfo', profileId: profileId }, response => {
                resolve(response);
            });
        });
        let profileDetails = await new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({ linkedinAction: 'getProfileView', profileId: profileId }, response => {
                resolve(response);
            });
        });
        let profileData = {
            ...profileContactInfo.result,
            ...profileDetails.result
        };
        let updatedProfileData = await callApi(`profiles/${profileId}/update`, 'PUT', profileData, csrfToken);
        dispatch({
            type: 'UPDATE_CONNECTION',
            payload: { profileId, updatedProfileData }
        })
    } catch (error) {

    } finally {
        dispatch(setConnectionLoadingEnd(profileId));
    }
}

export const backgroundUpdate = () => async (dispatch, getState) => {
    const allConnections = getState().connections.connections;

    const numberOfConnections = allConnections.length;
    let numberOfUpdatedConnections = 0;
    const unupdatedConnections = [];

    allConnections.forEach(connection =>  connection.updated ? numberOfUpdatedConnections++ : unupdatedConnections.push(connection));
    
    try {
        if(numberOfConnections !== numberOfUpdatedConnections) {
            const csrfToken = getState().user.csrfToken;
            let updateInfo = await callApi('user/auto-update/increment', 'POST', null, csrfToken);
            let currentDailyUpdateCount = updateInfo.autoUpdate.count;
    
            if(currentDailyUpdateCount < 400) {
                let backgroundUpdateLoader = getState().ui.backgroundUpdateLoader;
                if(backgroundUpdateLoader === false) { dispatch(backgroundUpdateLoaderSet(true)) }
                let connectionToUpdate = unupdatedConnections[0];
                await dispatch(backgroundConnectionUpdate(connectionToUpdate.profileId));
                let updateTimeout = 240000 + (Math.floor(Math.random() * 181) * 1000);
                setTimeout(() => dispatch(backgroundUpdate()), updateTimeout);
            } else { dispatch(backgroundUpdateLoaderSet(false)) }
        } else {
            dispatch(backgroundUpdateLoaderSet(false));
        }
    } catch (error) {

    }
    
}

export const applyTags = (profileIds, tags) => async (dispatch, getState) => {
    dispatch(startLoading());
    try {
        const csrfToken = getState().user.csrfToken;
        if(profileIds.length > 1) {
            await callApi('profiles/tags/bulk', 'POST', { connections: profileIds, tags: tags }, csrfToken);
            dispatch(showSuccessToast(`Tags successfully added to ${profileIds.length} users.`));
        } else {
            await callApi(`profiles/${profileIds[0]}/tags`, 'POST', { tags: tags }, csrfToken);
            dispatch(showSuccessToast(`Tags successfully added to user.`));
        }
    } catch (error) {

    } finally {
        dispatch(endLoading());
    }
}

export const removeTags = (profileIds, tags) => async (dispatch, getState) => {
    dispatch(startLoading());
    try {
        const csrfToken = getState().user.csrfToken;

        let promiseArray = [];

        profileIds.forEach(profileId => {
            promiseArray.push(callApi(`profiles/${profileId}/tags`, 'DELETE', { tags: tags }, csrfToken));
        })

        await Promise.allSettled(promiseArray);

        dispatch(showSuccessToast('Tag(s) successfully removed.'));
    } catch (error) {

    } finally {
        dispatch(endLoading());
    }
}