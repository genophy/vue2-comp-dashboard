/**
 * @description
 * @author  g_eno_phy
 * @version 0.1
 * Date      :  2020-04-24 14:14
 */
// eslint-disable-next-line no-unused-vars
function ieVersion() {
  var b_version = navigator.appVersion;
  var version = b_version.split(';');
  if (!version[1]) {
    return 99;
  }
  var trim_Version = version[1].replace(/[ ]/g, '');

  if (trim_Version === 'MSIE6.0') {
    return 6;
  } else if (trim_Version === 'MSIE7.0') {
    return 7;
  } else if (trim_Version === 'MSIE8.0') {
    return 8;
  } else if (trim_Version === 'MSIE9.0') {
    return 9;
  } else if (trim_Version === 'MSIE10.0') {
    return 10;
  }
  return 99;
}
