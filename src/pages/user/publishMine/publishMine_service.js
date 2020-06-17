import Tools from '../../../utils/petPlanetTools';
import {staticData} from '../../../constants';
import {setPublishMineAttrValue} from './publishMine_action';

/**
 * 拉取发布列表
 * @尹文楷
 * @returns {Function}
 */
function usersPublishMineRequest() {
  return async (dispatch) => {
    const {publishMineStore} = this.props;
    const {pageNum, pageSize, petPublishMineList} = publishMineStore;
    return Tools.request({
      url: 'users/publication/v2',
      data: {
        pageNum,
        pageSize
      },
      success(data, header) {
        const {data: _data} = data;
        let petPublishMineList_new = [...petPublishMineList, ..._data];
        dispatch(setPublishMineAttrValue({
          petPublishMineList: pageNum === 1 ? _data : petPublishMineList_new,
          currentPetPublishMineList: _data
        }));
        dispatch(setPublishMineAttrValue({
          loadStatus: (_data.length > 0 && _data.length === staticData['pageSize']) ?
            staticData['loadStatusConfig']['more'] : staticData['loadStatusConfig']['noMore']
        }));
      },
      complete: (res) => {
        this.setState({
          loading: false
        });
      }
    });
  }
}

const publishMineAPI = {
  usersPublishMineRequest
};

export default publishMineAPI;
