//loading加载标语
const loading = {
  content: '图片上传中...'
};

//校验语
const verify = {
  isEmpty: [
    'warning:宠物描述不能为空',
    'warning:图片组不能为空'
  ]
};

//标题、副标题、内容以及输入提示语
const publish = {
  title: '发布',
  placeholder: {
    content: '分享你的发现',
    title: '请输入标题'
  },
  label: {
    adoption: '选择话题'
  }
};

//模态框审核标题、内容以及按钮文案
const modal = {
  review: {
    title: '正在审核中...',
    confirmText: '我知道了',
    content: '您发布的内容,审核通过后会自动发布~'
  }
};

/**
 * 上传图片的类型
 * @type {string}
 */
const uploadPrefix = 'POST_CARD';

export {
  loading,
  verify,
  publish,
  modal,
  uploadPrefix
};
