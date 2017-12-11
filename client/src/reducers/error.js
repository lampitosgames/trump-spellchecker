import actionTypes from '../actions/actionTypes';

const initialState = {
    errorList: []
};

const error = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.THROW_ERROR:
            return {
                ...state,
                errorList: [
                    ...state.errorList.filter((err) => (err.context != action.error.context)),
                    action.error
                ]
            };
        case actionTypes.REMOVE_ERROR:
            return {
                ...state,
                errorList: state.errorList.filter((err) => (err !== action.error))
            }
        default:
            return state;
    }
}

export default error;
