import Taro, {Component} from '@tarojs/taro';
import {connect} from '@tarojs/redux';
import {
  Image,
  ScrollView,
  Text,
  View
} from '@tarojs/components';
import {
  AtAvatar,
  AtButton,
  AtIcon,
  AtImagePicker,
  AtInput,
  AtMessage
} from 'taro-ui';
import cns from 'classnames';
import moment from 'moment';

import communicationsAPI from './communications_service';
import Tools from '../../../../utils/petPlanetTools';
import {
  LoadingView,
  PanelView,
  GoodsRecommendView
} from '../../../../components/bussiness-components';
import * as constants from './constants';
import {pageCurrentList, loadingStatus} from '../../../../constants';
import {imgs} from '../../../../assets';
import {setCommunicationsAttrValue} from './communications_action';

import 'taro-ui/dist/style/components/avatar.scss';
import 'taro-ui/dist/style/components/button.scss';
import 'taro-ui/dist/style/components/image-picker.scss';
import 'taro-ui/dist/style/components/input.scss';
import 'taro-ui/dist/style/components/message.scss';
import 'taro-ui/dist/style/components/flex.scss';
import 'taro-ui/dist/style/components/activity-indicator.scss';
import 'taro-ui/dist/style/components/loading.scss';
import 'taro-ui/dist/style/components/icon.scss';

import '../../../commons/iconfont/iconfont.less';
import './index.less';
import './loading-view.less';

Tools.getMomentConfig(moment);

@connect((state, ownProps) => {
  return {
    communicationsStore: state.communicationsStore
  };
}, (dispatch, ownProps) => {
  return {
    //多层对象处理方法
    setAttrValueHandler(payload) {
      dispatch(setCommunicationsAttrValue(payload));
    }
  };
})
class Communications extends Component {
  static options = {
    addGlobalClass: true
  };

  config = {
    navigationBarTitleText: '对话记录'
  };

  constructor(props) {
    super(props);
    //是否继续请求下一页的数据
    this.isPageNext = true
  }


  state = {
    //上传图片时,最多可上传图片的数量
    count: 3,
    //回复的消息类型
    msgType: constants.msgType.TEXT,
    //对话记录列表当前所在页数
    pageNum: 1,
    //对话记录列表每页显示的条数
    pageSize: 30,
    //对话记录列表总共条数
    total: 0,
    //输入框当前值
    communicationsValue: '',
    //是否输入咨询框聚焦
    isFocus: false,
    //是否存在弹出面板浮层
    isPanel: false,
    //面板浮层高度
    panelHeight: 0,
    //获取手机键盘的高度转变为输入框底部的距离
    inputDistanceBoard: 0,
    //对话记录列表
    communicationsList: [],
    //对话记录列表里面的图片列表
    imgList: [],
    //对话记录针对的问题
    communicationsOS: {},
    //滚动条滚动顶部的距离
    scrollTop: 0,
    //是否显示正在加载loading页面......
    loading: false
  };

  componentDidMount() {
    communicationsAPI.getCommunicationsList.call(this);
  }

  componentDidShow() {
    const {
      communicationsStore: {isTinyGoods = false, goodsId = 0}, setAttrValueHandler = () => {
      }
    } = this.props;
    if (isTinyGoods) {
      this.setState({
        loading: true,
        communicationsValue: goodsId,
        msgType: constants.msgType.TINY_GOODS_DETAIL
      }, () => {
        communicationsAPI.postConsultMessage.call(this);
        setAttrValueHandler({
          isTinyGoods: false
        });
      });
    }
  }

  componentWillUnmount() {
    this.setState({
      communicationsValue: '',
      communicationsList: [],
      pageNum: 1,
      pageSize: 10,
    });
  }

  /**
   * 输入框值改变时触发的事件
   * @param val
   */
  onChangeValueHandler = (val) => {
    val = val.target ? val.target.value : val;
    this.setState({
      communicationsValue: val
    });
  };

