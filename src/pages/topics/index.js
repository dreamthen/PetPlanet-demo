import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  Text,
  View
} from '@tarojs/components';


@connect((state) => {
  return {}
}, (dispatch) => {
  return {}
})
class Topic extends Component {

  constructor(props) {
    super(props);
  }

  state = {};

  render() {
    return (
      <View>
        我叫尹文楷
        <Text decode>
          1111\n
        </Text>
        <Text decode>
          2222\n
        </Text>
      </View>
    )
  }
}

export default Topic;
