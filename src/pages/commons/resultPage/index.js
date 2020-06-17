import Taro, {Component} from '@tarojs/taro';
import {connect} from '@tarojs/redux';
import {
  Text,
  View
} from '@tarojs/components';
import {
  AtAvatar,
  AtButton
} from 'taro-ui';
import {pageCurrentList} from '../../../constants';
import './index.less';
import {imgs} from '../../../assets';

import 'taro-ui/dist/style/components/avatar.scss';
import 'taro-ui/dist/style/components/button.scss';

@connect(state => {
  return {}
}, dispatch => {
  return {};
})
class ResultPage extends Component {

  constructor() {
    super(...arguments);
    this.intervalMachine = null;
    this.state = {
      interval: 5
    };
  }

  static options = {
    addGlobalClass: true
  };

  config = {
    navigationBarTitleText: '咨询结果'
  };

  componentDidMount() {
    let {interval} = this.state;
    this.intervalMachine = setInterval(() => {
      if (this.state.interval === 0) {
        clearInterval(this.intervalMachine);
        this.intervalMachine = null;
        Taro.redirectTo({
          url: pageCurrentList[4]
        });
      } else {
        this.setState({
          interval: --interval
        });
      }
    }, 1000);
  }

  componentWillUnmount() {
    this.setState({
      interval: 5
    });
  }

  /**
   * 跳转到会话页面
   * @param e
   */
  onDirectToMessagePage = (e) => {
    clearInterval(this.intervalMachine);
    this.intervalMachine = null;
    Taro.redirectTo({
      url: pageCurrentList[4]
    });
    //取消冒泡
    e.stopPropagation();
  };

  render() {
    const {interval} = this.state;
    const {
      onDirectToMessagePage = () => {
      }
    } = this;
    return (
      <View>
        <View className='icon-container'>
          <AtAvatar
            className='icon'
            circle size='large'
            image={imgs.success}
          />
          <View className='title'>成功</View>
          <Text className='redirect'>
            {interval}s后跳转到会话页
          </Text>
          <AtButton
            size='small'
            className='redirect-page-button'
            onClick={onDirectToMessagePage}
          >
            点击直接跳转会话页
          </AtButton>
        </View>
      </View>
    );
  }
}

export default ResultPage;
