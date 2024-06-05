const scrollDisplay = {
  mounted(el, binding) {
    const options = {
      root: null,  // 表示預設觀察目標相對於瀏覽器視窗
      rootMargin: '0px 0px -100px 0px',  // 設定 root 的邊界，即元素露出底部 100px 時觸發
      threshold: 0.0  // 目標元素有多少比例在可見區域內，這裡是完全露出時
    };

    const callback = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // 當元素進入視窗底部 100px 內
          el.textContent = binding.value.newText;
        } else {
          // 當元素離開視窗底部 100px
          el.textContent = binding.value.originalText;
        }
      });
    };

    const observer = new IntersectionObserver(callback, options);
    observer.observe(el);

    // 在 unmounted 鉤子中清理
    el.__appearObserver = observer;
  },

  beforeUnmount(el) {
    if (el.__appearObserver) {
      el.__appearObserver.disconnect();
    }
  }
}

export default scrollDisplay;