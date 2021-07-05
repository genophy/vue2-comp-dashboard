/**
 * @description
 * @author  g_eno_phy
 * @version 0.1
 *
 */

export default class DateUtil {
  /**
   * 获取月的天数
   * @param year
   * @param month 1-12
   */
  static getMonthDayMax = (year, month) => {
    year      = Number(year);
    month     = Number(month);
    let count = 30;
    switch (month) {
      case 1:
      case 3:
      case 5:
      case 7:
      case 8:
      case 10:
      case 12:
        count = 31;
        break;
      case 2:
        count = ((((year % 4) === 0) && ((year % 100) !== 0)) || ((year % 400) === 0)) ? 29 : 28;
        break;
      default:
        break;
    }
    return count;
  };

  /**
   * 生成月份天数
   * @param year
   * @param month 1-12
   */
  static generatorMonthDays = (year, month) => {
    const max       = DateUtil.getMonthDayMax(year, month);
    const startDate = DateUtil.generateDate({year: year, month: month, day: 1});
    return DateUtil.generateRangeDate(startDate, max - 1);
  };

  /**
   * 生成日期范围
   * @param {*} startDate
   * @param {*} days
   */
  static generateRangeDate = (startDate, days) => {
    startDate = DateUtil.toDate(startDate);
    if (!startDate) return [];
    const arr = [new Date(startDate.getTime())];
    // 遍历追加天数
    for (let i = 0; i < days; i++) {
      startDate.setDate(startDate.getDate() + 1);
      arr.push(new Date(startDate.getTime()));
    }
    return arr;
  };

  /**
   * 生成时间
   * 若参数存存在 则以 + 或- 开头，则依据当前时间酌情增加或减少，否则设置对应值
   * 若参数不存在，采用默认值
   * @param params
   * @param params.date       {Date}
   * @param params.year       {Number | String}
   * @param params.month      {Number | String}  1-12
   * @param params.day        {Number | String}  1-30
   * @param params.hour       {Number | String}  0-23
   * @param params.minute     {Number | String}  0-59
   * @param params.second     {Number | String}  0-59
   */
  static generateDate = (params = {}) => {
    const d = new Date();
    d.setDate(1);
    if (params.date && params.date instanceof Date) {
      d.setTime(params.date.getTime());
    }

    if (params.year) {
      if (/^[+-].*?/.test(params.year)) {
        d.setFullYear(d.getFullYear() + Number(params.year));
      } else {
        d.setFullYear(params.year);
      }
    }
    if (params.month) {
      if (/^[+-].*?/.test(params.month)) {
        d.setMonth(d.getMonth() + Number(params.month));
      } else {
        d.setMonth(Number(params.month) - 1);
      }
    }
    if (params.day) {
      if (/^[+-].*?/.test(params.day)) {
        d.setDate(d.getDate() + Number(params.day));
      } else {
        d.setDate(params.day);
      }
    }
    if (params.hour) {
      if (/^[+-].*?/.test(params.hour)) {
        d.setHours(d.getHours() + Number(params.hour));
      } else {
        d.setHours(params.hour);
      }
    }
    if (params.minute) {
      if (/^[+-].*?/.test(params.minute)) {
        d.setMinutes(d.getMinutes() + Number(params.minute));
      } else {
        d.setMinutes(params.minute);
      }
    }
    if (params.second) {
      if (/^[+-].*?/.test(params.second)) {
        d.setSeconds(d.getSeconds() + Number(params.second));
      } else {
        d.setSeconds(params.second);
      }
    }

    return d;
  };

