import Taro, {Component} from '@tarojs/taro';
import {connect} from '@tarojs/redux';
import {
  View,
  Text
} from '@tarojs/components';
import {
  AtNoticebar
} from 'taro-ui';

import Tools from '../../../../../utils/petPlanetTools';
import {setDiseaseAttrValue} from '../disease_action';
import {LoadingView, NavBarView} from '../../../../../components/bussiness-components';
import diseaseDetailAPI from './diseaseDetail_service';
import {loadingStatus} from '../../../../../constants';
import {imgs} from '../../../../../assets';

import 'taro-ui/dist/style/components/activity-indicator.scss';
import 'taro-ui/dist/style/components/loading.scss';
import 'taro-ui/dist/style/components/tag.scss';
import 'taro-ui/dist/style/components/icon.scss';
import 'taro-ui/dist/style/components/noticebar.scss';

import './loading-view.less';
import './index.less';

@connect((state, ownProps) => {
  return {
    diseaseStore: state.diseaseStore
  };
}, (dispatch, ownProps) => {
  return {
    /**
     * 多层处理函数
     * @尹文楷
     */
    setAttrValue(payload) {
      dispatch(setDiseaseAttrValue(payload));
    }
  };
})
class DiseaseDetail extends Component {
  static options = {
    addGlobalClass: true
  };

  config = {
    navigationStyle: 'custom'
  };

  state = {
    //查到患病结果的id
    illnessId: 0,
    //疾病名称
    illness: null,
    //疾病症状
    symptom: null,
    //病因
    cause: null,
    //症状描述
    symptomDetail: null,
    //疾病诊断
    diagnosis: null,
    //疾病治疗
    treatment: null,
    //疾病定义
    definition: null,
    //是否显示正在加载loading页面......
    loading: true
  };

  componentWillMount() {
    const {params: {id}} = this.$router;
    this.setState({
      illnessId: id
    });
  }

  componentDidMount() {
    diseaseDetailAPI.getIllnessDetail.call(this);
  }

  /**
   * 页面跳到上一页
   */
  redirectToBackPage() {
    Taro.navigateBack({
      delta: 1
    });
  }

  render() {
    const {illness, symptom, definition, cause, symptomDetail, diagnosis, treatment, loading} = this.state;
    const {redirectToBackPage} = this;
    const {navBarHeight = 0} = Tools.adaptationNavBar() || {};
    return (
      <View className='pet-diseaseDetail'>
        {
          loading && <LoadingView
            size={56}
            color='#fb2a5d'
            className='pet-diseaseDetail-loading'
            content={loadingStatus.progress.text}
          />
        }
        <NavBarView
          color='#000'
          title={illness}
          imgs={imgs.back}
          className='pet-diseaseDetail-navBar'
          onClickLeftIcon={redirectToBackPage}
        />
        <View
          style={{marginTop: `${navBarHeight - 10}rpx`}}
          className='pet-diseaseDetail-container'
        >
          <AtNoticebar
            single
            marquee={false}
            className='pet-diseaseDetail-propose'
          >
            *治疗方案仅为建议，具体诊疗请前往医院进行
          </AtNoticebar>
          <View
            className='pet-diseaseDetail-operation'
          >
            <Text className='pet-diseaseDetail-operation-title'>
              疾病症状
            </Text>
            <Text className='pet-diseaseDetail-operation-content'
                  selectable
            >
              {symptom}
            </Text>
          </View>
          <View className='pet-diseaseDetail-operation'>
            <Text className='pet-diseaseDetail-operation-title'>
              症状描述
            </Text>
            <Text className='pet-diseaseDetail-operation-content'
                  selectable
            >
              {symptomDetail}
            </Text>
          </View>
          <View className='pet-diseaseDetail-operation'>
            <Text className='pet-diseaseDetail-operation-title'>
              疾病定义
            </Text>
            <Text className='pet-diseaseDetail-operation-content'
                  selectable
            >
              {definition}
            </Text>
          </View>
          <View className='pet-diseaseDetail-operation'>
            <Text className='pet-diseaseDetail-operation-title'>
              病因
            </Text>
            <Text className='pet-diseaseDetail-operation-content'
                  selectable
            >
              {cause}
            </Text>
          </View>
          <View className='pet-diseaseDetail-operation'>
            <Text className='pet-diseaseDetail-operation-title'>
              疾病诊断
            </Text>
            <Text className='pet-diseaseDetail-operation-content'
                  selectable
            >
              {diagnosis}
            </Text>
          </View>
          <View className='pet-diseaseDetail-operation'>
            <Text className='pet-diseaseDetail-operation-title'>
              疾病治疗
            </Text>
            <Text className='pet-diseaseDetail-operation-content'
                  selectable
            >
              {treatment}
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

export default DiseaseDetail;
