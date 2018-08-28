/*
 * @copyright 2018 Thibault Colette
 * @author Thibault Colette <thibaultcolette06@hotmail.fr>
 */

const SET_ISAPP = 'app.reducer.set_isapp';

export const AppReducer = (state = {
    isApp: false,
}, action) => {
    switch(action.type) {
        case SET_ISAPP:
            return Object.assign({}, state, {
                isApp: action.isApp,
            });
        default:
            return state;
    }
};

export function setIsApp(isApp) {
    return {
        type: SET_ISAPP,
        isApp: isApp,
    };
}