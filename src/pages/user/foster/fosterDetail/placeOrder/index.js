import Taro, {Component} from '@tarojs/taro';
import {
  Picker,
  Text,
  View
} from '@tarojs/components';
import {
  AtButton,
  AtCheckbox,
  AtInput,
  AtInputNumber,
  AtMessage,
  AtSwitch,
  AtTextarea
} from 'taro-ui';
import {
  connect
} from '@tarojs/redux';
import moment from 'moment';
import cns from 'classnames';

import Tools from '../../../../../utils/petPlanetTools';
import {pageCurrentList, loadingStatus} from '../../../../../constants';
import {
  NavBarView,
  LoadingView
} from '../../../../../components/bussiness-components';
import * as constants from './constants';
import placeOrderAPI from './placeOrder_service';
import {setAgreementAttrValue} from '../agreement/agreement_action';
import {imgs} from '../../../../../assets';

import 'taro-ui/dist/style/components/button.scss';
import 'taro-ui/dist/style/components/checkbox.scss';
import 'taro-ui/dist/style/components/input.scss';
import 'taro-ui/dist/style/components/input-number.scss';
import 'taro-ui/dist/style/components/message.scss';
import 'taro-ui/dist/style/components/switch.scss';
import 'taro-ui/dist/style/components/textarea.scss';
import 'taro-ui/dist/style/components/icon.scss';
import 'taro-ui/dist/style/components/activity-indicator.scss';
import 'taro-ui/dist/style/components/loading.scss';

import './loading-view.less';
import './index.less';

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
class PlaceOrder extends Component {
  constructor(props) {
    super(props);
  }

  static options = {
    addGlobalClass: true
  };

  config = {
    navigationStyle: 'custom',
    navigationBarTitleText: '立即下单'
  };

  state = {
    //家庭寄养商品名
    goodsName: null,
    //家庭寄养开始时间
    startTime: null,
    //家庭寄养结束时间
    endTime: null,
    //选择的家庭寄养开始时间
    moveStartTime: null,
    //选择的家庭寄养结束时间
    moveEndTime: null,
    //家庭寄养周期时间
    durationTime: null,
    //其他服务周期时间(其他服务与次数有关，与天数时间没有任何关系)
    durationOtherTime: constants.durationOtherTime,
    //家庭寄养寄养服务
    fosterService: [],
    //家庭寄养其他服务
    otherService: [],
    //联系人姓名
    contact: null,
    //联系人电话
    contactPhone: null,
    //紧急联系人姓名
    emContact: null,
    //紧急联系人电话
    emContactPhone: null,
    //备注
    desc: null,
    //合计的价格
    totalPrice: '0.00',
    //是否同意《寄养服务协议》
    onAgreement: [],
    //提交的商品列表
    orderItem: [],
    //支付类型
    channel: 'WECHAT',
    //是否显示正在加载loading页面......
    loading: false
  };

  componentWillMount() {
    const {params = {}} = this.$router;
    const {goodsName = null, fosterService = null, otherService = null, startDate = null, endDate = null} = params;
    const startTime = Number(startDate);
    const endTime = Number(endDate);
    const durationTime = moment(endTime).diff(moment(startTime), 'days', true);
    this.setState({
      goodsName,
      fosterService: JSON.parse(fosterService) || [],
      otherService: JSON.parse(otherService) || [],
      startTime,
      endTime,
      moveStartTime: startTime,
      moveEndTime: endTime,
      durationTime: durationTime || 0
    });
  }

  /**
   * 返回上一个页面
   */
  redirectToBackPage = (e) => {
    Taro.navigateBack({
      delta: 1
    });
    //取消冒泡
    e.stopPropagation();
  };

  /**
   * 日期选择器内容变化时,触发的方法
   */
  onDateChange = (value, type) => {
    const {startTime, endTime} = this.state;
    const {
      onDurationChange = () => {
      }
    } = this;
    value = value.detail ? value.detail.value : value;
    let time = new Date(value).getTime();
    time = time < startTime ? startTime : time > endTime ? endTime : time;
    this.setState({
      [type]: time
    }, () => {
      onDurationChange();
    });
  };

  /**
   * 日期选择器内容变化之后,周期时间的变化
   */
  onDurationChange = () => {
    const {moveEndTime, moveStartTime} = this.state;
    const {onAccountChangeHandler} = this;
    this.setState({
      durationTime: moment(moveEndTime).diff(moment(moveStartTime), 'days')
    }, () => {
      onAccountChangeHandler('fosterService', 'durationTime');
    });
  };

  /**
   * 联系人信息输入框内容变化时,触发的方法
   */
  onContactChangeHandler = (value, type) => {
    value = value.target ? value.target.value : value;
    this.setState({
      [type]: value
    });
  };

