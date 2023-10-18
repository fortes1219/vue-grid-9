export async function loadTheme(theme) {
    
    // 使用物件映射處理動態載入Scss來源
    const themeMap = {
      black: () => import('@/style/themes/black/theme.scss'),
      xmasTheme: () => import('@/style/themes/xmas/theme.scss'),
    };
  
    if (theme in themeMap) {
      const selectedThemeModule = await themeMap[theme]();
      applyThemeStyles(selectedThemeModule.default);
    } else {
      console.error(`Invalid theme: ${theme}`);
    }
  }
  
  /** 
   * 根據API回傳的結果來套用指定主題
   * 並且在DOM上產生一組 <style id="theme-styles"> 
  **/
  
  function applyThemeStyles(styles) {
    const styleElement = document.getElementById("theme-styles");
    if (styleElement) {
      styleElement.textContent = styles;
    } else {
      const newStyleElement = document.createElement("style");
      newStyleElement.id = "theme-styles";
      newStyleElement.textContent = styles;
      document.head.appendChild(newStyleElement);
    }
  }