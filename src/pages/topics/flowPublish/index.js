import Taro, {Component} from '@tarojs/taro';
import {
  Block,
  Image,
  View
} from '@tarojs/components';
import {
  AtIcon,
  AtTextarea,
  AtImagePicker,
  AtButton,
  AtMessage
} from 'taro-ui';
import {connect} from '@tarojs/redux';
import mta from 'mta-wechat-analysis';
import cns from 'classnames';
import {pageCurrentList, loadingStatus} from '../../../constants';
import {
  LoadingView,
  ModalView
} from '../../../components/bussiness-components';
import Tools from '../../../utils/petPlanetTools';
import topicsAPI from '../topics_service';
import * as constants from './constants';
import {maxFileSize} from '../../../utils/petPlanetTools/constants';
import {setFlowTopicAttrValue} from './flowTopics/flowTopics_action';

import 'taro-ui/dist/style/components/button.scss';
import 'taro-ui/dist/style/components/activity-indicator.scss';
import 'taro-ui/dist/style/components/loading.scss';
import 'taro-ui/dist/style/components/flex.scss';
import 'taro-ui/dist/style/components/image-picker.scss';
import 'taro-ui/dist/style/components/textarea.scss';
import 'taro-ui/dist/style/components/icon.scss';
import 'taro-ui/dist/style/components/modal.scss';
import 'taro-ui/dist/style/components/message.scss';

import '../../commons/iconfont/iconfont.less';
import './index.less';
import './loading-view.less';
import './modal-view.less';


@connect((state) => {
  return {
    flowTopicStore: state.flowTopicStore
  };
}, (dispatch) => {
  return {
    /**
     * 保存选中的话题对象
     * @param payload
     */
    setFlowTopicAttrValueHandler: payload => {
      dispatch(setFlowTopicAttrValue(payload));
    }
  };
})

class FlowPublish extends Component {
  static options = {
    addGlobalClass: true
  };

  config = {
    navigationBarTitleText: '发布'
  };

  constructor(props) {
    super(props);
    //能够上传图片数量的最大值
    this.count = 9;
  }

  state = {
    //是否显示添加图片按钮
    showAddBtn: true,
    //动态的可添加的图片的数量
    moveCount: 9,
    //上传图片是否存在loading
    uploadLoading: false,
    //用来提示用户需要审核才能发布
    reviewModal: false,
    //用于对于发现动态的描述
    content: null,
    //用于上传动态的图片
    files: [],
    //用于上传的图片
    images: []
  };

  componentWillMount() {
    const {params: {topic, img}} = this.$router;
    const {setFlowTopicAttrValueHandler} = this.props;
    topic && setFlowTopicAttrValueHandler({
      topic: {
        topic,
        img
      }
    });
    mta.Page.init();
  }

  /**
   * 组件在挂载时,要执行的任务
   */
  componentDidMount() {
  }

  /**
   * 在显示此发布路由页面时进行的操作
   * @returns {Promise<void>}
   */
  componentDidShow() {

  }

  componentWillUnmount() {
    const {setFlowTopicAttrValueHandler} = this.props;
    setFlowTopicAttrValueHandler({
      topic: null
    });
  }

  /**
   * 改变输入框的内容
   * @尹文楷
   * @returns {Promise<void>}
   */
  onTextChangeHandler = (key, event) => {
    let value;
    value = Object.prototype.toString.call(event) === '[object Object]' ? event.target.value : event;
    this.setState({
      [key]: value
    });
  };

