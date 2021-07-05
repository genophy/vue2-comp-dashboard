import { LangUtil } from '@/libs/util';

/**
 * @description 找出列表中存在某个值的
 *    // codeList [{id,code,desc}]
 *    {{'20022' | CusListFind(codeList,'code','desc')}}
 * @author  g_eno_phy
 * @version 0.1
 *
 */
export const CusListFind = function (value, list = [], keyName = '', resName = '', defaultValue = '-') {
  // 若未设置值，则返回默认值
  if (LangUtil.isNil(value) || !list || !keyName || !resName) {
    return defaultValue;
  }
  const tmp = (list || []).filter(item => `${item[keyName]}` === `${value}`)[0] || {};
  return tmp[resName] || defaultValue;
};
