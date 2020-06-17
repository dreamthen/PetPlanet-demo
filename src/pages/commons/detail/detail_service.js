import Tools from '../../../utils/petPlanetTools';

/**
 * 获取普通商品详情
 * @returns {*}
 */
function getCommonDetail() {
  const {id = 0} = this.state;
  return Tools.request({
    url: `eshop/goods/common/detail/${id}`,
    success: (data = {}, statusCode) => {
      const {
        images = [],
        skuOptionGroups = [],
        sales = 0,
        goodsName = '',
        goodsDesc = '',
        detailImages = [],
        coverPic = ''
      } = data || {};
      skuOptionGroups.sort(function (a, b) {
        return a['discPrice'] - b['discPrice']
      });
      const salePrice = skuOptionGroups[0] ? skuOptionGroups[0]['salePrice'] : {};
      const discPrice = skuOptionGroups[0] ? skuOptionGroups[0]['discPrice'] : {};
      skuOptionGroups.forEach(skuItem => {
        skuItem.checked = false;
      });
      skuOptionGroups[0]['checked'] = true;
      this.setState({
        images,
        salePrice,
        discPrice,
        coverPic,
        sales,
        goodsName,
        goodsDesc,
        detailImages,
        skus: skuOptionGroups,
        skuPrice: skuOptionGroups[0]['discPrice'],
        skuId: skuOptionGroups[0]['skudId'],
        skuStock: skuOptionGroups[0]['stock']
      });
    },
    fail: (res) => {

    },
    complete: (res) => {

    }
  });
}

const commonDetailAPI = {
  getCommonDetail
};

export default commonDetailAPI
