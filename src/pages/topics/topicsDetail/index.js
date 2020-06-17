import Taro, {Component} from '@tarojs/taro';
import {connect} from '@tarojs/redux';
import {
  Block,
  View,
  ScrollView,
  Text,
  Image,
  Input
} from '@tarojs/components';
import {
  AtAvatar,
  AtButton,
  AtIcon,
  AtImagePicker,
  AtInput,
  AtMessage
} from 'taro-ui';
import moment from 'moment';
import cns from 'classnames';
import {
  NavBarDetailView
} from '../../../components/bussiness-components';
import topicsAPI from '../topics_service';
import {setTopicsAttrValue} from '../topics_action';
import {setFindTopicsAttrValue} from '../findTopics/findTopics_action';
import Tools from '../../../utils/petPlanetTools';
import {pageCurrentList} from '../../../constants';
import {verify} from './constants';
import {imgs} from '../../../assets';

import 'taro-ui/dist/style/components/avatar.scss';
import 'taro-ui/dist/style/components/button.scss';
import 'taro-ui/dist/style/components/flex.scss';
import 'taro-ui/dist/style/components/image-picker.scss';
import 'taro-ui/dist/style/components/input.scss';
import 'taro-ui/dist/style/components/icon.scss';
import 'taro-ui/dist/style/components/message.scss';

import '../../commons/iconfont/iconfont.less';
import './index.less';

Tools.getMomentConfig(moment);

@connect((state, ownProps) => {
  return {
    topicsStore: state.topicsStore,
    findTopicsStore: state.findTopicsStore
  };
}, (dispatch, ownProps) => {
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
  };
})
class TopicsDetail extends Component {
  constructor(props) {
    super(props);
    //是否可以请求下一页的评论
    this.isNext = false;
  }

  static options = {
    addGlobalClass: true
  };

  config = {
    navigationStyle: 'custom'
  };

  state = {
    //内容社区列表某条posts的id
    id: 0,
    //内容社区列表详情的话题
    topic: null,
    //内容社区列表详情
    topicDetail: null,
    //评论的页码
    pageNum: 1,
    //评论的页内容数
    pageSize: 10,
    //评论列表的总数
    commentsTotal: 0,
    //评论列表
    commentsList: [],
    //获取手机键盘的高度转变为输入框底部的距离
    inputDistanceBoard: 0,
    //是否输入咨询框聚焦
    isFocus: false,
    //滚动距离顶部的距离
    scrollPositionTop: 0,
    //对于某条posts的喜欢数
    like: 0,
    //对于某条posts本用户是否喜欢
    liked: false,
    //对于某条posts的评论数
    comment: 0,
    //用户的昵称
    nickName: null,
    //用户的头像
    avatarUrl: null,
    //用户进行评论的内容
    commentValue: null,
    //对评论进行自己的回复
    parentCommentId: 0,
    //设置scrollView要滚动的位置
    scrollTop: {
      height: 0
    }
  };

  /**
   * 开始挂载的时候将id赋状态值
   */
  componentWillMount() {
    const {params: {id = 0, topic = null, like = 0, comment = 0, liked = false}} = this.$router;
    this.setState({
      id,
      topic,
      like,
      liked,
      comment
    });
  }

  /**
   * 挂载完成之后进行请求数据
   */
  componentDidMount() {
    topicsAPI.getFlowPostsDetail.call(this);
    topicsAPI.getTinyHomeInfo.call(this);
  }

  componentDidShow() {
    Taro.showShareMenu({
      withShareTicket: false
    });
    // Taro.onKeyboardHeightChange(res => {
    //   console.log(res);
    // });
    topicsAPI.getTinyHomeInfo.call(this);
  }

  /**
   * 触底请求下一页的数据
   */
  onScrollHandler = (event) => {
    const {detail: {scrollHeight = 0, scrollTop = 0}} = event || {};
    const {commentsList: {length = 0}, commentsTotal} = this.state;
    //函数防抖,来放置scrollTop距离顶端的长度
    // Tools.debounce(() => {
    //   this.setState({
    //     scrollTop: {
    //       height: scrollTop
    //     }
    //   // });
    // }, 2000);
    this.setState({
      scrollPositionTop: scrollTop
    });
    Taro.createSelectorQuery().select('#pet-topic-detail').fields({
      size: true
    }, res => {
      const {height = 0} = res;
      if (((scrollHeight - scrollTop - height) / scrollHeight < 0.1) && length < commentsTotal && !this.isNext) {
        this.isNext = true;
        topicsAPI.getFlowPostsDetailComments.call(this);
      }
    }).exec();
  };

