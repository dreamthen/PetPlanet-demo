import Taro from '@tarojs/taro';
import Tools from '../../../utils/petPlanetTools';
import {pageCurrentList} from '../../../constants';

/**
 * 拉取宠物医生列表
 */
function homeInfo() {
  const that = this;
  return Tools.request({
    url: 'cnslt/doctors',
    success: (data, header) => {
      if (data) {
        data.forEach(doctor => {
          doctor.checked = false;
        });
        that.setState({
          doctors: data
        });
      }
    },
    fail: res => {

    },
    complete: res => {
    }
  });
}

/**
 * 进行咨询～
 * @param id
 */
function consult(id = 0) {
  const {medicalConsultStore: {consultContent, uploadConsultImages}} = this.props;
  const {consultType = 'SYSTEM'} = this.state;
  return Tools.request({
    url: 'cnslt/consult',
    method: 'post',
    data: {
      docId: id,
      content: consultContent,
      cnsltType: consultType,
      imgs: uploadConsultImages
    },
    success: (data, header) => {
      if (data) {
        //清除应用内所有的页面,然后跳转到结果页
        Taro.reLaunch({
          url: pageCurrentList[14]
        });
      }
    },
    fail: res => {
    },
    complete: res => {
    }
  });
}

/**
 * 宠物医疗咨询下单
 */
function createOrder() {
  const {payFeeO = {}} = this.state;
  return Tools.request({
    url: 'eshop/order/common/create/order/v1',
    method: 'post',
    data: {
      address: {},
      orderItem: [{
        goodsId: payFeeO.goodsId,
        goodsNum: 1,
        skuId: payFeeO.goodsSkuId
      }],
      remark: '',
      payment: (payFeeO.fee / 100).toFixed(2)
    },
    success: (data = {}, header) => {
      return data;
    },
    fail: (res) => {
    },
    complete: (res) => {
    }
  });
}

/**
 * 生成支付单
 * @param orderId
 * @param orderNo
 * @param docId
 * @returns {*}
 */
function paymentPay(orderId, orderNo, docId = 0) {
  const {channel = 'WECHAT', payFeeO = {}} = this.state;
  const {medicalConsultStore: {consultContent, uploadConsultImages}} = this.props;
  const {consultType = 'SYSTEM'} = this.state;
  return Tools.request({
    url: 'payment/pay',
    method: 'post',
    data: {
      orderId,
      channel,
      actualPrice: payFeeO.fee
    },
    success: (data) => {
      const {prepayId, nonceStr, timestamp, paySign, signType} = data;
      Tools.requestPaymentConfig({
        timeStamp: timestamp,
        nonceStr,
        package: `prepay_id=${prepayId}`,
        signType,
        paySign,
        success: (res) => {
          consult.call(this, docId);
        },
        fail: (res) => {
          Taro.redirectTo({
            url: `${pageCurrentList[29]}?docId=${docId}&consultType=${consultType}&consultContent=${consultContent}&uploadConsultImages=${JSON.stringify(uploadConsultImages)}`
          });
        },
        complete: (res) => {
          this.initialLoading();
        }
      });
    },
    fail: (res) => {
      this.initialLoading();
    },
    complete: (res) => {
    }
  });
}

const medicalDoctorAPI = {
  homeInfo,
  consult,
  createOrder,
  paymentPay
};

export default medicalDoctorAPI;
