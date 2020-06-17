import Taro, {Component} from '@tarojs/taro';
import {
  Image,
  View,
  Swiper,
  SwiperItem,
  Text
} from '@tarojs/components';
import {
  AtAvatar,
  AtLoadMore
} from 'taro-ui';
import {
  connect
} from '@tarojs/redux';

import {
  LoadingView,
  ListItemView
} from '../../../components/bussiness-components';
import {pageCurrentList, staticData, loadingStatus} from '../../../constants';
import fosterAPI from './foster_service';

import 'taro-ui/dist/style/components/avatar.scss';
import 'taro-ui/dist/style/components/button.scss';
import 'taro-ui/dist/style/components/load-more.scss';
import 'taro-ui/dist/style/components/activity-indicator.scss';
import 'taro-ui/dist/style/components/loading.scss';

import './loading-view.less';
import './index.less';

@connect((state, ownProps) => {
  return {};
}, (dispatch, ownProps) => {
  return {};
})
class Foster extends Component {
  constructor(props) {
    super(props);
    //是否要加载下一页列表
    this.isNext = true;
  }

  static options = {
    addGlobalClass: true
  };

  config = {
    navigationBarTitleText: '家庭寄养'
  };

  state = {
    //家庭寄养列表页码
    pageNum: 1,
    //家庭寄养列表的总条数
    total: 0,
    //家庭寄养头部轮播图列表
    swiperList: [],
    //家庭寄养列表
    fosterList: [],
    //是否显示状态组件
    isShowLoad: false,
    //是否是在接口请求响应加载中
    isLoading: true,
    //加载状态
    loadStatus: staticData.loadStatusConfig.loading
  };

  componentDidMount() {
    fosterAPI.getFosterList.call(this);
    fosterAPI.getBannerSysConfig.call(this);
  }

  onReachBottom() {
    const {fosterList: {length}, total} = this.state;
    const {isNext} = this;
    if (length < total && isNext) {
      this.isNext = false;
      this.setState({
        isShowLoad: true
      });
      fosterAPI.getFosterList.call(this);
    }
  }

  /**
   * 跳转到详情页
   */
  onRedirectToDetail = (e) => {
    const {currentTarget: {dataset: {item = null}}} = e;
    const _item = JSON.parse(item) || {};
    const {merchantId = 0, goodsName = null} = _item;
    Taro.navigateTo({
      url: `${pageCurrentList[25]}?merchantId=${merchantId}&goodsName=${goodsName}`
    });
    //取消冒泡事件
    e.stopPropagation();
  };

  render() {
    const {
      swiperList = [],
      fosterList = [],
      isLoading = true,
      loadStatus = staticData.loadStatusConfig.loading,
      isShowLoad = false
    } = this.state;
    const {length = 0} = swiperList;
    const {
      onRedirectToDetail = () => {
      }
    } = this;
    return (
      <View className='pet-foster'>
        {
          isLoading && <LoadingView
            size={56}
            color='#fb2a5d'
            className='pet-foster-activity-indicator'
            content={loadingStatus.progress.text}
          />
        }
        <Swiper className='pet-foster-swiper'
                autoplay
                indicatorDots={length > 1}
                indicatorColor='#f9f9f9'
                indicatorActiveColor='#F93B5F'
        >
          {
            swiperList && length > 0 && swiperList.map(item => {
              return (
                <SwiperItem key={item.img}>
                  <Image src={item.img}
                         className='pet-foster-swiper-image'
                         mode='aspectFill'
                  >

                  </Image>
                </SwiperItem>
              )
            })
          }
        </Swiper>
        <View className='pet-foster-situation'>
          {
            fosterList && fosterList.length > 0 && fosterList.map(fosterItem => {
              const spuAttributes = fosterItem['spuAttributes'].slice(0, 1) || [];
              return (
                <ListItemView
                  className='pet-foster-situation-item'
                  key={String(fosterItem['merchantId'])}
                  dataItem={JSON.stringify(fosterItem)}
                  onClick={onRedirectToDetail}
                  renderHeadFigure={
                    <AtAvatar image={fosterItem['coverPic']}
                              size='large'
                              className='pet-foster-situation-item-avatar'
                              circle
                    >

                    </AtAvatar>
                  }
                  renderDesc={
                    <View className='pet-foster-situation-item-content'>
                      <View className='pet-foster-situation-item-content-title'>
                        {fosterItem['goodsName']}
                      </View>
                      {
                        spuAttributes.map(attrItem => {
                          return (
                            <View key={String(attrItem['goodsId'])}
                                  className='pet-foster-situation-item-content-detail'
                            >
                              <Text className='pet-foster-situation-item-content-attrName'>
                                {attrItem['attrName']}
                              </Text>
                              <Text className='pet-foster-situation-item-content-spuAttributeValue'>
                                {attrItem['spuAttributeValue']}
                              </Text>
                            </View>
                          )
                        })
                      }
                      <View className='pet-foster-situation-item-content-desc'>
                        {fosterItem['goodsDesc']}
                      </View>
                    </View>
                  }
                  renderExtra={
                    <View className='pet-foster-situation-item-price'>
                      <Text className='pet-foster-situation-item-price-symbol'>
                        ¥
                      </Text>
                      {`${fosterItem['salePrice']}`}
                    </View>
                  }
                />
              )
            })
          }
          {
            isShowLoad ? <AtLoadMore
              className='pet-foster-situation-loadMore'
              status={loadStatus}
            >
            </AtLoadMore> : <View className='pet-foster-situation-block'>
            </View>
          }
        </View>
      </View>
    );
  }
}

export default Foster;
