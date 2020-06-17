import {combineReducers} from 'redux';
import homeStore from '../pages/index/homeStore';
import userStore from '../pages/user/userStore';
import publishStore from '../pages/index/publish/publishStore';
import detailStore from '../pages/index/detail/detailStore';
import collectionStore from '../pages/user/collection/collectionStore';
import publishMineStore from '../pages/user/publishMine/publishMineStore';
import attendanceStore from '../pages/attendance/attendanceStore';
import medicalConsultStore from '../pages/medicalAdvice/medicalConsult/medicalConsultStore';
import communicationsStore from '../pages/user/message/communications/communicationsStore';
import diseaseStore from '../pages/medicalAdvice/selfObd/disease/diseaseStore';
import flowTopicStore from '../pages/topics/flowPublish/flowTopics/flowTopicStore';
import topicsStore from '../pages/topics/topicsStore';
import findTopicsStore from '../pages/topics/findTopics/findTopicsStore';
import agreementStore from '../pages/user/foster/fosterDetail/agreement/agreementStore';

const rootReducer = combineReducers({
  homeStore,
  userStore,
  publishStore,
  detailStore,
  collectionStore,
  publishMineStore,
  attendanceStore,
  communicationsStore,
  medicalConsultStore,
  diseaseStore,
  flowTopicStore,
  topicsStore,
  findTopicsStore,
  agreementStore
});

export default rootReducer;
