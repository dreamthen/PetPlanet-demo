import Taro, {Component} from '@tarojs/taro';
import PropTypes from 'prop-types';
import {
  Image,
  View
} from '@tarojs/components';
import {
  AtAvatar
} from 'taro-ui';
import cns from 'classnames';

import Tools from '../../../utils/petPlanetTools';
import {imgs} from '../../../assets';

import './index.less';

/**
 * 抽象分享页面业务组件
 * @尹文楷
 */
class NavBarDetailView extends Component {
  static options = {
    addGlobalClass: true
  };

  static propTypes = {
    //左边第一个图标类型点击事件
    onClickLeftIcon: PropTypes.func,
    //顶部导航栏的样式
    className: PropTypes.string,
    //用户头像
    avatar: PropTypes.string,
    //用户昵称
    nickName: PropTypes.string,
    //点击顶部导航栏的事件
    onClick: PropTypes.func
  };

  render() {
    const {
      className = '', onClickLeftIcon, avatar, nickName, onClick = () => {
      }
    } = this.props;
    const {statusBarClassName} = Tools.adaptationNavBar() || {};
    return (
      <View
        id='pet-topic-detail'
        className={cns(
          `pet-detail-navBar`,
          statusBarClassName,
          className
        )}
        onClick={onClick}
      >
        <View class={cns('at-row',
          'at-row--no-wrap',
          'nav-bar'
        )}>
          <View className={cns('at-col-1',
            'pet-detail-navBar-information-back'
          )}
                onClick={onClickLeftIcon}
          >
            <Image
              src={imgs.back}
              mode='widthFix'
              className='pet-detail-navBar-image'
            />
          </View>
          <View className={cns('at-col-8',
            'pet-detail-navBar-user'
          )}
          >
            <AtAvatar
              image={avatar}
              circle
              className='pet-detail-navBar-userImg'
              customStyle={{marginRight: '12px', width: '36px', height: '36px'}}
            >
            </AtAvatar>
            {nickName}
          </View>
        </View>
      </View>
    )
  }
}

export default NavBarDetailView;
