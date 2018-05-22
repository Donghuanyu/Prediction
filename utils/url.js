const DEBUG = "debug";
const RELEASE = "release";
const DEBUG_BASE_URL = "http://localhost:8080/prediction";
const RELEASE_BASE_URL = "http://1.1.1.1:8080/prediction";

function debugOrRelease() {
  return DEBUG;
  // return RELEASE;
}

function getBaseUrl() {

  if(DEBUG == debugOrRelease()) {
    return DEBUG_BASE_URL;
  }

  if (RELEASE == debugOrRelease()) {
    return RELEASE_BASE_URL;
  }

  return DEBUG_BASE_URL;
}

/**
 * 大数据匹配用户
 */
function matchUser() {
  return getBaseUrl() + "/match/matchUser";
}

/**
 * 获取题目
 */
function getSubjects() {
  return getBaseUrl() + "/subject/getSubjects";
}

/**
 * 提交答案，获取测试结果
 */
function getPredictionResult() {
  return getBaseUrl() + "/predictionResult/getPredictionResult";
}

/**
 * 创建用户
 */
function createUser() {
  return getBaseUrl() + "/user/createUser";
}

/**
 * 留言
 */
function leaveMessage() {
  return getBaseUrl() + "/message/leaveMessage";
}

/**
 * 获取留言列表
 */
function getMessageList() {
  return getBaseUrl() + "/message/getMessageList";
}

/**
 * 分页获取发给我的留言列表
 */
function getMessagePageList() {
  return getBaseUrl() + "/message/getMessagePageList";
}

/**
 * 分页获取我发送的留言列表
 */
function getFromMessagePageList() {
  return getBaseUrl() + "/message/getFromMessagePageList";
}


module.exports = {
  matchUser: matchUser,
  getSubjects: getSubjects,
  getPredictionResult: getPredictionResult,
  createUser: createUser,
  leaveMessage: leaveMessage,
  getMessageList: getMessageList,
  getMessagePageList: getMessagePageList,
  getFromMessagePageList: getFromMessagePageList
}