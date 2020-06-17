import Taro, {Component} from '@tarojs/taro';
import {
  Block,
  ScrollView,
  Text,
  View
} from '@tarojs/components';
import {
  AtIcon,
  AtAvatar,
  AtBadge,
  AtButton,
  AtLoadMore,
  AtSwipeAction,
  AtTag
} from 'taro-ui';
import {connect} from '@tarojs/redux';
import moment from 'moment';
import cns from 'classnames';

import {
  ListItemView,
  LoadingView
} from '../../../components/bussiness-components';
import * as constants from './constants';
import {pageCurrentList, staticData, loadingStatus} from '../../../constants';
import messageAPI from './message_service';
import {setCommunicationsAttrValue} from './communications/communications_action';
import Tools from '../../../utils/petPlanetTools';

import 'taro-ui/dist/style/components/avatar.scss';
import 'taro-ui/dist/style/components/badge.scss';
import 'taro-ui/dist/style/components/button.scss';
import 'taro-ui/dist/style/components/load-more.scss';
import 'taro-ui/dist/style/components/activity-indicator.scss';
import 'taro-ui/dist/style/components/loading.scss';
import 'taro-ui/dist/style/components/swipe-action.scss';
import 'taro-ui/dist/style/components/icon.scss';
import 'taro-ui/dist/style/components/tag.scss';

import '../../commons/iconfont/iconfont.less';
import './index.less';
import './loading-view.less';

Tools.getMomentConfig(moment);

@connect((state, ownProps) => {
  return {
    homeStore: state.homeStore,
    messageStore: state.messageStore,
    communicationsStore: state.communicationsStore
  };
}, (dispatch, ownProps) => {
  return {
    /**
     * 前往对话记录页面
     * @尹文楷
     */
    onCommunicationsPage({id, cnsltType, docUserId}, e) {
      const {consultationsList} = this.state;
      const consultationsItem = consultationsList.filter(item => item['id'] === id);
      consultationsItem.length > 0 && consultationsItem[0].hasMessage && (consultationsItem[0].hasMessage = false);
      this.setState({
        consultationsList
      });
      dispatch(setCommunicationsAttrValue({
        consultationsList,
        cnsltId: id,
        cnsltType,
        docId: docUserId
      }));
      Taro.navigateTo({
        url: pageCurrentList[11]
      });
      //清除冒泡事件
      e.stopPropagation();
    }
  };
})
class Message extends Component {
  static options = {
    addGlobalClass: true
  };

  constructor(props) {
    super(props);
    //是否可以请求下一页
    this.isNext = false;
  }

  config = {
    navigationBarTitleText: '会话',
    onReachBottomDistance: 188
  };

  state = {
    //咨询列表
    consultationsList: [],
    //是否是在接口请求响应加载中
    isLoading: true,
    //会话列表的页码
    pageNum: 1,
    //会话列表总共有多少条
    total: 0,
    //是否显示状态组件
    isShowLoad: false,
    //加载状态
    loadStatus: staticData.loadStatusConfig.loading
  };

