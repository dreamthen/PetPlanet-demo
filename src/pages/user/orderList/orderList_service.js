import Tools from '../../../utils/petPlanetTools';
import {staticData, loadingStatus, pageCurrentList} from '../../../constants';
import * as constants from './constants';
import commonOrderDetailAPI from '../../commons/detail/orderDetail/order_detail_service';
import Taro from "@tarojs/taro";

function getOrderList() {
  let {pageNum = 1, current = 0, orderList = []} = this.state;

  return Tools.request({
    url: 'eshop/order/list/v1',
    method: 'post',
    data: {
      orderStatus: current,
      pageNum,
      pageSize: staticData.pageSize
    },
    success: (data) => {
      const {data: _data = [], buyerName = '', buyerPic = '', total = 0, country = '', province = ''} = data || {};
      const _orderList = [...orderList, ...(_data || [])];
      const length = _orderList.length;
      const address = `${country} ${province}`;
      this.setState({
        pageNum: ++pageNum,
        orderList: _orderList,
        buyerName,
        buyerPic,
        total,
        address,
        isShowLoad: (length === total && total !== 0),
        loadStatus: length === total ? constants.loadStatus.noMore : constants.loadStatus.loading
      }, () => {
        this.isNext = true;
        this.setState({
          loading: false
        });
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
 * 用户完成寄养订单操作
 */
function orderClose(orderId) {
  return Tools.request({
    url: `eshop/order/close/v1/${orderId}`,
    success: (data) => {
      this.setState({
        current: constants['preparationNav'][2]['key'],
        isLoading: true,
        loadingText: loadingStatus.fostered.text,
        pageNum: 1,
        orderList: [],
        loadStatus: staticData['loadStatusConfig']['loading'],
        isShowLoad: false
      }, () => {
        getOrderList.call(this);
      });
    },
    fail: () => {

    },
    complete: () => {

    }
  });
}

/**
 * 生成支付单
 * @param orderId
 * @param orderNo
 * @param totalPrice
 * @param type
 * @returns {*}
 */
function paymentPayOrderList(orderId, orderNo, totalPrice, type) {
  const {channel = 'WECHAT'} = this.state;
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
          this.setState({
            current: constants['preparationNav'][1]['key'],
            loading: true,
            loadingText: loadingStatus.fostered.text,
            pageNum: 1,
            orderList: [],
            loadStatus: staticData['loadStatusConfig']['loading'],
            isShowLoad: false
          }, () => {
            if (constants.orderType[type]['isMedical']) {
              consult.call(this);
            } else {
              commonOrderDetailAPI.fosterSetStatus.call(this, () => {
                getOrderList.call(this);
              }, orderId);
            }
          });
        },
        fail: (res) => {
          this.initialLoading();
        },
        complete: (res) => {
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

/**
 * 进行咨询～
 */
function consult() {
  const {consultType = 'SYSTEM', consultContent = '', uploadConsultImages = [], docId = 0} = this.state;
  return Tools.request({
    url: 'cnslt/consult',
    method: 'post',
    data: {
      docId: docId,
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
 * 完成订单接口
 * @returns {*}
 */
function completeOrderList(orderId) {
  return Tools.request({
    url: `eshop/order/complete/${orderId}`,
    success: (data) => {
      getOrderList.call(this);
    },
    fail: (res) => {
      this.initialLoading();
    },
    complete: (res) => {

    }
  });
}

const orderListAPI = {
  getOrderList,
  orderClose,
  paymentPayOrderList,
  completeOrderList
};

export default orderListAPI;
