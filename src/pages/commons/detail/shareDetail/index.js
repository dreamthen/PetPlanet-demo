import Taro, {Component} from '@tarojs/taro';
import {
  Image,
  View,
  Text,
  ScrollView,
  RadioGroup,
  Radio,
} from '@tarojs/components';
import {
  AtButton,
  AtFloatLayout,
  AtIcon,
  AtDivider,
  AtInputNumber,
  AtMessage
} from 'taro-ui';
import cns from 'classnames';

import Tools from '../../../../utils/petPlanetTools';
import commonDetailAPI from '../detail_service';
import {pageCurrentList} from '../../../../constants';
import * as constants from '../constants';
import {
  DialogView, NavBarView
} from '../../../../components/bussiness-components';

import 'taro-ui/dist/style/components/divider.scss';
import 'taro-ui/dist/style/components/avatar.scss';
import 'taro-ui/dist/style/components/button.scss';
import 'taro-ui/dist/style/components/flex.scss';
import 'taro-ui/dist/style/components/float-layout.scss';
import 'taro-ui/dist/style/components/message.scss';
import 'taro-ui/dist/style/components/input-number.scss';
import 'taro-ui/dist/style/components/icon.scss';

import '../../iconfont/iconfont.less';
import '../index.less';

class ShareCommonDetail extends Component {
  config = {
    navigationStyle: 'custom'
  };

  static options = {
    addGlobalClass: true
  };

  constructor(props) {
    super(props);
  }

  state = {
    //轮播图
    images: [],
    //售价
    salePrice: '',
    //实际售价
    discPrice: '',
    //销量
    sales: 0,
    //封面图
    coverPic: '',
    //商品名称
    goodsName: '',
    //商品描述
    goodsDesc: '',
    //商品描述详情图片
    detailImages: [],
    //商品详情的id
    id: 0,
    //是否出现发货说明底部弹窗
    descDialog: false,
    //购买时sku规格参数底部弹层
    skuDialog: false,
    //购买时sku规格参数的实际售价
    skuPrice: 0,
    //购买时sku规格参数的数量
    skuCount: 1,
    //购买时sku规格参数的库存
    skuStock: 0,
    //购买时sku规格参数
    skus: [],
    //购买时选择sku的标识位
    choosedIdx: 0
  };

  componentWillMount() {
    const {params: {id = 0}} = this.$router;
    this.setState({
      id
    });
  }

  componentDidMount() {
    commonDetailAPI.getCommonDetail.call(this);
  }

  /**
   * 在新页面中全屏预览图片。预览的过程中用户可以进行保存图片、发送给朋友等操作。
   * @param value
   */
  onPreviewImage = (value) => {
    const {images = []} = this.state;
    Tools.previewImageConfig({
      urls: images,
      current: value,
      success: (res) => {
        console.log(res);
      },
      complete: (res) => {
        console.log(res);
      }
    });
  };

  /**
   * 在新页面中全屏预览图片。预览的过程中用户可以进行保存图片、发送给朋友等操作。
   * @param value
   */
  onPreviewDetailImage = (value) => {
    const {detailImages = []} = this.state;
    Tools.previewImageConfig({
      urls: detailImages,
      current: value,
      success: (res) => {
        console.log(res);
      },
      complete: (res) => {
        console.log(res);
      }
    });
  };

  /**
   * 配置分享的文案、图片以及路径
   * @param obj
   */
  onShareAppMessage(obj) {
    const {coverPic = '', id = '', goodsName = ''} = this.state;
    return {
      title: goodsName,
      path: `${pageCurrentList[36]}?id=${id}`,
      imageUrl: coverPic
    };
  }

  /**
   * 打开或者关闭底部弹层
   */
  onDialogChange = (type) => {
    const {[type]: dialog = false} = this.state;
    this.setState({
      [type]: !dialog
    });
  };

  /**
   * 进行调整sku规格参数数量
   * @param count
   */
  onCountChange = count => {
    this.setState({
      skuCount: count
    });
  };

  /**
   * 进行选择sku规格参数
   */
  onSkuChange = e => {
    const idx = e.detail.value;
    const {skus} = this.state;
    skus.forEach(sku => {
      sku.checked = false;
    });

    skus[idx].checked = true;
    this.setState({
      skus,
      skuPrice: skus[idx]['discPrice'],
      skuId: skus[idx]['skudId'],
      skuStock: skus[idx]['stock'],
      choosedIdx: idx
    });
  };

