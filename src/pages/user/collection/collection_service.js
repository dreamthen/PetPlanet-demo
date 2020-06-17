import Tools from '../../../utils/petPlanetTools';
import {staticData} from '../../../constants';
import {setCollectionAttrValue} from './collection_action';

/**
 * 拉取收藏列表
 * @尹文楷
 * @returns {Function}
 */
function usersCollectionRequest() {
  return async (dispatch) => {
    const {collectionStore} = this.props;
    const {pageNum, pageSize, petCollectionList} = collectionStore;
    return Tools.request({
      url: 'users/collection',
      method: 'get',
      data: {
        pageNum,
        pageSize
      },
      success(data, header) {
        let petCollectionList_new = [...petCollectionList, ...data];
        dispatch(setCollectionAttrValue({
          petCollectionList: pageNum === 1 ? data : petCollectionList_new,
          currentPetCollectionList: data
        }));
        dispatch(setCollectionAttrValue({
          loadStatus: (data.length > 0 && data.length === staticData['pageSize']) ?
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

const collectionAPI = {
  usersCollectionRequest
};

export default collectionAPI;

