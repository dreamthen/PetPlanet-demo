/**
 * 订单信息配置
 * @type {({})[]}
 */
const orderInfo = [{
  id: 'remark',
  name: '买家留言',
  isNone: true
}, {
  id: 'orderNo',
  name: '订单编号'
}, {
  id: 'channel',
  name: '支付方式',
  value: '微信支付'
}, {
  id: 'orderTime',
  name: '下单时间'
}, {
  id: 'deliveryTime',
  name: '发货时间',
  value: '尚未发货'
}, {
  id: 'paymentTime',
  name: '支付时间',
  value: '尚未支付'
}, {
  id: 'expressCompany',
  name: '物流公司',
  value: '尚未发货'
}, {
  id: 'express',
  name: '快递单号',
  value: '尚未发货'
}];

/**
 * 医疗咨询订单信息配置
 * @type {({})[]}
 */
const orderMedicalInfo = [{
  id: 'remark',
  name: '买家留言',
  isNone: true
}, {
  id: 'orderNo',
  name: '订单编号'
}, {
  id: 'channel',
  name: '支付方式',
  value: '微信支付'
}, {
  id: 'orderTime',
  name: '下单时间'
}, {
  id: 'paymentTime',
  name: '支付时间',
  value: '尚未支付'
}];

/**
 * 订单类型
 * @type {{'1': string, '2': string}}
 */
const orderType = {
  1: {
    name: '家庭寄养',
    isFoster: true
  },
  2: {
    name: '普通商品',
    isCommons: true
  },
  3: {
    name: '医疗咨询',
    isMedical: true
  }
};

export {
  orderInfo,
  orderType,
  orderMedicalInfo
}
