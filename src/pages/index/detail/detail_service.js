import Taro from '@tarojs/taro';
import Tools from '../../../utils/petPlanetTools';
import * as constants from '../../user/collection/constants';
import {setDetailAttrValue} from './detail_action';

/**
 * 对此宠物交易进行收藏
 * @returns {Promise<void>}
 */
function setCollectionRequest() {
  return async (dispatch) => {
    const {detailStore} = this.props;
    const {id} = detailStore;
    return await Tools.request({
      url: `tinyComms/${id}/collect`,
      method: 'POST',
      data: {},
      success: async (data, header) => {
        await Taro.showToast({
          icon: 'success',
          title: constants.collectionAction.collected.toast,
          mask: false,
          success: () => {

          }
        });
        await dispatch(setDetailAttrValue({
          collection: constants.collectionAction.collected.text,
          collectionType: constants.collectionAction.collected.type,
          collected: true
        }));
      },
      complete(res) {

      }
    })
  };
}

/**
 * 对此宠物交易进行取消收藏
 * @returns {Promise<void>}
 */
function setNoCollectionRequest() {
  return async (dispatch) => {
    const {detailStore} = this.props;
    const {id} = detailStore;
    return await Tools.request({
      url: `tinyComms/${id}/dispel`,
      method: 'DELETE',
      data: {},
      success: async (data, header) => {
        await Taro.showToast({
          icon: 'success',
          title: constants.collectionAction.noCollected.toast,
          mask: false,
          success: () => {

          }
        });
        await dispatch(setDetailAttrValue({
          collection: constants.collectionAction.noCollected.text,
          collectionType: constants.collectionAction.noCollected.type,
          collected: false
        }));
      },
      complete(res) {

      }
    })
  };
}

const detailAPI = {
  setCollectionRequest,
  setNoCollectionRequest
};

export default detailAPI;