  /**
   * 获取用户信息并发布宠物交易
   */
  onGetUserInfoHandler = async (event) => {
    const {verify} = this;
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
      Taro.navigateTo({
        url: `${pageCurrentList[20]}?pages=flowPublish`
      });
    } else {
      Tools.run(function* () {
        mta.Event.stat('user_authorization', {});
        if (verify()) {
          let publishData = yield topicsAPI.flowPostsPublish.apply(this);
          mta.Event.stat('publish_onPublish', {});
        }
      }.bind(this));
    }
    event.stopPropagation();
  };


  /**
   * 改变图片选择器的内容并上传图片
   * @尹文楷
   * @returns {Promise<void>}
   */
  onImageChangeHandler = (files, operationType, index) => {
    const {count} = this;
    let {files: fileList = [], images = []} = this.state;
    switch (operationType) {
      case 'add':
        this.setState({
          uploadLoading: true
        });
        this.setState({
          files: [],
          images: []
        }, () => {
          const {length} = files;
          for (let [key, value] of files.entries()) {
            const {file: {size}} = value;
            //图片的限制大小
            if (size > maxFileSize) {
              this.setState({
                uploadLoading: false
              });
            }
            topicsAPI.uploadImg.apply(this, [{size, value, key, total: length}]);
          }
        });
        break;
      case 'remove':
        fileList.splice(index, 1);
        images.splice(index, 1);
        const {length: _length} = images;
        this.setState({
          moveCount: count - _length
        });
        if (_length < count) {
          this.setState({
            showAddBtn: true
          });
        }
        this.setState({
          files: fileList,
          images
        });
        break;
      default:
        break;
    }
  };

  /**
   * 用于表单校验的规则函数
   * @尹文楷
   * @returns {Promise<void>}
   */
  verify = () => {
    const {content, images} = this.state;
    return Tools.addRules([
      content,
      images
    ], [{
      rule: 'isEmpty',
      errMsg: constants['verify']['isEmpty']
    }]).execute();
  };

  /**
   * 跳转到发现页面
   * @尹文楷
   */
  redirectToPreviousPage = () => {
    this.setState({
      reviewModal: false
    }, () => {
      Taro.reLaunch({
        url: pageCurrentList[0]
      });
    });
  };

  /**
   * 点击图片放大查看
   */
  onImagePreviewHandler = index => {
    const {files: fileList = []} = this.state;
    const previewImageFileList = fileList.map(item => {
      return item['url'];
    });
    Tools.previewImageConfig({
      current: previewImageFileList[index],
      urls: previewImageFileList,
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
   * 跳转到发现页面
   * @尹文楷
   */
  redirectToFlowTopicPage = (e) => {
    //取消冒泡
    e.stopPropagation();
    Taro.navigateTo({
      url: pageCurrentList[18]
    });
  };

  render() {
    const {
      onGetUserInfoHandler,
      onTextChangeHandler,
      onImageChangeHandler,
      redirectToPreviousPage,
      redirectToFlowTopicPage,
      onImagePreviewHandler
    } = this;
    const {
      showAddBtn,
      moveCount,
      uploadLoading,
      files,
      content,
      reviewModal
    } = this.state;
    const {flowTopicStore: {topic = {}}} = this.props;
    return (
      <Block>
        {
          uploadLoading && <LoadingView
            size={56}
            color='#fb2a5d'
            className='pet-flowPublish-loading'
            content={loadingStatus.upload.text}
          />
        }
        <View
          className='pet-flowPublish'
        >
          <AtMessage/>
          <View className='pet-flowPublish-publish'>
            <View className='pet-flowPublish-publish-content'>
              <View className='pet-flowPublish-publish-content-top'>
                <AtTextarea
                  count={false}
                  textOverflowForbidden={false}
                  height={520}
                  value={content || ''}
                  placeholderStyle='font-size:17PX;font-weight:400;color:#999;'
                  onChange={(e) => {
                    onTextChangeHandler('content', e);
                  }}
                  placeholder={constants.publish.placeholder.content}
                  className='pet-flowPublish-publish-content-description'
                />
                <AtImagePicker
                  mode='aspectFill'
                  length={4}
                  multiple
                  className='pet-flowPublish-publish-content-images'
                  files={files}
                  count={moveCount}
                  showAddBtn={showAddBtn}
                  onImageClick={onImagePreviewHandler}
                  onChange={onImageChangeHandler}
                />
              </View>
              <View className='pet-flowPublish-publish-content-bottom'>
                <View
                  className={cns('at-row',
                    'at-row--no-wrap',
                    'pet-flowPublish-publish-content-topic'
                  )}
                >
                  <View className={cns('at-col',
                    'at-col-2',
                    'pet-flowPublish-publish-content-topic-title'
                  )}>
                    {constants.publish.label.adoption}
                  </View>
                  <View className={cns('at-col',
                    'at-col-9',
                    'pet-flowPublish-publish-content-topic-content'
                  )}
                        onClick={redirectToFlowTopicPage}
                  >
                    {
                      Tools.isEmpty(topic) ? <Block>
                        #点击选择
                      </Block> : <View className='pet-flowPublish-publish-content-topic-info'>
                        <Image
                          src={topic.img}
                          mode='widthFix'
                        />
                        {topic['topic']}
                      </View>
                    }
                    <View className='pet-flowPublish-publish-content-topic-all'>
                      全部
                      <AtIcon
                        size={16}
                        color='rgb(223,223,223)'
                        className='pet-flowPublish-publish-content-topic-content-icon'
                        prefixClass='iconfont'
                        value='petPlanet-right'
                      />
                    </View>
                  </View>
                </View>
              </View>
              <View className='pet-flowPublish-publish-content-button'>
                <AtButton
                  type='primary'
                  lang='zh-CN'
                  onClick={onGetUserInfoHandler}
                >
                  发布
                </AtButton>
              </View>
              <ModalView
                isOpened={reviewModal}
                title={constants.modal.review.title}
                confirmText={constants.modal.review.confirmText}
                content={constants.modal.review.content}
                onConfirm={redirectToPreviousPage}
                closeOnClickOverlay={false}
              />
            </View>
          </View>
        </View>
      </Block>
    )
  }
}

export default FlowPublish;
