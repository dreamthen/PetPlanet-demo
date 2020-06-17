import Taro, {Component} from '@tarojs/taro';
import {
  Text,
  View
} from '@tarojs/components';
import {connect} from '@tarojs/redux';
import {
  AtAvatar,
  AtButton
} from 'taro-ui';
import moment from 'moment';
import cns from 'classnames';

import Tools from '../../../../../utils/petPlanetTools';
import {LoadingView} from '../../../../../components/bussiness-components';
import placeOrderAPI from '../placeOrder/placeOrder_service';
import * as constants from '../placeOrder/constants';
import {pageCurrentList, status, loadingStatus} from '../../../../../constants';
import {setAgreementAttrValue} from '../agreement/agreement_action';

import 'taro-ui/dist/style/components/avatar.scss';
import 'taro-ui/dist/style/components/button.scss';
import 'taro-ui/dist/style/components/icon.scss';
import 'taro-ui/dist/style/components/activity-indicator.scss';
import 'taro-ui/dist/style/components/loading.scss';

import './loading-view.less';
import './index.less';
import commonOrderDetailAPI from '../../../../commons/detail/orderDetail/order_detail_service';

Tools.getMomentConfig(moment);

@connect((state, ownProps) => {
  return {
    agreementStore: state.agreementStore
  };
}, (dispatch, ownProps) => {
  return {
    /**
     * 多层处理函数
     * @param payload
     */
    setAgreementAttrValueHandler(payload) {
      dispatch(setAgreementAttrValue(payload));
    }
  };
})
class PlaceOrderDetail extends Component {
  constructor(props) {
    super(props);
  }

  static options = {
    addGlobalClass: true
  };

  config = {
    navigationBarTitleText: '订单详情'
  };

  state = {
    //订单信息
    info: {},
    //用户昵称
    buyerName: '',
    //用户头像
    buyerPic: '',
    //订单状态
    orderStatus: '',
    //寄养家庭联系方式
    family: {},
    //寄养服务
    fosterService: [],
    //其他服务
    otherService: [],
    //订单id
    orderId: 0,
    //订单号
    orderNo: null,
    //开始寄养的时间
    startTime: '',
    //寄养结束的时间
    endTime: '',
    //总计金额
    payment: '',
    //联系人
    contactPerson: '',
    //联系电话
    contactPhone: '',
    //紧急联系人
    emContactPerson: '',
    //紧急联系电话
    emContactPhone: '',
    //支付结束时间
    durationToEndTime: '',
    //支付类型
    channel: 'WECHAT',
    //是否显示正在加载loading页面......
    loading: true,
    //loading加载标语
    loadingText: loadingStatus.progress.text
  };

  componentWillMount() {
    const {params = {}} = this.$router;
    const {orderNo = '', orderId = 0} = params;
    this.setState({
      orderNo,
      orderId
    });
  }

  componentDidMount() {
    placeOrderAPI.getPlaceOrderDetail.call(this);
  }

  /**
   * 查看《寄养服务协议》详情
   */
  onAgreementHandler = (e) => {
    const {setAgreementAttrValueHandler} = this.props;
    setAgreementAttrValueHandler({
      article: constants.agreement
    });
    Taro.navigateTo({
      url: `${pageCurrentList[27]}?title=寄养服务协议`
    });
    //取消冒泡
    e.stopPropagation();
  };

  /**
   * 拨打电话
   * @param e
   */
  phoneCallHandler = e => {
    const {family: {spuAttributes = []}} = this.state;
    const spuPhoneAttributes = spuAttributes.slice(-1);
    Taro.makePhoneCall({
      phoneNumber: spuPhoneAttributes[0] ? spuPhoneAttributes[0]['spuAttributeValue'] : '0'
    });
    //取消冒泡
    e.stopPropagation();
  };

  /**
   * 点击'已寄养'按钮,表示此订单已经完成交易,进行了寄养
   * @param e
   */
  onCloseOrder = e => {
    placeOrderAPI.orderClose.call(this);
    //取消冒泡
    e.stopPropagation();
  };

