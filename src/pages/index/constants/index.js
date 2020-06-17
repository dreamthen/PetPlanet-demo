//action type协定
const homeConstants = {
  //改变标签栏的索引值
  CHANGE_CURRENT: 'CHANGE_CURRENT',
  //改变分页码
  CHANGE_PAGE_NUM: 'CHANGE_PAGE_NUM',
  //获取宠物交易列表
  GET_PET_LIST: 'GET_PET_LIST',
  //改变滚动加载的AtLoadMore的状态
  CHANGE_LOAD_STATUS: 'CHANGE_LOAD_STATUS',
  //改变多层嵌套数据对象
  SET_ATTR_VALUE: 'SET_ATTR_VALUE'
};

/**
 * 筛选条件配置
 * @尹文楷
 * @type {*[]}
 */
const preparationNav = [{
  key: 'RECOMMEND',
  value: '推荐'
}, {
  key: 'AROUND',
  value: '附近'
}, {
  key: 'ADOPTED',
  value: '领养'
}];

/**
 * 广告位标识
 * @type {string}
 */
const bannerSysConfig = 'MASTER_HOME_BANNER';

export {
  homeConstants,
  preparationNav,
  bannerSysConfig
};
