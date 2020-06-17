/**
 * 获取用户收货地址。调起用户编辑收货地址原生界面，并在编辑完成后返回用户选择的地址。
 * @尹文楷
 */
function chooseAddress({
                         success = () => {
                         },
                         fail = () => {
                         },
                         complete = () => {
                         }
                       }) {
  return this.chooseAddress({
    success: (res) => {
      success(res);
    },
    fail: (res) => {
      fail(res);
    },
    complete: (res) => {
      complete(res);
    }
  });
}

export {
  chooseAddress
};
