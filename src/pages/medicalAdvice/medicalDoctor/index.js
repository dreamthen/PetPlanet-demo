import Taro, {Component} from '@tarojs/taro';
import {connect} from '@tarojs/redux';
import {
  View,
  Label,
  RadioGroup,
  Radio,
  Text
} from '@tarojs/components';
import {
  AtAvatar,
  AtButton
} from 'taro-ui';
import cns from 'classnames';

import {
  BlockTitleView,
  DialogView,
  LoadingView
} from '../../../components/bussiness-components';
import {loadingStatus, petPlanetPrefix} from '../../../constants';
import Tools from '../../../utils/petPlanetTools';
import medicalDoctorAPI from './medicalDoctor_service';
import * as constants from './constants';

import 'taro-ui/dist/style/components/avatar.scss';
import 'taro-ui/dist/style/components/button.scss';
import 'taro-ui/dist/style/components/float-layout.scss';
import 'taro-ui/dist/style/components/loading.scss';
import 'taro-ui/dist/style/components/activity-indicator.scss';

import './loading-view.less';
import './dialog-view.less';
import './index.less';

@connect(state => {
  let {medicalConsultStore} = state;
  return {
    medicalConsultStore
  };
})
class MedicalDoctor extends Component {
  constructor() {
    super(...arguments);
  }

  static options = {
    addGlobalClass: true
  };

  config = {
    navigationBarTitleText: '选择医师'
  };

  state = {
    consultType: 'SYSTEM',
    doctors: [],
    //是否出现订阅消息底部弹窗
    subscribeDialog: false,
    //用户是否触发过'总是保持以上选择，不再询问'
    isAlways: false,
    //选择的医生是否付费
    isPayFee: false,
    //付费的对象
    payFeeO: {},
    //支付类型
    channel: 'WECHAT'
  };

  componentWillMount() {
    this.setState({
      consultType: 'SYSTEM',
      doctors: []
    });
  }

  componentDidMount() {
    medicalDoctorAPI.homeInfo.call(this);
  }

  componentWillUnmount() {
  }

  /**
   * 选择宠物医师操作
   */
  onRadioChange = (e) => {
    const idx = e.detail.value;
    let {doctors, consultType} = this.state;
    doctors.forEach(doctor => {
      doctor.checked = false;
    });
    if (-1 !== Number(idx)) {
      consultType = 'SPECIFIC';
      doctors[idx].checked = true;
    } else {
      consultType = 'SYSTEM';
    }
    this.setState({
      doctors,
      consultType,
      payFeeO: doctors[idx],
      isPayFee: !!doctors[idx]['fee']
    });
  };

  /**
   * 初始化loading加载页面
   */
  initialLoading = () => {
    this.setState({
      loading: false,
      loadingText: loadingStatus.progress.text
    });
  };

  /**
   * 进行文字咨询或者图案咨询以及订单支付
   */
  onBtnClick = async (e) => {
    const {doctors = [], isPayFee = false} = this.state;
    const {onPaymentHandler} = this;
    let docId = doctors.find(doctor => {
      return doctor.checked;
    });
    if (isPayFee) {
      onPaymentHandler.call(this, docId);
      return true;
    }
    medicalDoctorAPI.consult.call(this, docId ? docId['id'] : docId);
    //取消冒泡事件
    e.stopPropagation();
  };

  /**
   * 进行全职医生支付咨询
   */
  onPaymentHandler = async (docId) => {
    const data = await medicalDoctorAPI.createOrder.call(this);
    const {statusCode, data: _data} = data;
    const {orderId, orderNo} = _data;
    if (statusCode === 200) {
      this.setState({
        loading: true,
        loadingText: loadingStatus.pay.text
      });
      medicalDoctorAPI.paymentPay.call(this, orderId, orderNo, docId ? docId['id'] : docId);
    }
  };

  /**
   * 弹起提醒进行订阅消息的浮层
   */
  onAdviceHandler = (event) => {
    const {
      onBtnClick = () => {
      }
    } = this;
    Tools.getSettingConfig({
      withSubscriptions: true,
      success: (authSetting = {}, subscriptionsSetting = {}) => {
        const {itemSettings} = subscriptionsSetting;
        if (itemSettings && itemSettings[constants.medicalAdviceTmplIds.response] === constants.floatLayout.requestSubscribeMessage.status.accept) {
          onBtnClick(event);
        } else if (itemSettings && itemSettings[constants.medicalAdviceTmplIds.response] === constants.floatLayout.requestSubscribeMessage.status.reject) {
          this.setState({
            subscribeDialog: true,
            isAlways: true
          });
        } else {
          this.setState({
            subscribeDialog: true
          });
        }
      },
      fail: (res) => {
      },
      complete: (res) => {
      }
    });
    //取消冒泡事件
    event.stopPropagation();
  };

  /**
   * 点击取消,关闭浮层弹窗
   */
  onSubscribeCancel = (e) => {
    this.setState({
      subscribeDialog: false
    });
    //取消冒泡事件
    e.stopPropagation();
  };

