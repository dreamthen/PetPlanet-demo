import Taro, {Component} from '@tarojs/taro';
import {
  Block,
  View
} from '@tarojs/components';
import {
  AtTextarea,
  AtImagePicker,
  AtList,
  AtListItem,
  AtInput,
  AtButton,
  AtMessage,
  AtTag
} from 'taro-ui';
import {connect} from '@tarojs/redux';
import cns from 'classnames';
import mta from 'mta-wechat-analysis';
import {setPublishAttrValue} from './publish_action';
import {pageCurrentList, loadingStatus} from '../../../constants';
import {
  LoadingView,
  ModalView
} from '../../../components/bussiness-components';
import publishAPI from './publish_service';
import Tools from '../../../utils/petPlanetTools';
import * as constants from './constants';
import {maxFileSize} from '../../../utils/petPlanetTools/constants';

import 'taro-ui/dist/style/components/button.scss';
import 'taro-ui/dist/style/components/flex.scss';
import 'taro-ui/dist/style/components/tab-bar.scss';
import 'taro-ui/dist/style/components/textarea.scss';
import 'taro-ui/dist/style/components/image-picker.scss';
import 'taro-ui/dist/style/components/list.scss';
import 'taro-ui/dist/style/components/input.scss';
import 'taro-ui/dist/style/components/modal.scss';
import 'taro-ui/dist/style/components/message.scss';
import 'taro-ui/dist/style/components/activity-indicator.scss';
import 'taro-ui/dist/style/components/loading.scss';
import 'taro-ui/dist/style/components/tag.scss';

import '../../commons/iconfont/iconfont.less';
import './index.less';
import './loading-view.less';
import './modal-view.less';


@connect((state) => {
  return {
    homeStore: state.homeStore,
    publishStore: state.publishStore
  };
}, (dispatch) => {
  return {
    /**
     * 改变图片选择器的内容并上传图片
     * @尹文楷
     * @returns {Promise<void>}
     */
    uploadImgHandler(...params) {
      dispatch(publishAPI.uploadImg.apply(this, params));
    },

    /**
     * 改变redux store里面的数据状态
     * @尹文楷
     */
    setAttrValueHandler(payload) {
      dispatch(setPublishAttrValue(payload));
    },

    /**
     * 获取用户授权设置
     * @尹文楷
     * @returns {Promise<void>}
     */
    async getSettingHandler(scope) {
      await dispatch(publishAPI.getSettingRequest.apply(this, [scope]));
    },

    /**
     * 向用户发起授权请求
     * @尹文楷
     * @returns {Promise<void>}
     */
    async authorizeHandler(scope) {
      await dispatch(publishAPI.authorizeRequest.apply(this, [scope]));
    },

    /**
     * 调起客户端小程序设置界面，返回用户设置的操作结果
     * @尹文楷
     * @returns {Promise<void>}
     */
    openSettingHandler() {
      dispatch(publishAPI.openSettingRequest.apply(this));
    },

    /**
     * 发布宠物交易
     * @尹文楷
     * @returns {Promise<void>}
     */
    publishItemHandler() {
      return dispatch(publishAPI.publishItemRequest.apply(this));
    }
  };
})

