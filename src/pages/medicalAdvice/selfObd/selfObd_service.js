import Tools from '../../../utils/petPlanetTools';

/**
 * 请求症状自我诊断接口
 */
function getSymptomOptions() {
  return Tools.request({
    url: 'cnslt/symptomOptions',
    data: {},
    success: (data, header) => {
      this.setState({
        obdList: data
      });
    },
    fail(res) {

    },
    complete(res) {

    }
  });
}

const selfObdAPI = {
  getSymptomOptions
};

export default selfObdAPI;
