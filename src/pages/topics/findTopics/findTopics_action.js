import * as constants from './constants';
/**
 * 改变redux store里面的数据状态
 * @尹文楷
 * @param payload
 */
export function setFindTopicsAttrValue(payload) {
  return {
    type: constants.findTopicsConstants['SET_FLOW_FIND_TOPICS_ATTR_VALUE'],
    payload
  }
}
