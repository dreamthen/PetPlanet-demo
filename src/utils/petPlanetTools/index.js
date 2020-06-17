import Taro from '@tarojs/taro';
import mta from 'mta-wechat-analysis';
import * as wxAPI from './wxAPI';
import * as packageAPI from './package';
import * as requestAPI from './requests';

const PetPlanetTools = (function () {
  //用于表单保存校验的规则
  //@尹文楷
  let verifyList = new WeakMap();
  //用于表单校验的规则函数
  //@尹文楷
  let rulesList = {
    /**
     * 判断输入的、选择的、图片组或者弹浮动窗值是否为空值
     * @尹文楷
     * @param value
     * @param type
     * @param errMsg
     * @returns {boolean}
     */
    isEmpty(value, type, errMsg) {
      if (value === '' || value === false || value === undefined || value === null || value.length === 0) {
        Taro.atMessage({
          type,
          message: errMsg
        });
        return false;
      }
    },
    /**
     * 判断是否选中某些下拉选框
     * @param value
     * @param attribute
     * @param type
     * @param errMsg
     */
    isSelect(value, attribute, type, errMsg) {
      if (value instanceof Array) {
        //将Symbol.hasInstance置为不可修改、不可枚举、不可删除、不可设置,这样就可以安心使用instanceof了
        Object.defineProperty(Array, Symbol.hasInstance, {
          value(val) {
            return Object.getPrototypeOf(val) === Array.prototype;
          },
          configurable: true
        });
        let item = value.filter(arrItem => arrItem.checked);
        if (item.length <= 0) {
          Taro.atMessage({
            type,
            message: errMsg
          });
          return false;
        }
      }
    },
    /**
     * 判断开始时间是否小于结束时间,结束时间是否大于开始时间
     */
    exceed(durationTime, type, errMsg) {
      if (durationTime < 0) {
        Taro.atMessage({
          type,
          message: errMsg
        });
        return false;
      }
    }
  };

  class PetPlanetTools {
    constructor() {
      this.wx = Taro;
      //任意状态第一次触发
      this.firstAccordionBind = true;
      //状态延时器
      this.accordionTimer = null;
      //函数防抖状态延时器
      this.debounceTimer = null;
      verifyList.set(this, []);
    }

    /**
     * 用于添加校验规则
     * @param val
     * @param rules
     * @尹文楷
     */
    addRules(val, rules) {
      let list = verifyList.get(this);
      let valList = [];
      if (Object.prototype.toString.call(val) === '[object Array]') {
        valList = [...val];
      } else {
        valList = [val];
      }
      for (let [val_key, val_item] of valList.entries()) {
        rules.forEach((ruleItem, ruleIndex) => {
          list = [...list, (() => {
            let rule = ruleItem['rule'],
              errMsg = ruleItem['errMsg'],
              errMsg_arr = [];
            if (Object.prototype.toString.call(errMsg) === '[object Array]') {
              errMsg_arr = [...errMsg];
            } else {
              errMsg_arr = [errMsg];
            }
            return () => {
              let params = rule.split(':');
              let _rule = params.shift();
              let typeErrMsg = [];
              let type = '';
              params.unshift(val_item);
              typeErrMsg = errMsg_arr[val_key].split(':');
              type = typeErrMsg.shift();
              params = [...params, type, ...typeErrMsg];
              return rulesList[_rule].apply(this, params);
            };
          })()];
        });
      }
      verifyList.set(this, list);
      return this;
    }

    /**
     * 执行校验规则
     * @尹文楷
     */
    execute() {
      let list = verifyList.get(this);
      let _execute;
      for (let [key, value] of list.entries()) {
        _execute = value.apply(this);
        if (_execute === false) {
          this.clear();
          return _execute;
        }
      }
      this.clear();
      return true;
    }

    /**
     * 清空校验规则
     * @尹文楷
     */
    clear() {
      verifyList.set(this, []);
    }

    /**
     * 定义多层处理对象属性值为null的函数
     * 在设置为父级底下多层属性值为null的情况下使用
     * @param state
     */
    toNullAll(state) {
      return packageAPI.setMultipleValue.multipleToNull(state);
    }

    /**
     * 定义多层处理对象属性值在不按照state模板的情况下,payload添加属性和属性值的情况下使用
     * 概括起来就是用于添加state属性使用
     * @param state
     * @param payload
     * @returns {*}
     */
    compare(state, payload) {
      return packageAPI.setMultipleValue.compareAdd(state, payload);
    }

    /**
     * 处理大图和缩略图时,不同的显示图片方式(七牛云压缩显示和正常显示)
     * @param imgs
     */
    previewImageOperation(imgs) {
      return packageAPI.imageOperation.previewImageOperation(imgs);
    }

    /**
     * wx请求方法封装
     */
    request(params) {
      return requestAPI.requests.apply(this.wx, [params, this]);
    }

    /**
     * wx上传文件方法封装
     * @param params
     */
    uploadFile(...params) {
      return requestAPI.uploadFile.apply(this.wx, params);
    }

    /**
     * 调用接口获取登录凭证（code）。通过凭证进而换取用户登录态信息，包括用户的唯一标识（openid）及本次登录的会话密钥（session_key）等。用户数据的加解密通讯需要依赖会话密钥完成
     * @尹文楷
     * @param params
     */
    login(...params) {
      return wxAPI.loginCodeAPI.loginCode.apply(this.wx, params);
    }

    /**
     * 获取moment时间日期配置
     * @param params
     */
    getMomentConfig(...params) {
      return packageAPI.momentConfig.getMoment.apply(this.wx, params);
    }

    /**
     * 登录,将微信与后台服务器绑定,建立会话
     * @尹文楷
     */
    loginSession(request, params) {
      this.login({
        timeout: 5000,
        success: async (code) => {
          // 登录,将微信与后台服务器绑定,建立会话
          // @尹文楷
          await this.request({
            url: 'tinySession/login',
            data: {
              code
            },
            success: async (data, header) => {
              await Taro.setStorageSync('petPlanet', header['Set-Cookie']);
              params['header']['cookie'] = header['Set-Cookie'];
              await request(params);
            },
            fail: async (res) => {

            },
            complete: async (res) => {

            }
          });
        },
        fail: async (res) => {

        },
        complete: async (res) => {
        }
      });
    }

    /**
     * 获取用户当前的设置
     * @尹文楷
     * @param params
     */
    getSettingConfig(...params) {
      return wxAPI.getSettingAPI.getSetting.apply(this.wx, params);
    }

    /**
     * 调起客户端小程序设置界面，返回用户设置的操作结果
     * @尹文楷
     * @param params
     */
    openSettingConfig(...params) {
      return wxAPI.getSettingAPI.openSetting.apply(this.wx, params);
    }

    /**
     * 发起微信支付
     * @param params
     * @returns {void|Promise<void>|Promise<Taro.getUserInfo.SuccessCallbackResult>|*}
     */
    requestPaymentConfig(...params) {
      return wxAPI.requestPaymentAPI.requestPayment.apply(this.wx, params);
    }

    /**
     * 向用户发起授权请求
     * @尹文楷
     * @param params
     */
    authorizeConfig(...params) {
      return wxAPI.getSettingAPI.authorize.apply(this.wx, params);
    }

    /**
     * 获取用户当前的位置信息
     * @尹文楷
     * @param params
     */
    chooseLocationConfig(...params) {
      return wxAPI.getSettingAPI.chooseLocation.apply(this.wx, params);
    }

    /**
     * 获取当前的地理位置、速度。当用户离开小程序后，此接口无法调用。
     * @尹文楷
     */
    getLocationConfig(...params) {
      return wxAPI.getSettingAPI.getLocation.apply(this.wx, params);
    }

    /**
     * 在新页面中全屏预览图片。预览的过程中用户可以进行保存图片、发送给朋友等操作。
     * @尹文楷
     */
    previewImageConfig(...params) {
      return wxAPI.imageOperationAPI.previewImage.apply(this.wx, params);
    }

    /**
     * 从本地相册选择图片或使用相机拍照
     * @param params
     * @returns {*}
     */
    chooseImageConfig(...params) {
      return wxAPI.imageOperationAPI.chooseImage.apply(this.wx, params);
    }

    /**
     * 获取全局唯一的版本更新管理器，用于管理小程序更新
     * @尹文楷
     */
    updateManagerConfig(forceUpdate) {
      wxAPI.updateManagerAPI.updateManger.apply(this.wx, [forceUpdate]);
    }

    /**
     * 获取转发详细信息
     * @尹文楷
     */
    getShareInfoConfig(...params) {
      return wxAPI.getShareInfoAPI.getShareInfo.apply(this.wx, params);
    }

    /**
     * 获取用户信息
     * @尹文楷
     */
    getUserInfoConfig(...params) {
      return wxAPI.getUserInfoAPI.getUserInfo.apply(this.wx, params);
    }

    /**
     * 调起客户端小程序订阅消息界面，返回用户订阅消息的操作结果
     * @param params
     */
    requestSubscribeMessageConfig(...params) {
      return wxAPI.requestSubscribeMessageAPI.requestSubscribeMessage.apply(this.wx, params);
    }

    chooseAddressConfig(...params) {
      return wxAPI.addressAPI.chooseAddress.apply(this.wx, params);
    }

    /**
     * onLaunch统计信息初始化
     * @尹文楷
     */
    mtaAppInit() {
      mta.App.init({
        'appID': '500667188',
        'eventID': '500667199',
        'lauchOpts': this.$router.params,
        'statPullDownFresh': true,
        'statShareApp': true,
        'statReachBottom': true
      });
    }

    /**
     * 判断对象是否为空对象
     * @尹文楷
     */
    isEmpty(obj) {
      try {
        if (Object.prototype.toString.call(obj) !== '[object Object]') {
          throw new TypeError('传入的值不是对象类型!');
        }
      } catch (error) {
        return true;
      }
      let obj_name_arr = Object.getOwnPropertyNames(obj);
      return obj_name_arr.length === 0;
    }

    /**
     * 函数截流
     * @尹文楷
     */
    throttle(fn, speed) {
      if (this.firstAccordionBind) {
        fn();
        this.firstAccordionBind = false;
        return false;
      }
      if (this.accordionTimer) {
        return false;
      }
      this.accordionTimer = setTimeout(() => {
        clearTimeout(this.accordionTimer);
        this.accordionTimer = null;
        fn();
      }, speed);
    }

    /**
     * 函数防抖
     * @尹文楷
     * @param fn
     * @param speed
     */
    debounce(fn, speed) {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = null;
      }
      this.debounceTimer = setTimeout(() => {
        fn();
      }, speed);
    }

    /**
     * 自制解决异步问题迭代器
     * @尹文楷
     */
    run(go) {
      let task = go(),
        val = task.next();
      (function step() {
        const {done, value} = val;
        if (!done) {
          if (typeof value === 'function') {
            value(function (data, header) {
              val = task.next(data);
              step();
            });
          } else {
            val = task.next(value);
            step();
          }
        }
      })();
    }

    /**
     * 适配各类手机,自定义导航栏高度
     */
    adaptationNavBar() {
      const res = Taro.getSystemInfoSync();
      const {model, system} = res;
      let navBarAdaptation = {};
      if (system.indexOf('iOS') !== -1) {
        if (model === 'iPhone X') {
          navBarAdaptation['navBarHeight'] = 184;
          navBarAdaptation['navBarPaddingTop'] = 82;
          navBarAdaptation['statusBarClassName'] = 'pet-detail-iPhoneX-navBar';
          navBarAdaptation['isX'] = true;
        } else if (model.indexOf('iPhone X') !== -1) {
          navBarAdaptation['navBarHeight'] = 174;
          navBarAdaptation['navBarPaddingTop'] = 82;
          navBarAdaptation['statusBarClassName'] = 'pet-detail-iPhoneXM-navBar';
          navBarAdaptation['isX'] = true;
        } else if (model === 'iPhone 5') {
          navBarAdaptation['navBarHeight'] = 158;
          navBarAdaptation['navBarPaddingTop'] = 82;
          navBarAdaptation['statusBarClassName'] = 'pet-detail-iPhone5-navBar';
        } else if (model.indexOf('iPhone') !== -1) {
          navBarAdaptation['navBarHeight'] = 136;
          navBarAdaptation['navBarPaddingTop'] = 30;
          navBarAdaptation['statusBarClassName'] = 'pet-detail-iPhone-navBar';
        }
      } else if (system.indexOf('Android') !== -1) {
        navBarAdaptation['navBarHeight'] = 136;
        navBarAdaptation['navBarPaddingTop'] = 40;
        navBarAdaptation['statusBarClassName'] = 'pet-detail-Android-navBar';
      }
      return navBarAdaptation;
    }

    /**
     * 模板字符串用于祛除变量为null的描述符
     */
    modelStrCutNull = (strs, ...params) => {
      let str = '',
        length = params.length;
      for (let [key, value] of params.entries()) {
        if (value || (value !== null && value !== undefined)) {
          str += `${strs[key]}${value}`
        }
      }
      str += strs[length];
      return str;
    };
  }

  return new PetPlanetTools();
})();

export default PetPlanetTools;
