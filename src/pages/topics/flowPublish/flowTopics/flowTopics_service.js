import Tools from '../../../../utils/petPlanetTools';
import {staticData} from '../../../../constants';

/**
 * 拉取话题列表
 */
function getTopics() {
  let {pageNum} = this.state;
  return Tools.request({
    url: `flow/topics?pageNum=${pageNum}&pageSize=${staticData.pageSize}`,
    success: data => {
      const {topics = []} = this.state;
      const {data: _data = [], total = 0} = data || {};
      let newTopics = [...topics, ..._data];
      const {length = 0} = newTopics;
      this.setState({
        topics: newTopics,
        pageNum: ++pageNum,
        isShowLoad: length === total,
        loadStatus: length === total ? staticData['loadStatusConfig']['noMore'] : staticData['loadStatusConfig']['loading'],
        total
      }, () => {
        this.isNextPage = false;
      });
    },
    fail: res => {

    },
    complete: res => {
    }
  });
}

const flowTopicAPI = {
  getTopics
};

export default flowTopicAPI;
