import * as constants from './constants';

function setDiseaseAttrValue(payload) {
  return {
    type: constants.diseaseConstants['SET_DISEASE_ATTR_VALUE'],
    payload
  };
}

export {
  setDiseaseAttrValue
}
