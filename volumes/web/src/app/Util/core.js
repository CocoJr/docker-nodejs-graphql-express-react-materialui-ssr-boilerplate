/*
* @author Thibault Colette <thibaultcolette06@hotmail.fr>
* @copyright 2018 Thibault Colette
*/

/**
 * Check if given user has specified role
 *
 * @param user
 * @param role
 * @returns {boolean}
 */
export function hasRole(user, role)
{
    if (user && !isEmptyObject(user.roles)) {
        for (let index in user.roles) {
            let userRole = user.roles[index];

            if (userRole === role) {
                return true;
            }
        }
    }

    return false;
}

/**
 * Check if the user is an user
 *
 * @param user
 * @returns {boolean}
 */
export function isUser(user) {
    return !isEmptyObject(user);
}

/**
 * Check if an user is admin
 *
 * @param user
 * @returns {*|boolean}
 */
export function isAdmin(user) {
    return user && hasRole(user, 'ROLE_ADMIN');
}

/**
* Set the auth token
*/
export function setAuthToken(token) {
    if (token && token.length) {
        setCookie('token', token);
    } else {
        setCookie('token', null);
    }
}

/**
 * Get form errors from graphql error
 *
 * @param error
 * @returns {any}
 */
export function getFormErrors(error)
{
    return error
    && isObject(error.graphQLErrors[0].message)
    && error.graphQLErrors[0].message['__typename'] === 'validation'
        ? error.graphQLErrors[0].message
        : null;
}

/**
* Test if the given variable is an object
* cf. https://stackoverflow.com/questions/8511281/check-if-a-value-is-an-object-in-javascript
*
* @param variable
* @returns {boolean}
*/
export function isObject(variable) {
    return (variable !== null && typeof variable === 'object');
}

/**
* Test if the given object is empty
*
* @param object
* @returns {boolean}
*/
export function isEmptyObject(object) {
    if(!isObject(object)) {
        return true;
    }

    return (Object.keys(object).length === 0 && object.constructor === Object);
}

/**
* Create cookie
*
* @param cname
* @param cvalue
* @param exdays
*/
export function setCookie(cname, cvalue, exdays) {
    let d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = 'expires='+ d.toUTCString();

    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
}

/**
* Get cookie
*
* @param cname
* @returns {string}
*/
export function getCookie(cname) {
    let name = cname + '=';
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');

    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];

        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }

        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }

    return '';
}