  componentWillUnmount() {
    this.setState({
      isFocus: false,
      inputDistanceBoard: 0
    });
  }

  /**
   * 当评论输入框获得焦点时,判断是否授权,进行授权处理,然后进行拉起输入框,进行输入发送评论
   */
  onFocusHandler = async (value) => {
    const {id, topic, like, comment} = this.state;
    this.setState({
      isFocus: true
    });
    let {authSetting} = await Tools.getSettingConfig({
      success: (authSetting) => {
        return authSetting;
      },
      fail: (res) => {
        return res;
      },
      complete: (res) => {
        return res;
      }
    });
    if (!authSetting['scope.userInfo']) {
      this.setState({
        isFocus: false,
        inputDistanceBoard: 0
      });
      Taro.navigateTo({
        url: `${pageCurrentList[20]}?pages=topicsDetail&id=${id}&topic=${topic}&like=${like}&comment=${comment}`
      });
    }
  };

  /**
   * 监听键盘高度发生变化的时候触发此事件
   */
  onKeyboardChangeHandler = (event = {}) => {
    const {currentTarget: {height = 0}} = event || {};
    this.setState({
      inputDistanceBoard: height
    });
  };

  /**
   * 当评论输入框失去焦点时,撤回输入框
   */
  onOutBlurHandler = () => {
    this.setState({
      isFocus: false,
      inputDistanceBoard: 0,
      parentCommentId: 0
    });
  };

  /**
   * 改变评论输入框中的内容
   */
  onChangeHandler = (value, event) => {
    let val = value.target ? value.target.value : value;
    this.setState({
      commentValue: val
    });
  };

  /**
   * 校验评论内容
   */
  verify = () => {
    const {commentValue} = this.state;
    return Tools.addRules(commentValue, [{
      rule: 'isEmpty',
      errMsg: verify.isEmpty
    }]).execute();
  };

  /**
   * 进行评论
   */
  flowPostComment = (event) => {
    const {verify} = this;
    //取消冒泡事件
    event.stopPropagation();
    if (verify()) {
      topicsAPI.flowPostCommentRequest.call(this);
    }
  };

  onShareAppMessage(res) {
    const {id = 0, topic = null, like = true, liked = 0, comment = 0, topicDetail = {}} = this.state;
    const {imgList, content} = topicDetail;
    return {
      title: content,
      path: Tools.modelStrCutNull`${pageCurrentList[19]}?id=${id}&topic=${topic}&like=${like}&comment=${comment}&liked=${liked}`,
      imageUrl: imgList[0]
    };
  };

