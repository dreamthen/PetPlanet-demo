import Taro, {Component} from '@tarojs/taro';
import {View, Text, ScrollView, Image} from '@tarojs/components';
import {
  AtIcon,
  AtButton,
  AtTag,
  AtAvatar
} from 'taro-ui';
import {connect} from '@tarojs/redux';
import mta from 'mta-wechat-analysis';
import cns from 'classnames';
import Tools from '../../../utils/petPlanetTools';
import {NavBarView, LoadingView} from '../../../components/bussiness-components';
import homeAPI from '../home_service';
import detailAPI from '../detail/detail_service';
import collectionAPI from '../../user/collection/collection_service';
import {setDetailAttrValue} from '../detail/detail_action';
import {setCollectionAttrValue} from '../../user/collection/collection_action';
import {pageCurrentList, staticData, loadingStatus} from '../../../constants';

import 'taro-ui/dist/style/components/avatar.scss';
import 'taro-ui/dist/style/components/button.scss';
import 'taro-ui/dist/style/components/flex.scss';
import 'taro-ui/dist/style/components/activity-indicator.scss';
import 'taro-ui/dist/style/components/loading.scss';
import 'taro-ui/dist/style/components/icon.scss';
import 'taro-ui/dist/style/components/tag.scss';

import '../../commons/iconfont/iconfont.less';
import '../detail/index.less';
import '../detail/loading-view.less';

@connect((state) => {
  return {
    homeStore: state.homeStore,
    topicsStore: state.topicsStore,
    detailStore: state.detailStore,
    collectionStore: state.collectionStore
  };
}, (dispatch) => {
  return {
    /**
     * 多层处理函数
     * @尹文楷
     * @param payload
     */
    setAttrValueHandler(payload) {
      dispatch(setDetailAttrValue(payload));
    },
    /**
     * 获取宠物发布之后的内容详情
     * @尹文楷
     * @param [params]
     * @returns {Promise<void>}
     */
    async getPetDetailInfoHandler(...params) {
      await dispatch(homeAPI.getPetDetailRequest.apply(this, params));
    },
    /**
     * 对此宠物交易进行收藏
     * @returns {Promise<void>}
     */
    async setCollectionHandler() {
      await dispatch(detailAPI.setCollectionRequest.apply(this));
    },
    /**
     * 对此宠物交易进行取消收藏
     * @returns {Promise<void>}
     */
    async setNoCollectionHandler() {
      await dispatch(detailAPI.setNoCollectionRequest.apply(this));
    },
    /**
     * 拉取收藏列表
     * @尹文楷
     */
    async usersCollectionHandler() {
      await dispatch(setCollectionAttrValue({
        pageNum: 1,
        petCollectionList: [],
        currentPetCollectionList: [],
        loadStatus: staticData['loadStatusConfig']['more']
      }));
      await dispatch(collectionAPI.usersCollectionRequest.apply(this));
    }
  };
})
class ShareDetail extends Component {
  static options = {
    addGlobalClass: true
  };
  config = {
    backgroundColor: '#fff',
    navigationStyle: 'custom'
  };

  async componentWillMount() {
    await mta.Page.init();
  }

  async componentDidMount() {
    const {getPetDetailInfoHandler} = this.props;
    const {id, avatarUrl, nickName, page} = this.$router.params;
    await getPetDetailInfoHandler.apply(this, [id, avatarUrl, nickName]);
    switch (page) {
      case 'medicalAdviceStore.js':
        mta.Event.stat('index_cardview', {'indexcardviewid': id});
        break;
      case 'collection':
        mta.Event.stat('collection_cardview', {'collectioncardviewid': id});
        break;
      case 'publishMine':
        mta.Event.stat('publishmine_cardview', {'publishcardviewid': id});
        break;
    }
  }

  componentWillReceiveProps(nextProps) {

  }

  /**
   * 小程序页面在显示的时候触发
   * @尹文楷
   */
  componentDidShow() {
    Taro.showShareMenu({
      withShareTicket: false
    });
  }

  /**
   * 小程序页面在被注销退出的时候触发
   * @尹文楷
   */
  componentWillUnmount() {
    const {setAttrValueHandler} = this.props;
    setAttrValueHandler.apply(this, [{
      countImage: 0,
      isLoading: true
    }]);
  }

  /**
   * 监听用户点击页面内转发按钮或右上角菜单“转发”按钮的行为，并自定义转发内容。
   * @returns {*}
   */
  onShareAppMessage({from, target, webViewUrl}) {
    const {detailStore} = this.props;
    const {title, images} = detailStore;
    const {id, page, nickName, avatarUrl} = this.$router.params;
    return {
      title: `逼疯的铲屎官-${title}`,
      path: `${pageCurrentList[5]}?id=${id}&page=${page}&nickName=${nickName}&avatarUrl=${avatarUrl}`,
      imageUrl: images[0]
    }
  }

  /**
   * 对此宠物交易进行收藏
   * @尹文楷
   */
  async setCollection() {
    const {setCollectionHandler} = this.props;
    await setCollectionHandler.apply(this);
    mta.Event.stat('detail_collect', {});
  }

  /**
   * 对此宠物交易进行取消收藏
   * @尹文楷
   */
  async setNoCollection() {
    const {setNoCollectionHandler} = this.props;
    await setNoCollectionHandler.apply(this);
    mta.Event.stat('detail_nocollect', {});
  }

