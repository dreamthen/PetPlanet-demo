import Taro, {Component} from '@tarojs/taro';
import {Provider} from '@tarojs/redux';
import Tools from './utils/petPlanetTools';
import Topic from './pages/topics';
import Index from './pages/index';
import MedicalAdvice from './pages/medicalAdvice';
import Message from './pages/user/message';
import User from './pages/user';
import Publish from './pages/index/publish';
import Detail from './pages/index/detail';
import ShareDetail from './pages/index/shareDetail';
import Collection from './pages/user/collection';
import PublishMine from './pages/user/publishMine';
import Attendance from './pages/attendance';
import Communications from './pages/user/message/communications';
import MedicalConsult from './pages/medicalAdvice/medicalConsult';
import MedicalDoctor from './pages/medicalAdvice/medicalDoctor';
import ResultPage from './pages/commons/resultPage';
import SelfObd from './pages/medicalAdvice/selfObd';
import Disease from './pages/medicalAdvice/selfObd/disease';
import DiseaseDetail from './pages/medicalAdvice/selfObd/disease/diseaseDetail';
import FlowTopics from './pages/topics/flowPublish/flowTopics';
import FlowComment from './pages/topics/topicsDetail/flowComment';
import FlowPublish from './pages/topics/flowPublish';
import TopicsDetail from './pages/topics/topicsDetail';
import Scope from './pages/commons/scope';
import FindTopics from './pages/topics/findTopics';
import Foster from './pages/user/foster';
import FosterDetail from './pages/user/foster/fosterDetail';
import PlaceOrder from './pages/user/foster/fosterDetail/placeOrder';
import Agreement from './pages/user/foster/fosterDetail/agreement';
import PlaceOrderDetail from './pages/user/foster/fosterDetail/placeOrderDetail';
import OrderList from './pages/user/orderList';
import RedPacket from './pages/commons/redPacket';
import CommonDetail from './pages/commons/detail';
import ShareCommonDetail from "./pages/commons/detail/shareDetail";
import CommunicationsGoodsList from './pages/user/message/communications/communicationsGoodsList';
import CommonOrder from './pages/commons/detail/order';
import CommonOrderDetail from './pages/commons/detail/orderDetail';
import CommonAddress from './pages/commons/detail/address';

import store from './store';
import {setAttrValue} from './pages/index/home_action';

import './stylesheets/index.less';


class App extends Component {

  config = {
    pages: [
      'pages/topics/index',
      'pages/index/index',
      'pages/medicalAdvice/index',
      'pages/user/index',
      'pages/user/message/index',
      'pages/index/publish/index',
      'pages/index/detail/index',
      'pages/index/shareDetail/index',
      'pages/user/collection/index',
      'pages/user/publishMine/index',
      'pages/attendance/index',
      'pages/user/message/communications/index',
      'pages/medicalAdvice/medicalConsult/index',
      'pages/medicalAdvice/medicalDoctor/index',
      'pages/commons/resultPage/index',
      'pages/medicalAdvice/selfObd/index',
      'pages/medicalAdvice/selfObd/disease/index',
      'pages/medicalAdvice/selfObd/disease/diseaseDetail/index',
      'pages/topics/flowPublish/flowTopics/index',
      'pages/topics/topicsDetail/index',
      'pages/commons/scope/index',
      'pages/topics/topicsDetail/flowComment/index',
      'pages/topics/flowPublish/index',
      'pages/topics/findTopics/index',
      'pages/user/foster/index',
      'pages/user/foster/fosterDetail/index',
      'pages/user/foster/fosterDetail/placeOrder/index',
      'pages/user/foster/fosterDetail/agreement/index',
      'pages/user/foster/fosterDetail/placeOrderDetail/index',
      'pages/user/orderList/index',
      'pages/commons/redPacket/index',
      'pages/commons/detail/index',
      'pages/user/message/communications/communicationsGoodsList/index',
      'pages/commons/detail/order/index',
      'pages/commons/detail/orderDetail/index',
      'pages/commons/detail/address/index',
      'pages/commons/detail/shareDetail/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black',
      navigationStyle: 'default'
    },
    permission: {
      'scope.userLocation': {
        desc: '你的位置信息将用于小程序位置接口的效果展示'
      }
    }
  };

  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    await store.dispatch(setAttrValue({
      loginSessionStatus: true
    }));
    Tools.mtaAppInit.apply(this);
  }

  async componentDidShow() {
  }

  componentDidHide() {
  }

  componentCatchError() {
  }

  componentDidCatchError() {
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <Topic/>
        <Index/>
        <MedicalAdvice/>
        <Message/>
        <User/>
        <Publish/>
        <Detail/>
        <ShareDetail/>
        <Collection/>
        <PublishMine/>
        <Attendance/>
        <Communications/>
        <MedicalConsult/>
        <MedicalDoctor/>
        <ResultPage/>
        <SelfObd/>
        <Disease/>
        <DiseaseDetail/>
        <FlowTopics/>
        <TopicsDetail/>
        <FlowComment/>
        <Scope/>
        <FlowPublish/>
        <FindTopics/>
        <Foster/>
        <FosterDetail/>
        <PlaceOrder/>
        <Agreement/>
        <PlaceOrderDetail/>
        <OrderList/>
        <RedPacket/>
        <Agreement/>
        <PlaceOrderDetail/>
        <OrderList/>
        <CommonDetail/>
        <ShareCommonDetail />
        <CommunicationsGoodsList/>
        <CommonOrder/>
        <CommonOrderDetail/>
        <CommonAddress />
      </Provider>
    )
  }
}

Taro.render(<App/>, document.querySelector('#app'));
