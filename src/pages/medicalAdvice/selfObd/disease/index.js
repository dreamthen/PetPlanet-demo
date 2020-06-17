import Taro, {Component} from '@tarojs/taro';
import {
  Block,
  View,
  Text
} from '@tarojs/components';
import {connect} from '@tarojs/redux';
import {
  AtActivityIndicator,
  AtIcon,
  AtTag
} from 'taro-ui';
import cns from 'classnames';
import {NavBarView, LoadingView} from '../../../../components/bussiness-components';
import {setDiseaseAttrValue} from './disease_action';
import Tools from '../../../../utils/petPlanetTools';
import diseaseAPI from './disease_service';
import {pageCurrentList, loadingStatus} from '../../../../constants';
import {imgs} from '../../../../assets';

import 'taro-ui/dist/style/components/activity-indicator.scss';
import 'taro-ui/dist/style/components/loading.scss';
import 'taro-ui/dist/style/components/tag.scss';
import 'taro-ui/dist/style/components/icon.scss';

import '../../../commons/iconfont/iconfont.less';
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
    async setAttrValue(payload) {
      return await dispatch(setDiseaseAttrValue(payload));
    },
    /**
     * 请求自诊选项详情页接口
     * @尹文楷
     */
    getSymptomDetailHandler() {
      dispatch(diseaseAPI.getSymptomDetail.call(this));
    },
    /**
     * 请求根据症状搜索疾病接口
     * @尹文楷
     */
    searchIllnessHandler() {
      dispatch(diseaseAPI.searchIllness.call(this));
    }
  };
})
class Disease extends Component {
  static options = {
    addGlobalClass: true
  };

  config = {
    navigationStyle: 'custom'
  };

  state = {
    //初始化病症id
    optionId: 0,
    //顶部病症标题
    title: '',
    //筛选病症标签选中列表
    tagActiveMap: new Map(),
    //判断患病结果类别的高度字典是否已经进行赋值
    illnessShaking: false,
    //患病结果列表的高度字典
    illnessMap: new Map(),
    //病症标签选中之后要传输的字段
    symptoms_state: [],
    //患病结果的标准高度
    standardIllnessHeight: 66,
    //是否显示正在加载loading页面......
    loading: true,
    //是否显示搜索正在加载loading页面......
    searchLoading: false
  };

  /**
   * 挂载钱将病症id,进行初始化赋值
   */
  componentWillMount() {
    const {params: {optionId, title}} = this.$router || {};
    this.setState({
      optionId,
      title
    });
  }

  /**
   * 挂载后,请求自诊选项详情页接口
   */
  componentDidMount() {
    const {getSymptomDetailHandler} = this.props;
    getSymptomDetailHandler.call(this);
  }

  componentDidUpdate(prevState) {
    const {illnessShaking} = this.state;
    const {selectIllness} = this;
    if (!illnessShaking) {
      selectIllness.call(this);
    }
  }

  /**
   * 获取所有患病结果的元素列表
   */
  selectIllness() {
    const {diseaseStore: {illness}} = this.props;
    let {illnessMap, standardIllnessHeight} = this.state;
    let query = Taro.createSelectorQuery();
    query.selectAll('.pet-disease-illness-list-item-content').boundingClientRect((rect) => {
      let index = 0;
      while (rect.length > 0) {
        let rectItem = rect.shift();
        illnessMap.set(illness[index]['id'], {
          isExpand: false,
          showExpandButton: (rectItem['height'] > standardIllnessHeight)
        });
        index++;
      }
      this.setState({
        illnessMap,
        illnessShaking: true
      });
    }).exec();
  }

  /**
   * 页面跳到上一页
   */
  redirectToBackPage() {
    Taro.navigateBack({
      delta: 1
    });
  }

  /**
   * 点击标签时触发，返回标签名字和状态
   * @尹文楷
   */
  onTagActiveHandler = (symptomId, {name, active}) => {
    const {searchIllnessHandler, setAttrValue} = this.props;
    let {tagActiveMap, symptoms_state} = this.state;
    tagActiveMap.set(symptomId, !active);
    let existSymptoms = symptoms_state.indexOf(name);
    if (active) {
      symptoms_state.splice(existSymptoms, 1);
    } else {
      symptoms_state = [...symptoms_state, name];
    }
    this.setState({
      tagActiveMap,
      symptoms_state,
      searchLoading: true
    }, () => {
      searchIllnessHandler.call(this);
    });
  };

  /**
   * 点击展开/收起触发动态,展开 and 收起
   */
  onIllnessContentExpandHandler = (illnessId, e) => {
    const {illnessMap} = this.state;
    let illnessStatus = illnessMap.get(illnessId);
    illnessStatus.isExpand = !illnessStatus.isExpand;
    illnessMap.set(illnessId, illnessStatus);
    this.setState({
      illnessMap
    });
    //取消冒泡事件
    e.stopPropagation();
  };