  /**
   * 点击(不)喜欢某条Post
   */
  onTopicLikeHandler = (e) => {
    //取消冒泡事件
    e.stopPropagation();
    topicsAPI.flowPostsTopicsDetailLike.call(this);
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

  /**
   * 点击评论标识区域,滑动到评论部分
   */
  onTopicCommentHandler = (e) => {
    //取消冒泡事件
    e.stopPropagation();
    const {scrollPositionTop} = this.state;
    const {navBarPaddingTop} = Tools.adaptationNavBar();
    Taro.createSelectorQuery().select('#pet-topic-detail-content').fields({
      size: true
    }, res => {
      const {height} = res;
      //todo 此处可以优化
      this.setState({
        scrollTop: {
          height: (scrollPositionTop - 1)
        }
      }, () => {
        this.setState({
          scrollTop: {
            height: height - navBarPaddingTop
          }
        });
      });
    }).exec();
  };

  /**
   * 点击评论部分的评论图标,进行聚焦
   * @param e
   */
  onCommentFocus = (e) => {
    const {currentTarget: {dataset: {item}}} = e;
    const {id} = JSON.parse(item) || {};
    const {scrollPositionTop} = this.state;
    const {navBarPaddingTop} = Tools.adaptationNavBar();
    this.setState({
      isFocus: true,
      parentCommentId: Number(id)
    });
    Taro.createSelectorQuery()
      .selectAll('.pet-topic-detail-comments-content-item-view-extra')
      .boundingClientRect(rect => {
        const current = rect.find((item, _index) => item.dataset.id === Number(id));
        const {top} = current || {};
        this.setState({
          scrollTop: {
            height: (scrollPositionTop - 1)
          }
        }, () => {
          this.setState({
            scrollTop: {
              height: (top + scrollPositionTop) - (navBarPaddingTop + 40)
            }
          });
        });
      }).exec();
  };

  /**
   * 点击查看更多回复跳转至'更多回复页面'
   */
  onDirectToFlowCommentHandler = (e) => {
    const {id: _id} = this.state;
    const {currentTarget: {dataset: {id}}} = e;
    Taro.navigateTo({
      url: `${pageCurrentList[21]}?id=${id}&postId=${_id}`
    });
  };

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
      topicDetail = '',
      topic = '',
      commentsList = [],
      inputDistanceBoard = 0,
      isFocus = false,
      like = 0,
      liked = false,
      comment = 0,
      avatarUrl: _avatarUrl = '',
      commentValue = '',
      scrollTop = 0
    } = this.state;
    const {
      showImageDetail = () => {
      },
      onFocusHandler = () => {
      },
      onChangeHandler = () => {
      },
      flowPostComment = () => {
      },
      onScrollHandler = () => {
      },
      onTopicLikeHandler = () => {
      },
      onRedirectToBackPage = () => {
      },
      onTopicCommentHandler = () => {
      },
      onCommentFocus = () => {
      },
      onOutBlurHandler = () => {
      },
      onKeyboardChangeHandler = () => {
      },
      onDirectToFlowCommentHandler = () => {
      }
    } = this;
    const {avatarUrl, nickName, content, imgList = [], commentTotal} = topicDetail || {};
    const {navBarHeight = 0, statusBarClassName = ''} = Tools.adaptationNavBar();
    const imgTransformList = imgList.map(item => {
      return {
        url: item
      };
    });
    return (
      <View
        className='pet-topic-detail'
      >
        <AtMessage
          className={statusBarClassName}
        />
        <NavBarDetailView
          className='pet-topic-detail-information'
          avatar={avatarUrl}
          nickName={nickName}
          onClickLeftIcon={onRedirectToBackPage}
          onClick={onOutBlurHandler}
        />
        <ScrollView
          id='pet-topic-detail'
          onScroll={onScrollHandler}
          scrollY
          className='pet-topic-detail-scroll'
          scrollTop={scrollTop ? scrollTop.height : 0}
          onClick={onOutBlurHandler}
        >
          <View
            id='pet-topic-detail-content'
            className='pet-topic-detail-content'
            style={{paddingTop: `${navBarHeight}rpx`}}
          >
            <Text
              className='pet-topic-detail-content-main'
              selectable
            >
              {content}
            </Text>
            <View className='pet-topic-detail-content-imageList'>
              {
                imgList && imgList.length > 0 && (imgList.length > 1 ? <View
                  className='pet-topic-detail-content-imageItem'
                >
                  <AtImagePicker
                    files={imgTransformList}
                    length={3}
                    showAddBtn={false}
                    onImageClick={(index, file) => showImageDetail(index, file, imgList)}
                  />
                </View> : <Image src={imgList[0]}
                                 mode='widthFix'
                                 onClick={() => showImageDetail(0, imgList[0], imgList)}
                >

                </Image>)
              }
            </View>
            {
              topic && <View className='pet-topic-detail-content-topics'>
                <Text className='pet-topic-detail-content-tag'
                      selectable
                >
                  #{topic}
                </Text>
              </View>
            }
            <View className='pet-topic-detail-content-share'>
              分享到
              <AtButton
                openType='share'
                className='pet-topic-detail-content-share-button'
              >
                <Image src='https://prod-pet.oss.1jtec.com/icon/wechat.png'
                       mode='aspectFill'
                >

                </Image>
              </AtButton>
            </View>
          </View>
          <View className='pet-topic-detail-comments'>
            <View className='pet-topic-detail-comments-header'>
              共 {commentTotal} 条评论
            </View>
            <View className='pet-topic-detail-comments-content'>
              {
                commentsList && commentsList.length > 0 && commentsList.map(commentItem => {
                  const subComments = commentItem['subComments'] && commentItem['subComments'].length > 0 ?
                    commentItem['subComments'].slice(0, 3) : [];
                  return (
                    <View
                      key={String(commentItem['id'])}
                      className='pet-topic-detail-comments-content-item'
                    >
                      <AtAvatar
                        circle
                        image={commentItem['avatarFrom']}
                        className='pet-topic-detail-comments-content-item-avatar'
                      />
                      <View className='pet-topic-detail-comments-content-item-view'>
                        <View className='pet-topic-detail-comments-content-item-view-nickName'>
                          {commentItem['nickNameFrom']}
                        </View>
                        <View className='pet-topic-detail-comments-content-item-view-time'>
                          {moment(commentItem['createTime']).format('YYYY-MM-DD HH:mm')}
                        </View>
                        <Text className='pet-topic-detail-comments-content-item-view-main'
                              selectable
                        >
                          {commentItem['content']}
                        </Text>
                        {
                          subComments.length > 0 &&
                          <View className='pet-topic-detail-comments-content-item-view-subComments'>
                            {
                              subComments.map(item => {
                                return (
                                  <View className='pet-topic-detail-subComments'
                                        key={String(item['id'])}
                                  >
                                    <AtAvatar
                                      circle
                                      image={item['avatarFrom']}
                                      className='pet-topic-detail-subComments-avatar'
                                    />
                                    <View className='pet-topic-detail-subComments-content'>
                                      <View className='pet-topic-detail-subComments-content-title'>
                                        <Text>{item['nickNameFrom']}</Text> 回复 <Text>{commentItem['nickNameFrom']}</Text>
                                      </View>
                                      <Text className='pet-topic-detail-subComments-content-info'
                                            selectable
                                      >
                                        {item['content']}
                                      </Text>
                                    </View>
                                  </View>
                                )
                              })
                            }
                            {
                              commentItem['moreSubComments'] && <View className='pet-topic-detail-subComments-more'
                                                                      data-id={commentItem['id']}
                                                                      onClick={onDirectToFlowCommentHandler}
                              >
                                查看更多回复...
                              </View>
                            }
                          </View>
                        }
                        <View className='pet-topic-detail-comments-content-item-view-extra'
                              data-id={commentItem['id']}
                        >
                          <View onClick={(e) => {
                            e.stopPropagation();
                          }}>
                            <View
                              data-item={JSON.stringify(commentItem)}
                              onClick={onCommentFocus}
                            >
                              <Image src={imgs.topic_message}
                                     mode='widthFix'
                              >

                              </Image>
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  )
                })
              }
            </View>
          </View>
        </ScrollView>
        <View className={cns('at-row',
          'at-row--no-wrap',
          'pet-topic-detail-topicBar'
        )}
              style={{bottom: `${inputDistanceBoard}px`}}
        >
          <View className={cns('at-col-2',
            'pet-topic-detail-topicBar-avatar'
          )} onClick={onOutBlurHandler}>
            <AtAvatar
              image={_avatarUrl}
              circle
              size='small'
            />
          </View>
          <View className={cns(
            {
              'at-col-4': !isFocus
            },
            {
              'at-col-8': isFocus
            },
            'pet-topic-detail-topicBar-input'
          )}>
            <Input
              type='text'
              focus={isFocus}
              value={commentValue}
              maxLength={100}
              className='pet-topic-detail-topicBar-topicValue'
              confirmType='发送'
              placeholder='说点什么吧...'
              adjustPosition={false}
              holdKeyboard={true}
              onFocus={onFocusHandler}
              onBlur={onOutBlurHandler}
              onKeyboardHeightChange={onKeyboardChangeHandler}
              onInput={onChangeHandler}
            />
          </View>
          <View className={
            cns(
              {
                'at-col-6': !isFocus
              },
              {
                'at-col-2': isFocus
              },
              'pet-topic-detail-topicBar-operation'
            )
          }>
            {
              isFocus ? <View
                className='pet-topic-detail-topicBar-send'
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <AtButton
                  size='small'
                  className='pet-topic-detail-topicBar-button'
                  onClick={flowPostComment}
                >
                  发送
                </AtButton>
              </View> : <Block>
                <View
                  className='pet-topic-detail-topicBar-operation-like'
                  onClick={onTopicLikeHandler}
                >
                  {
                    JSON.parse(liked) ? <AtIcon
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
                  <Text style={JSON.parse(liked) ? {color: '#F93B5F', fontWeight: 'bolder'} : {}}>
                    {like}
                  </Text>
                </View>
                <View
                  className='pet-topic-detail-topicBar-operation-comment'
                  onClick={onTopicCommentHandler}
                >
                  <Image src={imgs.topic_message}
                         mode='widthFix'
                  >

                  </Image>
                  {comment}
                </View>
              </Block>
            }
          </View>
        </View>
      </View>
    );
  }
}

export default TopicsDetail;
