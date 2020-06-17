/**
 * 调起客户端小程序订阅消息界面，返回用户订阅消息的操作结果
 * @param withSubscriptions
 * @param success
 * @param fail
 * @param complete
 * @returns {Promise<Taro.getSetting.Promised> | * | never}
 */
function requestSubscribeMessage({tmplIds = [], success, fail, complete}) {
  return this.requestSubscribeMessage({
    tmplIds,
    success(res) {
      success(res);
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
  requestSubscribeMessage
};


