import Taro, {Component} from '@tarojs/taro';
import {connect} from '@tarojs/redux';
import {View} from '@tarojs/components';
import {
  AtTabBar,
  AtButton,
  AtIcon
} from 'taro-ui';
import mta from 'mta-wechat-analysis';
import cns from 'classnames';

import {
  CardView,
  PreparationView
} from '../../components/bussiness-components';
import {changeCurrent, changePageNum, changeLoadStatus, setAttrValue} from './home_action';
import {setPublishAttrValue} from './publish/publish_action';
import homeAPI from './home_service';
import {pageCurrentList, staticData, tabBarTabList, linkTypeHandler, loadingStatus} from '../../constants';
import LoadingView from '../../components/bussiness-components/LoadingView';
import Tools from '../../utils/petPlanetTools';
import * as constants from './constants';

import 'taro-ui/dist/style/components/button.scss';
import 'taro-ui/dist/style/components/tab-bar.scss';
import 'taro-ui/dist/style/components/card.scss';
import 'taro-ui/dist/style/components/load-more.scss';
import 'taro-ui/dist/style/components/activity-indicator.scss';
import 'taro-ui/dist/style/components/loading.scss';
import 'taro-ui/dist/style/components/icon.scss';
import 'taro-ui/dist/style/components/tag.scss';


import '../commons/iconfont/iconfont.less';
import './card-view.less';
import './index.less';
import './loading-view.less';


@connect((state) => {
  return {
    homeStore: state.homeStore,
    topicsStore: state.topicsStore,
    detailStore: state.detailStore,
    publishStore: state.publishStore
  }
}, (dispatch) => {
  return {
    /**
     * 通过onClick事件来更新current值变化
     * @param value
     */
    async changeCurrentHandler(value) {
      const {currentList} = this.state;
      await dispatch(changeCurrent({current: value}));
      await Taro.redirectTo({
        url: currentList[`${value}`]
      });
    },
    /**
     * 初始化页面时更新current值的变化
     */
    changeCurrentInit() {
      const {path} = this.$router;
      const {currentList} = this.state;
      dispatch(changeCurrent({current: currentList.findIndex(item => item === path) || 0}));
    },
    /**
     * 获取小程序首页信息
     * @尹文楷
     */
    async homeInfoHandler(pageNum) {
      await dispatch(changePageNum({
        pageNum
      }));
      await dispatch(homeAPI.homeInfoRequest.apply(this));
    },

    /**
     * 改变滚动加载的AtLoadMore的状态
     * @尹文楷
     */
    async changeLoadStatusHandler(loadStatus) {
      await dispatch(changeLoadStatus({
        loadStatus
      }));
    },

    /**
     * 改变redux store里面的数据状态
     * @尹文楷
     */
    setAttrValueHandler(payload) {
      dispatch(setAttrValue(payload));
    },
    /**
     * 改变redux store里面的数据状态
     * @尹文楷
     */
    setPublishAttrValueHandler(payload) {
      dispatch(setPublishAttrValue(payload));
    },
  }
})
class Index extends Component {

  static options = {
    addGlobalClass: true
  };

  config = {
    navigationBarTitleText: '主子'
  };

  state = {
    tabBarInfo: {
      communication: {
        dot: false
      }
    },
    //广告位
    swiperList: [],
    //是否显示正在加载loading页面......
    loading: true,
    //筛选之后的TabBar标签页路由路径
    currentList: [],
    //获取底部TabBar配置
    tabBarTabList: [],
    //底部隐藏的TabBar配置
    tabBarTabNoSbList: [],
    //筛选头部导航下标
    current: constants.preparationNav[0]['key']
  };

