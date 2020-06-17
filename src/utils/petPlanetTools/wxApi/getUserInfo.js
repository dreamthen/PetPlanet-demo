/**
 * 获取用户信息
 * @param withCredentials
 * @param lang
 * @param success
 * @param fail
 * @param complete
 * @returns {Promise<void>}
 */
const getUserInfo = function ({withCredentials, lang, success, fail, complete}) {
  return this.getUserInfo({
    withCredentials,
    lang,
    success({userInfo}) {
      return success(userInfo);
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
  getUserInfo
};