  /**
   * 各个服务输入框内容变化时,触发的方法
   */
  onServiceChangeHandler = (value, type, attr, index, duration) => {
    const {onAccountChangeHandler} = this;
    const {[type]: service} = this.state;
    const fosterItem = service.findIndex((item, _index) => index === _index);
    service[fosterItem][attr] = value;
    this.setState({
      [type]: service
    }, () => {
      onAccountChangeHandler(type, duration);
    });
  };

  /**
   * 寄养服务协议单选框变化时,触发的方法
   * @param value
   */
  onAgreementCheckHandler = (value) => {
    this.setState({
      onAgreement: value
    });
  };

  /**
   * 计算合计每个服务的总价
   * @param type
   * @param duration
   */
  onAccountChangeHandler = (type, duration) => {
    let {[type]: service, [duration]: durationTime = 1} = this.state;
    const {onTotalHandler} = this;
    service.forEach(item => {
      let total = 0,
        orderItem = [];
      if (item.checked) {
        total += parseFloat((item.goodsNum * item.skuOptionGroups[0].discPrice * durationTime).toFixed(2));
        if (item.goodsNum > 0) {
          orderItem = [...orderItem, {
            goodsId: item.goodsId,
            skuId: item.skuOptionGroups[0] ? item.skuOptionGroups[0]['skuId'] : 0,
            goodsNum: item.goodsNum * durationTime
          }];
          item['orderItem'] = orderItem;
        } else {
          item['orderItem'] = [];
        }
        item['total'] = total;
      } else {
        delete item['total'];
      }
    });
    this.setState({
      [type]: service
    }, () => {
      onTotalHandler();
    });
  };

  /**
   * 计算合集所有服务的总价
   */
  onTotalHandler = () => {
    const {fosterService, otherService} = this.state;
    let total = 0,
      orderItem = [];
    for (let value of fosterService) {
      total += value['total'] || 0;
      orderItem = [...orderItem, ...(value['orderItem'] || [])];
    }
    for (let value of otherService) {
      total += value['total'] || 0;
      orderItem = [...orderItem, ...(value['orderItem'] || [])];
    }
    this.setState({
      totalPrice: total.toFixed(2),
      orderItem
    });
  };

  /**
   * 创建订单
   */
  onCreateOrderHandler = async (e) => {
    const {verify} = this;
    if (verify()) {
      const data = await placeOrderAPI.createOrder.call(this);
      const {statusCode, data: _data} = data;
      const {orderId, orderNo} = _data;
      if (statusCode === 200) {
        this.setState({
          loading: true
        });
        await placeOrderAPI.paymentPay.call(this, orderId, orderNo);
      }
    }
    //取消冒泡事件
    e.stopPropagation();
  };

  /**
   * 校验提交的订单
   */
  verify = () => {
    const {
      durationTime,
      contact,
      contactPhone,
      totalPrice,
      onAgreement
    } = this.state;
    return Tools.addRules([
      durationTime
    ], [{
      rule: 'exceed',
      errMsg: constants.verify.exceed
    }]).addRules([
      !!Number(totalPrice),
      contact,
      contactPhone,
      onAgreement
    ], [{
      rule: 'isEmpty',
      errMsg: constants.verify.isEmpty
    }]).execute();
  };

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


