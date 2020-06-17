//校验语
const verify = {
  isEmpty: {
    type: 'isEmpty',
    errMsg: 'warning:宠物问诊问题描述不能为空'
  },
  isSelect: {
    type: 'isSelect:checked',
    errMsg: [
      'warning:宠物问诊问题类型要选中一种哦~'
    ]
  }
};

/**
 * 上传图片的类型
 * @type {string}
 */
const uploadPrefix = 'MEDICAL_CONSULT';

//富文本输入提示语
const consult = {
  textarea: {
    placeholder: '请简要描述您的问题，限10-150字之间'
  }
};

//默认选择的图片的个数
const staticState = {
  moveCount: 9
};

//action type协定
const medicalConsultConstants = {
  SET_AREA_LIST: 'SET_AREA_LIST',
  CHECK_AREA_LIST: 'CHECK_AREA_LIST',
  UPDATE_CONSULT_CONTENT: 'UPDATE_CONSULT_CONTENT',
  UPDATE_AREA_LIST: 'UPDATE_AREA_LIST',
  SET_MEDICAL_CONSULT_ATTR_VALUE: 'SET_MEDICAL_CONSULT_ATTR_VALUE'
};


export {
  verify,
  consult,
  staticState,
  uploadPrefix,
  medicalConsultConstants
};