  /**
   * 获取星期
   */
  static weekStr      = (dateValue) => {
    dateValue = DateUtil.toDate(dateValue);
    if (!dateValue) return '';
    return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][dateValue.getDay()];
  };

  /**
   * 将日期字符转换成日期对象
   * @param {Date|Number|String} dateValue
   * @returns {Date}
   */
  static toDate = (dateValue) => {
    // return new Date(dateValue.replace(/(\.|\-)/g, '/'));
    if (dateValue) {
      if (dateValue instanceof Date) {
        const d = new Date();
        d.setTime(dateValue.getTime());
        return d;
      } else if (/^[0-9]{10,13}$/.test(dateValue)) {
        const tempDate = new Date();
        tempDate.setTime(Number(`${dateValue}000`.slice(0, 13)));
        return tempDate;
      } else if (typeof dateValue === 'string') {
        // 若只是年和月，变成年月日
        if (/^\d+[-/]\d+$/.test(dateValue)) {
          dateValue += '-01';
        }
        // 只截取 yyyy-MM-dd HH:mm:ss 长度
        dateValue = dateValue.slice(0, 19);
        return new Date(dateValue.replace(/[.-]/g, '/'));
      }
    }
    return null;
  };

  /**
   * 将日期对象格式化成新的日期字符串
   *      - Date  ->  2019-03-02 12:18:05
   * @param  {Date|Number|String} dateValue
   * @param    sFormat  yyyy-MM-dd HH:mm:ss
   * @returns  {string}
   */
  static toDateStr = (dateValue, sFormat = 'yyyy-MM-dd HH:mm:ss') => {
    if (!sFormat) {
      sFormat = 'yyyy-MM-dd HH:mm:ss';
    }
    dateValue = DateUtil.toDate(dateValue);
    if (!dateValue) {
      return '';
    }
    const time       = {
      Year       : 0,
      TYear      : '0',
      Month      : 0,
      TMonth     : '0',
      Day        : 0,
      TDay       : '0',
      Hour       : 0,
      THour      : '0',
      hour       : 0,
      Thour      : '0',
      Minute     : 0,
      TMinute    : '0',
      Second     : 0,
      TSecond    : '0',
      Millisecond: 0
    };
    time.Year        = dateValue.getFullYear();
    time.TYear       = String(time.Year).substr(2);
    time.Month       = dateValue.getMonth() + 1;
    time.TMonth      = time.Month < 10 ? '0' + time.Month : String(time.Month);
    time.Day         = dateValue.getDate();
    time.TDay        = time.Day < 10 ? '0' + time.Day : String(time.Day);
    time.Hour        = dateValue.getHours();
    time.THour       = time.Hour < 10 ? '0' + time.Hour : String(time.Hour);
    time.hour        = time.Hour < 13 ? time.Hour : time.Hour - 12;
    time.Thour       = time.hour < 10 ? '0' + time.hour : String(time.hour);
    time.Minute      = dateValue.getMinutes();
    time.TMinute     = time.Minute < 10 ? '0' + time.Minute : String(time.Minute);
    time.Second      = dateValue.getSeconds();
    time.TSecond     = time.Second < 10 ? '0' + time.Second : String(time.Second);
    time.Millisecond = dateValue.getMilliseconds();

    return sFormat.replace(/yyyy/ig, String(time.Year))
      .replace(/yyy/ig, String(time.Year))
      .replace(/yy/ig, time.TYear)
      .replace(/y/ig, time.TYear)
      .replace(/MM/g, time.TMonth)
      .replace(/M/g, String(time.Month))
      .replace(/dd/ig, time.TDay)
      .replace(/d/ig, String(time.Day))
      .replace(/HH/g, time.THour)
      .replace(/H/g, String(time.Hour))
      .replace(/hh/g, time.Thour)
      .replace(/h/g, String(time.hour))
      .replace(/mm/g, time.TMinute)
      .replace(/m/g, String(time.Minute))
      .replace(/ss/ig, time.TSecond)
      .replace(/s/ig, String(time.Second))
      .replace(/fff/ig, String(time.Millisecond));
  };

  /**
   * 日期转换成秒或者毫秒
   * @param {Date|Number|String} dateValue
   * @param isSecond 转换成秒，否则13位毫秒
   * @returns {string | number}
   */
  static ToTimestamp = (dateValue, isSecond = true) => {
    const d = DateUtil.toDate(dateValue);
    if (!d) {
      return 0;
    }
    // date的getTime默认返回是毫秒
    return isSecond ? Math.floor(d.getTime() / 1000) : d.getTime();
  };

  /**
   * 对比日期大小
   *      dateMax - dateMin
   *          < 0 表示 dateMin > dateMax
   *          = 0 表示 data1 = dateMax
   *          > 0 表示 dateMin < dateMax
   * @param {Date} dateMin
   * @param {Date} dateMax
   * @param {string} formatStr
   * @returns {number} dateMax.time - dateMin.time (毫秒相减)
   */
  static compareDate = (dateMin, dateMax, formatStr = 'yyyy-MM-dd HH:mm:ss') => {
    // 任意一方不为日期，都直接返回1，表示不用比较了
    if (typeof dateMin !== 'object' || !(dateMin instanceof Date) || typeof dateMax !== 'object' || !(dateMax instanceof Date)) {
      return 1;
    }

    if (!/yyyy/.test(formatStr)) {
      dateMin.setFullYear(2008);
      dateMax.setFullYear(2008);
    }
    if (!/MM/.test(formatStr)) {
      dateMin.setMonth(0);
      dateMax.setMonth(0);
    }
    if (!/dd/.test(formatStr)) {
      dateMin.setDate(1);
      dateMax.setDate(1);
    }
    if (!/HH/.test(formatStr)) {
      dateMin.setHours(0);
      dateMax.setHours(0);
    }
    if (!/mm/.test(formatStr)) {
      dateMin.setMinutes(0);
      dateMax.setMinutes(0);
    }
    if (!/ss/.test(formatStr)) {
      dateMin.setSeconds(0);
      dateMax.setSeconds(0);
    }

    const res = dateMax.getTime() - dateMin.getTime();
    if (Math.abs(res) < 1000) {
      return 0;
    }
    return dateMax.getTime() - dateMin.getTime();
  };
}
