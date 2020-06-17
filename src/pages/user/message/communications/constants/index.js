import Taro from '@tarojs/taro';
import Tools from '../../../../../utils/petPlanetTools';
import communicationsAPI from '../communications_service';
import * as constants from '../../../../../utils/petPlanetTools/constants';
import {pageCurrentList} from '../../../../../constants';

//loading加载标语
const loading = {
  text: '铲屎官帮您回复中...'
};

//校验语
const verify = {
  isEmpty: [
    'warning:咨询的内容不可为空'
  ]
};

//输入提示语
const communicationsBar = {
  input: {
    placeholder: '输入进行咨询'
  }
};

//action type协定
const communicationsConstants = {
  SET_COMMUNICATIONS_ATTR_VALUE: 'SET_COMMUNICATIONS_ATTR_VALUE'
};

//上传图片的类型
const uploadImageType = {
  CNSLT_COMMUNICATION: 'CNSLT_COMMUNICATION'
};

//回复消息的类型
const msgType = {
  TEXT: 'TEXT',
  IMG: 'IMG',
  TINY_GOODS_DETAIL: 'TINY_GOODS_DETAIL'
};

/**
 * 在不同回复消息类型时处理loading不同的方法
 * @type {{}}
 */
const setLoadingOperation = {
  [msgType.TEXT]() {
    this.setState({
      loading: false
    });
  },
  [msgType.IMG](key = 0, length = 0) {
    if (key >= (length - 1)) {
      this.setState({
        loading: false
      });
    }
  },
  [msgType.TINY_GOODS_DETAIL]() {
    this.setState({
      loading: false
    });
  }
};

//会话记录里面进行回复的功能
const communicationsFunc = [{
  id: 'picture',
  text: '相册',
  icon: 'petPlanet-picture',
  size: 28,
  onClick(e) {
    const {count} = this.state;
    Tools.chooseImageConfig({
      count,
      sourceType: ['album'],
      success: async (paths, files) => {
        this.setState({
          loading: true
        });
        for (let [key, value] of files.entries()) {
          const {size = 0, path = ''} = value;
          if (size > constants.maxFileSize) {
            this.setState({
              loading: false
            });
          }
          await communicationsAPI.uploadImg.call(this, {size, path, key, files});
        }
      },
      fail: (res) => {

      },
      complete: (res) => {

      }
    });
    //取消冒泡事件
    e.stopPropagation();
  }
}, {
  id: 'camera',
  text: '拍摄',
  icon: 'petPlanet-camera',
  size: 28,
  onClick(e) {
    const {count} = this.state;
    Tools.chooseImageConfig({
      count,
      sourceType: ['camera'],
      success: async (paths, files) => {
        this.setState({
          loading: true
        });
        for (let [key, value] of files.entries()) {
          const {size = 0, path = ''} = value;
          if (size > constants.maxFileSize) {
            this.setState({
              loading: false
            });
          }
          await communicationsAPI.uploadImg.call(this, {size, path, key, files});
        }
      },
      fail: (res) => {

      },
      complete: (res) => {

      }
    });
    //取消冒泡事件
    e.stopPropagation();
  }
}, {
  id: 'goods',
  text: '商品',
  icon: 'petPlanet-goods',
  size: 26,
  className: 'pet-communications-panel-func-item-contentGoods',
  onClick(e) {
    Taro.navigateTo({
      url: pageCurrentList[32]
    });
    this.onPanelHide();
    //取消冒泡事件
    e.stopPropagation();
  }
}];

export {
  verify,
  loading,
  communicationsBar,
  communicationsConstants,
  communicationsFunc,
  uploadImageType,
  msgType,
  setLoadingOperation
};
