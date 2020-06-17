import Taro, {Component} from '@tarojs/taro';
import {Provider} from '@tarojs/redux';
import Topic from './pages/topics';

import store from './store';


class App extends Component {

  config = {
    pages: [
      'pages/topics/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black',
      navigationStyle: 'default'
    }
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  componentDidShow() {
  }

  componentDidHide() {
  }

  componentCatchError() {
  }

  componentDidCatchError() {
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <Topic/>
      </Provider>
    )
  }
}

Taro.render(<App/>, document.querySelector('#app'));
