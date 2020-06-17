import Tools from '../../../../../utils/petPlanetTools';

/**
 * 加载疾病详情
 */
function getIllnessDetail() {
  const {illnessId} = this.state;
  return Tools.request({
    url: `cnslt/illnesses/${illnessId}`,
    success: (data, header) => {
      this.setState({
        ...data
      });
    },
    fail: (res) => {

    },
    complete: (res) => {
      this.setState({
        loading: false
      });
    }
  });
}

const diseaseDetailAPI = {
  getIllnessDetail
};

export default diseaseDetailAPI;
