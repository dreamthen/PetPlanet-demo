/**
 * 获取转发详细信息
 * @param shareTicket
 * @param timeout
 * @param success
 * @param fail
 * @param complete
 */
const getShareInfo = function ({shareTicket, timeout, success, fail, complete}) {
  return this.getShareInfo({
    shareTicket,
    timeout,
    success({encryptedData, iv}) {
      success(encryptedData, iv);
    },
    fail(response) {
      fail(response);
    },
    complete(response) {
      complete(response);
    }
  });
};

export {
  getShareInfo
};
