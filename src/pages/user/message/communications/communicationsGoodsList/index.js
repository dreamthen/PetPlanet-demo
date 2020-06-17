import Taro, {Component} from '@tarojs/taro';
import {
  Image,
  Text,
  View
} from '@tarojs/components';
import {
  AtAvatar,
  AtIcon,
  AtLoadMore
} from 'taro-ui';
import {
  connect
} from '@tarojs/redux';
import {
  ListItemView
} from '../../../../../components/bussiness-components';

import communicationsGoodsListAPI from './communicationsGoodsList_service';
import {setCommunicationsAttrValue} from '../communications_action';
import {staticData} from '../../../../../constants';

import 'taro-ui/dist/style/components/avatar.scss';
import 'taro-ui/dist/style/components/input.scss';
import 'taro-ui/dist/style/components/load-more.scss';
import 'taro-ui/dist/style/components/activity-indicator.scss';
import 'taro-ui/dist/style/components/button.scss';
import 'taro-ui/dist/style/components/icon.scss';

import '../../../../commons/iconfont/iconfont.less';
import './index.less';
import {imgs} from "../../../../../assets";

@connect((state) => {
  return {
    communicationsStore: state.communicationsStore
  };
}, (dispatch) => {
  return {
    //多层对象处理方法
    setAttrValueHandler(payload) {
      dispatch(setCommunicationsAttrValue(payload));
    }
  };
})
class CommunicationsGoodsList extends Component {
  static options = {
    addGlobalClass: true
  };

  config = {
    navigationBarTitleText: '选择商品'
  };

  constructor(props) {
    super(props);
    //是否可以请求下一页
    this.isNext = false;
  }

  state = {
    //商品列表页码
    pageNum: 1,
    //商品列表
    goods: [],
    //商品的总条数
    total: 0,
    //是否显示状态组件
    isShowLoad: false,
    //加载状态
    loadStatus: staticData.loadStatusConfig.loading
  };

  componentDidMount() {
    communicationsGoodsListAPI.getGoodsCommonList.call(this);
  }

  /**
   * 上拉加载商品列表数据
   */
  onReachBottom() {
    const {isNext = false} = this;
    const {goods = [], total = 0} = this.state;
    const {length = 0} = goods;
    if (!isNext && (length < total)) {
      this.isNext = true;
      communicationsGoodsListAPI.getGoodsCommonList.call(this);
    }
  }

  /**
   * 选择商品列表里面的商品项的方法
   */
  onSelectCommunicationsGoods = (e = {}) => {
    const {
      setAttrValueHandler = () => {
      }
    } = this.props;
    const {currentTarget: {dataset: {item = ''}}} = e;
    const _item = JSON.parse(item) || {};
    const {id = 0} = _item || {};
    setAttrValueHandler({
      isTinyGoods: true,
      goodsId: id,
      goods: _item
    });
    Taro.navigateBack({
      delta: -1
    });
  };

  render() {
    const {goods = [], isShowLoad = false, loadStatus = staticData.loadStatusConfig.loading} = this.state;
    const {
      onSelectCommunicationsGoods = () => {
      }
    } = this;
    return (
      <View className='pet-communicationsGoodsList'>
        {
          goods && goods.length > 0 && goods.map((goodItem) => {
            return (
              <ListItemView
                key={String(goodItem.id)}
                dataItem={JSON.stringify(goodItem)}
                onClick={onSelectCommunicationsGoods}
                title={goodItem.goodsName}
                className='pet-communicationsGoodsList-item'
                renderHeadFigure={
                  <Image
                    mode='aspectFill'
                    src={goodItem.coverPic}
                    className='pet-communicationsGoodsList-item-avatar'
                  />
                }
                renderDesc={
                  <View className='pet-communicationsGoodsList-item-price'>
                    <View className='pet-communicationsGoodsList-item-price-disc'>
                      <Text className='pet-communicationsGoodsList-item-price-disc-symbol'>
                        &#165;
                      </Text>
                      {goodItem.floorDiscPrice}
                    </View>
                    <View className='pet-communicationsGoodsList-item-price-real'>
                      <Text className='pet-communicationsGoodsList-item-price-real-symbol'>
                        &#165;
                      </Text>
                      {goodItem.floorPrice}
                    </View>
                  </View>
                }
                renderExtra={
                  <Image
                    className='pet-communicationsGoodsList-item-go'
                    mode='widthFix'
                    src={imgs.back}
                  />
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
    )
  }
}

export default CommunicationsGoodsList;
