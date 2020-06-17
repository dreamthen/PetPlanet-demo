import Taro, {Component} from '@tarojs/taro';
import {connect} from '@tarojs/redux';
import {
  Block,
  View,
  RadioGroup,
  Radio
} from '@tarojs/components';
import {
  AtButton,
  AtMessage,
  AtTextarea,
  AtImagePicker
} from 'taro-ui';
import cns from 'classnames';
import Tools from '../../../utils/petPlanetTools';
import {pageCurrentList, loadingStatus} from '../../../constants';
import {setMedicalConsultAttrValue} from './medicalConsult_action';
import medicalConsultAPI from './medicalConsult_service';
import {BlockTitleView, LoadingView} from '../../../components/bussiness-components';
import * as constants from './constants';
import {maxFileSize} from '../../../utils/petPlanetTools/constants';

import 'taro-ui/dist/style/components/activity-indicator.scss';
import 'taro-ui/dist/style/components/loading.scss';
import 'taro-ui/dist/style/components/button.scss';
import 'taro-ui/dist/style/components/textarea.scss';
import 'taro-ui/dist/style/components/message.scss';
import 'taro-ui/dist/style/components/image-picker.scss';


import './index.less';
import './loading-view.less';

@connect(state => {
  return {
    medicalConsultStore: state.medicalConsultStore
  };
}, dispatch => {
  return {
    /**
     * 用于处理多层对象的赋值
     * @param payload
     */
    setAttrValue: async payload => {
      return await dispatch(setMedicalConsultAttrValue(payload));
    },
    /**
     * 获取咨询的问题领域列表
     */
    homeInfo: () => {
      dispatch(medicalConsultAPI.homeInfo.call(this));
    },
    /**
     * 上传医疗咨询图片
     */
    uploadImg(...params) {
      dispatch(medicalConsultAPI.uploadImg.apply(this, params));
    }
  };
})
class MedicalConsult extends Component {
  static options = {
    addGlobalClass: true
  };

  config = {
    navigationBarTitleText: '宠物咨询'
  };

  constructor(props) {
    super(props);
    //能够上传图片数量的最大值
    this.count = constants.staticState.moveCount;
  }

  state = {
    isNextStepDisabled: true,
    //是否显示添加图片按钮
    showAddBtn: true,
    //动态的可添加的图片的数量
    moveCount: constants.staticState.moveCount,
    //上传图片是否存在loading
    uploadLoading: false
  };

  componentWillMount() {
    const {setAttrValue} = this.props;
    setAttrValue({
      areaList: [],
      consultContent: '',
      consultImages: [],
      uploadConsultImages: []
    });
  }

  componentDidMount() {
    const {homeInfo} = this.props;
    homeInfo();
  }

  componentWillUnmount() {
  }

  /**
   * 输入框值改变时触发的事件
   */
  handleTextAreaChange = (val) => {
    const {setAttrValue} = this.props;
    val = val.target ? val.target.value : val;
    setAttrValue({
      consultContent: val
    });
  };

  /**
   * 切换选择问题的类型触发的事件
   */
  onRadioChange(e) {
    // const {isNextStepDisabledChange} = this;
    const idx = e.detail.value;
    const {setAttrValue} = this.props;
    let {areaList} = this.state;
    areaList.forEach(area => {
      area.checked = false;
    });
    areaList[idx].checked = true;
    setAttrValue({
      areaList
    }).then(() => {
      // isNextStepDisabledChange();
    });
  }

  /**
   * 检测问诊问题类型和问题描述是否都填上选中
   */
  verify = () => {
    let {medicalConsultStore: {areaList, consultContent}} = this.props;
    return Tools.addRules(areaList, [{
      rule: constants.verify.isSelect.type,
      errMsg: constants.verify.isSelect.errMsg
    }]).addRules(consultContent, [{
      rule: constants.verify.isEmpty.type,
      errMsg: constants.verify.isEmpty.errMsg
    }]).execute();
  };

