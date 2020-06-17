import Taro from '@tarojs/taro';
import Tools from '../../../../utils/petPlanetTools';
import {pageCurrentList, staticData} from '../../../../constants';
import commonOrderDetailAPI from '../orderDetail/order_detail_service';

/**
 * 获取用户地址list
 */
function getAddressList() {
  let {pageNum = 1, addressList = []} = this.state;
  return Tools.request({
    url: 'eshop/address/list',
    method: 'post',
    data: {
      pageNum,
      pageSize: staticData.pageSize
    },
    success: (data = {}, statusCode = 200) => {
      const {data: _data = [], total = 0} = this.state;
      addressList = [...addressList, ..._data];
      this.setState({
        addressList,
        pageNum: ++pageNum,
        total,
        address: addressList[0]
      });
    },
    fail: (res) => {
    },
    complete: (res) => {
    }
  });
}

/**
 * 更新默认地址
 * @param params
 * @returns {*}
 */
function saveAddress(params) {
  return Tools.request({
    url: 'eshop/address/save',
    method: 'post',
    data: params,
    success: (data = {}, statusCode = 200) => {
      this.setState({
        address: params
      });
    },
    fail: (res) => {
    },
    complete: (res) => {
    }
  });
}

/**
 * 获取默认地址
 */
function getAddressLast() {
  return Tools.request({
    url: 'eshop/address/last',
    method: 'post',
    success: (data = {}, statusCode = 200) => {
      this.setState({
        address: data,
        loading: false
      });
    },
    fail: (res) => {
      this.setState({
        loading: false
      });
    },
    complete: (res) => {
    }
  });
}

/**
 * 创建订单
 */
function createOrder() {
  const {
    address = {},
    item = [],
    totalPrice = '0.00'
  } = this.state;
  return Tools.request({
    url: 'eshop/order/common/create/order/v1',
    method: 'post',
    dataType: 'json',
    data: {
      address,
      orderItem: item[0] ? [item[0]['orderItem']] : [],
      remark: item[0] ? item[0]['remark'] : '',
      payment: totalPrice
    },
    success: data => {
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
 * @returns {*}
 */
function paymentPay(orderId, orderNo) {
  const {channel = 'WECHAT', totalPrice = '0.00'} = this.state;
  return Tools.request({
    url: 'payment/pay',
    method: 'post',
    data: {
      orderId,
      channel,
      actualPrice: (parseFloat(totalPrice) * 100)
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
          commonOrderDetailAPI.fosterSetStatus.call(this, () => {
            Taro.redirectTo({
              url: `${pageCurrentList[34]}?orderNo=${orderNo}&orderId=${orderId}`
            });
          }, orderId);
        },
        fail: (res) => {
          Taro.redirectTo({
            url: `${pageCurrentList[29]}`
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

const commonOrderAPI = {
  createOrder,
  getAddressList,
  paymentPay,
  getAddressLast,
  saveAddress
};

export default commonOrderAPI
