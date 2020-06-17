import {flowTopicConstants} from './constants';
/**
 * 改变redux store里面的数据状态
 * @尹文楷
 * @param payload
 */
export function setFlowTopicAttrValue(payload) {
  return {
    type: flowTopicConstants['SET_FLOW_TOPIC_ATTR_VALUE'],
    payload
  }
}
