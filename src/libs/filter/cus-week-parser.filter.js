/**
 * @description 找出列表中存在某个值的
 *    {{['1'] | CusWeekParser }}
 * @author  g_eno_phy
 * @version 0.1
 *
 */
import { LangUtil } from '@/libs/util';

export const CusWeekParser = function (value, splitStr = ' ', defaultValue = '-') {
  const arr  = LangUtil.sortWeekNum(value);
  const week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

  return (arr || []).map(num => {
    return week[num - 1];
  }).join(splitStr) || defaultValue;
};
