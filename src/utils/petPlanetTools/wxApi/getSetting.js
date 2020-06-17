/**
 * 用于获取用户授权设置
 * @param withSubscriptions
 * @param success
 * @param fail
 * @param complete
 * @returns {Promise<Taro.getSetting.Promised> | * | never}
 */
function getSetting({
                      withSubscriptions = false,
                      success = () => {
                      },
                      fail = () => {
                      },
                      complete = () => {
                      }
                    }) {
  return this.getSetting({
    withSubscriptions,
    success({authSetting, subscriptionsSetting}) {
      success(authSetting, subscriptionsSetting);
    },
    fail(res) {
      fail(res);
    },
    complete(res) {
      complete(res);
    }
  });
}

/**
 * 调起客户端小程序设置界面，返回用户设置的操作结果
 * @param withSubscriptions
 * @param success
 * @param fail
 * @param complete
 * @returns {Promise<Taro.getSetting.Promised> | * | never}
 */
function openSetting({
                       withSubscriptions = false,
                       success = () => {
                       },
                       fail = () => {
                       },
                       complete = () => {
                       }
                     }) {
  return this.openSetting({
    withSubscriptions,
    success({authSetting = {}, subscriptionsSetting = {}}) {
      success(authSetting, subscriptionsSetting);
    },
    fail(res) {
      fail(res);
    },
    complete(res) {
      complete(res);
    }
  });
}

/**
 * 用于向用户发起授权请求
 * @param scope
 * @param success
 * @param fail
 * @param complete
 */
function authorize({scope, success, fail, complete}) {
  return this.authorize({
    scope,
    success() {
      success();
    },
    fail(res) {
      fail(res);
    },
    complete(res) {
      complete(res);
    }
  });
}

/**
 * 用于获取用户位置信息
 * @param success
 * @param fail
 * @param complete
 * @returns {Promise<TaroH5.chooseLocation.Promised> | * | never}
 */
function chooseLocation({success, fail, complete}) {
  return this.chooseLocation({
    success({name, address}) {
      success(name, address);
    },
    fail(res) {
      fail(res);
    },
    complete(res) {
      complete(res);
    }
  });
}

/**
 * 获取当前的地理位置、速度。当用户离开小程序后，此接口无法调用。
 * @尹文楷
 */
function getLocation({type, altitude, success, fail, complete}) {
  return this.getLocation({
    type,
    altitude,
    success({latitude, longitude}) {
      success(latitude, longitude);
    },
    fail(res) {
      fail(res);
    },
    complete(res) {
      complete(res);
    }
  });
}

export {
  getSetting,
  openSetting,
  authorize,
  chooseLocation,
  getLocation
};
