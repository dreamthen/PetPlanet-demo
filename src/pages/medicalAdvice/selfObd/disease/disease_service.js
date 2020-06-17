import Tools from '../../../../utils/petPlanetTools';
import {setDiseaseAttrValue} from './disease_action';

/**
 * 请求自诊选项详情页接口
 * @returns {function(*)}
 */
function getSymptomDetail() {
  return (dispatch) => {
    const {optionId, tagActiveMap} = this.state;
    return Tools.request({
      url: 'cnslt/symptomDetail',
      data: {
        optionId
      },
      success: (data, header) => {
        const {symptoms} = data;
        const copySymptoms = Object.assign({}, symptoms);
        tagActiveMap.clear();
        while (copySymptoms.length > 0) {
          tagActiveMap.set(copySymptoms.shift()['id'], false);
        }
        dispatch(setDiseaseAttrValue({
          ...data
        }));
        this.setState({
          tagActiveMap
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
  };
}

/**
 * 根据症状搜索疾病
 * @尹文楷
 */
function searchIllness() {
  return (dispatch) => {
    const {symptoms_state, optionId} = this.state;
    return Tools.request({
      url: 'cnslt/searchIllness',
      method: 'post',
      data: {
        optionId,
        symptoms: symptoms_state
      },
      success: (data, header) => {
        dispatch(setDiseaseAttrValue({
          illness: data
        }));
      },
      fail: (res) => {

      },
      complete: (res) => {
        this.setState({
          searchLoading: false
        });
      }
    });
  };
}

const diseaseAPI = {
  getSymptomDetail,
  searchIllness
};

export default diseaseAPI;
