import Taro, {Component} from '@tarojs/taro';
import {
  Block,
  Button,
  Image,
  Text,
  View
} from '@tarojs/components';
import {
  AtAvatar,
  AtIcon
} from 'taro-ui';
import cns from 'classnames';
import PropTypes from 'prop-types';

import Tools from '../../../utils/petPlanetTools';
import {imgs} from '../../../assets';

import GoodsRecommendView from "../GoodsRecommendView";

class DiscoveryView extends Component {
  static options = {
    addGlobalClass: true
  };

  static propTypes = {
    //列表(必须为数组)
    list: PropTypes.array.isRequired,
    //点击某个列表项所触发的动作
    onClick: PropTypes.func.isRequired,
    //点击某个列表项的(不)喜欢的动作
    onLiked: PropTypes.func.isRequired,
    //点击某个列表项的进行评论的动作
    onComment: PropTypes.func.isRequired,
    //容器标签元素的样式表
    className: PropTypes.string
  };

  state = {
    //九宫格图片的高度
    petFlowItemHeight: 0
  };

  componentDidMount() {
    const {windowWidth = 0} = Taro.getSystemInfoSync();
    const paddingDistance = 48;
    this.setState({
      petFlowItemHeight: (windowWidth - paddingDistance) / 3
    });
  }

  componentWillReceiveProps(nextProps, nextContext) {
  }

  /**
   * 点击图片触发的回调
   */
  showImageDetail = (index, file, imgs) => {
    imgs = Tools.previewImageOperation(imgs);
    Tools.previewImageConfig({
      urls: imgs,
      current: imgs[index],
      success: (res) => {

      },
      complete: (res) => {

      }
    });
  };

  render() {
    const {
      list = [],
      onClick = () => {
      },
      onLiked = () => {
      },
      onComment = () => {
      },
      className = ''
    } = this.props;
    const {petFlowItemHeight} = this.state;
    const {
      showImageDetail
    } = this;
    return (list && list.length) ? list.map(flowItem => {
      const {goods = {}} = flowItem;
      return (
        <View
          className={cns(
            'pet-list-item',
            className
          )}
          key={Number(flowItem['id'])}
          data-item={JSON.stringify(flowItem)}
          onClick={onClick}
        >
          <View className='pet-list-item-header'>
            <View className='pet-list-item-avatar'>
              <AtAvatar
                image={flowItem['userAvatarUrl']}
                className='pet-list-item-avatar-avatarPic'
                circle
              />
              {
                flowItem['certificate'] && <Image src={imgs.approve}
                                                  className='pet-list-item-avatar-approve'
                                                  mode='widthFix'
                >

                </Image>
              }
            </View>
            <View className='pet-list-item-user'>
              {flowItem['userNickName']}
            </View>
          </View>
          <View className='pet-list-item-content'>
            <View className='pet-list-item-content-container'
            >
              <View className='pet-list-item-content-info'>
                {flowItem['content']}
              </View>
              <View className='pet-list-item-content-imageList'
              >
                {
                  flowItem['imgs'] && flowItem['imgs'].length > 0 && (flowItem['imgs'].length > 1 ? <View
                    className='pet-list-item-content-imageItem'
                  >
                    {
                      (flowItem && flowItem['imgs']) && flowItem['imgs'].map((item, index) => {
                        return <View
                          className='pet-list-item-content-imageItem-main'
                          style={{height: `${petFlowItemHeight + 4}px`}}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          <Image src={item}
                                 key={item}
                                 mode='aspectFill'
                                 style={{height: `${petFlowItemHeight}px`}}
                                 onClick={(e) => showImageDetail(index, item, flowItem['imgs'])}
                          >

                          </Image>
                        </View>
                      })
                    }
                  </View> : <View style={{width: '72%'}}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                  }}>
                    <Image src={flowItem['imgs'][0]}
                           mode='widthFix'
                           lazyLoad
                           onClick={() => showImageDetail(0, flowItem['imgs'][0], flowItem['imgs'])}
                    >

                    </Image>
                  </View>)
                }
              </View>
              {
                flowItem['topic'] && <View className='pet-list-item-topicContent'>
                  <Text className='pet-list-item-topicContent-info'>
                    #{flowItem['topic']}
                  </Text>
                </View>
              }
            </View>
            {
              goods && <View onClick={(e) => e.stopPropagation()}>
                <View className='pet-list-item-goodsTitle'>
                  好物推荐
                </View>
                <GoodsRecommendView
                  dataId={goods.goodsId}
                  coverPic={goods.coverPic}
                  name={goods.goodsName}
                  price={(goods.salePrice / 100).toFixed(0)}
                  discPrice={(goods.discPrice / 100).toFixed(0)}
                  className='pet-list-item-goods'
                />
              </View>
            }
            <View className='pet-list-item-data'>
              <View onClick={(e) => e.stopPropagation()}>
                <View className={cns(
                  'pet-list-item-data-like',
                  {
                    'pet-list-item-data-like-selected': flowItem['liked']
                  }
                )}
                      data-id={flowItem['id']}
                      onClick={onLiked}
                >
                  {
                    flowItem['liked'] ? <AtIcon
                      prefixClass='iconfont'
                      value='petPlanet-liked'
                      size={28}
                      color='#ec544c'>
                    </AtIcon> : <AtIcon
                      prefixClass='iconfont'
                      value='petPlanet-like'
                      size={29}
                      color='rgba(0, 0, 0, .4)'
                    >
                    </AtIcon>
                  }
                  {flowItem['goodCount']}
                </View>
              </View>
              <View onClick={(e) => e.stopPropagation()}>
                <View className='pet-list-item-data-discuss'
                      data-item={JSON.stringify(flowItem)}
                      onClick={onComment}
                >
                  <Image src={imgs.topic_message}
                         mode='widthFix'
                  >

                  </Image>
                  {flowItem['commentCount']}
                </View>
              </View>
              <View onClick={(e) => {
                e.stopPropagation()
              }}>
                <View className='pet-list-item-data-share'>
                  <Button
                    data-item={JSON.stringify(flowItem)}
                    openType='share'
                    className='pet-list-item-data-shareButton'
                  >
                    <Image src='https://prod-pet.oss.1jtec.com/icon/share.png'
                           mode='widthFix'
                    >

                    </Image>
                  </Button>
                </View>
              </View>
              <View className='pet-list-item-data-view'>
                浏览<Text className='pet-list-item-data-view-data'>{flowItem['viewCount']}</Text>次
              </View>
            </View>
          </View>
        </View>
      );
    }) : <View className='pet-list-empty'>
      <AtIcon
        className='pet-list-icon'
        prefixClass='iconfont'
        value='petPlanet-cat-ao'
        color='#000'
        size={48}
      />
      <View className='pet-list-empty-title'>
        啊哦~~~
      </View>
      <View className='pet-list-empty-description'>
        铲屎官探索未知的空间，没有发现任何内容
      </View>
    </View>
  }
}

export default DiscoveryView;
