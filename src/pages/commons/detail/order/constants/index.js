/**
 * 我的收货地址列表空配置
 * @type {{text: string}}
 */
const emptyAddressList = {
  text: '点击新增地址'
};

/**
 * 校验提交的订单
 * @type {{isEmpty: [string]}}
 */
const verify = {
  isEmpty: [
    'warning:请选择收获地址',
    'warning:请添加商品'
  ]
};

/**
 * 微信权限标识
 * @type {{}}
 */
const scope = {
  address: 'scope.address'
};

//下单页输入以及标签提示语
const order = {
  placeholder: {
    remark: '选填,请先和商家协商一致'
  }
};

export {
  emptyAddressList,
  scope,
  order,
  verify
}
