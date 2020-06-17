import Taro, {Component} from '@tarojs/taro';
import PropTypes from 'prop-types';
import cns from 'classnames';
import {
  View,
  Image,
  ScrollView,
  Swiper,
  SwiperItem,
  Text
} from '@tarojs/components';
import {
  AtAvatar,
  AtCard,
  AtIcon,
  AtLoadMore,
  AtTag
} from 'taro-ui';

/**
 * 抽象业务组件卡片数组
 * @尹文楷
 */
class CardView extends Component {
  static options = {
    addGlobalClass: true
  };

  static propTypes = {
    //卡片列表(必须为数组)
    list: PropTypes.array.isRequired,
    //点击卡片的函数方法(必须为函数)
    onClick: PropTypes.func.isRequired,
    //卡片组件包含的样式名称
    wrapperClassName: PropTypes.string,
    //上拉加载更多
    loadStatus: PropTypes.string,
    //当滚动条滚到底部的时候进行上拉加载动作
    onScrollToLower: PropTypes.func.isRequired,
    //是否是双栏展示
    multiple: PropTypes.bool.isRequired,
    //广告栏部分
    ad: PropTypes.array,
    //如果有广告栏部分的情况下,点击广告栏触发的方法
    onAdClick: PropTypes.func.isRequired
  };

  state = {
    //瀑布流数据结构
    line: []
  };

  /**
   * 渲染首页瀑布流列表的函数
   */
  listRender(nextList) {
    let _line = [],
      _lineAno = [];
    for (let [key, value] of nextList.entries()) {
      if (key % 2 === 0) {
        _line = [..._line, value];
      } else {
        _lineAno = [..._lineAno, value];
      }
    }
    if (_line.length > 0 || _lineAno.length > 0) {
      this.setState({
        line: [_line, _lineAno]
      }, () => {
        this.forceUpdate();
      });
    }
  }

  /**
   * 渲染不同筛选条件下不同的结构
   */
  renderPetItem = (petItem) => {
    let id = petItem['id'],
      avatarUrl = petItem['avatarUrl'],
      nickName = petItem['nickName'],
      tags = petItem['tags'] || [],
      saleStatus = petItem['saleStatus'],
      saleStatusTag = null;
    const {
      onClick = () => {
      },
      multiple = false
    } = this.props;
    const onClickLocale = onClick;
    switch (saleStatus) {
      case 'OFF': {
        saleStatusTag = (<View className='pet-business-list-result'>
          <AtIcon
            prefixClass='iconfont'
            value='petPlanet-subscript'
            className='pet-business-list-subscript'
            size={36}
            color='#888'
          />
          <View className='pet-business-list-status pet-business-list-off'>
            已下架
          </View>
        </View>);
        break;
      }
      case 'SOLD': {
        saleStatusTag = (<View className='pet-business-list-result'>
          <AtIcon
            prefixClass='iconfont'
            value='petPlanet-subscript'
            className='pet-business-list-subscript'
            size={36}
            color='#888'
          />
          <View className='pet-business-list-status pet-business-list-sold'>
            已售完
          </View>
        </View>);
        break;
      }
      case 'CHECKING': {
        saleStatusTag = (<View className='pet-business-list-result'>
          <AtIcon
            prefixClass='iconfont'
            value='petPlanet-subscript'
            className='pet-business-list-subscript'
            size={36}
            color='#ffcb6b'
          />
          <View className='pet-business-list-status pet-business-list-checking'>
            审核中
          </View>
        </View>);
        break;
      }
      case 'SALING': {
        saleStatusTag = (<View className='pet-business-list-result'>
          <AtIcon
            prefixClass='iconfont'
            value='petPlanet-subscript'
            className='pet-business-list-subscript'
            size={36}
            color='#ec544c'
          />
          <View className='pet-business-list-status pet-business-list-sailing'>
            出售中
          </View>
        </View>);
        break
      }
      default: {
        break;
      }
    }
    return (
      <View key={id} className='pet-business-item'>
        <AtCard
          title={null}
          extra={null}
          className={
            cns(
              'pet-business-list',
              {
                'pet-business-list-single': !multiple
              }
            )
          }
          onClick={() => onClickLocale(id, avatarUrl, nickName)}
        >
          <Image
            mode='aspectFill'
            src={petItem['cover']}
            className={
              cns(
                'pet-business-list-image',
                {
                  'pet-business-list-image-single': !multiple
                }
              )
            }
            lazyLoad={true}
          />
          {
            petItem['saleStatus'] && saleStatusTag
          }
          <View className={
            cns(
              'pet-business-list-title',
              {
                'pet-business-list-title-single': !multiple
              }
            )
          }>
            {
              tags.length > 0 && tags.map((tagItem, tagIndex) => {
                return <AtTag
                  key={tagIndex}
                  size='small'
                  type='primary'
                  className='pet-business-list-tags-tagItem'
                >
                  {tagItem['title']}
                </AtTag>
              })
            }
            {petItem['title']}
          </View>
          <View className='pet-business-list-price'>
            <text class='pet-business-list-price-symbol'>
              &#165;
            </text>
            {petItem['cost']}
            <Text className={
              cns(
                'pet-business-list-price-like',
                {
                  'pet-business-list-price-like-single': !multiple
                }
              )
            }>
              <Text className='pet-business-list-price-like-count'>{petItem['wantCount']}</Text>人想要
            </Text>
            <View className={
              cns(
                'pet-business-list-address',
                {
                  'pet-business-list-address-single': !multiple
                }
              )
            }>
              <Image src='https://prod-pet.oss.1jtec.com/icon/location_blue.png'
                     mode='widthFix'
              >

              </Image>
              {petItem['area']}
            </View>
          </View>
          <View className='pet-business-list-user'>
            <AtAvatar
              size='small'
              circle
              image={petItem['avatarUrl']}
              className={
                cns(
                  'pet-business-list-avatar',
                  {
                    'pet-business-list-avatar-single': !multiple
                  }
                )
              }
            />
            <View className={
              cns(
                'pet-business-list-userName',
                {
                  'pet-business-list-userName-single': !multiple
                }
              )
            }>
              {petItem['nickName']}
            </View>
          </View>
        </AtCard>
      </View>
    )
  };

