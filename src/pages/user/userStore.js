import * as constants from './constants';
import Tools from '../../utils/petPlanetTools';
import cloneDeep from 'lodash.clonedeep';

const defaultState = {
  //个人页的昵称
  nickName: '',
  //是否已读的标识
  hasMessage: false,
  //个人页的头像
  avatar: null,
  //symbol图标集合
  opList: []
};

export default function userStore(state = defaultState, {type, payload}) {
  switch (type) {
    case constants.userConstants['SET_USER_ATTR_VALUE']:
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
