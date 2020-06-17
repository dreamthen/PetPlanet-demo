import Taro, {Component} from '@tarojs/taro';
import {connect} from '@tarojs/redux';
import {
  ScrollView,
  View
} from '@tarojs/components';
import {
  AtButton,
  AtIcon
} from 'taro-ui';
import mta from 'mta-wechat-analysis';
import cns from 'classnames';

import {setTopicsAttrValue} from '../topics_action';
import {setFindTopicsAttrValue} from './findTopics_action';
import homeAPI from '../../index/home_service';
import topicsAPI from '../topics_service';
import {pageCurrentList, loadingStatus} from '../../../constants';
import {
  DiscoveryView,
  LoadingView,
  NavBarDetailView
} from '../../../components/bussiness-components';
import Tools from '../../../utils/petPlanetTools';

import 'taro-ui/dist/style/components/avatar.scss';
import 'taro-ui/dist/style/components/button.scss';
import 'taro-ui/dist/style/components/activity-indicator.scss';
import 'taro-ui/dist/style/components/loading.scss';
import 'taro-ui/dist/style/components/icon.scss';

import '../../commons/iconfont/iconfont.less';
import './index.less';
import './list-view.less';
import './loading-view.less';


@connect((state) => {
  return {
    topicsStore: state.topicsStore,
    findTopicsStore: state.findTopicsStore
  }
}, (dispatch) => {
  return {
    /**
     * 改变redux store里面的数据状态
     */
    setTopicsAttrValueHandler(payload) {
      return dispatch(setTopicsAttrValue(payload));
    },
    /**
     * 改变redux store里面的数据状态
     */
    setFindTopicsAttrValueHandler(payload) {
      return dispatch(setFindTopicsAttrValue(payload));
    }
  }
})
class FindTopics extends Component {

  constructor(props) {
    super(props);
    //为了对请求分页接口进行截流
    this.hasNext = false;
  }

  static options = {
    addGlobalClass: true
  };

  config = {
    navigationBarTitleText: '话题',
    navigationStyle: 'custom'
  };

  state = {
    //flow内容流页码
    postPageNum: 1,
    //flow内容流的总条数
    postTotal: 0,
    //是否显示正在加载loading页面......
    loading: true,
    //内容流所在话题的文案
    topic: null,
    //内容流所在话题代表的图片
    img: null
  };

  componentWillMount() {
    const {params: {topic, img}} = this.$router;
    this.setState({
      topic,
      img
    });
  }

  async componentDidMount() {
    Tools.run(function* () {
      yield topicsAPI.getFlowPostsByTopics.call(this);
    }.bind(this));
    mta.Page.init();
  }

  componentWillReceiveProps(nextProps, nextContext) {
  }

