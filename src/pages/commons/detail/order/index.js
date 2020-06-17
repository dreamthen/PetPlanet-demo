import Taro, {Component} from '@tarojs/taro';
import {
  Block,
  Image,
  View,
  Text
} from '@tarojs/components';
import {
  AtButton,
  AtIcon,
  AtAvatar,
  AtInput,
  AtInputNumber,
  AtMessage
} from 'taro-ui';
import cns from 'classnames';

import Tools from '../../../../utils/petPlanetTools';
import * as constants from './constants';
import {pageCurrentList, loadingStatus} from '../../../../constants';
import commonOrderAPI from './order_service';
import {
  LoadingView
} from '../../../../components/bussiness-components';
import {imgs} from '../../../../assets';

import 'taro-ui/dist/style/components/avatar.scss';
import 'taro-ui/dist/style/components/icon.scss';
import 'taro-ui/dist/style/components/activity-indicator.scss';
import 'taro-ui/dist/style/components/loading.scss';
import 'taro-ui/dist/style/components/input.scss';
import 'taro-ui/dist/style/components/button.scss';
import 'taro-ui/dist/style/components/input-number.scss';
import 'taro-ui/dist/style/components/message.scss';

import '../../iconfont/iconfont.less';
import './loading-view.less';
import './index.less';
import {add} from '@tarojs/cli/templates/redux/src/actions/counter';

class CommonOrder extends Component {
  config = {
    navigationBarTitleText: '确认订单'
  };

  static options = {
    addGlobalClass: true
  };

  constructor(props) {
    super(props);
    //是否存在下一页
    this.isNext = false;
  }

  state = {
    //我的收货地址列表的页码
    pageNum: 1,
    //我的收货地址列表总共有多少条
    total: 0,
    //总共有多少件商品
    totalNum: 0,
    //我的收货地址列表
    // addressList: [],
    //下单时我的收货地址
    address: {},
    //是否显示正在加载loading页面......
    loading: true,
    //loading加载标语
    loadingText: loadingStatus.progress.text,
    //是否拒绝过获取地址权限
    isScopeAddressRefused: false,
    //合计的金额
    totalPrice: '0.00',
    //支付类型
    channel: 'WECHAT',
    //在详情页选中的商品以及商品的参数属性
    item: []
  };

  componentWillMount() {
    const {params: {item = ''}} = this.$router;
    let _item = JSON.parse(item) || [];
    _item = _item.map(item => {
      return {
        ...item,
        goodsNum: item.orderItem.goodsNum,
        remark: ''
      };
    });
    this.setState({
      item: _item
    }, () => {
      this.getTotalPrice.call(this);
    });
  }

  componentDidMount() {
    Tools.getSettingConfig({
      success: (res) => {
        if (res[constants.scope.address] === false) {
          this.setState({
            isScopeAddressRefused: true
          });
        }
      },
      fail: (res) => {

      },
      complete: (res) => {

      }
    });
    commonOrderAPI.getAddressLast.call(this);
    Taro.hideShareMenu();
  }

  /**
   * 获取合计的金额
   */
  getTotalPrice = () => {
    const {item = []} = this.state;
    let totalNum = 0, totalPrice = 0;
    item.forEach(_item => {
      totalNum += _item.goodsNum;
      _item.orderItem.goodsNum = _item.goodsNum;
      totalPrice = (parseFloat(totalPrice) + _item.orderItem.discPrice * _item.goodsNum).toFixed(2);
    });
    this.setState({
      totalNum,
      totalPrice
    });
  };

  /**
   * 改变Input输入和计数器的内容
   * @尹文楷
   * @returns {Promise<void>}
   */
  onOrderChangeHandler = (target = '', symbol = null, key = '', event = {}) => {
    let value;
    value = Object.prototype.toString.call(event) === '[object Object]' ? event.target.value : event;
    let {[target]: item} = this.state;
    item.forEach(_item => {
      if (symbol === _item.orderItem.goodsId) {
        _item[key] = value;
      }
    });
    this.setState({
      [target]: item
    }, () => {
      this.getTotalPrice.call(this);
    });
  };

  /**
   * 校验提交的订单
   */
  verify = () => {
    const {
      totalPrice = '0.00',
      address = {}
    } = this.state;
    return Tools.addRules([
      address,
      !!Number(totalPrice)
    ], [{
      rule: 'isEmpty',
      errMsg: constants.verify.isEmpty
    }]).execute();
  };

