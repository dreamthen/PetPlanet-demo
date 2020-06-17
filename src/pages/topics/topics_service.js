import Taro from '@tarojs/taro';
import {staticData} from '../../constants';
import Tools from '../../utils/petPlanetTools';
import * as constants from './flowPublish/constants';

/**
 * 拉取话题列表
 * @returns {*}
 */
function getFlowTopics() {
  let {pageNum, topicList} = this.state;
  const {homeStore: {cookie = ''}} = this.props;
  return (fn) => {
    return Tools.request({
      url: 'flow/topics',
      header: {
        'cookie': cookie
      },
      data: {
        pageNum: pageNum++,
        pageSize: staticData.pageSize
      },
      success: data => {
        const {data: _data = [], total = 0} = data || {};
        const {topic, id = 0} = _data[0] || {};
        this.setState({
          pageNum,
          topicList: [...topicList, ..._data],
          total
        }, () => {
          this.hasTopicNext = false;
          fn(_data);
        });
      },
      fail(res) {
        return res;
      },
      complete(res) {
        return res;
      }
    });
  }
}

/**
 * 拉取内容流
 * @returns {*}
 */
function getFlowPosts() {
  const {setTopicsAttrValueHandler, topicsStore, homeStore: {cookie = ''}} = this.props;
  const {flowPostList = []} = topicsStore;
  let {topic, postPageNum} = this.state;
  return (fn) => {
    return Tools.request({
      url: 'flow/posts',
      header: {
        'cookie': cookie
      },
      data: Object.assign({}, {
        pageNum: postPageNum++,
        pageSize: staticData.pageSize
      }, topic ? {
        topic
      } : {}),
      success: async data => {
        const {data: _data = [], total = 0} = data || {};
        let _flowPostList = this.state.postPageNum === 1 ? _data : [...flowPostList, ..._data];
        setTopicsAttrValueHandler({
          flowPostList: _flowPostList
        });
        this.setState({
          postTotal: total,
          postPageNum
        }, () => {
          this.hasNext = false;
          this.setState({
            loading: false
          });
        });
      },
      fail: (res) => {
        this.setState({
          loading: false
        });
        return res;
      },
      complete: (res) => {
      }
    });
  };
}

/**
 * 拉取话题内容流
 * @returns {*}
 */
function getFlowPostsByTopics() {
  let {topic, postPageNum} = this.state;
  const {setFindTopicsAttrValueHandler, findTopicsStore} = this.props;
  const {flowPostList = []} = findTopicsStore;
  return (fn) => {
    return Tools.request({
      url: 'flow/posts',
      data: Object.assign({}, {
        pageNum: postPageNum++,
        pageSize: staticData.pageSize
      }, topic ? {
        topic
      } : {}),
      success: async data => {
        const {data: _data = [], total = 0} = data || {};
        let _flowPostList = this.state.postPageNum === 1 ? _data : [...flowPostList, ..._data];
        setFindTopicsAttrValueHandler({
          flowPostList: _flowPostList
        });
        this.setState({
          postTotal: total,
          postPageNum
        }, () => {
          this.hasNext = false;
          this.setState({
            loading: false
          });
        });
      },
      fail: (res) => {
        this.setState({
          loading: false
        });
        return res;
      },
      complete: (res) => {
      }
    });
  };
}

/**
 * 获取某条post的详情页接口
 * @returns {*}
 */
function getFlowPostsDetail() {
  const {id} = this.state;
  return Tools.request({
    url: `flow/postDetails/${id}`,
    success: data => {
      const {comments = [], commentTotal = 0} = data || {};
      this.setState({
        topicDetail: data,
        commentsList: comments,
        commentsTotal: commentTotal,
        isNext: false
      }, () => {
        const {params: {scrollTop = 0}} = this.$router;
        const {navBarPaddingTop = 0} = Tools.adaptationNavBar();
        if (scrollTop) {
          Taro.createSelectorQuery().select('#pet-topic-detail-content').fields({
            size: true
          }, res => {
            const {height} = res;
            this.setState({
              scrollTop: {
                height: height - navBarPaddingTop
              }
            });
          }).exec();
        }
      });
    },
    fail: (res) => {
      return res;
    },
    complete: (res) => {
      return res;
    }
  });
}

/**
 * 拉取某条Post的回复列表
 * @returns {*}
 */
function getFlowPostsDetailComments() {
  let {
    id,
    pageNum,
    pageSize
  } = this.state;
  return Tools.request({
    url: `flow/posts/${id}/comments?pageNum=${++pageNum}&pageSize=${pageSize}`,
    success: data => {
      const {data: _data} = data || {};
      const {commentsList} = this.state;
      this.setState({
        pageNum,
        commentsList: [...commentsList, ..._data]
      }, () => {
        this.isNext = false;
      });
    },
    fail: (res) => {

    },
    complete: (res) => {

    }
  });
}

/**
 * 获取用户的昵称和头像
 * @returns {*}
 */
function getTinyHomeInfo() {
  return Tools.request({
    url: 'users/tinyHomeInfo',
    success: data => {
      const {nickName, avatarUrl} = data;
      this.setState({
        avatarUrl,
        nickName
      });
    },
    fail: res => {
      console.log(res);
    },
    complete: res => {
      console.log(res);
    }
  });
}

/**
 * 同步微信用户授权后的用户信息
 * @returns {*}
 */
