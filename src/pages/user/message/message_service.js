import Tools from '../../../utils/petPlanetTools';
import {staticData} from '../../../constants';
import * as constants from './constants';

/**
 * 获取会话页面咨询列表
 * @尹文楷
 */
function cnsltConsultations() {
  return Tools.request({
    url: 'cnslt/consultations/v2',
    success: (data, header) => {
      const {data: _data, total} = data;
      this.setState({
        consultationsList: _data,
        isLoading: false,
        total
      });
    },
    fail: (res) => {

    },
    complete: (res) => {

    }
  });
}

/**
 * 获取会话页面咨询列表,进行分页
 * @尹文楷
 */
function cnsltConsultationsPagination(pageNum) {
  return (fn) => {
    return Tools.request({
      url: 'cnslt/consultations/v2',
      data: {
        pageNum,
        pageSize: staticData.pageSize
      },
      success: (data, header) => {
        fn(data, header);
      },
      fail: (res) => {

      },
      complete: (res) => {

      }
    });
  }
}

/**
 * 删除咨询
 * @尹文楷
 * @param id
 * @param index
 */
function cnsltConsultationsDelete(id, index) {
  let {consultationsList = [], pageNum: pageNumRightNow = 1} = this.state;
  let pageNum = Math.ceil(index / staticData.pageSize);
  return Tools.request({
    url: `cnslt/consultations/${id}`,
    method: 'delete',
    success: (data, statusCode) => {
      let total = 0,
        loop = pageNumRightNow > pageNum ? 2 : 1,
        slicePosition = ((pageNum - 1) * staticData.pageSize) - 1;
      Tools.run(function* () {
        consultationsList = slicePosition < 0 ? [] : consultationsList.slice(0, slicePosition);
        for (let i = 0; i < loop; i++) {
          let {data: _consultationsList = [], total: _total = 0} = yield cnsltConsultationsPagination(pageNum + i);
          consultationsList = [...consultationsList, ..._consultationsList];
          total = _total;
        }
        let pageNumTransform = pageNumRightNow > pageNum ? ++pageNum : pageNum,
          {length}= consultationsList;
        this.setState({
          consultationsList,
          total: --total,
          pageNum: pageNumTransform,
          isShowLoad: length === total,
          loadStatus: length === total ? constants.loadStatus.noMore : constants.loadStatus.loading
        });
      }.bind(this));
    },
    fail: (res) => {
    },
    complete: (res) => {
    }
  });
}

const messageAPI = {
  cnsltConsultations,
  cnsltConsultationsPagination,
  cnsltConsultationsDelete
};

export default messageAPI;
