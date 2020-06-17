/**
 * 处理大图和缩略图时,不同的显示图片方式(七牛云压缩显示和正常显示)
 * @param imgs
 */
function previewImageOperation(imgs) {
  imgs = imgs.map((item) => {
    const $_index = item.indexOf('@');
    if($_index !== -1) {
      return item.slice(0, $_index);
    }
    return item;
  });
  return imgs;
}

export {
  previewImageOperation
}
