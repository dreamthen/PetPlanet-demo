import Taro from '@tarojs/taro';
import Tools from '../../../../utils/petPlanetTools';
import * as constants from './constants';

/**
 * 查看咨询页详情
 * @尹文楷
 */
function getCommunicationsList() {
  const {communicationsStore: {cnsltId, parentId}} = this.props;
  let {pageSize, pageNum} = this.state;
  return Tools.request({
    url: `cnslt/consultations/${cnsltId}`,
    data: {
      cnsltId,
      parentId,
      pageSize
    },
    success: data => {
      const list = data.communications.data,
        total = data.communications.total,
        imgList = list.filter(item => (item && item['msgType']) === constants.msgType.IMG);
      this.setState(() => {
        return {
          pageNum: ++pageNum,
          communicationsOS: data,
          total,
          imgList,
          communicationsList: list
        }
      });
    },
    fail: (res) => {

    },
    complete: (res) => {

    }
  });
}

/**
 * 查看咨询页分页详情
 * @尹文楷
 */
function getCommunicationsPaginationList() {
  const {communicationsStore: {cnsltId, parentId}} = this.props;
  let {pageNum, pageSize, communicationsList} = this.state;
  return (fn) => {
    return Tools.request({
      url: 'cnslt/communications',
      data: {
        cnsltId,
        parentId,
        pageNum: pageNum++,
        pageSize
      },
      success: data => {
        const list = data.data,
          total = data.total,
          _communicationsList = [...communicationsList, ...list],
          new_communicationsList = [...communicationsList, ...list],
          imgList = _communicationsList.filter(item => (item && item['msgType']) === constants.msgType.IMG);
        this.setState({
          total,
          pageNum: (!list || list.length === 0) ? --pageNum : pageNum,
          communicationsList: new_communicationsList,
          imgList
        }, () => {
          this.isPageNext = true;
          fn(data);
        });
      },
      fail: (res) => {
      },
      complete: (res) => {
      }
    });
  };
}


/**
 * 咨询回复操作
 * @尹文楷
 */
function postConsultMessage({key = 0, length = 0} = {}) {
  const {communicationsValue = '', msgType = constants.msgType.TEXT} = this.state;
  const {communicationsStore: {cnsltId, openidTo, parentId}} = this.props;
  let {pageSize, total} = this.state;
  return Tools.request({
    url: 'cnslt/communications',
    method: 'post',
    data: {
      cnsltId,
      msgType,
      content: communicationsValue,
      openidTo,
      parentId
    },
    success: data => {
      ++total;
      let divisor = Math.ceil(total / pageSize);
      const that = this;
      this.setState({
        communicationsList: [],
        communicationsValue: '',
        pageNum: 1
      }, () => {
        Tools.run(function* () {
          for (let i = 0; i < divisor; i++) {
            yield getCommunicationsPaginationList.call(that);
          }
          yield Taro.createSelectorQuery().select('#pet-communications-oq').fields({
            size: true
          }, res => {
            const {height} = res;
            that.setState({
              scrollTop: height
            });
          }).exec();
          yield constants.setLoadingOperation[msgType].apply(that, [key, length]);
        });
      });
    },
    fail: (res) => {
      this.setState({
        loading: false
      });
      return res;
    },
    complete: (res) => {
      return res;
    }
  });
}

/**
 * 会话记录上传图片
 * @param path
 * @param key
 * @param files
 * @param size
 * @returns {*}
 */
function uploadImg({size = 0, path = '', key = 0, files = []}) {
  return Tools.uploadFile({
    url: 'tinyStatics/uploadImg/v2',
    filePath: path,
    size,
    name: 'file',
    formData: {
      type: constants.uploadImageType.CNSLT_COMMUNICATION
    },
    success: (data, statusCode) => {
      const {length = 0} = files;
      if (statusCode === 200) {
        this.setState({
          communicationsValue: data,
          msgType: constants.msgType.IMG
        }, () => {
          postConsultMessage.call(this, {key, length});
        });
      } else {
        this.setState({
          loading: false
        });
      }
    },
    fail: (res) => {
      this.setState({
        loading: false
      });
    },
    complete: (res) => {
      this.onPanelHide();
    }
  });
}

const communicationsAPI = {
  getCommunicationsList,
  getCommunicationsPaginationList,
  postConsultMessage,
  uploadImg
};

export default communicationsAPI;
