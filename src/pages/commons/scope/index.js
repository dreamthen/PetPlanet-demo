import Taro, {Component} from '@tarojs/taro';
import {
  View
} from '@tarojs/components';
import {
  AtAvatar,
  AtButton
} from 'taro-ui';
import topicsAPI from '../../topics/topics_service';

import 'taro-ui/dist/style/components/avatar.scss';
import 'taro-ui/dist/style/components/button.scss';

import './index.less';

class Scope extends Component {
  static options = {
    addGlobalClass: true
  };

  config = {
    navigationBarTitleText: '授权'
  };

  state = {
    //从哪一个页面跳转过来的标识符
    pages: null
  };

  componentWillMount() {
    const {params} = this.$router;
    this.setState({
      ...params
    });
  }

  /**
   * 获取用户信息
   * @尹文楷
   */
  getUserInfoHandler = (event) => {
    const {currentTarget: {userInfo, iv, signature, rawData, encryptedData}} = event;
    const targetUserInfo = {
      ...userInfo,
      iv,
      signature,
      rawData,
      encryptedData
    };
    if (userInfo) {
      topicsAPI.syncUserInfo.call(this, targetUserInfo);
    }
  };

  render() {
    const {getUserInfoHandler} = this;
    return (
      <View
        className='pet-scope'
      >
        <View className='pet-scope-container'>
          <AtAvatar
            size='large'
            circle
            image='https://prod-pet.oss.1jtec.com/icon/logo.png'
            className='pet-scope-avatar'
          />
          <View className='pet-scope-content'>
            给主子想要的
          </View>
        </View>
        <AtButton
          className='pet-scope-button'
          size='normal'
          type='primary'
          lang='zh_CN'
          openType='getUserInfo'
          onGetUserInfo={getUserInfoHandler}
        >
          微信登录
        </AtButton>
      </View>
    )
  }
}

export default Scope;
