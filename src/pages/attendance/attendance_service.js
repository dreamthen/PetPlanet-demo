import Taro from '@tarojs/taro';
import moment from 'moment';
import Tools from '../../utils/petPlanetTools';
import {pageCurrentList, staticData, loadingStatus} from '../../constants';
import * as constants from './constants';
import {setAttendanceAttrValue} from './attendance_action';

Tools.getMomentConfig(moment);

/**
 * 向用户发起用户信息权限申请
 * @param scope
 * @returns {Function}
 */
const getSettingRequest = (scope) => {
  return async (dispatch) => {
    return Tools.getSettingConfig({
      success(authSetting) {
        return authSetting;
      },
      fail(res) {

      },
      complete(res) {

      }
    });
  };
};

/**
 * 获取个人页随机的头像和昵称
 * @尹文楷
 * @returns {Function}
 */
function userTinyHomeInfoRequest() {
  return async (dispatch) => {
    return await Tools.request({
      url: 'users/tinyHomeInfo',
      success: async (data, header) => {
        await dispatch(setAttendanceAttrValue({
          nickName: data['nickName'],
          avatar: data['avatarUrl']
        }));
      },
      complete: async (response) => {

      }
    });
  }
}

/**
 * 同步微信用户授权后的用户信息
 * @尹文楷
 */
function syncUserInfoRequest(params) {
  return (dispatch) => {
    return Tools.request({
      url: 'users/syncUserInfo',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: params,
      success: async (data, header) => {
        dispatch(userTinyHomeInfoRequest.apply(this));
      },
      fail: async (res) => {

      },
      complete: async (res) => {

      }
    });
  };
}

/**
 * 在页面入口处同步微信用户授权后的用户信息
 * @尹文楷
 */
function syncUserInfoPassRequest(params) {
  const {homeStore: {cookie = ''}} = this.props;
  return (dispatch) => {
    return Tools.request({
      url: 'users/syncUserInfo',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': cookie
      },
      data: params,
      success: async (data, header) => {
      },
      fail: async (res) => {
      },
      complete: async (res) => {
      }
    });
  };
}

/**
 * 在用户授权之后获取用户个人信息
 * @returns {function(*)}
 */
function getUserInfoConfigRequest() {
  return (dispatch) => {
    return Tools.getUserInfoConfig({
      withCredentials: true,
      lang: 'zh_CN',
      success: async (userInfo) => {
        return userInfo;
      },
      fail: async (res) => {
      },
      complete: async (res) => {
      }
    });
  }
}

/**
 * 进行签到
 * @param params
 * @returns {Promise<void>}
 */
function communitySignRequest() {
  return (dispatch) => {
    let {attendanceStore: {openGid}} = this.props;
    return Tools.request({
      url: 'community/sign',
      method: 'post',
      data: JSON.stringify({
        opengid: openGid
      }),
      success: async (data, header) => {
        const {success = false, remarks = '', lucky = false, redPacketUrl = ''} = data;
        if (success) {
          if (lucky) {
            this.setState({
              isShowRedPacket: true,
              redPacketUrl,
              loading: true,
              loadingText: loadingStatus.sign.text
            });
            getWalletRedPackets.call(this);
          }
          //多层处理函数
          await dispatch(setAttendanceAttrValue({
            signObject: null,
            signList: [],
            signObjectType: []
          }));
          //获取用户签到信息
          let {data: {signed = false}} = await dispatch(communityHomeInfoRequest.apply(this));
          //获取群动态列表
          dispatch(communityGroupLogsRequest.apply(this, [{
            pageNum: 1,
            pageSize: staticData['pageSize']
          }]));
          if (signed) {
            this.setState({
              loading: false,
              loadingText: loadingStatus.progress.text
            });
            this.scaleAnimate.normal(this);
            clearInterval(this.animateTimer);
          }
        } else {
          dispatch(setAttendanceAttrValue({
            modal: {
              sign: {
                isSigned: true,
                data: {
                  remarks
                }
              }
            }
          }));
          this.isSignedClick = false;
        }
      },
      fail: (res) => {

      },
      complete: (res) => {
      }
    });
  };
}

/**
 * 当前用户的可领取红包列表
 */
