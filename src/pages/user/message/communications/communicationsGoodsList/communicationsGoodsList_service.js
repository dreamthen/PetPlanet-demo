import Tools from '../../../../../utils/petPlanetTools';
import {staticData} from '../../../../../constants';
import * as constants from './constants';

/**
 * 获得通用商品列表
 * @returns {*}
 */
function getGoodsCommonList() {
  const {goods = []} = this.state;
  let {pageNum = 1} = this.state;
  return Tools.request({
    url: 'eshop/goods/common/list',
    method: 'post',
    data: {
      pageNum,
      pageSize: constants.staticData.pageSize
    },
    success: (data, statusCode) => {
      const {data: _data = [], total = 0} = data;
      let new_goods = [...goods, ..._data];
      const {length = 0} = new_goods;
      this.setState({
        goods: new_goods,
        pageNum: ++pageNum,
        total,
        isShowLoad: length === total,
        loadStatus: length === total ? staticData['loadStatusConfig']['noMore'] : staticData['loadStatusConfig']['loading']
      }, () => {
        this.isNext = false;
      });
    },
    fail: (res) => {
    },
    complete: (res) => {
    }
  });
}

const communicationsGoodsListAPI = {
  getGoodsCommonList
};

export default communicationsGoodsListAPI;
