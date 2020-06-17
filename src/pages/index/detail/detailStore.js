import * as constants from './constants';
import Tools from '../../../utils/petPlanetTools';
import cloneDeep from 'lodash.clonedeep';

const defaultState = {
  //用于对于发布的宠物交易的id
  id: null,
  //用于对于宠物用户的头像
  avatarUrl: null,
  //用于对于宠物用户的用户名
  nickName: null,
  //是否显示loading
  isLoading: true,
  //用于对于宠物的标题
  title: null,
  //用于对于宠物的价格
  cost: null,
  //用于对于宠物的描述
  content: null,
  //是否含有视频
  includeVideo: false,
  //发布时用于提供定位
  area: null,
  //用于发布接口的图片
  images: [],
  //用于对于宠物被人需要的数量
  wantCount: null,
  //用于卖方的联系方式
  contactInfo: null,
  //用于对于此宠物交易是否收藏的判断标识符
  collected: false,
  //用于对于此宠物交易是否收藏的文案
  collection: null,
  //用于对于此宠物交易是否收藏按钮的类型
  collectionType: null,
  //用于对于此宠物交易项标签code,领养是0001
  tags: []
};

export default function detailStore(state = defaultState, {type, payload}) {
  switch (type) {
    case constants.detailConstants['SET_DETAIL_ATTR_VALUE']:
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
