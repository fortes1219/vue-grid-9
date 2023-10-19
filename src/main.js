import { createApp } from "vue";
import "@/style/index.scss";
import App from "./App.vue";
import router from "@/router";
import vant from 'vant';
import debouncedSetRootFontSize from "@/utils/rem.js";
import { loadTheme } from "@/plugins/loadTheme";

const app = createApp(App);

// 執行等比縮放的方法，預設1rem = 100px，畫面上16px = 0.16rem
debouncedSetRootFontSize();

// 定義 fetchThemeName 函數

async function fetchThemeName() {
  // 模擬請求API行為，放個假的JSON在public
  const url = import.meta.env.MODE === 'production'
    ? "/vue-grid-9/theme.json"
    : "/theme.json";

  const response = await fetch(url);
  const data = await response.json();
  return data.theme;
}

(async () => {
  // 從後端 API 獲取主題名稱
  const themeName = await fetchThemeName();
  // 根據 API 返回的主題名稱動態切換主題
  await loadTheme(themeName);

  app.use(router).mount("#app");
})();
