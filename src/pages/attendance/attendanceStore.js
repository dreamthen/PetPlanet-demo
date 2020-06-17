import Tools from '../../utils/petPlanetTools';
import * as constants from './constants';
import cloneDeep from 'lodash.clonedeep';

const defaultState = {
  //群动态列表当前所在页数
  pageNum: 1,
  //群动态列表每页显示的条数
  pageSize: 10,
  //群动态列表的总条数
  total: 0,
  //下拉加载防抖动
  throttle: true,
  //群唯一id openGid
  openGid: null,
  //获取用户唯一id openid
  openid: null,
  //用户是否授权申请用户信息
  isPermission: false,
  //获取用户的昵称
  nickName: '',
  //获取用户的头像
  avatar: '',
  //模态框中的数据
  modal: {
    sign: {
      //已签到模态框是否显示
      isSigned: false,
      data: {
        //已签到提示语
        remarks: ''
      }
    }
  },
  //手风琴组件数据状态
  accordion: {
    //今日是否已经签到
    signed: false,
    //签到是否成功
    success: false,
    //当前激活tab面板的key
    activeKey: false,
    //备注
    remarks: '',
    //积分
    score: 0,
    //今日积分
    scoreToday: 0,
    //金币
    coin: 0,
    //今日金币
    coinToday: 0,
    //排名
    rank: 0,
    //签到时间
    signTime: '',
    //总签到天数
    dayOfTotal: 0,
    //本月天数
    dayOfMonth: 0,
    //连续天数
    dayOfContinuity: 0,
    //各个签到群群名
    groupName: '',
    //顶部背景图片
    bannerList: [],
    //宠医问诊是否有新的消息
    hasMessage: false
  },
  //群动态列表
  signList: [],
  //群动态对象
  signObject: {},
  //群动态对象根据签到的当前天还是之前天进行处理不同的状态
  signObjectType: []
};

function attendanceStore(state = defaultState, {type, payload}) {
  switch (type) {
    case constants.attendanceConstants['SET_ATTENDANCE_ATTR_VALUE']:
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
    //初始化签到页面的所有信息
    case constants.attendanceConstants['CLEAR_ATTENDANCE_ATTR_VALUE']:
      return Object.assign({}, defaultState, {isPermission: true});
  }
  return state;
}

export default attendanceStore;