class Publish extends Component {
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
    uploadLoading: false
  };

  async componentWillMount() {
    await mta.Page.init();
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
  async componentDidShow() {

  }

  componentWillUnmount() {
    const {setAttrValueHandler} = this.props;
    setAttrValueHandler({
      isAdoption: false,
      tagCodes: []
    });
  }

  /**
   * 改变输入框的内容
   * @尹文楷
   * @returns {Promise<void>}
   */
  onTextChangeHandler = (key, event) => {
    const {setAttrValueHandler} = this.props;
    let value;
    value = Object.prototype.toString.call(event) === '[object Object]' ? event.target.value : event;
    setAttrValueHandler({
      [key]: value
    });
  };

  /**
   * 获取用户信息并发布宠物交易
   */
  onGetUserInfoHandler = async (event) => {
    const {publishItemHandler} = this.props;
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
        url: `${pageCurrentList[20]}?pages=publish`
      });
    } else {
      Tools.run(function* () {
        mta.Event.stat('user_authorization', {});
        if (verify()) {
          let publishData = yield publishItemHandler.apply(this);
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
    const {setAttrValueHandler, uploadImgHandler, publishStore} = this.props;
    const {count} = this;
    let {files: fileList = [], images = []} = publishStore;
    switch (operationType) {
      case 'add':
        this.setState({
          uploadLoading: true
        });
        setAttrValueHandler({
          files: [],
          images: []
        });
        const {length} = files;
        for (let [key, value] of files.entries()) {
          const {file: {size}} = value;
          //图片的限制大小
          if (size > maxFileSize) {
            this.setState({
              uploadLoading: false
            });
          }
          uploadImgHandler.apply(this, [{size, value, key, total: length}]);
        }
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
        setAttrValueHandler({
          files: fileList,
          images
        });
        break;
      default:
        break;
    }
  };

  /**
   * 向用户发起授权请求
   * @尹文楷
   **/
  getAuthorizeHandler = async (e) => {
    const {getSettingHandler, authorizeHandler} = this.props;
    await getSettingHandler('scope.userLocation');
    await authorizeHandler.apply(this, ['scope.userLocation']);
    await mta.Event.stat('publish_gps', {});
    //取消冒泡事件
    e.stopPropagation();
  };

  /**
   * 用于表单校验的规则函数
   * @尹文楷
   * @returns {Promise<void>}
   */
  verify = () => {
    const {publishStore} = this.props;
    const {content, images, isLocationAuthorize, title, cost, contactInfo} = publishStore;
    return Tools.addRules([
      content,
      images,
      isLocationAuthorize,
      title,
      cost,
      contactInfo
    ], [{
      rule: 'isEmpty',
      errMsg: constants['verify']['isEmpty']
    }]).execute();
  };

  /**
   * 调起客户端小程序设置界面，返回用户设置的操作结果
   * @尹文楷
   * @returns {Promise<void>}
   */
  getOpenSettingHandler = () => {
    const {openSettingHandler} = this.props;
    openSettingHandler.apply(this);
  };

  /**
   * 调起客户端小程序设置界面，返回用户设置的操作结果，点击取消触发的动作
   * @returns {Promise<void>}
   */
  getModalCancelHandler = () => {
    const {setAttrValueHandler} = this.props;
    setAttrValueHandler({
      isRefusedModal: false
    });
  };

  /**
   * 点击是否领养按钮，引起领养状态改变的事件
   * @returns {Promise<void>}
   */
  adoptionChangeHandler = (code, {name, active}) => {
    const {setAttrValueHandler, publishStore} = this.props;
    const {tagCodes} = publishStore;
    setAttrValueHandler({
      isAdoption: !active,
      tagCodes
    });
  };

  /**
   * 跳转到主子页面
   * @尹文楷
   */
  redirectToPreviousPage = () => {
    const {setAttrValueHandler} = this.props;
    Taro.navigateBack({
      delta: Taro.getCurrentPages().length
    });
    setAttrValueHandler({
      reviewModal: false
    });
  };

  /**
   * 点击图片放大查看
   */
  onImagePreviewHandler = index => {
    const {publishStore} = this.props;
    const {files: fileList = []} = publishStore;
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

  render() {
    const {publishStore} = this.props;
    const {
      onGetUserInfoHandler = () => {
      },
      adoptionChangeHandler = () => {
      },
      onTextChangeHandler = () => {
      },
      onImageChangeHandler = () => {
      },
      getAuthorizeHandler = () => {
      },
      getOpenSettingHandler = () => {
      },
      getModalCancelHandler = () => {
      },
      redirectToPreviousPage = () => {
      },
      onImagePreviewHandler = () => {
      }
    } = this;
    const {showAddBtn, moveCount, uploadLoading} = this.state;
    const {
      isRefusedModal,
      reviewModal,
      content,
      files,
      area,
      title,
      cost,
      contactInfo,
      isAdoption
    } = publishStore;
    return (
      <Block>
        {
          uploadLoading && <LoadingView
            size={56}
            color='#fb2a5d'
            className='pet-business-loading'
            content={loadingStatus.upload.text}
          />
        }
        <View
          className='pet-business'
        >
          <AtMessage/>
          <View className='pet-business-publish'>
            <View className='pet-business-publish-content'>
              <View className='pet-business-publish-content-top'>
                <AtInput
                  name='title'
                  type='text'
                  placeholderClass='pet-business-publish-content-title-placeholder'
                  placeholderStyle='font-size: 19px;font-weight: 500;color: #666'
                  placeholder={constants.publish.placeholder.title}
                  value={title}
                  className={cns('pet-business-publish-content-input',
                    'pet-business-publish-content-title'
                  )}
                  onChange={(e) => {
                    onTextChangeHandler('title', e);
                  }}
                />
                <AtTextarea
                  count={false}
                  textOverflowForbidden={false}
                  height={144}
                  value={content ? content : ''}
                  onChange={(e) => {
                    onTextChangeHandler('content', e);
                  }}
                  placeholder={constants.publish.placeholder.content}
                  placeholderStyle='font-size:16PX;font-weight:400;color:#999;'
                  className='pet-business-publish-content-description'
                />
                <AtImagePicker
                  mode='aspectFill'
                  length={4}
                  multiple
                  className='pet-business-publish-content-images'
                  files={files}
                  count={moveCount}
                  showAddBtn={showAddBtn}
                  onImageClick={onImagePreviewHandler}
                  onChange={onImageChangeHandler}
                />
                <AtList
                  className='pet-business-publish-content-position'
                  hasBorder={false}
                >
                  <AtListItem
                    iconInfo={{prefixClass: 'iconfont', value: 'petPlanet-gps', size: 16, color: '#999'}}
                    hasBorder={false}
                    title={area}
                    onClick={getAuthorizeHandler}
                  />
                </AtList>
              </View>
              <View className='pet-business-publish-content-bottom'>
                <AtInput
                  name='cost'
                  type='number'
                  title={constants.publish.label.cost}
                  placeholder={constants.publish.placeholder.cost}
                  placeholderStyle='font-size:14PX;font-weight:400;color:#999;'
                  value={cost}
                  className={cns('pet-business-publish-content-input',
                    'pet-business-publish-content-price'
                  )}
                  onChange={(e) => {
                    onTextChangeHandler('cost', e);
                  }}
                />
                <AtInput
                  name='contactInfo'
                  type='text'
                  title={constants.publish.label.contactInfo}
                  placeholder={constants.publish.placeholder.contactInfo}
                  placeholderStyle='font-size:14PX;font-weight:400;color:#999;'
                  value={contactInfo}
                  maxlength={50}
                  className={cns('pet-business-publish-content-input',
                    'pet-business-publish-content-contactInfo'
                  )}
                  onChange={(e) => {
                    onTextChangeHandler('contactInfo', e);
                  }}
                />
                <View
                  className={cns('at-row',
                    'at-row--no-wrap',
                    'pet-business-publish-content-tag'
                  )}
                >
                  <View className={cns('at-col',
                    'at-col-2',
                    'pet-business-publish-content-tag-adoption-title'
                  )}>
                    {constants.publish.label.adoption}
                  </View>
                  <View className='at-col at-col-9'>
                    <AtTag
                      className='pet-business-publish-content-tag-adoption-tagAdoption'
                      name='isAdoption'
                      size='normal'
                      type='primary'
                      active={isAdoption}
                      onClick={(e) => {
                        adoptionChangeHandler('0001', e);
                      }}
                    >
                      {constants.publish.content.adoption}
                    </AtTag>
                  </View>
                </View>
              </View>
              <View className='pet-business-publish-content-button'>
                <AtButton
                  type='primary'
                  lang='zh_CN'
                  onClick={onGetUserInfoHandler}
                >
                  发布
                </AtButton>
              </View>
              <ModalView
                isOpened={isRefusedModal}
                title={constants.modal.refuse.title}
                cancelText={constants.modal.refuse.cancelText}
                confirmText={constants.modal.refuse.confirmText}
                content={constants.modal.refuse.content}
                onConfirm={getOpenSettingHandler}
                onCancel={getModalCancelHandler}
                onClose={getModalCancelHandler}
              />
              <ModalView
                isOpened={reviewModal}
                title={constants.modal.review.title}
                closeOnClickOverlay={false}
                confirmText={constants.modal.review.confirmText}
                content={constants.modal.review.content}
                onConfirm={redirectToPreviousPage}
              />
            </View>
          </View>
        </View>
      </Block>
    )
  }
}

export default Publish;
