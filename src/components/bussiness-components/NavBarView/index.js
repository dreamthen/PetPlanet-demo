import Taro, {Component} from '@tarojs/taro';
import PropTypes from 'prop-types';
import Tools from '../../../utils/petPlanetTools';
import {
  Image,
  View
} from '@tarojs/components';
import {
  AtIcon
} from 'taro-ui';
import cns from 'classnames';
import './index.less';

/**
 * 抽象分享页面业务组件
 * @尹文楷
 */
class NavBarView extends Component {
  static options = {
    addGlobalClass: true
  };

  static propTypes = {
    //顶部导航栏的标题
    title: PropTypes.string.isRequired,
    //顶部导航栏的样式
    className: PropTypes.string,
    //链接文字跟图标颜色，不包括标题
    color: PropTypes.string,
    //className 前缀，用于第三方字体图标库
    leftIconPrefixClass: PropTypes.string,
    //左边图标类型
    leftIconType: PropTypes.string,
    //左边第一个图标类型点击事件
    onClickLeftIcon: PropTypes.func,
    //是否传入的是图片，而不是icon，如果为图片就使用图片，否则使用icon
    imgs: PropTypes.string
  };

  render() {
    const {title, className = '', color, leftIconPrefixClass, leftIconType, onClickLeftIcon, imgs = ''} = this.props;
    const {statusBarClassName} = Tools.adaptationNavBar() || {};
    return (
      <View
        className={cns(
          `pet-detail-navBar`,
          statusBarClassName,
          className
        )}
      >
        <View className={cns('at-row',
          'at-row--no-wrap',
          'nav-bar'
        )}>
          <View
            className={cns('at-col',
              'at-col-3',
              'nav-bar-leftIcon'
            )}
            onClick={onClickLeftIcon}
          >
            {
              imgs ? <Image
                src={imgs}
                mode='widthFix'
                className='nav-bar-image'
              /> : <AtIcon
                prefixClass={leftIconPrefixClass ? leftIconPrefixClass : 'at-icon'}
                value={leftIconType}
                color={color}
                size={20}
              />
            }
          </View>
          <View className={cns('at-col',
            'at-col-6',
            'nav-bar-title'
          )}>{title}</View>
          <View className={cns('at-col',
            'at-col-3'
          )}> </View>
        </View>
      </View>
    )
  }
}

export default NavBarView;
