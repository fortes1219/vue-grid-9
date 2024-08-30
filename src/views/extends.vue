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
  // 目標倍率，隨機1.00~2.00之間
  let targetMultiplier = 0;

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

    const multiplierText = new PIXI.Text('0.00x', {
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

      // 生成 0.00 至 6.00 之間的隨機倍率
      const multiplier = Math.random() * 6.0;

      // 設定起始點
      const startX = plane.x;
      const startY = plane.y;

      // 計算畫布邊界
      const maxX = app.screen.width - 40; // 保留40px的邊距
      const maxY = app.screen.height - 40; // 保留40px的邊距

      // 動態生成控制點和終點
      const rangeX = maxX - startX;
      const rangeY = startY - 40;

      let cp1X, cp1Y, cp2X, cp2Y, endX, endY;
      cp1X = startX + rangeX * 0.3;
      cp1Y = startY - rangeY * (multiplier / 6.0) * 0.6;
      cp2X = startX + rangeX * 0.6;
      cp2Y = startY - rangeY * (multiplier / 6.0) * 0.8;
      endX = startX + rangeX;
      endY = startY - rangeY * (multiplier / 6.0);

      // if (multiplier < 5.5) {
      //   // 墜機邏輯：飛機先上升後急劇下降
      //   const peakMultiplier = Math.random() * 3.0 + 5.5; // 設定一個最高點的倍率
      //   cp1X = startX + rangeX * 0.4; // 控制點1位於曲線的前半段
      //   cp1Y = startY - rangeY * (peakMultiplier / 6.0); // 控制點1讓曲線上升

      //   cp2X = startX + rangeX * 0.6; // 控制點2位於曲線的後半段
      //   cp2Y = startY - rangeY * (multiplier / 6.0); // 控制點2讓曲線下降

      //   endX = startX + rangeX; // 終點
      //   endY = startY - rangeY * (multiplier / 6.0); // 終點對應最終倍率
      // } else {
      //   // 正常邏輯：只上升
      //   cp1X = startX + rangeX * 0.3;
      //   cp1Y = startY - rangeY * (multiplier / 6.0) * 0.6;
      //   cp2X = startX + rangeX * 0.6;
      //   cp2Y = startY - rangeY * (multiplier / 6.0) * 0.8;
      //   endX = startX + rangeX;
      //   endY = startY - rangeY * (multiplier / 6.0);
      // }

      let progress = 0; // 初始進度

      // 調整 duration，使飛行時間與倍率掛鉤
      const duration = 500 + multiplier * 100;

      // 初始化倍率顯示
      multiplierText.text = `0.00x`;

      // 使用 PIXI Ticker 來逐步繪製貝塞爾曲線並更新倍率顯示
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

          // 更新倍率顯示
          const relativeHeight = (startY - currentY) / rangeY;
          const currentMultiplier = relativeHeight * 6.0;
          multiplierText.text = `${currentMultiplier.toFixed(2)}x`;

          // 更新飛機位置，使飛機位於曲線的最尾端
          plane.x = currentX;
          plane.y = currentY;

          progress++;
        } else {
          // 繪製完成後設置最終倍率
          multiplierText.text = `${multiplier.toFixed(2)}x`;
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
