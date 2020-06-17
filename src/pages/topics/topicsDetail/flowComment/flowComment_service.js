import Tools from '../../../../utils/petPlanetTools';
import qs from 'querystring';

/**
 * 查询某条回复的子回复列表
 * @returns {function(*=): *}
 */
function getComments() {
  let {commId, pageNum, pageSize} = this.state;
  const qsObj = {
    commentId: commId,
    pageNum: pageNum++,
    pageSize
  };
  const qsStr = qs.stringify(qsObj);
  return (fn) => {
    return Tools.request({
      url: `flow/comments/${commId}/subComments?${qsStr}`,
      success: data => {
        const {subCommentList = []} = this.state;
        let {subComments = []} = data;
        subComments = subComments ? subComments : [];
        const length = subComments.length;
        this.isPageNext = true;
        this.setState({
          ...data,
          pageNum: length > 0 ? pageNum : --pageNum,
          pageSize,
          subCommentList: [...subCommentList, ...subComments]
        }, () => {
          fn(data);
        });
      },
      fail: res => {
      },
      complete: rec => {
      }
    });
  };
}

/**
 * 进行评论
 */
function flowPostCommentRequest() {
  let {postId, flowCommentsValue, commId} = this.state;
  const that = this;
  return Tools.request({
    url: `flow/posts/${postId}/comments`,
    method: 'post',
    data: {
      comment: flowCommentsValue,
      parentCommentId: Number(commId)
    },
    success: data => {
      this.setState({
        subCommentList: [],
        flowCommentsValue: '',
        pageNum: 1,
        scrollTop: 0,
        loading: false
      }, () => {
        Tools.run(function* () {
          yield getComments.call(that);
        });
      });
    },
    fail: (res) => {
      console.log(res);
    },
    complete: (res) => {
      console.log(res);
    }
  });
}

const flowCommentAPI = {
  getComments,
  flowPostCommentRequest
};

export default flowCommentAPI;
