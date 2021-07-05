/**
 * @description
 * @author  g_eno_phy
 *    {{ 1555555555 | CusToDateStr}}
 *    {{ 1555555555555 | CusToDateStr}}
 * @version 0.1
 *
 */
import { DateUtil } from '@/libs/util';

/**
 * 将 timestamp 转换成对应的日期字符串
 * @constructor
 * @param timestamp 时间（秒）；默认需要 x 1000 或加 000
 * @param formatStr 默认是 DateUtil的 yyyy-MM-dd HH:mm:ss
 * @param defaultValue
 * @returns {*}
 */
export const CusToDateStr = (timestamp, formatStr, defaultValue = '-') => {
  if (!timestamp) {
    return defaultValue || timestamp;
  }
  return DateUtil.toDateStr(timestamp, formatStr);
};
