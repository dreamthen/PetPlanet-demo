import * as constants from './constants';

/**
 * 多层处理函数
 * @param payload
 * @returns {{payload: *, type: string}}
 */
export function setAttendanceAttrValue(payload) {
  return {
    type: constants.attendanceConstants['SET_ATTENDANCE_ATTR_VALUE'],
    payload
  };
}

/**
 * 初始化签到页面的所有信息
 * @returns {{type: string}}
 */
export function clearAttendanceAttrValue () {
  return {
    type: constants.attendanceConstants['CLEAR_ATTENDANCE_ATTR_VALUE']
  };
}