  componentWillUnmount() {
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
   * 下滑分页,滑动至距离底部还有20%的距离时,请求下一页
   */
  scrollToNextPage = (event) => {
    const {detail = {}} = event;
    const {findTopicsStore} = this.props;
    const {postTotal} = this.state;
    const {flowPostList: {length}} = findTopicsStore;
    const {scrollTop = 0, scrollHeight = 0} = detail;
    const {hasNext} = this;
    Taro.createSelectorQuery().select('#pet-topic-flowList').fields({
      size: true
    }, res => {
      const {height} = res;
      const that = this;
      if (((scrollHeight - height - scrollTop) / scrollHeight < 0.1) && (length < postTotal) && !hasNext) {
        this.hasNext = true;
        Tools.run(function* () {
          yield topicsAPI.getFlowPostsByTopics.call(that);
        });
      }
    }).exec();
  };

  /**
   * 点击跳转到内容社区详情页
   * e
   */
  redirectToDetail = (e) => {
    //取消冒泡事件
    e.stopPropagation();
    const {currentTarget = {}} = e || {};
    const {dataset: {item}} = currentTarget;
    const {id, goodCount, commentCount, liked, topic} = JSON.parse(item) || {};
    Taro.navigateTo({
      url: Tools.modelStrCutNull`${pageCurrentList[19]}?id=${id}&topic=${topic}&like=${goodCount}&comment=${commentCount}&liked=${liked}`
    });
  };

  /**
   * 点击跳转到内容社区详情页
   * e
   */
  redirectToDetailComment = (e) => {
    //取消冒泡事件
    e.stopPropagation();
    const {currentTarget = {}} = e || {};
    const {dataset: {item}} = currentTarget;
    const {id, goodCount, commentCount, liked, topic} = JSON.parse(item) || {};
    Taro.navigateTo({
      url: Tools.modelStrCutNull`${pageCurrentList[19]}?id=${id}&topic=${topic}&like=${goodCount}&comment=${commentCount}&liked=${liked}&scrollTop=${true}`
    });
  };

  /**
   * 点击(不)喜欢某条Post
   */
  onTopicLikeHandler = (e) => {
    //取消冒泡事件
    e.stopPropagation();
    const {currentTarget} = e || {};
    const {dataset: {id}} = currentTarget || {};
    topicsAPI.flowPostsTopicsLike.call(this, id);
  };

  /**
   * 监听用户点击页面内转发按钮或右上角菜单“转发”按钮的行为，并自定义转发内容。
   * @param res
   */
  onShareAppMessage(res) {
    const params = res[0];
    const {from} = params;
    switch (from) {
      case 'button':
        let {target: {dataset: {item}}} = params;
        const {id, goodCount, commentCount, imgs, content, liked, topic} = JSON.parse(item) || {};
        return {
          title: content,
          path: Tools.modelStrCutNull`${pageCurrentList[19]}?id=${id}&topic=${topic}&like=${goodCount}&comment=${commentCount}&liked=${liked}`,
          imageUrl: imgs[0]
        };
      case 'menu':
        return {
          title: '逼疯的铲屎官 - 发现'
        };
      default:
        break;
    }
  };

  /**
   * 点击上一页,返回上一页
   */
  onRedirectToBackPage = (e) => {
    //取消冒泡事件
    e.stopPropagation();
    Taro.navigateBack({
      delta: 1
    });
  };

  render() {
    const {
      scrollToNextPage,
      redirectToDetail,
      redirectToDetailComment,
      onTopicLikeHandler,
      onRedirectToBackPage
    } = this;
    const {navBarHeight = 0, isX = false} = Tools.adaptationNavBar();
    const {
      findTopicsStore = {}
    } = this.props;
    const {flowPostList = []} = findTopicsStore;
    const {loading, topic, img} = this.state;
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
        <NavBarDetailView
          className='pet-topic-flowList-information'
          avatar={img}
          nickName={topic}
          onClickLeftIcon={onRedirectToBackPage}
          onClick={() => {
          }}
        />
        <View className='pet-find'
        >
          <ScrollView
            id='pet-topic-flowList'
            className='pet-topic-flowList'
            scrollY
            onScroll={scrollToNextPage}
            style={{height: `calc(100% - ${navBarHeight}rpx)`, paddingTop: `${navBarHeight}rpx`}}
          >
            <DiscoveryView
              list={flowPostList}
              onClick={redirectToDetail}
              onLiked={onTopicLikeHandler}
              onComment={redirectToDetailComment}
            />
          </ScrollView>
        </View>
        {/*按钮发布区域: 使用formId进行发起一次有formId的模板消息请求*/}
        <View
          className={cns(
            'pet-topic-deal',
            {
              'pet-topic-deal-adaption': !!isX
            }
          )}
        >
          <AtButton
            size='small'
            type='primary'
            className='pet-topic-deal-add'
            onClick={(event) => {
              Taro.navigateTo({
                url: `${pageCurrentList[22]}?topic=${topic}&img=${img}`
              });
              //取消冒泡事件
              event.stopPropagation();
            }}
          >
            <AtIcon
              value='add'
              className='pet-topic-deal-add-icon'
              size={22}
              color='#fff'
            />
          </AtButton>
        </View>
      </View>
    )
  }
}

export default FindTopics;