  componentDidMount() {
    const {list} = this.props;
    this.listRender(list);
  }

  componentDidShow() {
    const {list} = this.props;
    this.listRender(list);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const {list} = this.props;
    const {list: nextList} = nextProps;
    let {length} = list,
      {length: nextLength} = nextList;
    if (nextList && nextLength > 0) {
      this.listRender(nextList);
    }
  }

  /**
   * 点击广告位,通过后台配置,进行跳转的策略执行方法
   */
  onDirectToPage = (e) => {
    const {
      onAdClick = () => {
      }
    } = this.props;
    onAdClick(e);
  };

  render() {
    const {list = [], wrapperClassName = '', loadStatus, multiple, ad = []} = this.props;
    const {line = []} = this.state;
    const {onDirectToPage} = this;
    const {length = 0} = ad;
    return list && list.length > 0 && (
      <ScrollView
        scrollY
        className={
          cns('pet-business', wrapperClassName)
        }
        scrollTop={0}
        lowerThreshold={86}
        onScrollToLower={this.props.onScrollToLower}
      >
        {
          ad && length > 0 && <Swiper className='pet-business-swiper'
                                      autoplay
                                      indicatorDots={length > 1}
                                      indicatorColor='#f9f9f9'
                                      indicatorActiveColor='#F93B5F'
          >
            {
              ad.map(adItem => {
                return <SwiperItem key={adItem.img}
                                   data-item={JSON.stringify(adItem)}

                                   className='pet-business-swiper-item'
                                   onClick={onDirectToPage}
                >
                  <Image src={adItem.img}
                         className='pet-business-swiper-image'
                         mode='aspectFill'
                  />
                </SwiperItem>
              })
            }
          </Swiper>
        }
        {/*列表区域*/}
        <View className={cns(
          {'at-row': multiple},
          {'at-row--wrap': multiple},
          {'pet-business-container': multiple}
        )}>
          {
            multiple && line && line.length > 0 && line.map((lineItem, lineIndex) => {
              return (
                <View
                  className={cns('at-col',
                    'at-col-6',
                    'pet-business-line'
                  )}
                  key={lineIndex}
                >
                  {
                    lineItem && lineItem.length > 0 && lineItem.map((petItem) => this.renderPetItem(petItem))
                  }
                </View>
              );
            })
          }
          {
            !multiple && list.map(petItem => this.renderPetItem(petItem))
          }
        </View>
        {/*上拉加载更多区域*/}
        {
          line && line.length > 0 && <AtLoadMore
            status={loadStatus}
            moreText=''
            className='pet-business-load-more'
          />
        }
      </ScrollView>
    )
  }
}


export default CardView;
