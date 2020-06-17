import Taro, {Component} from '@tarojs/taro';
import {
  AtModal
} from 'taro-ui';
import PropTypes from 'prop-types';
import cns from 'classnames';

class ModalView extends Component {
  static options = {
    addGlobalClass: true
  };

  static propTypes = {
    //是否显示模态框
    isOpened: PropTypes.bool.isRequired,
    //点击浮层的时候时候自动关闭
    closeOnClickOverlay: PropTypes.bool,
    //外部传入样式表
    className: PropTypes.string,
    //元素的标题
    title: PropTypes.string,
    //确认按钮的文本
    confirmText: PropTypes.string,
    //取消按钮的文本
    cancelText: PropTypes.string,
    //元素的内容
    content: PropTypes.string,
    //点击确认按钮触发的事件
    onConfirm: PropTypes.func,
    //点击取消按钮触发的事件
    onCancel: PropTypes.func,
    //点击关闭或者点击底部浮层以外的区域,将底部浮层关闭
    onClose: PropTypes.func
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {
      isOpened = false,
      closeOnClickOverlay = false,
      className = '',
      title = '',
      confirmText = '',
      cancelText = '',
      content = '',
      onConfirm = () => {
      },
      onCancel = () => {
      },
      onClose = () => {
      }
    } = this.props;
    return content ? (
      <AtModal
        isOpened={isOpened}
        className={cns(
          'modal',
          className
        )}
        title={title}
        closeOnClickOverlay={closeOnClickOverlay}
        cancelText={cancelText}
        confirmText={confirmText}
        content={content}
        onConfirm={onConfirm}
        onCancel={onCancel}
        onClose={onClose}
      />
    ) : (
      <AtModal
        isOpened={isOpened}
        className={cns(
          'modal',
          className
        )}
        title={title}
        closeOnClickOverlay={closeOnClickOverlay}
        onClose={onClose}
      >
        {this.props.children}
      </AtModal>
    )
  }
}

export default ModalView;
