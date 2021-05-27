import { callApi } from 'services/api/api';
import { startLoading, endLoading} from './uiActions';

export const SET_TAGS = 'SET_TAGS';

export const setTags = tags => ({ type: SET_TAGS, payload: { tags } });

export const getAllTags = () => async (dispatch, getState) => {
    dispatch(startLoading());
    const compare = (rowA, rowB) => {
        const tagA = rowA.title || '';
        const tagB = rowB.title || '';
    
        let aIsAlphabetical = tagA.localeCompare('a') >= 0;
        let bIsAlphabetical = tagB.localeCompare('a') >= 0;
    
        if (!aIsAlphabetical && bIsAlphabetical)
            return 1;
        if (aIsAlphabetical && !bIsAlphabetical)
            return -1;
    
        return tagA.localeCompare(tagB);
    };

    try {
        const csrfToken = getState().user.csrfToken;

        let tags = await callApi('tags', 'GET', null, csrfToken);
        tags.sort(compare);
        dispatch(setTags(tags));  
    } catch (error) {
        dispatch(endLoading());
    } finally {
        dispatch(endLoading());
    }
}

export const addNewTag = tag => async (dispatch, getState) => {
    dispatch(startLoading());

    try {
        const csrfToken = getState().user.csrfToken;
        await callApi('tags', 'POST', { title: tag.title, color: tag.color }, csrfToken);
        await dispatch(getAllTags());
        dispatch(endLoading());
    } catch (error) {
        dispatch(endLoading());
    }
}

export const editTag = tag => async (dispatch, getState) => {
    dispatch(startLoading());

    try {
        const csrfToken = getState().user.csrfToken;
        await callApi(`tags/${tag.id}`, 'PUT', { title: tag.title.trim(), color: tag.color }, csrfToken);
        await dispatch(getAllTags());
        dispatch(endLoading());
    } catch (error) {
        dispatch(endLoading());
    }
}

export const deleteTag = tagId => async (dispatch, getState) => {
    dispatch(startLoading());

    try {
        const csrfToken = getState().user.csrfToken;
        await callApi(`tags/${tagId}`, 'DELETE', null, csrfToken);
        await dispatch(getAllTags());
        dispatch(endLoading());
    } catch (error) {
        dispatch(endLoading());
    }
}