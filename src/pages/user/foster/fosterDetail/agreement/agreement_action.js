import * as constants from './constants';

/**
 * 多层处理函数
 * @param payload
 * @returns {{payload: *, type: string}}
 */
export function setAgreementAttrValue(payload) {
  return {
    type: constants.agreementConstants['SET_AGREEMENT_ATTR_VALUE'],
    payload
  };
}
