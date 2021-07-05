/**
 * @description
 *  usage:
 *      WatermarkUtil.setWatermark(['水印内容']);
 * @author  g_eno_phy
 * @version 0.1
 *
 */

export default class WatermarkUtil {
  // id
  static  $_id = `watermark_${Math.floor(Math.random() * 1000)}`;

  /**
   * 设置水印
   * @param strArr
   * @param isOver 是否覆盖 默认不覆盖
   * @param fillStyle 填充样式
   */
  static setWatermark (strArr = [], isOver = false, fillStyle = '') {
    const id = this.$_id;
    // 若不需要覆盖，且存在水印，则直接返回
    if (!isOver && document.getElementById(id) !== null) {
      return;
    }

    // 移除水印
    this.removeWatermark();

    const can  = document.createElement('canvas');
    can.width  = 350;
    can.height = 350;

    const canContext = can.getContext('2d');
    canContext.rotate(-20 * Math.PI / 180);
    canContext.font         = '16px Vedana';
    canContext.fillStyle    = fillStyle || 'rgba(242,242,242,0.1)';
    canContext.textAlign    = 'center';
    canContext.textBaseline = 'middle';
    // canContext.fillText(str, can.width / 20, can.height);
    strArr.reverse();
    strArr.forEach((str, idx) => {
      canContext.fillText(str, can.width / 20, can.height - 32 * (idx + 1));
    });

    const div               = document.createElement('div');
    div.id                  = id;
    div.style.pointerEvents = 'none';
    div.style.top           = '3px';
    div.style.left          = '0';
    div.style.position      = 'fixed';
    div.style.zIndex        = '10000';
    div.style.width         = document.documentElement.clientWidth + 'px';
    div.style.height        = document.documentElement.clientHeight + 'px';
    div.style.background    = `url(${can.toDataURL('image/png')}) left top repeat`;
    document.body.appendChild(div);
  }

  /**
   * 移除水印
   */
  static removeWatermark () {
    const id = this.$_id;
    if (document.getElementById(id) !== null) {
      document.body.removeChild(document.getElementById(id));
    }
  }
}