  /**
   * 进行下单
   */
  onCreateOrderHandler = async (e) => {
    const {
      verify = () => {
      }
    } = this;
    if (verify()) {
      const data = await commonOrderAPI.createOrder.call(this);
      const {statusCode, data: _data} = data;
      const {orderId, orderNo} = _data;
      if (statusCode === 200) {
        this.setState({
          loading: true,
          loadingText: loadingStatus.pay.text
        });
        await commonOrderAPI.paymentPay.call(this, orderId, orderNo)
      }
    }
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

  /**
   * 点击新增地址或者已有地址,进行跳转至地址列表页
   */
  onRedirectToAddressPage = (e) => {
    // const {addressList = []} = this.state;
    // Taro.navigateTo({
    //   url: `${pageCurrentList[35]}?addressList=${JSON.stringify(addressList)}`
    // });
    const {isScopeAddressRefused = false} = this.state;
    if (isScopeAddressRefused) {
      Tools.openSettingConfig({
        success: (authSetting) => {
          if (authSetting[constants.scope.address]) {
            this.setState({
              isScopeAddressRefused: false
            });
          }
        },
        fail: (res) => {

        },
        complete: (res) => {

        }
      });
    } else {
      Tools.chooseAddressConfig({
        success: ({
                    userName = '',
                    telNumber = '',
                    provinceName = '',
                    cityName = '',
                    countyName = '',
                    detailInfo = '',
                    postalCode = ''
                  }) => {
          const address = {
            consignee: userName,
            mobile: telNumber,
            postcode: postalCode,
            province: provinceName,
            city: cityName,
            district: countyName,
            street: detailInfo
          };
          commonOrderAPI.saveAddress.call(this, address);
        },
        fail: (res) => {
        },
        complete: (res) => {

        }
      });
    }

    //取消冒泡事件
    e.stopPropagation();
  };

  render() {
    const {
      address = {},
      item = [],
      totalNum = 0,
      totalPrice = '0.00',
      loading = false,
      loadingText = loadingStatus.progress.text
    } = this.state;
    const totalPoint = totalPrice.indexOf('.'),
      totalIntPrice = totalPrice.slice(0, totalPoint === -1 ? totalPrice.length : totalPoint),
      totalFloatPrice = totalPoint !== -1 ? totalPrice.slice(totalPoint) : '.00';
    const {
      onRedirectToAddressPage = () => {
      },
      onOrderChangeHandler = () => {
      },
      onCreateOrderHandler = () => {
      }
    } = this;
    return (
      <Block>
        {
          loading && <LoadingView
            size={52}
            color='#fb2a5d'
            className='order-loading'
            content={loadingText}
          />
        }
        <View className='order'>
          <AtMessage/>
          <View className={cns(
            'order-service',
            'order-address'
          )}
                onClick={onRedirectToAddressPage}
          >
            <AtIcon
              clsssName='order-address-icon'
              size={48}
              color='#F93B5F'
              prefixClass='iconfont'
              value='petPlanet-address'
            />
            <View className='order-address-content'
            >
              {
                (!address || Tools.isEmpty(address)) ? constants.emptyAddressList.text : <Block>
                  <View className='order-address-userInfo'>
                    <Text className='order-address-userInfo-name'>
                      {address.consignee}
                    </Text>
                    <Text className='order-address-userInfo-mobile'>
                      {address.mobile}
                    </Text>
                  </View>
                  <View className='order-address-addressInfo'>
                    {`${address.province} ${address.city} ${address.district} ${address.street}`}
                  </View>
                </Block>
              }
            </View>
            <Image
              className='order-address-redirectTo'
              src={imgs.back}
              mode='widthFix'
            />
          </View>
          {
            item && item.length > 0 && item.map(_item => {
              const discPrice = parseFloat(_item.orderItem.discPrice).toFixed(2),
                discPricePoint = discPrice.indexOf('.'),
                discIntPrice = discPrice.slice(0, discPricePoint === -1 ? discPrice.length : discPricePoint),
                discFloatPrice = discPricePoint !== -1 ? discPrice.slice(discPricePoint) : '.00';
              return (
                <Block
                  key={_item.orderItem.goodsId}
                >
                  <View className={cns(
                    'order-service',
                    'order-detail'
                  )}
                        data-item={JSON.stringify(_item)}
                  >
                    <AtAvatar
                      image={_item.coverPic}
                      className='order-detail-avatar'
                      size='large'
                    />
                    <View className='order-detail-content'>
                      <View className='order-detail-content-title'>
                        {_item.goodsName}
                      </View>
                      <View className='order-detail-content-desc'>
                        {_item.orderItem.optionName}
                      </View>
                    </View>
                    <View className='order-detail-priceNum'>
                      <View className='order-detail-priceNum-discPrice'>
                        <Text
                          className='order-detail-priceNum-discPrice-symbol'>
                          &#165;
                        </Text>
                        {discIntPrice}
                        <Text className='order-detail-priceNum-discPrice-float'>
                          {discFloatPrice}
                        </Text>
                      </View>
                      <View className='order-detail-priceNum-num'>
                        x{_item.goodsNum}
                      </View>
                    </View>
                  </View>
                  <View className='order-goodsInfo'>
                    <View className='order-goodsInfo-title'>
                      购买数量
                    </View>
                    <View className='order-goodsInfo-content'>
                      <AtInputNumber
                        min={0}
                        max={1000}
                        step={1}
                        width={64}
                        value={_item.goodsNum}
                        onChange={(value) => onOrderChangeHandler('item', _item.orderItem.goodsId, 'goodsNum', value)}
                        className='order-goodsInfo-content-number'
                      />
                    </View>
                  </View>
                  <View className='order-remark'>
                    <View className='order-remark-title'>
                      订单备注
                    </View>
                    <View className='order-remark-content'>
                      <AtInput
                        placeholder={constants.order.placeholder.remark}
                        placeholderStyle='font-size:16PX;font-weight:400;color:#999;'
                        className='order-remark-content-input'
                        value={item.remark}
                        onChange={(e) => onOrderChangeHandler('item', _item.orderItem.goodsId, 'remark', e)}
                      />
                    </View>
                  </View>
                </Block>
              )
            })
          }
          <View className='order-total'>
            <View className='order-total-info'>
              共{totalNum}件, 合计: <Text className='order-total-info-price'>
              <Text
                className='order-total-info-symbol'>
                &#165;
              </Text>
              {totalIntPrice}
              <Text className='order-total-info-float'>
                {totalFloatPrice}
              </Text>
            </Text>
            </View>
            <AtButton
              className='order-total-submit'
              full={false}
              type='primary'
              onClick={onCreateOrderHandler}
            >
              提交订单
            </AtButton>
          </View>
        </View>
      </Block>
    )
  }
}

export default CommonOrder;
