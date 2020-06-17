import * as constants from './constants';

export function setCollectionAttrValue(payload) {
  return {
    type: constants.collectionConstants['SET_COLLECTION_ATTR_VALUE'],
    payload
  };
}