function getWalletRedPackets() {
  return Tools.request({
    url: 'wallet/fetchRedPackets',
    success: (data = [], statusCode) => {
      const item = data[0];
      if (!item) {
        return false;
      }
      const {redPackType = ''} = item;
      this.setState({
        redPack: item
      }, () => {
        constants.redPacketTypeAction[redPackType].call(this);
      });
    },
    fail: (res) => {

    },
    complete: (res) => {

    }
  });
}

/**
 * 用户领取红包
 * @returns {*}
 */
function receiveRedPacket() {
  const {redPack = {}} = this.state;
  return Tools.request({
    url: 'wallet/receiveRedPacket',
    data: redPack,
    success: (data = {}, statusCode) => {
      const {
        success = false,
        redPackType = constants.redPacketTypeSymbol.ENTERPRISE,
        totalAmount = '0.00',
        avatar = '',
        nickName = '',
        createTime = ''
      } = data;
      if (success) {
        const time = moment(createTime).format('YYYY-MM-DD HH:mm:ss');
        Taro.navigateTo({
          url: `${pageCurrentList[30]}?redPackType=${redPackType}&totalAmount=${totalAmount}&avatar=${avatar}&nickName=${nickName}&time=${time}`
        });
      }
    },
    fail: (res) => {
    },
    complete: (res) => {
      this.setState({
        loading: false,
        loadingText: loadingStatus.progress.text
      });
    }
  });
}

/**
 * 按照时间分组获取群签到动态信息
 * @param params
 * @returns {Promise<AxiosResponse<any> | *>}
 */
function communityGroupLogsRequest(params) {
  return (dispatch) => {
    let {attendanceStore: {openGid, signObject, signList, signObjectType}} = this.props;
    return Tools.request({
      url: 'community/searchGroupLogs/v2',
      method: 'post',
      data: JSON.stringify({
        ...params,
        opengid: openGid
      }),
      success: async (data, header) => {
        let {pageNum} = params;
        let _sign = data.data,
          _signList = [],
          total = data.total,
          _signObject = signObject ? signObject : {};
        /**
         * 分两组处理业务,第一组signObject用于按照时间分组排序显示群签到动态信息
         * 第二组signList用于分页加载群签到动态列表信息
         */
        let signSort = Object.entries(_sign);
        signSort.sort((a, b) => {
          return (+new Date(b[0])) - (+new Date(a[0]));
        });
        for (let [sign_key, sign_value] of signSort) {
          let isSignEmpty = Tools.isEmpty(_signObject);
          if (_signObject[sign_key]) {
            _signObject[sign_key] = [..._signObject[sign_key], ...sign_value];
          } else {
            _signObject[sign_key] = [..._sign[sign_key]];
            signObjectType.push((pageNum === 1 && isSignEmpty) ? 'signing' : 'signed');
          }
          _signList = [..._signList, ...sign_value];
        }
        dispatch(setAttendanceAttrValue({
          signObject: _signObject,
          signObjectType,
          pageNum,
          total,
          throttle: true,
          signList: [...signList, ..._signList]
        }));
        this.isSignedClick = false;
      },
      fail: async (res) => {

      },
      complete: async (res) => {
      }
    });
  };
}

/**
 * 获取用户签到信息
 * @param params
 * @returns {function(*)}
 */
function communityHomeInfoRequest() {
  const {attendanceStore: {openGid}} = this.props;
  return (dispatch) => {
    return Tools.request({
      url: 'community/homeInfo',
      method: 'post',
      data: JSON.stringify({
        opengid: openGid
      }),
      success: async (data, header) => {
        let {signed} = data;
        await dispatch(setAttendanceAttrValue({
          accordion: {
            ...data
          }
        }));
        if (signed) {
          this.scaleAnimate.normal(this);
          clearInterval(this.animateTimer);
          this.animateTimer = null;
        }
        this.setState({
          loading: false
        });
      },
      fail: async (res) => {
        this.setState({
          loading: false
        });
      },
      complete: async (res) => {
      }
    });
  };
}

export default {
  getSettingRequest,
  getWalletRedPackets,
  receiveRedPacket,
  getUserInfoConfigRequest,
  syncUserInfoRequest,
  syncUserInfoPassRequest,
  userTinyHomeInfoRequest,
  communitySignRequest,
  communityGroupLogsRequest,
  communityHomeInfoRequest
};