  render() {
    const {navBarHeight = 0, statusBarClassName = ''} = Tools.adaptationNavBar();
    const {
      goodsName = '',
      fosterService = [],
      otherService = [],
      contact = null,
      contactPhone = null,
      emContact = null,
      emContactPhone = null,
      desc = null,
      onAgreement = [],
      startTime = 0,
      moveEndTime = 0,
      moveStartTime = 0,
      endTime = 0,
      durationTime = 0,
      totalPrice = '0.00',
      loading = false
    } = this.state;
    const {
      redirectToBackPage,
      onDateChange,
      onServiceChangeHandler,
      onContactChangeHandler,
      onAgreementCheckHandler,
      onAgreementHandler,
      onCreateOrderHandler
    } = this;
    const startFormatDate = moment(startTime).format('YYYY-MM-DD'),
      endFormatDate = moment(endTime).format('YYYY-MM-DD'),
      moveStartFormatDate = moment(moveStartTime).format('YYYY-MM-DD'),
      moveEndFormatDate = moment(moveEndTime).format('YYYY-MM-DD'),
      totalPoint = totalPrice.indexOf('.'),
      totalIntPrice = totalPrice.slice(0, totalPoint === -1 ? totalPrice.length : totalPoint),
      totalFloatPrice = totalPoint !== -1 ? totalPrice.slice(totalPoint) : '.00';
    return (
      <View className='pet-placeOrder'>
        <AtMessage
          className={statusBarClassName}
        />
        {
          loading && <LoadingView
            size={56}
            color='#fb2a5d'
            className='pet-placeOrder-loading'
            content={loadingStatus.pay.text}
          />
        }
        <NavBarView
          color='#000'
          title={goodsName}
          imgs={imgs.back}
          className='pet-placeOrder-navBar'
          onClickLeftIcon={redirectToBackPage}
        />
        <View
          className='pet-placeOrder-container'
          style={{paddingTop: `${navBarHeight}rpx`}}
        >
          <View className={cns(
            'pet-placeOrder-area',
            'pet-placeOrder-pickerTime')
          }>
            <Text className='pet-placeOrder-area-title'>
              预约时间
            </Text>
            <View className='pet-placeOrder-area-content'>
              寄养时间
              <View className='pet-placeOrder-area-time'>
                <Picker mode='date'
                        start={startFormatDate}
                        value={moveStartFormatDate}
                        end={endFormatDate}
                        fields='day'
                        onChange={(value) => onDateChange(value, 'moveStartTime')}
                        className='pet-placeOrder-area-picker'
                >
                  <Text className='picker'>
                    {moveStartFormatDate}
                  </Text>
                </Picker>-<Picker mode='date'
                                  start={startFormatDate}
                                  value={moveEndFormatDate}
                                  end={endFormatDate}
                                  fields='day'
                                  onChange={(value) => onDateChange(value, 'moveEndTime')}
                                  className='pet-placeOrder-area-picker'
              >
                <Text className='picker'>
                  {moveEndFormatDate}
                </Text>
              </Picker>
              </View>
              {durationTime}天
            </View>
          </View>
          <View className={
            cns(
              'pet-placeOrder-area',
              'pet-placeOrder-service'
            )
          }>
            <Text className='pet-placeOrder-area-title'>
              寄养服务
            </Text>
            <View className='pet-placeOrder-area-service'>
              {
                fosterService && fosterService.length > 0 && fosterService.map((fosterItem, fosterIndex) => {
                  const skuOptionGroups = fosterItem.skuOptionGroups;
                  return (
                    <View className='pet-placeOrder-area-service-item'
                          key={String(fosterItem['goodsId'])}
                    >
                      <Text className='pet-placeOrder-area-service-item-title'>
                        {fosterItem['goodsName']}
                      </Text>
                      {
                        skuOptionGroups && skuOptionGroups.length > 0 && skuOptionGroups.map(optItem => {
                          return (
                            <View className='pet-placeOrder-area-service-item-info'
                                  key={String(optItem.skuId)}
                            >
                              <Text className='pet-placeOrder-area-service-item-info-symbol'>
                                ¥
                              </Text>
                              {optItem.discPrice}/天
                            </View>
                          )
                        })
                      }
                      <View className='pet-placeOrder-area-service-item-numberCounter'
                      >
                        <AtInputNumber
                          min={0}
                          max={1000}
                          step={1}
                          width={64}
                          value={fosterItem['goodsNum']}
                          disabled={!fosterItem['checked']}
                          onChange={(value, e) => {
                            onServiceChangeHandler(value, 'fosterService', 'goodsNum', fosterIndex, 'durationTime');
                          }}
                          className='pet-placeOrder-area-service-item-number'
                        />只
                      </View>
                      <AtSwitch
                        color='#F93B5F'
                        className='pet-placeOrder-area-service-item-switch'
                        border={false}
                        checked={fosterItem['checked']}
                        onChange={(value) => {
                          onServiceChangeHandler(value, 'fosterService', 'checked', fosterIndex, 'durationTime');
                        }}
                      />
                    </View>
                  )
                })
              }
            </View>
          </View>
          <View className={
            cns(
              'pet-placeOrder-area',
              'pet-placeOrder-service'
            )
          }>
            <View className='pet-placeOrder-area-title'>
              其他服务
              <View className='pet-placeOrder-area-title-desc'>
                按次统计 一次一只
              </View>
            </View>
            <View className='pet-placeOrder-area-service'>
              {
                otherService && otherService.length > 0 && otherService.map((otherItem, otherIndex) => {
                  const skuOptionGroups = otherItem.skuOptionGroups;
                  return (
                    <View className='pet-placeOrder-area-service-item'
                          key={String(otherItem['goodsId'])}
                    >
                      <Text className='pet-placeOrder-area-service-item-title'>
                        {otherItem['goodsName']}
                      </Text>
                      {
                        skuOptionGroups && skuOptionGroups.length > 0 && skuOptionGroups.map(optItem => {
                          return (
                            <View className='pet-placeOrder-area-service-item-info'
                                  key={String(optItem.skuId)}
                            >
                              <Text className='pet-placeOrder-area-service-item-info-symbol'>
                                ¥
                              </Text>
                              {optItem.discPrice}/次
                            </View>
                          )
                        })
                      }
                      <View className='pet-placeOrder-area-service-item-numberCounter'
                      >
                        <AtInputNumber
                          min={0}
                          max={1000}
                          step={1}
                          width={64}
                          value={otherItem['goodsNum']}
                          disabled={!otherItem['checked']}
                          onChange={(value) => {
                            onServiceChangeHandler(value, 'otherService', 'goodsNum', otherIndex, 'durationOtherTime');
                          }}
                          className='pet-placeOrder-area-service-item-number'
                        />次
                      </View>
                      <AtSwitch
                        color='#F93B5F'
                        className='pet-placeOrder-area-service-item-switch'
                        border={false}
                        checked={otherItem['checked']}
                        onChange={(value) => {
                          onServiceChangeHandler(value, 'otherService', 'checked', otherIndex, 'durationOtherTime');
                        }}
                      />
                    </View>
                  )
                })
              }
            </View>
          </View>
          <View className={
            cns(
              'pet-placeOrder-area',
              'pet-placeOrder-contact'
            )
          }>
            <Text className='pet-placeOrder-area-title'>
              联系人
            </Text>
            <View className='pet-placeOrder-area-content'>
              <AtInput
                name='contact'
                type='text'
                placeholderStyle='font-size: 14px;color: #999'
                placeholder={constants.placeOrder.placeholder.contact}
                value={contact || ''}
                onChange={(value) => {
                  onContactChangeHandler(value, 'contact');
                }}
                className='pet-placeOrder-area-contact'
              />
              <AtInput
                name='contactPhone'
                type='text'
                placeholderStyle='font-size: 14px;color: #999'
                placeholder={constants.placeOrder.placeholder.contactPhone}
                value={contactPhone || ''}
                onChange={(value) => {
                  onContactChangeHandler(value, 'contactPhone');
                }}
                className='pet-placeOrder-area-contactPhone'
              />
            </View>
          </View>
          <View className={
            cns(
              'pet-placeOrder-area',
              'pet-placeOrder-contact'
            )
          }>
            <Text className='pet-placeOrder-area-title'>
              紧急联系人（选填）
            </Text>
            <View className='pet-placeOrder-area-content'>
              <AtInput
                name='contact'
                type='text'
                placeholderStyle='font-size: 14px;color: #999'
                placeholder={constants.placeOrder.placeholder.emContact}
                value={emContact || ''}
                onChange={(value) => {
                  onContactChangeHandler(value, 'emContact');
                }}
                className='pet-placeOrder-area-contact'
              />
              <AtInput
                name='contactPhone'
                type='text'
                placeholderStyle='font-size: 14px;color: #999'
                placeholder={constants.placeOrder.placeholder.emContactPhone}
                value={emContactPhone || ''}
                onChange={(value) => {
                  onContactChangeHandler(value, 'emContactPhone');
                }}
                className='pet-placeOrder-area-contactPhone'
              />
            </View>
          </View>
          <View className={
            cns(
              'pet-placeOrder-area',
              'pet-placeOrder-contact',
              'pet-placeOrder-desc'
            )
          }>
            <Text className='pet-placeOrder-area-title'>
              备注（选填）
            </Text>
            <View className='pet-placeOrder-area-description'>
              <AtTextarea
                count={false}
                className='pet-placeOrder-area-textarea'
                textOverflowForbidden={false}
                placeholder={constants.placeOrder.placeholder.description}
                placeholderStyle='font-size: 14px;color: #666'
                value={desc || ''}
                onChange={(value) => {
                  onContactChangeHandler(value, 'desc');
                }}
              >

              </AtTextarea>
            </View>
            <View
              className='pet-placeOrder-area-agreement-wrap'
            >
              <AtCheckbox
                className='pet-placeOrder-area-agreement'
                options={[{
                  value: 'agreement',
                  label: '我同意'
                }]}
                selectedList={onAgreement}
                onChange={onAgreementCheckHandler}
              />
              <Text className='pet-placeOrder-area-agreementDetail'
                    decode
                    onClick={onAgreementHandler}
              >
                《寄养服务协议》&nbsp;&nbsp;
              </Text>
            </View>
          </View>
          <View className='pet-placeOrder-account'>
            <AtButton className='pet-placeOrder-account-total'
                      full
                      type='primary'
            >
              合计: <Text className='pet-placeOrder-account-total-symbol'>¥</Text>
              {totalIntPrice}
              <Text className='pet-placeOrder-account-total-float'>{totalFloatPrice}</Text>
            </AtButton>
            <AtButton className='pet-placeOrder-account-ordered'
                      full
                      type='primary'
                      onClick={onCreateOrderHandler}
            >
              立即结算
            </AtButton>
          </View>
        </View>
      </View>
    )
  }
}

export default PlaceOrder;
