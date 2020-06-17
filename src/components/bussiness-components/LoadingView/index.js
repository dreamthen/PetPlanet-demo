import Taro, {Component} from '@tarojs/taro';
import PropTypes from 'prop-types';
import {AtActivityIndicator} from 'taro-ui';
import cns from 'classnames';

/**
 * 抽象Loading加载中组件
 * @尹文楷
 */
class LoadingView extends Component {
  static options = {
    addGlobalClass: true
  };

  static propTypes = {
    //Loading加载中组件外部传入className样式表
    className: PropTypes.string,
    //Loading加载中组件icon大小
    size: PropTypes.number,
    //loading加载中组件icon颜色
    color: PropTypes.string,
    //loading加载中组件元素的内容文本
    content: PropTypes.string
  };

  render() {
    const {className, size, color, content} = this.props;
    return (
      <AtActivityIndicator
        className={cns('pet-component-activity-indicator', `pet-component-activity-indicator ${className}`)}
        size={size}
        color={color}
        content={content}
      />
    );
  }
}

export default LoadingView;
