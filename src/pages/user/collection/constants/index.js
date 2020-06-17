//action type协定
const collectionConstants = {
  SET_COLLECTION_ATTR_VALUE: 'SET_COLLECTION_ATTR_VALUE'
};

//收藏或者取消收藏提示语
const collectionAction = {
  collected: {
    text: '已收藏',
    toast: '收藏成功',
    type: 'primary'
  },
  noCollected: {
    text: '收藏',
    toast: '取消收藏',
    type: 'secondary'
  }
};

export {
  collectionConstants,
  collectionAction
};
