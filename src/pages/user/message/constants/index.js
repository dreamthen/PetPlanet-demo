const swipeAction = {
  message: '删除'
};

/**
 * 加载状态
 * @type {{noMore: string, loading: string}}
 */
const loadStatus = {
  noMore: 'noMore',
  loading: 'loading'
};

/**
 * 咨询会话列表问题状态
 * @type {{}}
 */
const cnsltState = {
  DISPATCHED: {
    txt: '已分配',
    className: 'pet-message-consultationsItem-info-extra-tag-dispatched'
  },
  RESPONSED: {
    txt: '已回应',
    className: 'pet-message-consultationsItem-info-extra-tag-responsed'
  }
};

export {
  swipeAction,
  loadStatus,
  cnsltState
};
