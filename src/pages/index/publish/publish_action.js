import * as constants from './constants';

export function setPublishAttrValue(payload) {
  return {
    type: constants.publishConstants['SET_PUBLISH_ATTR_VALUE'],
    payload
  }
}