  /**
   * 点击确定,调起客户端小程序订阅消息界面，返回用户订阅消息的操作结果
   */
  onSubscribeConfirm = (e) => {
    const {
      onBtnClick = () => {
      }
    } = this;
    const {isAlways = false} = this.state;
    if (isAlways) {
      Tools.openSettingConfig({
        withSubscriptions: true,
        success: (authSetting, subscriptionsSetting) => {
          onBtnClick(e);
        },
        fail: (res) => {
        },
        complete: (res) => {
        }
      });
    } else {
      Tools.requestSubscribeMessageConfig({
        tmplIds: constants.tmplIds,
        success: (res) => {
          onBtnClick(e);
        },
        fail: (res) => {
        },
        complete: (res) => {
          this.setState({
            subscribeDialog: false
          });
        }
      });
    }
  };

  /**
   * 点击关闭或者点击底部浮层以外的区域,将底部浮层关闭
   */
  onSubscribeClose = () => {
    this.setState({
      subscribeDialog: false
    });
  };

  render() {
    const {
      doctors = [],
      consultType = 'SYSTEM',
      subscribeDialog = false,
      loading = false,
      loadingText = loadingStatus.progress.text
    } = this.state;
    const {
      onRadioChange = () => {
      },
      onAdviceHandler = () => {
      },
      onSubscribeCancel = () => {
      },
      onSubscribeConfirm = () => {
      },
      onSubscribeClose = () => {
      }
    } = this;
    return (
      <View className='container'>
        {
          loading && <LoadingView
            size={52}
            color='#fb2a5d'
            className='pet-medicalDoctor-loading'
            content={loadingText}
          />
        }
        <RadioGroup className='radio-container' onChange={onRadioChange}>
          <Label for={-1}>
            <View className='radio-item at-row'>
              <View
                className={cns('radio-item-content',
                  'at-row',
                  'at-row__align--center',
                  {'checked': consultType === 'SYSTEM'}
                )}
              >
                <AtAvatar
                  size='large'
                  className='radio-item-content-avatar'
                  circle
                  image={`${petPlanetPrefix}/tinyStatics/imgs/default-doctor-avatar.png`}
                />
                <View className={cns('at-col',
                  'at-row__align--start'
                )}>
                  <View className='title'>系统随机指派兼职医师</View>
                  <View className='sub-title'>全国医师资源，平均6s快速响应</View>
                </View>
                <View className='number'><Text className='number-symbol'>¥</Text>0.00</View>
              </View>
            </View>
            <Radio hidden id={-1} value={-1}/>
          </Label>

          <BlockTitleView className='panel_title'>
            为您推荐优质的医师
          </BlockTitleView>
          <View className='sub-title'><Text className='full-time-font'>全职</Text>医生/秒级回复/更加专业</View>
          {/* 医师列表 */}
          {
            doctors.length > 0 && doctors.map((doctor, idx) => {
              const fee = doctor.fee || 0;
              return (
                <Label for={idx} key={doctor.userId}>
                  <View className={cns('radio-item',
                    'at-row'
                  )}>
                    <View
                      className={cns('radio-item-content',
                        'radio-item-content-select',
                        'at-row',
                        'at-row__align--center',
                        {'checked': doctor.checked}
                      )}
                    >
                      <AtAvatar
                        className='radio-item-content-avatar'
                        size='large'
                        circle
                        image={doctor.avatarUrl}
                      />
                      <View className={cns('at-col',
                        'at-row__align--start'
                      )}>
                        <View className={cns(
                          'title-wrap',
                          'at-row',
                          'at-row__align--center'
                        )}>
                          <View className='title'>{doctor.nickName}</View>
                          {
                            !doctor.partTimeJob && (
                              <View className='full-time-job-icon'>全职</View>
                            )
                          }
                        </View>
                        <View className='sub-title'>擅长领域: <Text
                          className='sub-title-goodAt'>{doctor.goodAt}</Text></View>
                        <View className={cns('color-light-grey',
                          'sub-title'
                        )}>服务人次: {doctor.serveCount}次, 好评率: 100%</View>
                      </View>
                      <View className='number'>
                        <Text className='number-symbol'>¥</Text>{(fee / 100).toFixed(2)}
                      </View>
                    </View>
                    <Radio hidden id={idx} value={idx}/>
                  </View>
                </Label>
              );
            })
          }
        </RadioGroup>
        {/*按钮发布区域: 使用formId进行发起一次有formId的模板消息请求*/}
        <AtButton
          full
          type='primary'
          className='next-step'
          onClick={onAdviceHandler}
        >
          咨询
        </AtButton>
        <DialogView isOpened={subscribeDialog}
                    title={constants.floatLayout.requestSubscribeMessage.title}
                    content={constants.floatLayout.requestSubscribeMessage.content}
                    cancelText='取消'
                    onCancel={onSubscribeCancel}
                    onClose={onSubscribeClose}
                    confirmText='进行订阅'
                    onConfirm={onSubscribeConfirm}
        />
      </View>
    );
  }
}

export default MedicalDoctor;
