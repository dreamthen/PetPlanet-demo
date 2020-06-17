import * as constants from './constants';

export function setCommunicationsAttrValue(payload) {
  return {
    type: constants.communicationsConstants['SET_COMMUNICATIONS_ATTR_VALUE'],
    payload
  };
}
