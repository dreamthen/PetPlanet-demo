import * as constants from './constants';

export function setUserAttrValue(payload) {
  return {
    type: constants.userConstants['SET_USER_ATTR_VALUE'],
    payload
  }
}
