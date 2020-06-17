import Tools from '../../../../utils/petPlanetTools';

/**
 * 获取寄养家庭详情
 */
function getFosterDetail() {
  const {merchantId} = this.state;
  return Tools.request({
    url: `eshop/goods/foster/detail/v1/${merchantId}`,
    success: data => {
      const {family = null, fosterService = [], otherService = []} = data || {};
      const {goodsImages} = family || {};
      this.setState({
        family,
        swiperList: goodsImages,
        fosterService,
        otherService
      });
    },
    fail: (res) => {

    },
    complete: (res) => {

    }
  });
}

const fosterDetailAPI = {
  getFosterDetail
};

export default fosterDetailAPI;
