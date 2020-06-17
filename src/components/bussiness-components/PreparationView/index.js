import Taro, {Component} from '@tarojs/taro';
import PropTypes from 'prop-types';
import {
  Text,
  View
} from '@tarojs/components';
import cns from 'classnames';

import './index.less';

/**
 * 筛选头部导航组件
 */
class PreparationView extends Component {
  static options = {
    addGlobalClass: true
  };

  static propTypes = {
    strategy: PropTypes.array.isRequired,
    current: PropTypes.any.isRequired,
    className: PropTypes.string,
    onChange: PropTypes.func.isRequired
  };

  state = {
    _current: 0
  };

  componentDidMount() {
    const {current} = this.props;
    if (current !== undefined) {
      this.setState({
        _current: current
      });
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const {current} = this.props;
    const {current: nextCurrent} = nextProps;
    if (current !== nextCurrent) {
      this.setState({
        _current: nextCurrent
      });
    }
  }

  /**
   * 筛选头部导航改变时,触发的动作
   * @param e
   * @param _current
   */
  onPreparationChangeHandler = (e, _current) => {
    const {onChange} = this.props;
    if (onChange !== undefined && _current !== undefined) {
      onChange(_current, e);
    } else {
      this.setState({
        _current
      });
      //取消冒泡
      e.stopPropagation();
    }
  };

  render() {
    const {strategy, className, current, onChange} = this.props;
    const {_current} = this.state;
    const {onPreparationChangeHandler} = this;
    return (
      <View className={cns(
        'preparation',
        className
      )}>
        {
          strategy && strategy.length > 0 && strategy.map((strategyItem, strategyIndex) => {
            return <View
              className={cns(
                'preparation-item',
                {'preparation-item-selected': strategyItem['key'] ? (_current === strategyItem['key']) : (_current === strategyIndex)}
              )}
              key={strategyIndex}
              onClick={(e) => {
                onPreparationChangeHandler(e, (current !== undefined && onChange !== undefined) ? strategyItem['key'] : strategyIndex);
              }}
            >
              <Text className='preparation-item-selected-text'>
                {strategyItem['value']}
              </Text>
              {
                (strategyItem['key'] ? (_current === strategyItem['key']) : (_current === strategyIndex)) ?
                  <View className='preparation-item-selected-border'>
                  </View> : null
              }
            </View>;
          })
        }
      </View>
    );
  }
}

export default PreparationView;
