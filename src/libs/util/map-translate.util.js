/**
 * @description
 * @author  g_eno_phy (2020-08-12 19:00)
 * @version 0.1
 */
// WGS-84：是国际标准，GPS坐标（Google Earth使用、或者GPS模块）
// GCJ-02：中国坐标偏移标准，Google Map、高德、腾讯使用
// BD-09：百度坐标偏移标准，Baidu Map使用

// GPS转腾讯
// GPS.gcj_encrypt(lat.lng);

// 腾讯转GPS 粗略
// GPS.gcj_decrypt(lat.lng);

// 腾讯转GPS 粗略 精确(二分极限法)
// let threshold = 0.000000001; 目前设置的是精确到小数点后9位，这个值越小，越精确，但是javascript中，浮点运算本身就不太精确，九位在GPS里也偏差不大了
// GSP.gcj_decrypt_exact(lat.lng);

// 腾讯转百度
// GPS.bd_encrypt(lat.lng);

// 百度转腾讯
// GPS.bd_decrypt(lat.lng);

// 求距离
// GPS.distance(lat1.lng1,lat2.lng2);

const MapTranslateUtil = {
  PI   : 3.14159265358979324,
  x_pi : (3.14159265358979324 * 3000.0) / 180.0,
  delta: function (lat, lng) {
    // Krasovsky 1940
    //
    // a = 6378245.0, 1/f = 298.3
    // b = a * (1 - f)
    // ee = (a^2 - b^2) / a^2;
    const a         = 6378245.0; //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
    const ee        = 0.00669342162296594323; //  ee: 椭球的偏心率。
    let dLat        = this.transformLat(lng - 105.0, lat - 35.0);
    let dLon        = this.transformLon(lng - 105.0, lat - 35.0);
    const radLat    = (lat / 180.0) * this.PI;
    let magic       = Math.sin(radLat);
    magic           = 1 - ee * magic * magic;
    const sqrtMagic = Math.sqrt(magic);
    dLat            = (dLat * 180.0) / (((a * (1 - ee)) / (magic * sqrtMagic)) * this.PI);
    dLon            = (dLon * 180.0) / ((a / sqrtMagic) * Math.cos(radLat) * this.PI);
    return {lat: dLat, lng: dLon};
  },

  // WGS-84 to GCJ-02  GPS -> (腾讯，高德)
  gcj_encrypt: function (wgsLat, wgsLon) {
    wgsLat = Number(wgsLat);
    wgsLon = Number(wgsLon);
    if (!wgsLat || !wgsLon) return {lat: '', lng: ''};
    if (this.outOfChina(wgsLat, wgsLon)) return {lat: wgsLat, lng: wgsLon};

    const d = this.delta(wgsLat, wgsLon);
    return {lat: wgsLat + d.lat, lng: wgsLon + d.lng};
  },
  // GCJ-02 to WGS-84 (腾讯，高德) -> GPS (粗略)
  gcj_decrypt: function (gcjLat, gcjLon) {
    gcjLat = Number(gcjLat);
    gcjLon = Number(gcjLon);
    if (!gcjLat || !gcjLon) return {lat: '', lng: ''};
    if (this.outOfChina(gcjLat, gcjLon)) return {lat: gcjLat, lng: gcjLon};

    const d = this.delta(gcjLat, gcjLon);
    return {lat: gcjLat - d.lat, lng: gcjLon - d.lng};
  },
  // GCJ-02 to WGS-84 exactly (腾讯，高德) -> GPS （精确）
  gcj_decrypt_exact: function (gcjLat, gcjLon) {
    gcjLat = Number(gcjLat);
    gcjLon = Number(gcjLon);
    if (!gcjLat || !gcjLon) return {lat: '', lng: ''};
    const initDelta = 0.01;
    const threshold = 0.000000001;
    let dLat        = initDelta;
    let dLon        = initDelta;
    let mLat        = gcjLat - dLat;
    let mLon        = gcjLon - dLon;
    let pLat        = gcjLat + dLat;
    let pLon        = gcjLon + dLon;
    let wgsLat;
    let wgsLon;
    let i           = 0;
    while (1) {
      wgsLat    = (mLat + pLat) / 2;
      wgsLon    = (mLon + pLon) / 2;
      const tmp = this.gcj_encrypt(wgsLat, wgsLon);
      dLat      = tmp.lat - gcjLat;
      dLon      = tmp.lng - gcjLon;
      if (Math.abs(dLat) < threshold && Math.abs(dLon) < threshold) break;

      if (dLat > 0) pLat = wgsLat;
      else mLat = wgsLat;
      if (dLon > 0) pLon = wgsLon;
      else mLon = wgsLon;

      if (++i > 10000) break;
    }
    return {lat: wgsLat, lng: wgsLon};
  },
  // GCJ-02 to BD-09 (腾讯，高德) -> 百度
  bd_encrypt: function (gcjLat, gcjLon) {
    gcjLat = Number(gcjLat);
    gcjLon = Number(gcjLon);
    if (!gcjLat || !gcjLon) return {lat: '', lng: ''};
    const x     = gcjLon;
    const y     = gcjLat;
    const z     = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * this.x_pi);
    const theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * this.x_pi);
    const bdLon = z * Math.cos(theta) + 0.0065;
    const bdLat = z * Math.sin(theta) + 0.006;
    return {lat: bdLat, lng: bdLon};
  },
  // WGS-84 to BD-09  gps -> 百度
  bd_encrypt2: function (wgsLat, wgsLon) {
    const p = this.gcj_encrypt(wgsLat, wgsLon);
    return this.bd_encrypt(p.lat, p.lng);
  },

  // BD-09 to GCJ-02  百度 -> (腾讯，高德)
  bd_decrypt: function (bdLat, bdLon) {
    bdLat = Number(bdLat);
    bdLon = Number(bdLon);
    if (!bdLat || !bdLon) return {lat: '', lng: ''};
    const x      = bdLon - 0.0065;
    const y      = bdLat - 0.006;
    const z      = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * this.x_pi);
    const theta  = Math.atan2(y, x) - 0.000003 * Math.cos(x * this.x_pi);
    const gcjLon = z * Math.cos(theta);
    const gcjLat = z * Math.sin(theta);
    return {lat: gcjLat, lng: gcjLon};
  },
  // BD-09 to WGS-84  百度 -> gps
  bd_decrypt2: function (bdLng, bdLat) {
    const {lat, lng} = this.bd_decrypt(bdLat, bdLng); // 百度到高德
    return this.gcj_decrypt(lng, lat); // 高德到gps
  },
  // WGS-84 to Web mercator
  // mercatorLat -> y mercatorLon -> x
  mercator_encrypt: function (wgsLat, wgsLon) {
    wgsLat = Number(wgsLat);
    wgsLon = Number(wgsLon);
    if (!wgsLat || !wgsLon) return {lat: '', lng: ''};
    const x = (wgsLon * 20037508.34) / 180;
    let y   = Math.log(Math.tan(((90 + wgsLat) * this.PI) / 360)) / (this.PI / 180);
    y       = (y * 20037508.34) / 180;
    return {lat: y, lng: x};
    /*
      if ((Math.abs(wgsLon) > 180 || Math.abs(wgsLat) > 90))
          return null;
      let x = 6378137.0 * wgsLon * 0.017453292519943295;
      let a = wgsLat * 0.017453292519943295;
      let y = 3189068.5 * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)));
      return {'lat' : y, 'lng' : x};
      // */
  },
  // Web mercator to WGS-84
  // mercatorLat -> y mercatorLon -> x
  mercator_decrypt: function (mercatorLat, mercatorLon) {
    mercatorLat = Number(mercatorLat);
    mercatorLon = Number(mercatorLon);
    if (!mercatorLat || !mercatorLon) return {lat: '', lng: ''};
    const x = (mercatorLon / 20037508.34) * 180;
    let y   = (mercatorLat / 20037508.34) * 180;
    y       = (180 / this.PI) * (2 * Math.atan(Math.exp((y * this.PI) / 180)) - this.PI / 2);
    return {lat: y, lng: x};
    /*
      if (Math.abs(mercatorLon) < 180 && Math.abs(mercatorLat) < 90)
          return null;
      if ((Math.abs(mercatorLon) > 20037508.3427892) || (Math.abs(mercatorLat) > 20037508.3427892))
          return null;
      let a = mercatorLon / 6378137.0 * 57.295779513082323;
      let x = a - (Math.floor(((a + 180.0) / 360.0)) * 360.0);
      let y = (1.5707963267948966 - (2.0 * Math.atan(Math.exp((-1.0 * mercatorLat) / 6378137.0)))) * 57.295779513082323;
      return {'lat' : y, 'lng' : x};
      // */
  },
  // 两点之间距离
  distance    : function (latA, lngA, latB, lngB) {
    const earthR = 6371000;
    const x      = Math.cos((latA * this.PI) / 180) * Math.cos((latB * this.PI) / 180) * Math.cos(((lngA - lngB) * this.PI) / 180);
    const y      = Math.sin((latA * this.PI) / 180) * Math.sin((latB * this.PI) / 180);
    let s        = x + y;
    if (s > 1) s = 1;
    if (s < -1) s = -1;
    const alpha    = Math.acos(s);
    const distance = alpha * earthR;
    return distance;
  },
  outOfChina  : function (lat, lng) {
    if (lng < 72.004 || lng > 137.8347) return true;
    if (lat < 0.8293 || lat > 55.8271) return true;
    return false;
  },
  transformLat: function (x, y) {
    let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    ret += ((20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0) / 3.0;
    ret += ((20.0 * Math.sin(y * this.PI) + 40.0 * Math.sin((y / 3.0) * this.PI)) * 2.0) / 3.0;
    ret += ((160.0 * Math.sin((y / 12.0) * this.PI) + 320 * Math.sin((y * this.PI) / 30.0)) * 2.0) / 3.0;
    return ret;
  },
  transformLon: function (x, y) {
    let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    ret += ((20.0 * Math.sin(6.0 * x * this.PI) + 20.0 * Math.sin(2.0 * x * this.PI)) * 2.0) / 3.0;
    ret += ((20.0 * Math.sin(x * this.PI) + 40.0 * Math.sin((x / 3.0) * this.PI)) * 2.0) / 3.0;
    ret += ((150.0 * Math.sin((x / 12.0) * this.PI) + 300.0 * Math.sin((x / 30.0) * this.PI)) * 2.0) / 3.0;
    return ret;
  }
};

export default MapTranslateUtil;
