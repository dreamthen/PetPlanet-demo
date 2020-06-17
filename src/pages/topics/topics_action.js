import * as constants from './constants';
/**
 * 改变redux store里面的数据状态
 * @尹文楷
 * @param payload
 */
export function setTopicsAttrValue(payload) {
  return {
    type: constants.topicsConstants['SET_FLOW_TOPICS_ATTR_VALUE'],
    payload
  }
}
