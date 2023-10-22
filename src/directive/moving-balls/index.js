/** 先建立一個動畫方向的策略物件 */
const movementStrategies = {
  right: (distance, unit) => ({
    initial: `translateX(0) translateY(-50%)`,
    end: `translateX(${distance}${unit}) translateY(-50%)`
  }),
  left: (distance, unit) => ({
    initial: `translateX(0) translateY(-50%)`,
    end: `translateX(-${distance}${unit}) translateY(-50%)`
  }),
  up: (distance, unit) => ({
    initial: `translateX(-50%) translateY(0)`,
    end: `translateX(-50%) translateY(-${distance}${unit})`
  }),
  down: (distance, unit) => ({
    initial: `translateX(-50%) translateY(0)`,
    end: `translateX(-50%) translateY(${distance}${unit})`
  }),
};

const movingBalls = {
  beforeMount(el, binding) {
    const { direction, distance, unit, duration } = binding.value;
    if (distance === 0) {
      return;
    }

    const movementStrategy = movementStrategies[direction];
    if (movementStrategy) {
      const { initial, end } = movementStrategy(distance, unit);
      const animationName = `move${direction.charAt(0).toUpperCase() + direction.slice(1)}`;
      const animationDefinition = `
        @keyframes ${animationName} {
          0%, 100% { transform: ${initial}; }
          50% { transform: ${end}; }
        }
      `;

      // 將 keyframes 動畫插入到頁面的 style 中
      const style = document.createElement('style');
      style.innerHTML = animationDefinition;
      document.head.appendChild(style);

      // 將元素的動畫設置為我們剛剛定義的 keyframes
      el.style.animation = `${animationName} ${duration} infinite`;
    } else {
      console.warn(`Invalid direction: ${direction}`);
    }
  }
};

export default movingBalls;