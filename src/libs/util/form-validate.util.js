/**
 * @description 校验 {validator: FormValidateUtil.noChinese, trigger: 'blur'}
 * @author  g_eno_phy
 * @version 0.1
 *
 */
export default class FormValidateUtil {
  /**
   * 不包含中文
   * @param rule
   * @param value
   * @param callback
   */
  static noChinese = (rule, value, callback) => {
    if (!/[\u4e00-\u9fa5]/g.test(value)) {
      callback();
    } else {
      callback(new Error('不能含有中文'));
    }
  };

  /**
   * 项目名
   * @param rule
   * @param value
   * @param callback
   */
  static projectName = (rule, value, callback) => {
    if (/^[\u4e00-\u9fa5a-z]{1,50}$/i.test(value)) {
      callback();
    } else {
      callback(new Error('项目名为1-50位中文或英文字母'));
    }
  };

  /**
   * 姓名
   * @param rule
   * @param value
   * @param callback
   */
  static name = (rule, value, callback) => {
    if (/^[\u4e00-\u9fa5a-z]{1,20}$/i.test(value)) {
      callback();
    } else {
      callback(new Error('姓名为1-20位中文或英文字母'));
    }
  };

  /**
   * 校验relation-url  /xxx/xxxx/xxx.xx/xx
   * @param rule
   * @param value
   * @param callback
   */
  static relationUrl = (rule, value, callback) => {
    if (/^(\/([0-9a-z_\-#()])+)*(\/([0-9a-z_\-#.()])+)$/i.test(value)) {
      callback();
    } else {
      callback(new Error('请输入合法url'));
    }
  };

  /**
   * 校验网络url http://xxx.xxx
   * @param rule
   * @param value
   * @param callback
   */
  static webUrl = (rule, value, callback) => {
    if (/^http(s)?:\/\/[^.\s]+(\.[^.\s]+)+$/.test(value)) {
      callback();
    } else {
      callback(new Error('请输入合法的url'));
    }
  };

  /**
   * 校验ip
   * @param rule
   * @param value
   * @param callback
   */
  static ip = (rule, value, callback) => {
    if (/^([0-9]{1,3}.){3}[0-9]{1,3}$/.test(value) && value.split('.').filter(v => (Number(v) && Number(v) >= 0 && Number(v) <= 255)).length === 4) {
      callback();
    } else {
      callback(new Error('请输入合法ip'));
    }
  };

  /**
   * 可为负数的数字，可有小数点
   * @param rule
   * @param value
   * @param callback
   */
  static number = (rule, value, callback) => {
    if (!/^-?(0|[1-9]\d*)(\.\d+)?$/.test(value)) {
      callback(new Error('请输入合法数字'));
    } else {
      callback();
    }
  };

  /**
   * 只能是正数的数字，可有小数点
   * @param rule
   * @param value
   * @param callback
   */
  static numberPositive = (rule, value, callback) => {
    if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(value)) {
      callback(new Error('请输入不小于0的数字'));
    } else {
      callback();
    }
  };

  /**
   * 可为负数的小数点后两位数字
   * @param rule
   * @param value
   * @param callback
   */
  static numberD2 = (rule, value, callback) => {
    if (!/^-?(0|[1-9]\d*)(\.\d)?$/.test(value)) {
      callback(new Error('请输入合法数字'));
    } else if (!/^-?(0|[1-9]\d*)(\.\d{1,2})?$/.test(value)) {
      callback(new Error('输入的数字，只能精确到小数点后两位'));
    } else {
      callback();
    }
  };

  /**
   * 只能是正数的小数点后两位数字
   * @param rule
   * @param value
   * @param callback
   */
  static numberPositiveD2 = (rule, value, callback) => {
    if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(value)) {
      callback(new Error('请输入不小于0的数字'));
    } else if (!/^(0|[1-9]\d*)(\.\d{1,2})?$/.test(value)) {
      callback(new Error('输入的数字，只能精确到小数点后两位'));
    } else {
      callback();
    }
  };

  /**
   * 只能是整数的数字
   * @param rule
   * @param value
   * @param callback
   */
  static integer = (rule, value, callback) => {
    if (!/^-?(0|[1-9]\d*)$/.test(value)) {
      callback(new Error('请输入整数'));
    } else {
      callback();
    }
  };

  /**
   * 只能是正整数的数字
   * @param rule
   * @param value
   * @param callback
   */
  static integerPositive = (rule, value, callback) => {
    if (!/^(0|[1-9]\d*)$/.test(value)) {
      callback(new Error('请输入正整数'));
    } else {
      callback();
    }
  };

  /**
   * 身份证
   * @param rule
   * @param value
   * @param callback
   */
  static  idCard = (rule, value, callback) => {
    if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)) {
      callback(new Error('身份证格式有误'));
    } else {
      callback();
    }
  };

  /**
   * 手机号
   * @param rule
   * @param value
   * @param callback
   */
  static phone = (rule, value, callback) => {
    if (!/^1[3456789]\d{9}$/.test(value)) {
      callback(new Error('11位手机号格式有误'));
    } else {
      callback();
    }
  };

  /**
   * 微信OpenId
   * @param rule
   * @param value
   * @param callback
   */
  static weChatOpenId = (rule, value, callback) => {
    if (value && !/^[a-z0-9_\-=]{28}$/i.test(value)) {
      callback(new Error('openId格式有误'));
    } else {
      callback();
    }
  };

  /**
   * 必须同时包含字母与数字
   * @param rule
   * @param value
   * @param callback
   */
  static onlyLetterNumber = (rule, value, callback) => {
    if (!/^([0-9]+[a-z0-9]*[a-z]+[a-z0-9]*|[a-z]+[a-z0-9]*[0-9]+)+[a-z0-9]*$/i.test(value)) {
      callback(new Error('必须同时包含字母与数字'));
    } else {
      callback();
    }
  };

  /**
   * 只能包含中文字母和数字
   * @param rule
   * @param value
   * @param callback
   */
  static zhLetterAndNumber = (rule, value, callback) => {
    // 后台不支持下划线查询所以除去下划线
    if (!/^([\u4e00-\u9fa5]|[a-z0-9])*$/i.test(value)) {
      callback(new Error('只能输入中文，字母与数字'));
    } else {
      callback();
    }
  };

  /**
   * 只能包含字母和数字
   * @param rule
   * @param value
   * @param callback
   */
  static letterAndNumber = (rule, value, callback) => {
    if (!/^[a-z0-9]*$/i.test(value)) {
      callback(new Error('只能输入字母与数字'));
    } else {
      callback();
    }
  };

  /**
   * 验证第一个密码，必须要与第二个确认密码配合使用
   *
   *      formRule: {
   *          password: [
   *              { validator: (rule, value, callback)=> { ViewDesignValidateUtil.password1(this.$refs.formField1Ref, 'password2')(rule, value, callback); } }
   *          ]
   *      }
   * @param formRef               表单Ref对象
   * @param password2FieldName    第二个确认密码的字段名
   * @returns {function(...[*]=)}
   */
  static password1of2 = function (formRef, password2FieldName) {
    return (rule, value, callback) => {
      if (value.length < 6 || !(/[a-z]/i.test(value) && /[0-9]/.test(value))) {
        callback(new Error('新密码必须为6-20位字母+数字组合，支持特殊字符'));
      } else {
        if (formRef.model[password2FieldName] !== '') {
          // 对第二个密码框单独验证
          formRef.validateField(password2FieldName);
        }
        callback();
      }
    };
  };

  /**
   * 验证第二个确认密码，必须要与第一个密码配合使用
   *      formRule: {
   *          password2: [
   *              { validator: (rule, value, callback)=> { ViewDesignValidateUtil.password1(this.$refs.formField1Ref, 'password')(rule, value, callback); } }
   *          ]
   *      }
   * @param formRef               表单Ref对象
   * @param password1FieldName    第一个密码的字段名
   * @returns {function(...[*]=)}
   */
  static password2of2 = function (formRef, password1FieldName) {
    return (rule, value, callback) => {
      if (value !== formRef.model[password1FieldName]) { // 与第一个密码进行对比
        callback(new Error('两次密码不一致'));
      } else {
        callback();
      }
    };
  };
}
