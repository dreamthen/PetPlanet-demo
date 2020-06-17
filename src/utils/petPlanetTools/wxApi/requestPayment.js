/**
 * 发起微信支付
 * @param timeStamp
 * @param nonceStr
 * @param packageSign
 * @param signType
 * @param paySign
 * @param success
 * @param fail
 * @param complete
 * @returns {void|Promise<void>|Promise<Taro.getUserInfo.SuccessCallbackResult>|*}
 */
const requestPayment = function ({timeStamp, nonceStr, package: packageSign, signType, paySign, success, fail, complete}) {
  return this.requestPayment({
    timeStamp,
    nonceStr,
    package: packageSign,
    signType,
    paySign,
    success(res) {
      return success(res);
    },
    fail(res) {
      return fail(res);
    },
    complete(res) {
      return complete(res);
    }
  });
};

export {
  requestPayment
};
