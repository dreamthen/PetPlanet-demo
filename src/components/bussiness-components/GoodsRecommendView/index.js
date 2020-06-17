import Taro, {Component} from '@tarojs/taro';
import PropTypes from 'prop-types';
import cns from 'classnames';
import {Image, Text, View} from "@tarojs/components";
import {imgs} from "../../../assets";
import {pageCurrentList} from "../../../constants";
import './goods-recommend-view.less';

class GoodsRecommendView extends Component {
  static options = {
    addGlobalClass: true
  };

  static propTypes = {
    //商品id
    dataId: PropTypes.number.isRequired,
    //商品头图
    coverPic: PropTypes.string.isRequired,
    //商品名称
    name: PropTypes.string.isRequired,
    //商品价格
    price: PropTypes.number.isRequired,
    //商品打折价格
    discPrice: PropTypes.number.isRequired,
    //外部传入样式表
    className: PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  state = {};

  /**
   * 重定向跳转至商品详情
   */
  onRedirectToGoodsDetail = (e = {}) => {
    const {currentTarget: {dataset: {id}}} = e;
    Taro.navigateTo({
      url: `${pageCurrentList[31]}?id=${id}`
    });
    //取消冒泡事件
    e.stopPropagation();
  };

  render() {
    const {
      dataId = 0,
      coverPic = '',
      name = '',
      discPrice = '',
      price = 0,
      className = ''
    } = this.props;
    const {onRedirectToGoodsDetail} = this;
    return (
      <View className={cns('goods', className)}
            data-id={dataId}
            onClick={onRedirectToGoodsDetail}
      >
        <Image
          src={coverPic}
          mode='aspectFill'
          className='goods-avatar'
        />
        <View className='goods-title'>
          {name}
          <View className='goods-price'>
            <View className='goods-price-disc'>
              <Text className='goods-price-disc-symbol'>
                &#165;
              </Text>
              {discPrice}
            </View>
            <View className='goods-price-real'>
              <Text className='goods-price-real-symbol'>
                &#165;
              </Text>
              {price}
            </View>
          </View>
        </View>
        <Image
          className='goods-go'
          mode='widthFix'
          src={imgs.back}
        />
      </View>
    );
  }
}

export default GoodsRecommendView;


