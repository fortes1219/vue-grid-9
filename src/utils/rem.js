import debounce from "lodash/debounce"

function setRootFontSize(doc, win) {
  const clientWidth = win.innerWidth || doc.documentElement.clientWidth
  if (!clientWidth) return

  // 判別是不是 PC
  const isPC = win.matchMedia("(min-width: 1024px)").matches
  if (isPC) {
    doc.documentElement.style.fontSize = "72px"
    return
  }

  // Set font size based on screen width
  const baseFontSize = 100 * (clientWidth / 390)
  if (clientWidth >= 768) {
    // 依照實際需要修改裝置寬度上限
    doc.documentElement.style.fontSize = "100px"
  } else {
    doc.documentElement.style.fontSize = baseFontSize + "px"
  }
}

// 動態rem處理，並借用lodash debounce防止resize發生時會抖動
document.addEventListener("DOMContentLoaded", () =>
  setRootFontSize(document, window)
);

const debouncedSetRootFontSize = debounce(
  () => setRootFontSize(document, window),
  10
);
window.addEventListener("resize", debouncedSetRootFontSize)
window.addEventListener("orientationchange", debouncedSetRootFontSize)

export default debouncedSetRootFontSize