import Tools from '../../utils/petPlanetTools';

function medicalAdviceHomeInfo() {
  const that = this;
  return Tools.request({
    url: 'cnslt/homeInfo',
    success: data => {
      const {cnsltBanners, dynamicList} = data;
      const {length} = dynamicList;
      length % 2 !== 0 && dynamicList.push(dynamicList[0]);
      that.setState({
        bannerList: cnsltBanners,
        consultingNewsList: dynamicList
      });
    },
    fail: (res) => {

    },
    complete: (res) => {

    }
  });
}

const medicalAdviceAPI = {
  medicalAdviceHomeInfo
};

export default medicalAdviceAPI;
