/**
 * 筛选条件配置
 * @尹文楷
 * @type {*[]}
 */
const preparationNav = [{
  key: 0,
  value: '全部'
}, {
  key: 2,
  value: '待送出'
}, {
  key: 3,
  value: '待确认'
}, {
  key: 7,
  value: '已完成'
}, {
  key: 6,
  value: '已关闭'
}];

/**
 * 订单类型
 * @type {{'1': string, '2': string}}
 */
const orderType = {
  1: {
    name: '家庭寄养',
    isFoster: true,
    url: (fn) => {
      return fn(28);
    }
  },
  2: {
    name: '普通商品',
    isCommons: true,
    url: (fn) => {
      return fn(34);
    }
  },
  3: {
    name: '医疗咨询',
    isMedical: true,
    url: (fn) => {
      return fn(34);
    }
  }
};

/**
 * 订单状态
 * @type {{}}
 */
const orderStatus = {
  confirm: 3,
  complete: 7
};

/**
 * 加载状态
 * @type {{noMore: string, loading: string}}
 */
const loadStatus = {
  noMore: 'noMore',
  loading: 'loading'
};

export {
  loadStatus,
  orderStatus,
  preparationNav,
  orderType
};
