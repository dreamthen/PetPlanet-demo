import Taro, {Component} from '@tarojs/taro';
import {connect} from '@tarojs/redux';
import {
  Text,
  ScrollView,
  View
} from '@tarojs/components';


@connect((state) => {
  return {
  }
}, (dispatch) => {
  return {
  }
})
class Topic extends Component {

  constructor(props) {
    super(props);
  }

  static options = {
    addGlobalClass: true
  };

  config = {
    navigationBarTitleText: '发现'
  };

  state = {
  };

  render() {
    return (
      <View className='pet'>
        hello world~~~hello world~~~hello world~~~hello world~~~hello world~~~hello world~~~hello world~~~hello world~~~hello world~~~hello world~~~hello world~~~hello world~~~hello world~~~hello world~~~hello world~~~hello world~~~hello world~~~hello world~~~hello world~~~hello world~~~hello world~~~hello world~~~hello world~~~
      </View>
    )
  }
}

export default Topic;
