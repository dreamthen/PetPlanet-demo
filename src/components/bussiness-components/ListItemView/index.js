import Taro, {Component} from '@tarojs/taro';
import PropTypes from 'prop-types';
import {
  View
} from '@tarojs/components';
import cns from 'classnames';

import './list-view.less';

class ListItemView extends Component {
  static propTypes = {
    //外部传入样式表
    className: PropTypes.string,
    //列表标题
    title: PropTypes.string,
    //头图
    renderHeadFigure: PropTypes.element,
    //描述部分
    renderDesc: PropTypes.element,
    //额外信息部分
    renderExtra: PropTypes.element,
    //列表点击事件
    onClick: PropTypes.func,
    //列表传入的唯一的列表元素值
    dataItem: PropTypes.string
  };

  static options = {
    addGlobalClass: true
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      title = '',
      className = '',
      onClick = () => {
      },
      dataItem = ''
    } = this.props;
    return (
      <View
        data-item={dataItem}
        className={
          cns(
            'list-item',
            className
          )}
        onClick={onClick}
      >
        <View
          className='list-item-headFigure'
        >
          {this.props.renderHeadFigure}
        </View>
        <View
          className='list-item-title'
        >
          {title}
          <View className='list-item-desc'>
            {this.props.renderDesc}
          </View>
        </View>
        <View className='list-item-extra'>
          {this.props.renderExtra}
        </View>
      </View>
    )
  }
}

export default ListItemView;
