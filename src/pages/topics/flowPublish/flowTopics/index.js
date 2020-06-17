import Taro, {Component} from '@tarojs/taro';
import {
  View
} from '@tarojs/components';
import {
  AtAvatar,
  AtIcon,
  AtLoadMore
} from 'taro-ui';
import {connect} from '@tarojs/redux';
import cns from 'classnames';

import {
  ListItemView
} from '../../../../components/bussiness-components';
import flowTopicAPI from './flowTopics_service';
import {setFlowTopicAttrValue} from './flowTopics_action';
import {staticData} from '../../../../constants';

import 'taro-ui/dist/style/components/avatar.scss';
import 'taro-ui/dist/style/components/flex.scss';
import 'taro-ui/dist/style/components/load-more.scss';
import 'taro-ui/dist/style/components/activity-indicator.scss';
import 'taro-ui/dist/style/components/loading.scss';
import 'taro-ui/dist/style/components/button.scss';
import 'taro-ui/dist/style/components/icon.scss';

import '../../../commons/iconfont/iconfont.less';
import './index.less';

@connect(state => {
  return {
    flowTopicStore: state.flowTopicStore
  };
}, dispatch => {
  return {
    /**
     * 保存选中的话题对象
     * @param payload
     */
    saveFlowTopic: payload => {
      dispatch(setFlowTopicAttrValue(payload));
    }
  };
})
class FlowTopics extends Component {
  constructor(props) {
    super(props);
    //是否可以请求下一页
    this.isNextPage = false;
  }

  static options = {
    addGlobalClass: true
  };

  config = {
    navigationBarTitleText: '选择话题',
    onReachBottomDistance: 80
  };

  state = {
    //话题列表页码
    pageNum: 1,
    //话题列表
    topics: [],
    //话题的总条数
    total: 0,
    //是否显示状态组件
    isShowLoad: false,
    //加载状态
    loadStatus: staticData.loadStatusConfig.loading
  };

  componentDidMount() {
    flowTopicAPI.getTopics.call(this);
  }

  /**
   * 触底请求下一页话题列表
   */
  onReachBottom() {
    const {isNextPage} = this;
    const {topics: {length = 0}, total = 0} = this.state;
    if (!isNextPage && (length < total)) {
      this.setState({
        isShowLoad: true
      });
      this.isNextPage = true;
      flowTopicAPI.getTopics.call(this);
    }
  }

  /**
   * 将话题选择保存到store，以供页面间通讯
   * @param e
   */
  onTopicClick = e => {
    const {saveFlowTopic} = this.props;
    console.log(e);
    const {currentTarget: {dataset: {item}}} = e || {};
    saveFlowTopic({
      topic: JSON.parse(item) || {}
    });
    Taro.navigateBack({
      delta: 1
    });
  };

  render() {
    const {
      topics = [],
      isShowLoad = false,
      loadStatus = staticData.loadStatusConfig.loading
    } = this.state;
    const {onTopicClick} = this;
    return (
      <View className='pet-flowTopics'>
        <View className='pet-flowTopics-list'>
          {
            topics && topics.length > 0 && topics.map(topic => {
              return (
                <ListItemView
                  key={String(topic.id)}
                  dataItem={JSON.stringify(topic)}
                  className={cns(
                    'at-row',
                    'pet-flowTopics-list-item'
                  )}
                  renderHeadFigure={<AtAvatar
                    size='large'
                    image={topic.img}
                    circle
                  />}
                  renderExtra={
                    <AtIcon
                      prefixClass='iconfont'
                      value='petPlanet-right'
                      color='#DFDFDF'
                      size={20}
                    />
                  }
                  title={topic.topic}
                  onClick={onTopicClick}
                />
              );
            })
          }
        </View>
        {
          isShowLoad ? <AtLoadMore
            className='pet-flowTopics-loadMore'
            status={loadStatus}
          >
          </AtLoadMore> : <View className='pet-flowTopics-block'>
          </View>
        }
      </View>
    );
  }
}

export default FlowTopics;