  /**
   * 筛选底部TabBar配置
   * @returns {Promise<void>}
   */
  async componentWillMount() {
    const {changeCurrentInit} = this.props;
    let {data: tabBarConfig} = await homeAPI.getTabBarConfigRequest();
    let filterTabBarList = [],
      tabBarTabNoSbList,
      filterTabBarNoSbList = [],
      list = Object.assign([], pageCurrentList),
      filterTabBarKeyList = [];
    for (let val of tabBarConfig) {
      let filterTabBarConfig = tabBarTabList.filter(tabBarItem => (tabBarItem['id'] === val['code']) && val['sb']),
        filterTabBarNoSbConfig = tabBarTabList.filter(tabBarItem => (tabBarItem['id'] === val['code']) && !val['sb']);
      if (filterTabBarConfig && filterTabBarConfig.length > 0) {
        filterTabBarList = [...filterTabBarList, ...filterTabBarConfig];
      }
      if (filterTabBarNoSbConfig && filterTabBarNoSbConfig.length > 0) {
        filterTabBarNoSbList = [...filterTabBarNoSbList, val];
      }
    }
    for (let [key, val] of list.entries()) {
      tabBarTabNoSbList = filterTabBarNoSbList.filter(sbItem => sbItem['path'] === val);
      tabBarTabNoSbList && tabBarTabNoSbList.length > 0 && (filterTabBarKeyList = [...filterTabBarKeyList, key]);
    }
    for (let val of filterTabBarKeyList) {
      list.splice(val, 1, undefined);
    }
    list = list.filter(listItem => listItem !== undefined);
    this.setState({
      tabBarTabList: filterTabBarList,
      currentList: list
    }, () => {
      changeCurrentInit.call(this);
    });
    mta.Page.init();
  }

  componentDidMount() {
    const {homeInfoHandler, changeLoadStatusHandler} = this.props;
    homeInfoHandler.apply(this, [1]);
    changeLoadStatusHandler('more');
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const {homeInfoHandler, changeLoadStatusHandler} = this.props;
    const {homeStore: {petList}} = nextProps || {};
    if (petList.length <= 0) {
      homeInfoHandler.apply(this, [1]);
      changeLoadStatusHandler('more');
    }
  }

  componentWillUnmount() {
    this.setState({
      current: constants.preparationNav[0]['key']
    })
  }

  async componentDidShow() {
    let {data: newTabBarInfo} = await homeAPI.getTabBarInfoRequest();
    this.setState(Object.assign({}, {
      tabBarInfo: this.state.tabBarInfo
    }, {
      tabBarInfo: newTabBarInfo
    }));
    Taro.showShareMenu({
      withShareTicket: false
    });
  }

  componentDidHide() {
  }

  /**
   * 监听用户点击页面内转发按钮或右上角菜单“转发”按钮的行为，并自定义转发内容。
   * @param from
   * @param target
   * @param webViewUrl
   */
  onShareAppMessage({from, target, webViewUrl}) {

  }

  /**
   * 当滚动条滚到底部的时候进行上拉加载动作
   * @尹文楷
   */
  onScrollToLower = async () => {
    const {homeStore, homeInfoHandler, changeLoadStatusHandler} = this.props;
    let {pageNum, currentPetList, loadStatus} = homeStore;
    if (currentPetList.length === staticData['pageSize'] && loadStatus === staticData['loadStatusConfig']['more']) {
      await changeLoadStatusHandler(staticData['loadStatusConfig']['loading']);
      await homeInfoHandler.apply(this, [++pageNum]);
      mta.Event.stat('index_scrolltolower', {});
    }
  };

  /**
   * 获取详情页内容
   * @尹文楷
   **/
  getPetDetailHandler = (id, avatarUrl, nickName) => {
    Taro.navigateTo({
      url: `${pageCurrentList[5]}?id=${id}&page=index&avatarUrl=${avatarUrl}&nickName=${nickName}`
    });
  };

  /**
   * 筛选出dot为true的底部边栏结构
   * @尹文楷
   */
  filterDotTabBarList = (tabBarInfo) => {
    if (!tabBarInfo) {
      return false;
    }
    const {tabBarTabList} = this.state;
    let tabBarInfoList = Object.entries(tabBarInfo),
      tabBarInfoDotList = tabBarInfoList.filter((item, index) => {
        return !!(item[1] && item[1].dot);
      });
    let newFilterTabBarInfoDotList = tabBarInfoDotList.map((dotItem, dotIndex) => {
      return (dotItem && dotItem[0]);
    });
    while (newFilterTabBarInfoDotList.length > 0) {
      let span = newFilterTabBarInfoDotList.shift();
      tabBarTabList.forEach((item, index) => {
        if (item.name === span) {
          item.dot = true;
        }
      });
    }
  };

