import Taro, {Component} from '@tarojs/taro';
import {
  Image,
  Text,
  View
} from '@tarojs/components';
import {connect} from '@tarojs/redux';
import {
  AtAvatar
} from 'taro-ui';
import cns from 'classnames';

import {
  ListItemView
} from '../../../components/bussiness-components';
import {imgs} from '../../../assets';
import * as constants from './constants';

import 'taro-ui/dist/style/components/avatar.scss';

import './index.less';


@connect(state => {
  return {};
}, (dispatch) => {
  return {};
})
class RedPacket extends Component {
  static options = {
    addGlobalClass: true
  };

  config = {
    navigationBarTitleText: '',
    navigationBarBackgroundColor: '#f05548',
    navigationBarTextStyle: 'white'
  };

  state = {
    //红包发送方式
    redPackType: constants.redPacketTypeSymbol.ENTERPRISE,
    //红包金额
    totalAmount: '0.00',
    //用户昵称
    nickName: '',
    //用户头像
    avatar: '',
    //用户获取红包的时间
    time: ''
  };

  componentWillMount() {
    const {
      params: {
        redPackType = constants.redPacketTypeSymbol.ENTERPRISE,
        totalAmount = '0.00',
        avatar = '',
        nickName = '',
        time = ''
      }
    } = this.$router;
    this.setState({
      redPackType,
      totalAmount: (totalAmount / 100).toFixed(2),
      avatar,
      nickName,
      time
    });
  }

  componentDidMount() {
  }

  render() {
    const {
      avatar = '',
      nickName = '',
      totalAmount = '0.00',
      time = ''
    } = this.state;
    return (
      <View className='redPacket'>
        <View className='redPacket-container'
        >
          <Image
            className='redPacket-bg'
            mode='widthFix'
            src={imgs.redPacketBg}
          />
          <View className={cns(
            'redPacket-area',
            'redPacket-title'
          )}>
            拉旦木红包
          </View>
          <View className={cns(
            'redPacket-area',
            'redPacket-desc'
          )}>
            每日打卡，轻松领红包
          </View>
          <View className={cns(
            'redPacket-area',
            'redPacket-totalPrice'
          )}>
            {totalAmount}
            <Text className='redPacket-totalPrice-symbol'>
              元
            </Text>
          </View>
          <View className={cns(
            'redPacket-area',
            'redPacket-totalPriceDesc'
          )}>
            已存入零钱，可用于发红包
          </View>
          <View className='redPacket-userContainer'>
            <View className='redPacket-userPacket'>
              <ListItemView
                className='redPacket-userPacket-userList'
                renderHeadFigure={<AtAvatar image={avatar} size='large' />}
                renderDesc={<View className='redPacket-userPacket-userList-userInfo'>
                  <View className='redPacket-userPacket-userList-userInfo-userName'>
                    {nickName}
                  </View>
                  <View className='redPacket-userPacket-userList-userInfo-time'>
                    {time}
                  </View>
                </View>}
                renderExtra={<View className='redPacket-userPacket-userList-priceTag'>
                  {totalAmount}元
                </View>}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default RedPacket;
