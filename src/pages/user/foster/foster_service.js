import Tools from '../../../utils/petPlanetTools';
import * as constants from './constants';
import {staticData} from '../../../constants';

/**
 * 获取寄养家庭列表
 */
function getFosterList() {
  let {pageNum, fosterList = []} = this.state;
  return Tools.request({
    url: 'eshop/goods/foster/home/list/v1',
    method: 'post',
    data: {
      pageNum: pageNum++,
      pageSize: staticData.pageSize
    },
    success: (data) => {
      const {data: _data = [], total} = data;
      fosterList = [...fosterList, ..._data];
      const {length = 0} = fosterList;
      this.setState({
        fosterList,
        pageNum,
        total,
        isLoading: false,
        isShowLoad: length === total,
        loadStatus: length === total ? constants.loadStatus.noMore : constants.loadStatus.loading
      }, () => {
        this.isNext = true;
      });
    },
    fail: (res) => {

    },
    complete: (res) => {

    }
  });
}

/**
 * 获取家庭轮播图
 */
function getBannerSysConfig() {
  return Tools.request({
    url: 'sysConfig/banners',
    data: {
      code: constants.bannerSysConfig
    },
    success: (data) => {
      this.setState({
        swiperList: data
      });
    },
    fail: (res) => {

    },
    complete: (res) => {

    }
  });
}

const fosterAPI = {
  getFosterList,
  getBannerSysConfig
};

export default fosterAPI;
