import Taro, {Component} from '@tarojs/taro';
import {
  Text
} from '@tarojs/components';
import PropTypes from 'prop-types';
import cns from 'classnames';
import './index.less';

class BlockTitleView extends Component {
  static options = {
    addGlobalClass: true
  };

  static propTypes = {
    //块级标题组件传递的内容
    content: PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {content} = this.props;
    return (
      <Text
        className={
          cns(
            'pet-block-title',
            this.props.className
          )
        }
      >
        {content ? content : this.props.children}
      </Text>
    );
  }
}

export default BlockTitleView;
