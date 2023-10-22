<template>
  <div class="neu-grid-view">
    <div
      :ref="el => (gridRefs[i] = el)"
      v-for="(item, i) in 9"
      :key="i"
      class="neu-grid-view__grid"
      :class="{ 'is-flash': handleLightOrder(i) }">
    </div>
    <!-- 第一種: Directive綁定動畫 -->
    <i 
      v-for="(ball, i) in ballsOrder" 
      :key="i" 
      class="neu-grid-view__ball"
      v-moving-balls="{ direction: 'right', distance: 2.5, unit: 'rem', duration: '2s' }"
      :style="{ 
        top: ballPos[i].top + 'px', 
        left: ballPos[i].left + 'px',
        transform: `translate(${ballPos[i].x}${ballPos[i].unit}, ${ballPos[i].y}${ballPos[i].unit})`
      }">
      {{ ball }}
    </i>
    <!-- 第二種方式: 純CSS -->
    <!-- <i 
      v-for="(ball, i) in ballsOrder" 
      :key="i" 
      class="neu-grid-view__ball"
      :style="{ 
        top: ballPos[i].top + 'px', 
        left: ballPos[i].left + 'px',
        transform: `translate(${ballPos[i].x}${ballPos[i].unit}, ${ballPos[i].y}${ballPos[i].unit})`
      }">
      {{ ball }}
    </i> -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick} from "vue";

/** 指定在第幾格會閃爍 */
const bgLightOrder = [3, 5, 9];
const handleLightOrder = (index) => bgLightOrder.includes(index + 1);

/** 定義每個grid格子的Refs */
const gridRefs = [];

const ballsOrder = ref([1, 3, 7, 9]);
const defaultPosition = { top: 0, left: 0, unit: 'px' };
const ballPos = ref(ballsOrder.value.map(() => defaultPosition));

const updateballPos = () => {
  ballPos.value = ballsOrder.value.map(ballsIdx => {
    const grid = gridRefs[ballsIdx - 1];
    return {
      top: grid.offsetTop + grid.offsetHeight / 2,
      left: grid.offsetLeft + grid.offsetWidth / 2
    };
  });
};

onMounted(() => {
  /** 確定DOM都渲染完以後
   * 依據grid ref取得的每格offset將球的位置分布在指定的格子上 */
  nextTick(() => {
    updateballPos();
    window.addEventListener('resize', updateballPos);
  });
  
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateballPos);
});

</script>
