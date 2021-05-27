export const SET_PAGE = 'SET_PAGE';
export const LOADING_START = 'LOADING_START';
export const LOADING_END = 'LOADING_END';

export const MODAL_FEEDBACK = 'MODAL_FEEDBACK';
export const MODAL_NOTE = 'MODAL_NOTE';
export const MODAL_MESSAGE = 'MODAL_MESSAGE';
export const MODAL_APPLY_TAG = 'MODAL_APPLY_TAG';
export const MODAL_REMOVE_TAG = 'MODAL_REMOVE_TAG';
export const MODAL_NEW_TAG = 'MODAL_NEW_TAG';
export const MODAL_EDIT_TAG = 'MODAL_EDIT_TAG';
export const MODAL_DELETE_TAG = 'MODAL_DELETE_TAG';
export const MODAL_WELCOME = 'MODAL_WELCOME';
export const MODAL_LINKED_LOGIN = 'MODAL_LINKED_LOGIN';

export const MODAL_CLOSE = 'MODAL_CLOSE';

export const TOAST_SUCCESS = 'TOAST_SUCCESS';
export const TOAST_INFO = 'TOAST_INFO';
export const TOAST_WARNING = 'TOAST_WARNING';
export const TOAST_ERROR = 'TOAST_ERROR';

export const TOAST_HIDE = 'TOAST_HIDE';

export const BACKGROUND_UPDATE_LOADER_SET = 'BACKGROUND_UPDATE_LOADER_SET';

export const setPage = page => ({ type: SET_PAGE, payload: { page } });
export const startLoading = () => ({ type: LOADING_START });
export const endLoading = () => ({ type: LOADING_END });

export const openFeedbackModal = () => ({ type: MODAL_FEEDBACK });
export const openNoteModal = (note, profileId) => ({ type: MODAL_NOTE, payload: { note, profileId } });
export const openMessageModal = (...profileIds) => ({ type: MODAL_MESSAGE, payload: { profileIds: profileIds } });
export const openApplyTagModal = (...profileIds) => ({ type: MODAL_APPLY_TAG, payload: { profileIds: profileIds } });
export const openRemoveTagModal = (...profileIds) => ({ type: MODAL_REMOVE_TAG, payload: { profileIds: profileIds } });
export const openNewTagModal = () => ({ type: MODAL_NEW_TAG });
export const openEditTagModal = tag => ({ type: MODAL_EDIT_TAG, payload: { tag } });
export const openDeleteTagModal = (id, tagName) => ({ type: MODAL_DELETE_TAG, payload: { id, tagName } });
export const openWelcomeModal = () => ({ type: MODAL_WELCOME });
export const openCheckLinkedinLoginModal = () => ({ type: MODAL_LINKED_LOGIN });

export const closeModal = () => ({ type: MODAL_CLOSE });

export const showSuccessToast = (message) => ({ type: TOAST_SUCCESS, payload: { message } });
export const showInfoToast = (message) => ({ type: TOAST_INFO, payload: { message } });
export const showWarningToast = (message) => ({ type: TOAST_WARNING, payload: { message } });
export const showErrorToast = (message) => ({ type: TOAST_ERROR, payload: { message } });

export const hideToast = () => ({ type: TOAST_HIDE });

export const backgroundUpdateLoaderSet = value => ({ type: BACKGROUND_UPDATE_LOADER_SET, payload: { value }});