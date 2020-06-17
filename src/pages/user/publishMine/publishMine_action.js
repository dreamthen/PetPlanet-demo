import * as constants from './constants';

export function setPublishMineAttrValue(payload) {
  return {
    type: constants.publishMineConstants['SET_PUBLISH_MINE_ATTR_VALUE'],
    payload
  };
}
