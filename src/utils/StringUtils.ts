

export default {
  isChinaPoneNumber,
  isEmail,
  isUrl,
  isNumber,
  isBase64,
  isNullOrEmpty,
}

/**
 * 检查字符串是否为空或null
 * @param str 字符串
 */
function isNullOrEmpty(str){
  return !str || typeof str == 'undefined' || str == ''
}
/**
* 判断字符串是否是 Base64 编码
* @param {String} str 
*/
function isBase64(str : string) {
  return /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{4}|[A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)$/.test(str);
}
/**
 * 检测字符串是否是一串数字
 * @param {String} val 
 */
function isNumber(val : string) {
  var regPos = /^\d+(\.\d+)?$/; //非负浮点数
  var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
  if (regPos.test(val) || regNeg.test(val)) {
    return true;
  } else {
    return false;
  }
}
function isUrl(str : string) {
  var myreg=/^(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]$/;
  if (!myreg.test(str)) {
      return false;
  } else {
      return true;
  }
}
function isChinaPoneNumber(str : string) {
  var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
  if (!myreg.test(str)) {
      return false;
  } else {
      return true;
  }
}
function isEmail(str : string){
  var re=/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
  if (re.test(str) != true) {
    return false;
  }else{
    return true;
  }
}