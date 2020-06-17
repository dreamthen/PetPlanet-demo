import * as constants from './constants';
import Tools from '../../../../utils/petPlanetTools';
import cloneDeep from 'lodash.clonedeep';

const defaultState = {
  //疾病列表
  illness: [],
  //筛选疾病的症状列表
  symptoms: [],
  //点击疾病列表具体的症状
  illnessDetail: null,
  //点击疾病列表具体的症状描述
  definitionDetail: null
};

export default function diseaseStore(state = defaultState, {type, payload} = {}) {
  switch (type) {
    case constants.diseaseConstants['SET_DISEASE_ATTR_VALUE']:
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
  return state
}
