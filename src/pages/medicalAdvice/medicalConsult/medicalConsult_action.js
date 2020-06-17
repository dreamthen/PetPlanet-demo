import * as constants from './constants';

export function setMedicalConsultAttrValue(payload) {
  return {
    type: constants.medicalConsultConstants['SET_MEDICAL_CONSULT_ATTR_VALUE'],
    payload
  };
}

