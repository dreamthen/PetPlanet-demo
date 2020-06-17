import cloneDeep from 'lodash.clonedeep';
import * as constants from './constants';
import Tools from '../../../utils/petPlanetTools';

const defaultState = {
  areaList: [],
  consultContent: '',
  //上传显示的图片列表
  consultImages: [],
  //真正上传的图片列表
  uploadConsultImages: []
};

export default function medicalConsultStore(state = defaultState, { type, payload }) {
  switch(type) {
    case constants.medicalConsultConstants['CHECK_AREA_LIST']:
      let {areaList} = state;
      areaList.forEach(area => {
        checked: false
      });
      const idx = payload.idx;
      areaList[idx].checked = true;
      return state;
    case constants.medicalConsultConstants['SET_MEDICAL_CONSULT_ATTR_VALUE']:
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
