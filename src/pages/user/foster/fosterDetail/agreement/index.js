import Taro, {Component} from '@tarojs/taro';
import {connect} from '@tarojs/redux';
import {
  Text,
  View
} from '@tarojs/components';

import Tools from '../../../../../utils/petPlanetTools';
import {
  NavBarView
} from '../../../../../components/bussiness-components';
import {imgs} from '../../../../../assets';

import 'taro-ui/dist/style/components/icon.scss';

import './index.less';

/**
 * 协议
 */
@connect((state) => {
  return {
    agreementStore: state.agreementStore
  };
}, (dispatch) => {
  return {};
})
class Agreement extends Component {
  constructor(props) {
    super(props);
  }

  config = {
    navigationStyle: 'custom',
    navigationBarTitleText: '协议'
  };

  static options = {
    addGlobalClass: true
  };

  state = {
    //头部标题栏标题
    title: null
  };

  componentWillMount() {
    const {params = {}} = this.$router;
    const {title = null} = params;
    this.setState({
      title: title || ''
    });
  }

  /**
   * 返回上一个页面
   */
  redirectToBackPage = (e) => {
    Taro.navigateBack({
      delta: 1
    });
    //取消冒泡
    e.stopPropagation();
  };

  render() {
    const {navBarHeight = 0} = Tools.adaptationNavBar();
    const {agreementStore} = this.props;
    const {title} = this.state;
    const {redirectToBackPage} = this;
    return (
      <View className='pet-agreement'>
        <NavBarView
          color='#000'
          title={title}
          imgs={imgs.back}
          className='pet-agreement-navBar'
          onClickLeftIcon={redirectToBackPage}
        />
        <View className='pet-agreement-container'
              style={{paddingTop: `${navBarHeight}rpx`}}
        >
          <Text decode
                className='pet-agreement-content'
          >
            {agreementStore.article}
          </Text>
        </View>
      </View>
    )
  }
}

export default Agreement;
