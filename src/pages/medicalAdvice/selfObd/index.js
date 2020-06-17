import Taro, {Component} from '@tarojs/taro';
import {
  AtList,
  AtListItem,
  AtTabs,
  AtTabsPane
} from 'taro-ui';
import {connect} from '@tarojs/redux';

import selfObdAPI from './selfObd_service';
import {pageCurrentList} from '../../../constants';

import 'taro-ui/dist/style/components/tabs.scss';
import 'taro-ui/dist/style/components/list.scss';

import './index.less';

@connect((state, ownProps) => {
  return {};
}, (dispatch, ownProps) => {
  return {};
})
class SelfObd extends Component {
  static options = {
    addGlobalClass: true
  };

  config = {
    navigationBarTitleText: '症状自诊',
    disableScroll: true
  };

  state = {
    //症状自我诊断列表
    obdList: [],
    //当前选中的标签索引值
    current: 0
  };

  /**
   * 组件挂载时,请求接口'症状自我诊断'
   */
  componentDidMount() {
    //请求症状自我诊断接口
    selfObdAPI.getSymptomOptions.call(this);
  }

  /**
   * 点击或滑动时触发事件,选中标签列表索引值
   * @param current
   */
  obdFilterTabs = (current) => {
    this.setState({
      current
    });
  };

  /**
   * 点击症状进入详情页面
   * @param {id, title}
   * @param e
   */
  redirectToDisease = ({id, title}, e) => {
    Taro.navigateTo({
      url: `${pageCurrentList[16]}?optionId=${id}&title=${title}`
    });
    //取消冒泡事件
    e.stopPropagation();
  };

  render() {
    const {obdList, current} = this.state;
    const {obdFilterTabs, redirectToDisease} = this;
    return (
      <AtTabs
        current={current}
        tabList={obdList}
        scroll
        tabDirection='vertical'
        className='pet-selfObd-tabs'
        height='100%'
        onClick={obdFilterTabs}
      >
        {
          (obdList && obdList.length > 0) && obdList.map((obdItem, obdIndex) => {
            return (
              <AtTabsPane
                key={`${obdItem['id']}`}
                current={this.state.current}
                index={obdIndex}
                tabDirection='vertical'
              >
                <AtList
                  hasBorder={false}
                  className='pet-selfObd-tabs-list'
                >
                  {
                    obdItem['subOptions'] && obdItem['subOptions'].length > 0 && obdItem['subOptions'].map((subOptionItem, subOptionIndex) => {
                      return (
                        <AtListItem
                          key={`${subOptionItem['id']}`}
                          title={subOptionItem['title']}
                          className='pet-selfObd-tabs-list-item'
                          onClick={(e) => redirectToDisease(subOptionItem, e)}
                        />
                      );
                    })
                  }
                </AtList>
              </AtTabsPane>
            );
          })
        }
      </AtTabs>
    );
  }
}

export default SelfObd;