  /**
   * 点击'付款'按钮,进行付款
   * @param e
   */
  paymentPayHandler = e => {
    this.setState({
      loading: true,
      loadingText: loadingStatus.pay.text
    }, () => {
      placeOrderAPI.paymentPayPlaceOrder.call(this);
    });
    //取消冒泡事件
    e.stopPropagation();
  };

  /**
   * 初始化loading加载页面
   */
  initialLoading = () => {
    this.setState({
      loading: false,
      loadingText: loadingStatus.progress.text
    });
  };

  render() {
    const {
      orderStatus = '',
      family = {},
      fosterService = [],
      otherService = [],
      address = '',
      startTime = '',
      endTime = '',
      payment = '',
      contactPerson = '',
      contactPhone = '',
      emContactPerson = '',
      emContactPhone = '',
      durationToEndTime = '',
      buyerName = '',
      buyerPic = '',
      loading = true,
      loadingText = loadingStatus.progress.text,
      info = {}
    } = this.state;
    const {
      coverPic = '',
      spuAttributes = [],
      goodsDesc = '',
      goodsName = ''
    } = family;
    const {
      onAgreementHandler = () => {
      },
      onCloseOrder = () => {
      },
      phoneCallHandler = () => {
      },
      paymentPayHandler = () => {
      }
    } = this;
    const spuHeaderAttributes = spuAttributes.slice(6, 7),
      spuAddressAttributes = spuAttributes[3],
      spuDateAttributes = spuAttributes[1];
    const startTimeMSeconds = new Date(startTime).getTime(),
      endTimeMSeconds = new Date(endTime).getTime(),
      durationTime = moment(endTimeMSeconds).diff(moment(startTimeMSeconds), 'days'),
      paymentPoint = payment.indexOf('.'),
      paymentInt = payment.slice(0, paymentPoint === -1 ? payment.length : paymentPoint),
      paymentFloat = paymentPoint !== -1 ? payment.slice(paymentPoint) : '.00',
      orderInfo = constants.orderInfo;
    return (
      <View className='pet-placeOrderDetail'>
        {
          loading && <LoadingView
            size={56}
            color='#fb2a5d'
            className='pet-placeOrderDetail-loading'
            content={loadingText}
          />
        }
        <View className={cns(
          'pet-placeOrderDetail-status',
          {
            'pet-placeOrderDetail-statusPendingPayment': orderStatus === status.pendingPayment
          }
        )}>
          <View className={cns(
            'pet-placeOrderDetail-status-order'
          )}>
            <View className='pet-placeOrderDetail-status-order-detail'>
              <Text className='pet-placeOrderDetail-status-order-desc'>订单状态: </Text>
              <Text>{orderStatus}</Text>
            </View>
          </View>
          {
            orderStatus === status.pendingPayment &&
            <Text className='pet-placeOrderDetail-status-durationToEndTime'>
              {durationToEndTime}
            </Text>
          }
        </View>
        <View className={
          cns(
            'pet-placeOrderDetail-service',
            'pet-placeOrderDetail-family'
          )
        }>
          <Text className='pet-placeOrderDetail-service-title'>
            寄养家庭
          </Text>
          <View className='pet-placeOrderDetail-family-container'>
            <AtAvatar className='pet-placeOrderDetail-family-avatar'
                      image={coverPic}
                      size='large'
                      circle
            />
            <View className='pet-placeOrderDetail-family-content'>
              <Text className='pet-placeOrderDetail-family-content-title'
                    selectable
              >
                {goodsName}
              </Text>
              {
                spuHeaderAttributes.map(attrItem => {
                  return (
                    <View key={String(attrItem['goodsId'])}
                          className='pet-placeOrderDetail-family-content-detail'
                    >
                      <View className='pet-placeOrderDetail-family-content-spuAttributeValue'
                            selectable
                      >
                        {attrItem['spuAttributeValue']}
                      </View>
                    </View>
                  )
                })
              }
              <Text className='pet-placeOrderDetail-family-content-desc'
                    selectable
              >
                {goodsDesc}
              </Text>
            </View>
          </View>
        </View>
        <View className='pet-placeOrderDetail-service'>
          <Text className='pet-placeOrderDetail-service-title'>
            寄养信息
          </Text>
          <View className='pet-placeOrderDetail-service-container'>
            <AtAvatar className='pet-placeOrderDetail-service-avatar'
                      image={buyerPic}
                      size='large'
                      circle
            >

            </AtAvatar>
            <View className='pet-placeOrderDetail-service-content'>
              <Text className='pet-placeOrderDetail-service-content-title'
                    selectable
              >
                {buyerName}
              </Text>
              <Text className='pet-placeOrderDetail-service-content-desc'
                    selectable
              >
                {address}
              </Text>
              <View className='pet-placeOrderDetail-service-content-time'>
                <Text>
                  {startTime} 至 {endTime}
                </Text>
                <Text>
                  {durationTime}天
                </Text>
              </View>
              {
                fosterService && fosterService.length > 0 &&
                <View className='pet-placeOrderDetail-service-fosterServiceList'>
                  <View className='pet-placeOrderDetail-service-fosterServiceList-title'>
                    寄养服务
                  </View>
                  {
                    fosterService.map(foster => {
                      return <View className='pet-placeOrderDetail-service-fosterServiceList-item'
                                   key={foster.skuId}
                      >
                        <Text className='pet-placeOrderDetail-service-fosterServiceList-item-name'>
                          {foster.goodsName}
                        </Text>
                        <Text className='pet-placeOrderDetail-service-fosterServiceList-item-number'>
                          x{foster.goodsNum / durationTime}只
                        </Text>
                        <View className='pet-placeOrderDetail-service-fosterServiceList-item-info'
                        >
                          <Text className='pet-placeOrderDetail-service-fosterServiceList-item-info-symbol'>
                            ¥
                          </Text>
                          {foster.discPrice}/天
                        </View>
                      </View>
                    })
                  }
                </View>
              }
              {
                otherService && otherService.length > 0 &&
                <View className='pet-placeOrderDetail-service-otherServiceList'>
                  <View className='pet-placeOrderDetail-service-otherServiceList-title'>
                    其他服务
                  </View>
                  {
                    otherService.map(other => {
                      return <View className='pet-placeOrderDetail-service-otherServiceList-item'
                                   key={other.skuId}
                      >
                        <Text className='pet-placeOrderDetail-service-otherServiceList-item-name'>
                          {other.goodsName}
                        </Text>
                        <Text className='pet-placeOrderDetail-service-otherServiceList-item-number'>
                          x{other.goodsNum}次
                        </Text>
                        <View className='pet-placeOrderDetail-service-otherServiceList-item-info'
                        >
                          <Text className='pet-placeOrderDetail-service-otherServiceList-item-info-symbol'>
                            ¥
                          </Text>
                          {other.discPrice}/次
                        </View>
                      </View>
                    })
                  }
                </View>
              }
              <View className='pet-placeOrderDetail-service-total'>
                合计: <Text className='pet-placeOrderDetail-service-total-symbol'>
                ¥
              </Text>{paymentInt}<Text className='pet-placeOrderDetail-service-total-float'>
                {paymentFloat}
              </Text>
              </View>
            </View>
          </View>
        </View>
        <View className='pet-placeOrderDetail-service pet-placeOrderDetail-user'>
          <Text className='pet-placeOrderDetail-service-title'>
            宠物主人信息
          </Text>
          <View className='pet-placeOrderDetail-service-user-info'>
            <Text className='pet-placeOrderDetail-service-user-info-title'>
              联系人
            </Text>
            <View className='pet-placeOrderDetail-service-user-info-content'>
              <Text selectable
                    className='pet-placeOrderDetail-service-user-info-content-name'
              >
                {contactPerson}
              </Text>
              <Text selectable
                    className='pet-placeOrderDetail-service-emUser-info-content-phone'
              >
                {contactPhone}
              </Text>
            </View>
          </View>
          {
            emContactPerson && <View className='pet-placeOrderDetail-service-emUser-info'>
              <Text className='pet-placeOrderDetail-service-emUser-info-title'>
                紧急联系人
              </Text>
              <View className='pet-placeOrderDetail-service-emUser-info-content'>
                <Text selectable
                      className='pet-placeOrderDetail-service-emUser-info-content-name'
                >
                  {emContactPerson}
                </Text>
                <Text selectable
                      className='pet-placeOrderDetail-service-emUser-info-content-phone'
                >
                  {emContactPhone}
                </Text>
              </View>
            </View>
          }
        </View>
        <View className={cns(
          'pet-placeOrderDetail-service',
          'pet-placeOrderDetail-placeOrderInfo'
        )}>
          <Text className='pet-placeOrderDetail-service-title'>
            订单信息
          </Text>
          <View className='pet-placeOrderDetail-service-placeOrderInfo-info'>
            <View className='pet-placeOrderDetail-service-placeOrderInfo-info-item'>
              <Text className='pet-placeOrderDetail-service-placeOrderInfo-info-item-title'>订单金额:</Text>
              <Text className='pet-placeOrderDetail-service-placeOrderInfo-info-item-symbol'>
                ¥
              </Text>{payment}
            </View>
            {
              orderInfo && orderInfo.length > 0 && orderInfo.map(item => {
                return (
                  <View className='pet-placeOrderDetail-service-placeOrderInfo-info-item'
                        key={item.id}
                  >
                    <Text className='pet-placeOrderDetail-service-placeOrderInfo-info-item-title'>{item.name}:</Text>
                    {info[item.id]}
                  </View>
                )
              })
            }
            <View className='pet-placeOrderDetail-service-placeOrderInfo-info-item'>
              我同意
              <Text className='pet-placeOrderDetail-service-placeOrderInfo-info-item-agreement'
                    onClick={onAgreementHandler}
              >
                《寄养服务协议》
              </Text>
            </View>
          </View>
        </View>
        <View className={
          cns('pet-placeOrderDetail-service',
            'pet-placeOrderDetail-serviceOwner'
          )}>
          <Text selectable
                className='pet-placeOrderDetail-serviceOwner-item'
          >
            如有疑问请咨询铲屎官客服wx: ok8023-only
          </Text>
          <Text selectable
                className='pet-placeOrderDetail-serviceOwner-item'
          >
            工作时间: 9:00-18:00
          </Text>
        </View>
        <View className='pet-placeOrderDetail-serviceOrder'>
          <AtButton className={
            cns(
              'pet-placeOrderDetail-serviceOrder-button',
              'pet-placeOrderDetail-serviceOrder-phone',
              {
                'pet-placeOrderDetail-serviceOrder-isFull': (orderStatus !== status.pendingPayment)
                // (orderStatus !== constants.status.isFostering && orderStatus !== constants.status.pendingPayment)
              }
            )
          }
                    full
                    type='primary'
                    onClick={phoneCallHandler}
          >
            拨打电话
          </AtButton>
          {/*{*/}
          {/*  orderStatus === constants.status.isFostering ?*/}
          {/*    <AtButton className={cns(*/}
          {/*      'pet-placeOrderDetail-serviceOrder-button',*/}
          {/*      'pet-placeOrderDetail-serviceOrder-fostering'*/}
          {/*    )}*/}
          {/*              full*/}
          {/*              type='primary'*/}
          {/*              onClick={onCloseOrder}*/}

          {/*    >*/}
          {/*      已寄养*/}
          {/*    </AtButton> : null*/}
          {/*}*/}
          {
            orderStatus === status.pendingPayment ?
              <AtButton className={cns(
                'pet-placeOrderDetail-serviceOrder-button',
                'pet-placeOrderDetail-serviceOrder-pendingPayment'
              )}
                        full
                        type='primary'
                        onClick={paymentPayHandler}

              >
                付款
              </AtButton> : null
          }
        </View>
      </View>
    )
  }
}

export default PlaceOrderDetail;
