import Tools from '../../../../../utils/petPlanetTools';
import * as constants from './constants';
import cloneDeep from 'lodash.clonedeep';

const defaultState = {
  //协议内容
  article: null
};

function agreementStore(state = defaultState, {type, payload}) {
  switch (type) {
    case constants.agreementConstants['SET_AGREEMENT_ATTR_VALUE']:
      //多层对象处理方法
      return (function multiple(oldState, newState) {
        let stateChange = oldState;
        //用于在不按照state模板的情况下,payload添加属性和属性值的情况下使用
        stateChange = Tools.compare(stateChange, newState);
        for (let [key, value] of Object.entries(stateChange)) {
          //这里严格判断value是否是对象{},不能使用typeof,原因自己查
          if (Object.prototype.toString.call(value) === '[object Object]' && newState[key] !== undefined && newState[key] !== null) {
            stateChange[key] = multiple(value, newState[key]);
          } else {
            if (newState[key] !== undefined && newState[key] !== null) {
              stateChange[key] = newState[key];
            }
            if (newState[key] === null) {
              stateChange[key] = null;
            }
          }
        }
        return stateChange;
      })(cloneDeep(state), payload);
  }
  return state;
}

export default agreementStore;