  /**
   * 输入框聚焦时触发
   * @尹文楷
   */
  onFocusHandler = (value) => {
    this.setState({
      isFocus: true,
      isPanel: false,
      msgType: constants.msgType.TEXT
    });
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
   * 输入框失焦时触发
   * @尹文楷
   */
  onBlurHandler = (event) => {
    const {isPanel} = this.state;
    let new_state = Object.assign({}, {isFocus: false}, isPanel ? {} : {inputDistanceBoard: 0});
    this.setState(new_state);
  };

  /**
   * 校验咨询的内容
   */
  verifyPostMessage = () => {
    const {communicationsValue} = this.state;
    return Tools.addRules([
      communicationsValue
    ], [{
      rule: 'isEmpty',
      errMsg: constants.verify.isEmpty
    }]).execute();
  };

  /**
   * 输入进行咨询
   * @尹文楷
   */
  onPostMessageHandler = () => {
    const {verifyPostMessage} = this;
    if (verifyPostMessage()) {
      this.setState({
        loading: true
      });
      communicationsAPI.postConsultMessage.call(this);
    }
  };

  /**
   * 点击图片放大查看
   */
  onImagePreviewHandler = index => {
    const {communicationsOS} = this.state;
    let {imgs = []} = communicationsOS;
    imgs = Tools.previewImageOperation(imgs);
    Tools.previewImageConfig({
      current: imgs[index],
      urls: imgs,
      success: (res) => {
        console.log(res);
      },
      fail: (res) => {
        console.log(res);
      },
      complete: (res) => {
        console.log(res);
      }
    });
  };

  /**
   * 当scrollview区域滚动至底部还剩5%时,触发分页
   */
  onCommunicationScrollHandler = ({detail: {scrollTop = 0, scrollHeight = 0}}) => {
    const {isPageNext} = this;
    const that = this;
    Taro.createSelectorQuery().select('#pet-communications-scrollView').fields({
      size: true
    }, res => {
      const {height} = res;
      if (((scrollHeight - scrollTop - height) / scrollHeight < .05) && isPageNext) {
        this.isPageNext = false;
        Tools.run(function* () {
          yield communicationsAPI.getCommunicationsPaginationList.call(that);
        });
      }
    }).exec();
  };

  /**
   * 获取更多的功能(发送图片以及商品详情链接等等)
   */
  onGetMoreFuncHandler = () => {
    const {isPanel = false} = this.state;
    this.setState({
      inputDistanceBoard: !isPanel ? 180 : 0,
      isPanel: !isPanel
    });
  };

  /**
   * 将面板隐藏
   */
  onPanelHide = (e = {}) => {
    this.setState({
      isPanel: false,
      isFocus: false,
      inputDistanceBoard: 0
    });
    //取消冒泡事件
    e.stopPropagation && e.stopPropagation();
  };

  /**
   * 在新页面中全屏预览图片。预览的过程中用户可以进行保存图片、发送给朋友等操作。
   * @param e
   * @param value
   */
  onPreviewImage = (e, value) => {
    const {imgList = []} = this.state;
    Tools.previewImageConfig({
      urls: imgList,
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
   * 显示内容
   */
  renderShowContent = (msgType = '', item = {}) => {
    const {
      onPreviewImage = () => {
      }
    } = this;
    const {data = {}} = item;
    switch (msgType) {
      case constants.msgType.TEXT: {
        return <Text selectable>
          {item.content}
        </Text>;
      }
      case constants.msgType.IMG: {
        return <Image
          className='pet-communications-item-content-image'
          src={item.content}
          alt={item.content}
          mode='widthFix'
          onClick={(e) => onPreviewImage(e, item.content)}
        />;
      }
      case constants.msgType.TINY_GOODS_DETAIL: {
        return <GoodsRecommendView
          dataId={data.goodsId}
          coverPic={data.coverPic}
          name={data.goodsName}
          price={data.floorPrice}
          discPrice={data.floorDiscPrice}
        />;
      }
    }
  };

  render() {
    const {
      communicationsValue = '',
      isFocus = false,
      communicationsList = [],
      communicationsOS = {},
      inputDistanceBoard = 0,
      scrollTop = 0,
      loading = false,
      isPanel = false
    } = this.state;
    const {
      onChangeValueHandler = () => {
      },
      onFocusHandler = () => {
      },
      onBlurHandler = () => {
      },
      onPostMessageHandler = () => {
      },
      onImagePreviewHandler = () => {
      },
      onKeyboardChangeHandler = () => {
      },
      onCommunicationScrollHandler = () => {
      },
      onGetMoreFuncHandler = () => {
      },
      onPanelHide = () => {
      }
    } = this;
    let showImgs = [];
    const {imgs: osImg} = communicationsOS;
    const {communicationsFunc} = constants;
    if (osImg) {
      showImgs = osImg.map(item => {
        return {
          url: item
        };
      });
    }
    return (
      <View className='pet-communications'>
        <AtMessage/>
        {
          loading && <LoadingView
            size={56}
            color='#fb2a5d'
            className='pet-communications-loading'
            content={loadingStatus.progress.text}
          />
        }
        <ScrollView className='pet-communications-scrollView'
                    id='pet-communications-scrollView'
                    onScroll={onCommunicationScrollHandler}
                    onClick={onPanelHide}
                    scrollTop={scrollTop}
                    scrollY
        >
          <View id='pet-communications-oq'>
            <View className='pet-communications-container'>
              <View className='pet-communications-os'>
                <AtAvatar
                  className='pet-communications-os-avatar'
                  circle
                  size='large'
                  image={communicationsOS['cnsltAvatarUrl']}
                />
                <View
                  className='pet-communications-os-content'
                >
                  <View
                    className='pet-communications-os-content-username'
                  >
                    <Text
                      decode
                    >
                      {communicationsOS['cnsltUsername']}
                    </Text>
                  </View>
                  <Text
                    className='pet-communications-os-content-time'
                  >
                    {moment(communicationsOS['createTime']).fromNow()}
                  </Text>
                  <Text
                    className='pet-communications-os-content-master'
                  >
                    咨询提问
                  </Text>
                </View>
              </View>
              <View
                className='pet-communications-qs'
              >
                <Text className='pet-communications-qs-content'
                      selectable
                >
                  {communicationsOS['problemContent']}
                </Text>
                <View className='pet-communications-qs-imgArea'>
                  {
                    osImg && osImg.length > 0 ? (osImg.length > 1 ? <AtImagePicker
                      className='pet-communications-qs-imgArea-multiple'
                      length={3}
                      showAddBtn={false}
                      onImageClick={onImagePreviewHandler}
                      files={showImgs}
                    /> : <Image className='pet-communications-qs-imgArea-single'
                                mode='widthFix'
                                src={osImg[0]}
                                onClick={(e) => {
                                  onImagePreviewHandler(0);
                                  e.stopPropagation();
                                }}
                    />) : null
                  }
                </View>
              </View>
            </View>
            <View
              className='pet-communications-qsContainer'
            >
              {
                communicationsList && communicationsList.length > 0 && communicationsList.map((communicationItem, communicationIndex) => {
                  return (
                    <View
                      key={`${communicationItem['id']}`}
                      className='pet-communications-item'
                    >
                      <AtAvatar
                        className='pet-communications-item-avatar'
                        circle
                        size='normal'
                        image={communicationItem['avatarFrom']}
                      />
                      <View
                        className='pet-communications-item-content'
                      >
                        <View
                          className='pet-communications-item-content-username'
                        >
                          <Text
                            decode
                          >
                            {communicationItem['nicknameFrom']}
                          </Text>
                        </View>
                        <View
                          className='pet-communications-item-content-time'
                        >
                          <Text
                            decode
                          >
                            {moment(communicationItem['createTime']).fromNow()}
                          </Text>
                        </View>
                        <View
                          className={cns('pet-communications-item-content-txt',
                            {
                              'grey': communicationItem['owner']
                            }
                          )}
                        >
                          {this.renderShowContent(communicationItem['msgType'], communicationItem)}
                        </View>
                      </View>
                    </View>
                  );
                })
              }
            </View>
          </View>
        </ScrollView>
        <View
          className={cns('at-row',
            'at-row--no-wrap',
            'pet-communications-communicationsBar')
          }
          style={{bottom: `${inputDistanceBoard}px`}}
        >
          <View className={cns('at-col-10',
            'pet-communications-communicationsBar-input')
          }>
            <AtInput
              type='text'
              maxLength={100}
              className={cns(
                'pet-communications-communicationsBar-communicationsValue',
                {'pet-communications-communicationsBar-communicationsValue-focus': !!isFocus}
              )}
              placeholder={constants.communicationsBar.input.placeholder}
              adjustPosition={false}
              value={communicationsValue}
              onChange={onChangeValueHandler}
              onFocus={onFocusHandler}
              onKeyboardHeightChange={onKeyboardChangeHandler}
              onBlur={onBlurHandler}
              onConfirm={onPostMessageHandler}
            >
              <Image
                src={imgs.addMoreFunc}
                mode='widthFix'
                className='pet-communications-communicationsBar-addFunc'
                onClick={onGetMoreFuncHandler}
              />
            </AtInput>
          </View>
          <View className={cns('at-col-2',
            'pet-communications-communicationsBar-post'
          )}>
            {/*按钮发布区域: 使用formId进行发起一次有formId的模板消息请求*/}
            <AtButton
              size='small'
              className='pet-communications-communicationsBar-post-button'
              onClick={onPostMessageHandler}
            >
              发送
            </AtButton>
          </View>
        </View>
        <PanelView
          className='pet-communications-panel'
          isPanel={isPanel}
        >
          <View className='pet-communications-panel-func'>
            {
              communicationsFunc && communicationsFunc.length > 0 && communicationsFunc.map(item => {
                return <View
                  key={item.id}
                  className='pet-communications-panel-func-item'
                  onClick={(e) => item.onClick.call(this, e)}
                >
                  <AtIcon
                    prefixClass='iconfont'
                    value={item.icon}
                    color='#666'
                    size={item.size}
                  />
                  <View className={cns(
                    'pet-communications-panel-func-item-content',
                    item.className || ''
                  )}>
                    {item.text}
                  </View>
                </View>
              })
            }
          </View>
        </PanelView>
      </View>
    );
  }
}

export default Communications;