  /**
   * 图片上传,files 值发生变化触发的回调函数,
   */
  onImagePickerChange = (files, opType, index) => {
    const {uploadImg, setAttrValue} = this.props;
    const {count} = this;
    let {medicalConsultStore: {consultImages = [], uploadConsultImages = []}} = this.props;
    if (opType === 'add') {
      this.setState({
        uploadLoading: true
      });
      //先将上传显示的图片列表和真正上传的图片列表置空
      setAttrValue({
        consultImages: [],
        uploadConsultImages: []
      });
      for (let [key, value] of files.entries()) {
        const {file: {size}} = value;
        //图片的限制大小
        if (size > maxFileSize) {
          this.setState({
            uploadLoading: false
          });
        }
        uploadImg.apply(this, [{size, value, key, total: files.length}]);
      }
    } else {
      consultImages.splice(index, 1);
      uploadConsultImages.splice(index, 1);
      setAttrValue({
        consultImages,
        uploadConsultImages
      });
      const {length} = consultImages;
      if (length < count) {
        this.setState({
          showAddBtn: true,
          moveCount: count - length
        });
      }
    }
  };

  /**
   * 点击图片放大查看
   */
  onImagePreviewHandler = index => {
    let {medicalConsultStore: {consultImages = []}} = this.props;
    const previewImageFileList = consultImages.map(item => {
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
   * 获取用户信息并进行下一步选择宠物医师咨询
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
        url: `${pageCurrentList[20]}?pages=medicalConsult`
      });
    } else {
      if (verify()) {
        Taro.navigateTo({
          url: pageCurrentList[13]
        });
      }
    }
    event.stopPropagation();
  };

  render() {
    const {
      onRadioChange = () => {
      },
      handleTextAreaChange = () => {
      },
      onImagePickerChange = () => {
      },
      onImagePreviewHandler = () => {
      },
      onGetUserInfoHandler = () => {
      }
    } = this;
    const {showAddBtn, moveCount, uploadLoading} = this.state;
    let {medicalConsultStore: {areaList, consultContent, consultImages = []}} = this.props;
    return (
      <Block>
        {
          uploadLoading && <LoadingView
            size={56}
            color='#fb2a5d'
            className='pet-consult-loading'
            content={loadingStatus.upload.text}
          />
        }
        <View className='pet-consult'>
          <AtMessage/>
          {/* 问题领域 */}
          <View className='pet-consult-area'>
            <BlockTitleView
              className='panel_title'
            >
              问题类型
            </BlockTitleView>
            <View className='pet-consult-area'>
              <View>
                <RadioGroup
                  className={cns('at-row',
                    'at-row--wrap'
                  )}
                  onChange={onRadioChange}
                >
                  {
                    areaList.map((area, i) => {
                      return <Block key={area.code}>
                        <View
                          className={cns(
                            'radio-item-content',
                            {
                              'checked': area.checked
                            }
                          )}
                        >
                          <View className='radio-sub-title'>
                            {area['subTitle']}
                          </View>
                        </View>
                        <Radio
                          hidden
                          id={i}
                          value={i}
                        />
                      </Block>
                    })
                  }
                </RadioGroup>
              </View>
            </View>
          </View>

          {/* 问题描述 */}
          <View className='pet-consult-description'>
            <BlockTitleView className='panel_title'>输入问题描述</BlockTitleView>
            <View className='pet-consult-content'>
              <AtTextarea
                value={consultContent}
                className='pet-consult-content-textarea'
                onChange={handleTextAreaChange}
                maxLength={150}
                height={250}
                showConfirmBar
                placeholder={constants.consult.textarea.placeholder}
              />
            </View>
          </View>
          {/* 咨询图片 */}
          <View className='pet-consult-imagepicker'>
            <BlockTitleView className='panel_title'>症状实拍</BlockTitleView>
            <AtImagePicker
              multiple
              showAddBtn={showAddBtn}
              length={3}
              count={moveCount}
              files={consultImages}
              onImageClick={onImagePreviewHandler}
              onChange={onImagePickerChange}
            />
          </View>
          <AtButton
            full
            type='primary'
            lang='zh_CN'
            onClick={onGetUserInfoHandler}
            className='next-step'
          >
            下一步
          </AtButton>
        </View>
      </Block>
    );
  }
}

export default MedicalConsult;
