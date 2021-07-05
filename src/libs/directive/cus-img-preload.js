/**
 * @description 图片懒加载
 * @code
 *   - usage : <img v-cus-img-preload="imgUrl" src="../*.png" alt>
 *
 * @author  g_eno_phy
 * @version 0.1
 */

export const CusImgPreload = {
  bind(el, binding) {
    if (binding.value) {
      const img = new Image();
      img.src   = binding.value || '';
      // 图片成功加载后，改变src值
      img.onload = () => {
        el.src = binding.value;
        el.classList.add('img-pre-loaded');
      };
    } else {
      el.classList.add('img-pre-none');
    }
  }
};