  /**
   * 判断此宠物交易是否进行收藏或者取消收藏的配置函数
   * @returns {Promise<void>}
   */
  setCollectionConfig = async () => {
    const {setCollection, setNoCollection} = this;
    const {detailStore, usersCollectionHandler} = this.props;
    const {collected} = detailStore;
    await collected ? setNoCollection.apply(this) : setCollection.apply(this);
    let currentPages = Taro.getCurrentPages(),
      length = currentPages.length;
    if (currentPages[length - 2] && pageCurrentList[5].indexOf(currentPages[length - 2]['route']) !== -1) {
      await usersCollectionHandler.apply(this);
    }
  };

  /**
   * 在新页面中全屏预览图片。预览的过程中用户可以进行保存图片、发送给朋友等操作。
   * @param value
   */
  onPreviewImage = (value) => {
    const {detailStore} = this.props;
    const {images} = detailStore;
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
   * 分享页面回到'主人'首页
   * @尹文楷
   */
  backToMasterHome = () => {
    Taro.redirectTo({
      url: `${pageCurrentList[1]}`
    });
  };

  /**
   * 当第一张照片加载完毕时，直接将loading加载等待元素关闭
   */
  onImageLoad = () => {
    const {setAttrValueHandler} = this.props;
    setAttrValueHandler({
      isLoading: false
    });
  };

  render() {
    const {
      detailStore = {}
    } = this.props;
    const {
      onPreviewImage = () => {
      },
      setCollectionConfig = () => {
      },
      backToMasterHome = () => {
      },
      onImageLoad = () => {
      }
    } = this;
    const {title, isLoading, cost, content, collected, images, area, contactInfo, tags, avatarUrl, nickName} = detailStore;
    const {navBarHeight = 0} = Tools.adaptationNavBar();
    return (
      <ScrollView
        className='pet-detail'
        scrollY={true}
        scrollTop={0}
        style={{paddingTop: `${navBarHeight}rpx`}}
      >
        <NavBarView
          color='#000'
          title='内容详情'
          leftIconPrefixClass='iconfont'
          leftIconType='petPlanet-home'
          onClickLeftIcon={backToMasterHome}
        />
        {
          isLoading && <LoadingView
            size={56}
            color='#fb2a5d'
            className='pet-detail-activity-indicator'
            content={loadingStatus.progress.text}
          />
        }
        <View className='pet-detail-personal'>
          <View className='pet-detail-personal-user'>
            <AtAvatar
              size='normal'
              circle
              image={avatarUrl}
              className='pet-detail-personal-user-avatar'
            />
            {nickName}
          </View>
          <Text className='pet-detail-personal-contactInfo'
                selectable
          >
            {contactInfo}
          </Text>
        </View>
        <View className={cns('at-row',
          'at-row--no-wrap',
          'pet-detail-header'
        )}>
          <View className={cns('at-col',
            'at-col-10',
            'at-col--wrap',
            'pet-detail-header-container'
          )}>
            {
              tags && tags.length > 0 && tags.map((tagItem, tagIndex) => {
                return (
                  <AtTag
                    key={tagIndex}
                    size='small'
                    type='primary'
                    className='pet-detail-header-tags'
                  >
                    {tagItem['title']}
                  </AtTag>
                );
              })
            }
            <Text className='pet-detail-header-title'
                  style={(tags && tags.length > 0) ? {} : {marginLeft: 0}}
            >
              {title}
            </Text>
          </View>
          <View className={cns('at-col',
            'at-col-1'
          )}>

          </View>
        </View>
        <View className='pet-detail-content'>
          <View className='pet-detail-content-price'>
            <Text className='pet-detail-content-price-symbol'>
              &#165;
            </Text>
            {cost}
          </View>
          <View className='pet-detail-content-area'>
            <Image src='https://prod-pet.oss.1jtec.com/icon/location_blue.png'
                   mode='widthFix'
            >

            </Image>
            {area}
          </View>
          <View className='pet-detail-content-operation'>
            <AtButton
              size='small'
              type='secondary'
              className='pet-detail-content-collection-button'
              onClick={setCollectionConfig}
            >
              <AtIcon prefixClass='iconfont' value={collected ? 'petPlanet-collected' : 'petPlanet-collect'} size={26}
                      color='#000'/>
              <View className='pet-detail-content-collection-title'>
                收藏
              </View>
            </AtButton>
            <AtButton
              openType='share'
              size='small'
              type='secondary'
              className='pet-detail-content-share-button'
            >
              <AtIcon prefixClass='iconfont' value='petPlanet-share' size={25} color='#000'/>
              <View className='pet-detail-content-share-title'>
                分享
              </View>
            </AtButton>
          </View>
        </View>
        <View className='pet-detail-info'>
          <Text className={cns('at-row',
            'at-row--wrap',
            'pet-detail-info-content'
          )}
                selectable
          >
            {content}
          </Text>
        </View>
        <View className='pet-detail-images'>
          {
            images && images.length && images.map((imageItem, imageIndex) => {
              return <Image
                key={imageIndex}
                mode='widthFix'
                className='pet-detail-images-item'
                src={imageItem}
                onClick={() => onPreviewImage(imageItem)}
                onLoad={onImageLoad}
              />
            })
          }
        </View>
      </ScrollView>
    )
  }
}

export default ShareDetail;