function syncUserInfo(params) {
  const {pages} = this.state;
  return Tools.request({
    url: 'users/syncUserInfo',
    method: 'post',
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: params,
    success: data => {
      Taro.navigateBack({
        delte: 1
      });
    },
    fail: (res) => {

    },
    complete: (res) => {

    }
  });
}

/**
 * 进行评论
 */
function flowPostCommentRequest() {
  const {id, commentValue, parentCommentId} = this.state;
  return Tools.request({
    url: `flow/posts/${id}/comments`,
    method: 'post',
    data: Object.assign({}, {
      comment: commentValue ? commentValue : ''
    }, parentCommentId ? {parentCommentId} : {}),
    success: data => {
      this.setState(Object.assign({}, {
        pageNum: 1,
        commentValue: '',
        isFocus: false,
        inputDistanceBoard: 0,
        parentCommentId: 0
      }, parentCommentId ? {} : {scrollTop: 0}), () => {
        getFlowPostsDetail.call(this);
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

/**
 * (不)喜欢某条Post
 */
function flowPostsTopicsLike(id) {
  const {
    topicsStore: {flowPostList: topicsFlowPostList},
    findTopicsStore: {flowPostList = []},
    setTopicsAttrValueHandler = () => {

    },
    setFindTopicsAttrValueHandler = () => {

    }
  } = this.props;
  return Tools.request({
    url: `flow/posts/${id}/like`,
    method: 'post',
    data: {
      id
    },
    success: data => {
      const {liked, likeCount} = data;
      const currentItem = flowPostList.find(item => item['id'] === id);
      const topicsCurrentItem = topicsFlowPostList.find(item => item['id'] === id);
      if (currentItem) {
        currentItem['goodCount'] = likeCount;
        currentItem['liked'] = liked;
      }
      if (topicsCurrentItem) {
        topicsCurrentItem['goodCount'] = likeCount;
        topicsCurrentItem['liked'] = liked;
      }
      setTopicsAttrValueHandler({
        flowPostList: topicsFlowPostList
      });
      setFindTopicsAttrValueHandler({
        flowPostList
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

/**
 * 在详情页(不)喜欢某条Post
 */
function flowPostsTopicsDetailLike() {
  const {id} = this.state;
  const {
    topicsStore: {flowPostList: topicsFlowPostList},
    findTopicsStore: {flowPostList = []},
    setTopicsAttrValueHandler = () => {

    },
    setFindTopicsAttrValueHandler = () => {

    }
  } = this.props;
  return Tools.request({
    url: `flow/posts/${id}/like`,
    method: 'post',
    data: {
      id
    },
    success: data => {
      const {liked, likeCount} = data;
      const currentItem = flowPostList.find(item => item['id'] === Number(id));
      const topicsCurrentItem = topicsFlowPostList.find(item => item['id'] === Number(id));
      if (currentItem) {
        currentItem['goodCount'] = likeCount;
        currentItem['liked'] = liked;
      }
      if (topicsCurrentItem) {
        topicsCurrentItem['goodCount'] = likeCount;
        topicsCurrentItem['liked'] = liked;
      }
      setTopicsAttrValueHandler({
        flowPostList: topicsFlowPostList
      });
      setFindTopicsAttrValueHandler({
        flowPostList
      });
      this.setState({
        liked,
        like: likeCount
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

/**
 * 发布上传图片
 * @尹文楷
 */
function uploadImg({size, value, key, total}) {
  const {count} = this;
  let {files = [], images = []} = this.state;
  return Tools.uploadFile({
    url: 'tinyStatics/uploadImg/v2',
    filePath: value.url,
    size,
    name: 'file',
    formData: {
      type: constants.uploadPrefix
    },
    success: (data, statusCode) => {
      if (statusCode === 200) {
        images.push(data);
        files.push(value);
        const {length} = images;
        this.setState({
          moveCount: count - length
        });
        if (length >= count) {
          this.setState({
            showAddBtn: false
          });
        }
        //将上传图片loading消除
        if (key >= (total - 1)) {
          this.setState({
            uploadLoading: false
          });
        }
        this.setState({
          files,
          images
        });
      } else {
        this.setState({
          uploadLoading: false
        });
      }
    },
    complete: async (res) => {

    }
  });
}

/**
 * 发布一条Posts
 */
function flowPostsPublish() {
  const {images, content} = this.state;
  const {flowTopicStore: {topic}, setFlowTopicAttrValueHandler} = this.props;
  const {topic: topics = null} = topic || {};
  return Tools.request({
    url: 'flow/posts',
    method: 'post',
    data: Object.assign({}, {
      imgs: images,
      content
    }, topics ? {
      topic: topics
    } : {}),
    success: data => {
      this.setState({
        images: [],
        files: [],
        content: null
      });
      setFlowTopicAttrValueHandler({
        topic: null
      });
      this.setState({
        reviewModal: true
      });
    },
    fail: res => {
      return res;
    },
    complete: res => {
      return res;
    }
  });
}

const topicsAPI = {
  getFlowTopics,
  getFlowPosts,
  getFlowPostsByTopics,
  getFlowPostsDetail,
  getFlowPostsDetailComments,
  getTinyHomeInfo,
  syncUserInfo,
  flowPostCommentRequest,
  flowPostsTopicsLike,
  flowPostsTopicsDetailLike,
  uploadImg,
  flowPostsPublish
};

export default topicsAPI;
