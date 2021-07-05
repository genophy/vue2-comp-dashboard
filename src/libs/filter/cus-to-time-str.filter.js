/**
 * @description
 * @author  g_eno_phy
 *    {{ 1555555555 | CusToDateStr}}
 *    {{ 1555555555555 | CusToDateStr}}
 * @version 0.1
 *
 */

/**
 * 将 timestamp 转换成对应的日期字符串
 * @constructor
 * @param timeNum 时间数值
 * @param unit 单位 [y,M,d,H,m,s]
 * @param defaultValue
 * @returns {*}
 */
export const CusToTimeStr = (timeNum, unit, defaultValue = '-') => {
  if (!timeNum) return defaultValue;
  // 先将 timeNum 转化成 秒
  let num = Number(timeNum) || 0;
  switch (unit) {
    case 'y':
      num = num * 360 * 24 * 3600;
      break;
    case 'M':
      num = num * 30 * 24 * 3600;
      break;
    case 'd':
      num = num * 24 * 3600;
      break;
    case 'H':
      num = num * 3600;
      break;
    case 'm':
      num = num * 60;
      break;
    default:
      break;
  }
  const y        = Math.floor(num / (360 * 24 * 3600)); // 年
  let M          = Math.floor(num / (30 * 24 * 3600)); // 月
  let d          = Math.floor(num / (24 * 3600)); // 天
  let H          = Math.floor(num / 3600); // 时
  let m          = Math.floor(num / 60); // 分
  let s          = Math.floor(num); // 秒
  s              = s - m * 60;
  m              = m - H * 60;
  H              = H - d * 24;
  d              = d - M * 30;
  M              = M - y * 12;
  const unitList = ['年', '月', '天', '时', '分', '秒'];

  return [y, M, d, H, m, s].map((val, idx) => {
    if (!val) return '';
    if (idx === 0) {
      return `${val}${unitList[idx]}`;
    }
    return `${val > 9 ? val : '0' + val}${unitList[idx]}`;
  }).filter(val => !!val).join('');
};
