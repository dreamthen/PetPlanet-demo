//用户信息权限语
const permission = {
  alert: '您暂未获取微信授权,将无法正常使用群内的功能~如需正常使用,请点击\'授权登录\'按钮,打开头像、昵称等信息的授权。'
};

//通告栏部分
const notice = {
  alert: '立即打卡，有红包在等着你哟~~'
};

//提示语配置
const modal = {
  isSigned: {
    title: '温馨提示',
    confirmText: '确定'
  },
  isRule: {
    title: '红包领取规则',
    content: '每日打卡都有机会领取随机金额红包',
    confirmText: '确定'
  },
  isRedPacketCancel: {
    title: '温馨提示',
    content: '红包放弃后将无法再次领取~',
    confirmText: '确定',
    cancelText: '取消'
  }
};

//没有数据时的提示语
const emptyList = {
  content: '暂无动态~'
};

//action type协定
const attendanceConstants = {
  //多层对象处理方法
  SET_ATTENDANCE_ATTR_VALUE: 'SET_ATTENDANCE_ATTR_VALUE',
  //初始化签到页面的所有信息
  CLEAR_ATTENDANCE_ATTR_VALUE: 'CLEAR_ATTENDANCE_ATTR_VALUE'
};

/**
 * 根据红包发送方式的不同,触发不同的方法
 * @type {{ENTERPRISE()}}
 */
const redPacketTypeAction = {
  ENTERPRISE() {
    this.setState({
      isShowRedPacket: true
    });
  }
};

/**
 * 红包发送方式
 * @type {{ENTERPRISE: string}}
 */
const redPacketTypeSymbol = {
  ENTERPRISE: 'ENTERPRISE'
};

export {
  permission,
  modal,
  notice,
  emptyList,
  attendanceConstants,
  redPacketTypeSymbol,
  redPacketTypeAction
};
