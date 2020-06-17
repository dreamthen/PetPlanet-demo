/**
 * 需要订阅的消息模板的id的集合，一次调用最多可订阅3条消息
 * @type {*[]}
 */
const tmplIds = [
  'wzydwA-6l4ILMEO8ZNwW_pS8mUIc9jNR8xAFuUVcWO4'
];

const medicalAdviceTmplIds = {
  response: 'wzydwA-6l4ILMEO8ZNwW_pS8mUIc9jNR8xAFuUVcWO4'
};

/**
 * 多浮层配置
 * @type {{}}
 */
const floatLayout = {
  requestSubscribeMessage: {
    title: '温馨提示',
    content: '订阅后,医生回复会及时通知到您! 点击"进行订阅",进行订阅哦~',
    status: {
      accept: 'accept',
      reject: 'reject'
    }
  }
};

export {
  tmplIds,
  floatLayout,
  medicalAdviceTmplIds
};