  /**
   * 页面跳到患病结果详情
   */
  redirectToIllnessDetail = (e) => {
    const {currentTarget: {dataset: {id}}} = e;
    Taro.navigateTo({
      url: `${pageCurrentList[17]}?id=${id}`
    });
    e.stopPropagation();
  };

  render() {
    const {diseaseStore: {illness, symptoms}} = this.props;
    const {title, tagActiveMap, illnessMap, loading, searchLoading} = this.state;
    const {
      redirectToBackPage = () => {
      },
      onTagActiveHandler = () => {
      },
      redirectToIllnessDetail = () => {
      },
      onIllnessContentExpandHandler = () => {
      }
    } = this;
    const {navBarHeight = 0} = Tools.adaptationNavBar() || {};
    return (
      <View className='pet-disease'>
        {
          loading && <LoadingView
            size={56}
            color='#fb2a5d'
            className='pet-disease-loading'
            content={loadingStatus.progress.text}
          />
        }
        <NavBarView
          color='#000'
          title={title}
          imgs={imgs.back}
          className='pet-disease-navBar'
          onClickLeftIcon={redirectToBackPage}
        />
        <View
          className='pet-disease-symptoms'
          style={{paddingTop: `${navBarHeight}rpx`}}
        >
          <View className='pet-disease-symptoms-title'>
            <Text className='pet-disease-symptoms-title-content'>
              是否还出现以下症状
            </Text>
          </View>
          <View className='pet-disease-symptoms-tagList'>
            {
              symptoms && symptoms.length > 0 && symptoms.map((symptomsItem, symptomsIndex) => {
                return (
                  <Block
                    key={`${symptomsItem['id']}`}
                  >
                    <AtTag
                      name={`${symptomsItem['adjointSymptom']}`}
                      size='normal'
                      type='primary'
                      className='pet-disease-symptoms-tagItem'
                      circle
                      active={tagActiveMap.get(symptomsItem['id'])}
                      onClick={(tagInfo, event) => onTagActiveHandler(symptomsItem['id'], tagInfo)}
                    >
                      {symptomsItem['adjointSymptom']}
                    </AtTag>
                  </Block>
                )
              })
            }
          </View>
        </View>
        <View className='pet-disease-illness'>
          <View className='pet-disease-illness-title'>
            <Text className='pet-disease-illness-title-content'>
              可能的患病结果
            </Text>
            <View className='pet-disease-illness-propose'>
              *治疗方案仅为建议，具体诊疗请前往医院进行
            </View>
          </View>
          <View className='pet-disease-illness-list'>
            {
              illness && illness.length > 0 && !searchLoading ? illness.map((illnessItem, illnessIndex) => {
                const {showExpandButton, isExpand} = illnessMap.get(illnessItem['id']) || {};
                return (
                  <Block
                    key={`${illnessItem['id']}`}
                  >
                    <View
                      className='pet-disease-illness-list-item'
                      data-id={illnessItem['id']}
                      onClick={redirectToIllnessDetail}
                    >
                      <Text
                        selectable
                        className='pet-disease-illness-list-item-title'
                      >
                        {illnessItem['illness']}
                      </Text>
                      <Text
                        selectable
                        className={cns(
                          'pet-disease-illness-list-item-content',
                          {
                            'pet-disease-illness-list-item-content-clamp': showExpandButton && !isExpand
                          }
                        )}
                      >
                        {illnessItem['definition']}
                      </Text>
                      {
                        showExpandButton && <View onClick={(e) => e.stopPropagation()}>
                          <View
                            className='pet-disease-illness-list-item-content-expand'
                            onClick={(e) => onIllnessContentExpandHandler(illnessItem['id'], e)}
                          >
                            {isExpand ? '收起' : '展开'}
                          </View>
                        </View>
                      }
                    </View>
                  </Block>
                );
              }) : (!illness || illness.length <= 0) ? <View className='pet-disease-empty'>
                <AtIcon
                  className='pet-disease-empty-icon'
                  prefixClass='iconfont'
                  value='petPlanet-cat-ao'
                  color='#000'
                  size={48}
                />
                <View className='pet-disease-empty-description'>
                  啊哦~铲屎官搜索不到任何患病的结果
                </View>
              </View> : <View className='pet-disease-searchLoading'>
                <AtActivityIndicator
                  className='pet-disease-searchLoading-icon'
                  color='#fb2a5d'
                  size={48}
                />
                <View className='pet-disease-searchLoading-description'>
                  铲屎官努力搜索加载中...
                </View>
              </View>
            }
          </View>
        </View>
      </View>
    );
  }
}

export default Disease;
