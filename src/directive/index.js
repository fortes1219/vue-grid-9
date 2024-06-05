import movingBalls from './moving-balls';
import formatCurrency from './format-currency';
import scrollDisplay from './scroll-display';

const directives = {
  movingBalls,  // 這裡是指令的名稱，需要遵循camelCase命名，並在模板中使用kebab-case形式。
  formatCurrency,
  scrollDisplay
};

export const customDirectives = {
  install(app) {
    Object.entries(directives).forEach(([directiveName, directiveObj]) => {
      app.directive(directiveName, directiveObj);
    });
  },
};