  /**
   * 筛选头部导航改变时,触发的动作,改变下标,并发起筛选请求
   * @尹文楷
   */
  onPreparationChangeHandler = (current = 0, e = {}) => {
    const {homeInfoHandler, changeLoadStatusHandler} = this.props;
    this.setState({
      current,
      loading: true
    }, () => {
      homeInfoHandler.apply(this, [1]);
    });
    changeLoadStatusHandler('more');
    //取消冒泡
    e.stopPropagation && e.stopPropagation();
  };

  /**
   * 点击广告位,通过后台配置,进行跳转的策略执行方法
   */
  onDirectToPage = (e) => {
    const {currentTarget: {dataset: {item}}} = e || {};
    const _item = JSON.parse(item) || {};
    _item.link && linkTypeHandler[_item['linkType']](_item.link);
  };

  /**
   * 点击'添加'主子按钮,跳转到主子发布页
   */
  onDirectToPublishPage = (event) => {
    const {setPublishAttrValueHandler} = this.props;
    setPublishAttrValueHandler({
      content: null,
      files: [],
      uploadFilterFiles: [],
      images: [],
      isLocationAuthorize: false,
      area: '添加地点',
      title: null,
      cost: null,
      contactInfo: null
    });
    Taro.navigateTo({
      url: pageCurrentList[7]
    });
    //取消冒泡事件
    event.stopPropagation();
  };

  render() {
    const {
      onScrollToLower = () => {
      },
      getPetDetailHandler = () => {
      },
      filterDotTabBarList = () => {
      },
      onPreparationChangeHandler = () => {
      },
      onDirectToPage = () => {
      },
      onDirectToPublishPage = () => {
      }
    } = this;
    const {
      homeStore,
      changeCurrentHandler
    } = this.props;
    const {
      tabBarInfo = {},
      current: _current,
      loading = true,
      tabBarTabList = [],
      swiperList = []
    } = this.state;
    const {current, petList, loadStatus} = homeStore;
    const {isX} = Tools.adaptationNavBar();
    filterDotTabBarList(tabBarInfo);
    return (
      <View className='pet'>
        {
          loading && <LoadingView
            size={56}
            color='#fb2a5d'
            className='pet-business-loading'
            content={loadingStatus.progress.text}
          />
        }
        <PreparationView
          strategy={constants.preparationNav}
          current={_current}
          onChange={onPreparationChangeHandler}
        />
        {/*首页宠物交易列表区域*/}
        <CardView
          wrapperClassName={
            cns({
              'pet-business-adaption': !!isX
            })
          }
          ad={swiperList || []}
          onAdClick={onDirectToPage}
          multiple={_current !== constants.preparationNav[0]['key']}
          list={petList}
          onScrollToLower={onScrollToLower}
          onClick={getPetDetailHandler}
          loadStatus={loadStatus}
        />
        {
          petList && petList.length <= 0 && <View className='pet-business-empty'>
            <AtIcon
              className='pet-business-empty-icon'
              prefixClass='iconfont'
              value='petPlanet-cat-ao'
              color='#000'
              size={48}
            />
            <View className='pet-business-empty-description'>
              啊哦~铲屎官搜索不到喵星人~~
            </View>
          </View>
        }
        {/*按钮发布区域: 使用formId进行发起一次有formId的模板消息请求*/}
        <View
          className={cns(
            'pet-business-deal',
            {'pet-business-deal-adaption': !!isX}
          )}
        >
          <AtButton
            size='small'
            type='primary'
            className='pet-business-deal-add'
            onClick={onDirectToPublishPage}
          >
            <AtIcon
              value='add'
              className='pet-business-deal-add-icon'
              size={22}
              color='#fff'
            />
          </AtButton>
        </View>
        {/*导航区域: 分首页、咨询、会话和我四个部分*/}
        <AtTabBar
          className={cns(
            'pet-tabBar',
            {
              'pet-tabBar-adaption': !!isX
            }
          )}
          fixed
          current={current}
          tabList={tabBarTabList}
          onClick={changeCurrentHandler.bind(this)}
          color='#979797'
          iconSize={24}
          selectedColor='#000'
        />
      </View>
    )
  }
}

export default Index;
