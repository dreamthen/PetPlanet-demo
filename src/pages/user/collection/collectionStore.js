import * as constants from './constants';
import {staticData} from '../../../constants';
import Tools from '../../../utils/petPlanetTools';
import cloneDeep from 'lodash.clonedeep';

const defaultState = {
  pageNum: 1,
  pageSize: staticData['pageSize'],
  //宠物收藏列表
  //@尹文楷
  petCollectionList: [],
  //当前页的宠物收藏列表的数量
  //@尹文楷
  currentPetCollectionList: [],
  //组件状态，more 状态显示查看更多按钮，loading 状态显示加载状态，noMore 显示无更多数据
  //@尹文楷
  loadStatus: staticData['loadStatusConfig']['more']
};

export default function collectionStore(state = defaultState, {type, payload}) {
  switch (type) {
    case constants.collectionConstants['SET_COLLECTION_ATTR_VALUE']:
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
