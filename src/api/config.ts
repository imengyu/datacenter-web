import ConstConfig from "../const/Const"

export default {
  getApiPath,
}

function getApiPath() { return ConstConfig.API_HOST + ConstConfig.API_PATH }