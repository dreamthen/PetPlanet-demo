import * as constants from '../constants'

/**
 * 获取全局唯一的版本更新管理器，用于管理小程序更新
 */
const updateManger = function (forceUpdate) {
  let that = this;
  const _updateManger = that.getUpdateManager();
  _updateManger.onCheckForUpdate((res) => {
    if (res.hasUpdate) {
      _updateManger.onUpdateReady(() => {
        that.showModal({
          title: constants.modal.title,
          content: constants.modal.content,
          showCancel: !forceUpdate,
          success: (res) => {
            if (res.confirm) {
              _updateManger.applyUpdate();
            }
          },
          fail: (res) => {

          },
          complete: (res) => {

          }
        });
      });
    }
  });
};


export {
  updateManger
}