  /**
   * 校验下单
   */
  verify = () => {
    const {skuCount = 0} = this.state;
    return Tools.addRules(
      skuCount > 0,
      [{
        rule: 'isEmpty',
        errMsg: constants.verify.isEmpty
      }]
    ).execute();
  };

  onEnsureBuyClick = e => {
    const {
      verify = () => {
      }
    } = this;
    const {choosedIdx = 0, coverPic = '', goodsName = '', skus = [], id = 0, skuCount = 0} = this.state;
    const sku = skus[choosedIdx];
    if (verify()) {
      const navParam = [{
        coverPic,
        goodsName,
        orderItem: {
          goodsId: id,
          goodsNum: skuCount,
          skuId: sku.skuId,
          discPrice: sku.discPrice,
          optionName: sku.optionGroup.map(option => option.optionName).join(' ')
        }
      }];
      Taro.navigateTo({
        url: `${pageCurrentList[33]}?item=${JSON.stringify(navParam)}`
      });
    }
    //取消冒泡事件
    e.stopPropagation();
  };

  /**
   * 分享页面回到'发现'首页
   * @尹文楷
   */
  backToMasterHome = () => {
    Taro.redirectTo({
      url: `${pageCurrentList[0]}`
    });
  };

  render() {
    const {
      images = [],
      discPrice = '',
      salePrice = '',
      sales = 0,
      goodsName = '',
      goodsDesc = '',
      detailImages = [],
      descDialog = false,
      skuDialog = false,
      skuPrice,
      skuCount,
      skus,
      skuStock
    } = this.state;
    const {length = 0} = images;
    const {
      onPreviewImage = () => {
      },
      onPreviewDetailImage = () => {
      },
      onDialogChange = () => {
      },
      backToMasterHome = () => {
      },
    } = this;
    const {shipConfig = []} = constants || {};
    const {navBarHeight = 0} = Tools.adaptationNavBar();
    return (
      <View className='detail'
            style={{paddingTop: `${navBarHeight}rpx`}}
      >
        <NavBarView
          color='#000'
          title='商品详情'
          leftIconPrefixClass='iconfont'
          leftIconType='petPlanet-home'
          onClickLeftIcon={backToMasterHome}
        />
        <AtMessage/>
        <Swiper
          className='detail-swiper'
          autoplay
        >
          {
            images && length > 0 && images.map((imageItem, imageIndex) => {
              return (
                <SwiperItem key={imageItem}
                            className='detail-swiper-item'
                            onClick={() => onPreviewImage(imageItem)}
                >
                  <Image
                    mode='aspectFill'
                    src={imageItem}
                    className='detail-swiper-item-image'
                  />
                  <Text className='detail-swiper-item-current'>
                    {imageIndex + 1}/{length}
                  </Text>
                </SwiperItem>
              )
            })
          }
        </Swiper>
        <View className='detail-skuOptions'>
          <View className='detail-skuOptions-discPrice'>
            <View className='detail-skuOptions-discPrice-main'>
              <Text className='detail-skuOptions-discPrice-symbol'>
                &#165;
              </Text>
              {discPrice}
            </View>
            <View className='detail-skuOptions-salePrice'>
              <AtIcon
                prefixClass='iconfont'
                value='petPlanet-taobao'
                size={18}
                color='#ee5d2a'
              />
              <AtIcon
                prefixClass='iconfont'
                value='petPlanet-tmall'
                size={17}
                color='rgb(188,39,26)'
              />
              <View className='detail-skuOptions-salePrice-real'>
                <Text className='detail-skuOptions-salePrice-symbol'>
                  &#165;
                </Text>
                {salePrice}
              </View>
            </View>
          </View>
          <View className='detail-skuOptions-sales'>
            共销{sales}
          </View>
        </View>
        <View className='detail-goods'>
          <View className='detail-goods-goodsName'>
            {goodsName}
          </View>
          <View className='detail-goods-goodsDesc'>
            {goodsDesc}
          </View>
          <View className='detail-goods-service'>
            <View className='detail-goods-service-container'>
              服务
              <View className='detail-goods-service-content'>
                <View className='detail-goods-service-content-item'>
                  优质宠品
                </View>
                <View className='detail-goods-service-content-item'>
                  极速发货
                </View>
                <View className='detail-goods-service-content-item'>
                  7天退换
                </View>
              </View>
            </View>
            <View className='detail-goods-service-desc'
                  onClick={() => onDialogChange('descDialog')}
            >
              发货说明
              <AtIcon
                size={12}
                color='#999'
                className='pet-flowPublish-publish-content-topic-content-icon'
                prefixClass='iconfont'
                value='petPlanet-right'
              />
            </View>
          </View>
          <View className='detail-goods-goodsDetail'>
            <View className='detail-goods-goodsDetail-title'>商品详情</View>
            {
              detailImages && detailImages.length > 0 && detailImages.map(detailItem => {
                return <Image
                  key={detailItem}
                  src={detailItem}
                  className='detail-goods-goodsDetail-item'
                  mode='widthFix'
                  onClick={() => onPreviewDetailImage(detailItem)}
                >
                </Image>
              })
            }
          </View>
        </View>
        <View className='detail-serviceOrder'>
          <AtButton className={
            cns(
              'detail-serviceOrder-button',
              'detail-serviceOrder-share'
            )
          }
                    full
                    openType='share'
                    type='primary'
          >
            <AtIcon prefixClass='iconfont' value='petPlanet-share' size={16} color='#333'/>
            分享
          </AtButton>
          <AtButton className={
            cns(
              'detail-serviceOrder-button',
              'detail-serviceOrder-placeOrder'
            )
          }
                    full
                    type='primary'
                    onClick={() => onDialogChange('skuDialog')}
          >
            立即购买
          </AtButton>
        </View>
        <DialogView isOpened={descDialog}
                    title={constants.floatLayout.delivery.title}
                    className='detail-float-layout'
                    onClose={() => onDialogChange('descDialog')}
                    renderContent={
                      <View className='detail-float-layout-content'>
                        {
                          shipConfig && shipConfig.length > 0 && shipConfig.map(shipItem => {
                            return <View className='detail-float-layout-content-item'>
                              <View className='detail-float-layout-content-item-title'>
                                {shipItem.title}
                                <View className='detail-float-layout-content-item-detail'>
                                  {shipItem.content}
                                </View>
                              </View>
                            </View>
                          })
                        }
                      </View>
                    }
        />
        <AtFloatLayout
          isOpened={skuDialog}
          className='detail-sku-choose'
          onClose={() => onDialogChange('skuDialog')}
        >
          <View
            className='detail-sku-choose-info at-row'
          >
            <Image
              className='detail-sku-choose-info-image'
              src={images[0]}
              mode='aspectFill'
            />
            <View
              className='detail-sku-choose-info-common  at-col at-col--wrap'
            >
              <View class='detail-sku-choose-info-price'>&#165;{skuPrice}</View>
              <View class='detail-sku-choose-info-stock'>{skuStock}件</View>
            </View>
          </View>
          <AtDivider height='1' className='detail-sku-choose-divider' lineColor='#F6F6F6'/>
          <ScrollView
            className='detail-sku-choose-option'
            scrollY
          >
            {/* 规格标题 */}
            <View className='detail-sku-choose-option-title'>规格</View>
            {/* 规格选择 */}
            <RadioGroup onChange={this.onSkuChange}>
              {
                skus && skus.length > 0 && (
                  skus.map((sku, idx) => {
                    return (
                      <Label for={idx} key={idx}>
                        <View className='detail-sku-choose-option-wrap'>
                          <Text className={cns(
                            'detail-sku-choose-option-item',
                            {'checked': sku.checked}
                          )}>
                            {
                              sku.optionGroup && sku.optionGroup.map(option => {
                                return `${option.optionName} `;
                              })
                            }
                          </Text>
                          <Radio hidden id={idx} value={idx}/>
                        </View>
                      </Label>
                    );
                  })
                )
              }
            </RadioGroup>
            <AtDivider height='1' className='detail-sku-choose-divider' lineColor='#F6F6F6'/>
            {/* 数量 */}
            <View className='detail-sku-choose-count at-row at-row__justify--between'>
              <Text className='detail-sku-choose-option-title'>数量</Text>
              <AtInputNumber
                min={1}
                max={100}
                step={1}
                width={64}
                value={skuCount}
                onChange={this.onCountChange}
                className='detail-sku-choose-count-inputNumber'
              />
            </View>
          </ScrollView>
          <View
            className='detail-sku-choose-btn'
            onClick={this.onEnsureBuyClick}
          >
            确定
          </View>
        </AtFloatLayout>
      </View>
    )
  }
}

export default ShareCommonDetail;
