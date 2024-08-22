<template>
  <div ref="pixiContainer">
    <canvas ref="pixiCanvas" />
  </div>
</template>

<script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import * as PIXI from 'pixi.js';
  import planeImage from '@/assets/plane.png';

  const pixiContainer = ref(null);
  const pixiCanvas = ref(null);
  const app = new PIXI.Application();
  let ticker = null;
  let arcGraphics = null;
  const safeMargin = 40; // 安全邊界
  let targetMultiplier = 0; // 目標倍率

  onMounted(async () => {
    await app.init({
      width: 800,
      height: 600,
      backgroundColor: 0x000000, // 設定為黑色背景
      canvas: pixiCanvas.value,
    });

    // 加载资源
    const planeTexture = await PIXI.Assets.load(planeImage);
    const plane = new PIXI.Sprite(planeTexture);
    plane.anchor.set(0.5, 1);
    plane.x = safeMargin;
    plane.y = app.screen.height - safeMargin;
    app.stage.addChild(plane);

    arcGraphics = new PIXI.Graphics();
    app.stage.addChild(arcGraphics);

    const multiplierText = new PIXI.Text('1.0x', {
      fontFamily: 'Arial',
      fontSize: 64,
      fill: 0xffffff,
    });
    multiplierText.anchor.set(0.5);
    multiplierText.x = app.screen.width / 2;
    multiplierText.y = app.screen.height / 2;
    app.stage.addChild(multiplierText);

    const startButton = new PIXI.Text('Start', {
      fontFamily: 'Arial',
      fontSize: 36,
      fill: 0x00ff00,
      align: 'center',
    });
    startButton.interactive = true;
    startButton.buttonMode = true;
    startButton.x = app.screen.width / 2 - 50;
    startButton.y = app.screen.height - 100;
    startButton.on('pointerdown', startMovement);
    app.stage.addChild(startButton);

    const resetButton = new PIXI.Text('Reset', {
      fontFamily: 'Arial',
      fontSize: 36,
      fill: 0xff0000,
      align: 'center',
    });
    resetButton.interactive = true;
    resetButton.buttonMode = true;
    resetButton.x = app.screen.width / 2 + 50;
    resetButton.y = app.screen.height - 100;
    resetButton.on('pointerdown', resetPosition);
    app.stage.addChild(resetButton);

    function startMovement() {
      arcGraphics.clear();
      arcGraphics.lineStyle(4, 0xff0000, 1);

      // 假設這裡是模擬來自SOCKET的隨機倍率數值，這裡用160作為例子
      const multiplier = 160.0;

      // 設定起始點
      const startX = plane.x;
      const startY = plane.y;

      // 計算畫布邊界
      const maxX = app.screen.width - 40; // 保留40px的邊距
      const maxY = app.screen.height - 40; // 保留40px的邊距

      // 根據倍率生成貝塞爾曲線的控制點和終點，並確保不超過邊界
      const cp1X = Math.min(startX + Math.random() * 100 * multiplier * 0.1, maxX);
      const cp1Y = Math.max(startY - Math.random() * 100 * multiplier * 0.05, 40);
      const cp2X = Math.min(cp1X + Math.random() * 100 * multiplier * 0.1, maxX);
      const cp2Y = Math.max(cp1Y - Math.random() * 100 * multiplier * 0.05, 40);
      const endX = Math.min(cp2X + Math.random() * 100 * multiplier * 0.1, maxX);
      const endY = Math.max(cp2Y - Math.random() * 100 * multiplier * 0.05, 40);

      let progress = 0; // 初始進度

      // 調整 duration 來改變繪製速度
      const duration = 100 + multiplier * 0.5; // 隨著倍率增加，延長繪製時間

      // 使用 PIXI Ticker 來逐步繪製貝塞爾曲線
      const ticker = new PIXI.Ticker();
      ticker.add(() => {
        if (progress <= duration) {
          const t = progress / duration; // 正規化進度
          const currentX =
            (1 - t) ** 3 * startX + 3 * (1 - t) ** 2 * t * cp1X + 3 * (1 - t) * t ** 2 * cp2X + t ** 3 * endX;

          const currentY =
            (1 - t) ** 3 * startY + 3 * (1 - t) ** 2 * t * cp1Y + 3 * (1 - t) * t ** 2 * cp2Y + t ** 3 * endY;

          if (progress === 0) {
            arcGraphics.moveTo(currentX, currentY); // 初始移動到起始位置
          } else {
            arcGraphics.lineTo(currentX, currentY); // 逐步繪製到新的位置
          }

          arcGraphics.stroke(); // 繪製當前線條

          progress++;
        } else {
          ticker.stop(); // 完成後停止 Ticker
        }
      });

      ticker.start(); // 啟動 Ticker
    }

    function resetPosition() {
      plane.x = safeMargin;
      plane.y = app.screen.height - safeMargin;
      arcGraphics.clear();
    }

    onBeforeUnmount(() => {
      if (app) {
        app.destroy(true, { children: true });
      }
    });
  });
</script>

<style>
  #pixi-container {
    width: 100%;
    height: 100%;
  }
</style>
