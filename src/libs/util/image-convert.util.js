/**
 * @description 图片转换
 * @author  g_eno_phy
 * @version 0.1
 *
 */
export default class ImageConvertUtil {
  /**
   * 将图片转换为base64
   * @param file
   * @returns {Promise<String>}
   */
  static fileToDataURL (file) {
    return new Promise(resolve => {
      const reader     = new FileReader();
      reader.onloadend = function (e) {
        resolve(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  }

  /**
   * 重设图片大小，返回 Blob 、 Base64 或 Image
   * @param file
   * @param width
   * @param quality
   * @param outType (Blob,String,Image)
   * @returns {Promise<Blob | String | Image>}
   */
  static fileResize (file, width = 600, quality = 0.4, outType = 'String') {
    const defaultSizeWithoutCompress = 50 * 1000; // 50kb内不用压缩
    return this.fileToDataURL(file).then(dataUrl => {
      return this.__resizeImage(dataUrl, width,
        file.size <= defaultSizeWithoutCompress ? -1 : quality, outType);
    });
  }

  /**
   * base64图片转化成blob
   * @param dataUrl
   */
  static base64ToBlob (dataUrl = '') {
    return new Promise(resolve => {
      if (!dataUrl) return resolve(null);
      const img  = new Image();
      img.src    = dataUrl;
      img.onload = function () {
        const imgWidth  = img.width;
        const imgHeight = img.height;
        const canvas    = document.createElement('canvas');
        const ctx       = canvas.getContext('2d');
        canvas.setAttribute('width', `${imgWidth}`);
        canvas.setAttribute('height', `${imgHeight}`);
        ctx.drawImage(this, 0, 0, imgWidth, imgHeight);
        canvas.toBlob(function (blobObj) {
          resolve(blobObj);
        }, 'image/jpeg', 1);
      };
    });
  }

  /**
   * 适配裁剪base64图片适合宽度
   * @param dataUrl
   * @param rate w:h
   * @param defaultQuality
   * @return {Promise<unknown>}
   */
  static fitImageDataUrl (dataUrl, rate = 1, defaultQuality = 1) {

    return new Promise(resolve => {

      const img  = new Image();
      img.src    = dataUrl;
      img.onload = function () {
        const currentWidth  = img.width;
        const currentHeight = img.height;
        let width           = currentWidth;
        let height          = Math.floor(width / rate);
        if (height > currentHeight) {
          height = currentHeight;
          width  = Math.floor(height * rate);
        }
        const canvas = document.createElement('canvas');
        const ctx    = canvas.getContext('2d');
        // 若需要适配裁剪
        if (currentWidth >= width && currentHeight >= height) {
          const x = Math.floor((currentWidth - width) / 2);
          const y = Math.floor((currentHeight - height) / 2);
          canvas.setAttribute('width', `${width}`);
          canvas.setAttribute('height', `${height}`);
          ctx.drawImage(this, x, y, width, height, 0, 0, width, height);
          const base64 = canvas.toDataURL('image/jpeg', defaultQuality);
          resolve(base64);
        } else {
          canvas.setAttribute('width', `${currentWidth}`);
          canvas.setAttribute('height', `${currentHeight}`);
          ctx.drawImage(this, 0, 0, currentWidth, currentHeight);
          const base64 = canvas.toDataURL('image/jpeg', defaultQuality);
          resolve(base64);
        }

      };
    });
  }


  /**
   * 裁剪base64
   * @param dataUrl
   * @param x
   * @param y
   * @param w
   * @param h
   * @param width
   * @param rate w:h
   * @returns {Promise<unknown>}
   */
  static cropDataUrl (dataUrl, x, y, w, h, width = 500, rate = 4 / 5) {
    return new Promise(resolve => {
      const img  = new Image();
      img.src    = dataUrl;
      img.onload = () => {
        resolve(this.cropImageToDataUrl(img, x, y, w, h, width, rate));
      };
    });
  }

  /**
   * 裁剪图片
   * @param image
   * @param x
   * @param y
   * @param w
   * @param h
   * @param width
   * @param rate w:h
   * @returns {string}
   */
  static cropImageToDataUrl (image, x, y, w, h, width = 500, rate = 4 / 5) {
    const canvas = document.createElement('canvas');
    const ctx    = canvas.getContext('2d');
    // 若需要适配裁剪
    canvas.setAttribute('width', `${width}`);
    canvas.setAttribute('height', `${width / rate}`);
    ctx.drawImage(image, x, y, w, h, 0, 0, width, width / rate);
    return canvas.toDataURL('image/jpeg', 1);
  }

  /**
   * 重设图片大小
   *          - 只限制宽度，防止用户上传长图
   * @param dataUrl
   * @param defaultMaxWidthSide
   * @param defaultQuality 0 - 1
   * @param outType (Blob,String,Image)
   * @returns {Promise<Blob|String|Image>}
   * @private
   */
  static __resizeImage (dataUrl, defaultMaxWidthSide, defaultQuality, outType = 'String') {
    return new Promise(resolve => {
      const img  = new Image();
      img.src    = dataUrl;
      img.onload = function () {
        let currentWidth = img.width;
        if (defaultMaxWidthSide) {
          currentWidth = currentWidth > defaultMaxWidthSide ? defaultMaxWidthSide : currentWidth;
        }
        const rate      = img.width / img.height; // 宽高比
        const imgWidth  = currentWidth;
        const imgHeight = currentWidth / rate;
        const canvas    = document.createElement('canvas');
        const ctx       = canvas.getContext('2d');

        canvas.setAttribute('width', `${imgWidth}`);
        canvas.setAttribute('height', `${imgHeight}`);

        ctx.drawImage(this, 0, 0, imgWidth, imgHeight);
        let currentQuality = defaultQuality;
        if (img.quality && img.quality <= 1 && img.quality > 0) {
          currentQuality = img.quality;
        }
        if (outType === 'Blob') {
          canvas.toBlob(function (blobObj) {
            resolve(blobObj);
          }, 'image/jpeg', currentQuality);
        } else if (outType === 'Image') {
          canvas.toBlob(function (blobObj) {
            const img  = new Image();
            img.src    = window.URL.createObjectURL(blobObj);
            img.onload = function () {
              resolve(img);
            };
          }, 'image/jpeg', currentQuality);
        } else {
          const base64 = canvas.toDataURL('image/jpeg', currentQuality);
          resolve(base64);
        }
      };
    });
  }
}