  componentDidMount() {
    messageAPI.cnsltConsultations.call(this);
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  /**
   * 点击会话列表项进入具体的交流会话页面
   * @param e
   */
  onDirectToMedicalAdvicePage = (e) => {
    Taro.redirectTo({
      url: pageCurrentList[2]
    });
    //取消冒泡
    e.stopPropagation();
  };

  /**
   * 当用户上拉触底时,获取会话页面咨询列表下一页的数据
   */
  messageScrollListener = (event) => {
    const {detail: {scrollHeight, scrollTop}} = event || {};
    const {total = 0, consultationsList = []} = this.state;
    const {isNext = false} = this;
    let domHeight = null;
    Taro.createSelectorQuery().select('#pet-message').fields({
      size: true
    }, res => {
      domHeight = res.height;
      const {length = 0} = consultationsList;
      let {pageNum = 1} = this.state;
      if ((((scrollHeight - domHeight - scrollTop) / scrollHeight) <= 0.15) && (length < total) && !isNext) {
        Tools.run(function* () {
          this.isNext = true;
          yield this.setState({
            isShowLoad: true
          });
          const data = yield messageAPI.cnsltConsultationsPagination.call(this, ++pageNum);
          const {data: _data, total} = data;
          let consultationsEndList = [...consultationsList, ..._data];
          const {length: _length = 0} = consultationsEndList;
          this.setState({
            consultationsList: consultationsEndList,
            isLoading: false,
            total,
            pageNum,
            isShowLoad: _length === total,
            loadStatus: _length === total ? constants.loadStatus.noMore : constants.loadStatus.loading
          }, () => {
            this.isNext = false;
          });
        }.bind(this));
      }
    }).exec();
  };

  render() {
    const {onCommunicationsPage} = this.props;
    const {onDirectToMedicalAdvicePage, messageScrollListener} = this;
    let {consultationsList, isLoading, loadStatus = staticData.loadStatusConfig.loading, isShowLoad = false} = this.state;
    return (
      <Block>
        <ScrollView
          id='pet-message'
          scrollY
          className='pet-message'
          onScroll={messageScrollListener}
        >
          {
            isLoading && <LoadingView
              size={56}
              color='#fb2a5d'
              className='pet-message-activity-indicator'
              content={loadingStatus.progress.text}
            />
          }
          {
            consultationsList.length > 0 ? consultationsList.map((consultationItem, consultationIndex) => {
              return (
                <AtSwipeAction
                  key={`${consultationItem['id']}`}
                  isOpened={false}
                  autoClose
                  options={[{
                    text: constants.swipeAction.message,
                    style: {
                      backgroundColor: '#F93B5F',
                      color: '#fff'
                    }
                  }]}
                  onClick={(e) => {
                    messageAPI.cnsltConsultationsDelete.call(this, consultationItem['id'], consultationIndex);
                  }}
                >
                  <ListItemView
                    className='pet-message-consultationsItem'
                    onClick={onCommunicationsPage.bind(this, consultationItem)}
                    renderHeadFigure={
                      <AtBadge
                        dot={consultationItem['hasMessage']}
                      >
                        <AtAvatar
                          className='pet-message-consultationsItem-avatar'
                          size='large'
                          image={consultationItem['avatarUrl']}
                        />
                      </AtBadge>
                    }
                    renderDesc={
                      <View
                        className='pet-message-consultationsItem-info'
                      >
                        <View
                          className={cns(
                            'pet-message-consultationsItem-info-content'
                          )}
                        >
                          <Text
                            className={cns(
                              'pet-message-consultationsItem-info-content-title'
                            )}
                          >
                            {
                              consultationItem['problemContent']
                            }
                          </Text>
                        </View>
                      </View>
                    }
                    renderExtra={
                      <View
                        className={cns(
                          'pet-message-consultationsItem-info-extra'
                        )}
                      >
                        <View
                          className={cns(
                            'pet-message-consultationsItem-info-extra-time'
                          )}
                        >
                          {
                            moment(consultationItem['createTime']).format('YYYY-MM-DD HH:mm')
                          }
                        </View>
                        <View>
                          <AtTag
                            size='small'
                            className={cns(
                              'pet-message-consultationsItem-info-extra-tag',
                              constants.cnsltState[consultationItem['cnsltState']]['className']
                            )}
                          >
                            {constants.cnsltState[consultationItem['cnsltState']]['txt']}
                          </AtTag>
                        </View>
                      </View>
                    }
                  />
                </AtSwipeAction>
              )
            }) : <View className='pet-message-empty'>
              <AtIcon
                className='pet-message-empty-icon'
                prefixClass='iconfont'
                value='petPlanet-cat-ao'
                color='#000'
                size={48}
              />
              <View className='pet-message-empty-title'>
                宠物问题，专业咨询
              </View>
              <View className='pet-message-empty-description'>
                啊哦~您还没有任何宠物问题的咨询
              </View>
              <AtButton
                className='pet-message-empty-button'
                size='small'
                onClick={onDirectToMedicalAdvicePage}
              >
                点击进行问诊咨询
              </AtButton>
            </View>
          }
          {
            isShowLoad ? <AtLoadMore
              className='pet-message-loadMore'
              status={loadStatus}
            >
            </AtLoadMore> : <View className='pet-message-block'>
            </View>
          }
        </ScrollView>
      </Block>
    );
  };
}

export default Message;


