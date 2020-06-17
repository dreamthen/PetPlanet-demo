import Taro, {Component} from '@tarojs/taro';
import {
  Block,
  View
} from '@tarojs/components';
import {
  AtButton,
  AtFloatLayout
} from 'taro-ui';
import PropTypes from 'prop-types';
import cns from 'classnames';

class DialogView extends Component {
  static options = {
    addGlobalClass: true
  };

  static propTypes = {
    //是否显示底部弹层框
    isOpened: PropTypes.bool.isRequired,
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
    //自定义渲染的主体内容
    renderContent: PropTypes.element,
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
      className = '',
      title = '',
      confirmText = '',
      content = '',
      onConfirm = () => {
      },
      onCancel = () => {
      },
      onClose = () => {
      },
      cancelText = ''
    } = this.props;
    return (
      <AtFloatLayout isOpened={isOpened}
                     title={title}
                     className={cns(
                       'float-layout',
                       className
                     )}
                     onClose={onClose}
      >
        {
          content ? <Block>
            <View className='float-layout-content'>
              {content}
            </View>
            <View className='float-layout-button'>
              {
                cancelText ? <AtButton className='float-layout-button-cancel'
                                       type='primary'
                                       onClick={onCancel}
                >
                  {cancelText}
                </AtButton> : null
              }
              <AtButton className='float-layout-button-confirm'
                        type='primary'
                        onClick={onConfirm}
              >
                {confirmText}
              </AtButton>
            </View>
          </Block> : this.props.renderContent
        }
      </AtFloatLayout>
    )
  }
}

export default DialogView;
