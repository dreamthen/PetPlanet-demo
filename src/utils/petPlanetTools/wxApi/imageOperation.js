/**
 * 在新页面中全屏预览图片。预览的过程中用户可以进行保存图片、发送给朋友等操作。
 * @尹文楷
 */
function previewImage({
                        urls = '',
                        current = 0,
                        success = () => {
                        },
                        fail = () => {
                        },
                        complete = () => {
                        }
                      }) {
  return this.previewImage({
    urls,
    current,
    success: (res) => {
      success(res);
    },
    fail: (res) => {
      fail(res);
    },
    complete: (res) => {
      complete(res);
    }
  });
}

/**
 * 从本地相册选择图片或使用相机拍照。
 */
function chooseImage({
                       count = 9,
                       sizeType = ['original', 'compressed'],
                       sourceType = ['album', 'camera'],
                       success = () => {
                       },
                       fail = () => {
                       },
                       complete = () => {
                       }
                     }) {
  return this.chooseImage({
    count,
    sizeType,
    sourceType,
    success: ({tempFilePaths = [], tempFiles = []}) => {
      success(tempFilePaths, tempFiles);
    },
    fail: (res) => {
      fail(res);
    },
    complete: (res) => {
      complete(res);
    }
  });
}

export {
  previewImage,
  chooseImage
};
