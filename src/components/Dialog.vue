<template>
  <div v-if="isVisible" class="dialog-backdrop">
    <div class="dialog-content">
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
      <button @click="close">Close</button>
    </div>
  </div>
</template>

<script setup>
  import { defineModel } from 'vue';

  // 定義組件的數據模型
  // const isVisible = defineModel('isVisible', { type: Boolean, default: false });
  // const title = defineModel('title', { type: String, default: '' });
  // const message = defineModel('message', { type: String, default: '' });

  // 帶有修飾符參數的寫法
  const [isVisible, isVisibleModifiers] = defineModel('isVisible');
  const [title, titleModifiers] = defineModel('title');
  const [message, messageModifiers] = defineModel('message');

  console.log(isVisibleModifiers);
  console.log(titleModifiers);
  console.log(messageModifiers);

  // 閉合方法
  const close = () => {
    isVisible.value = false;
  };
</script>

<style scoped>
  .dialog-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .dialog-content {
    background: white;
    padding: 20px;
    border-radius: 5px;
    text-align: center;
  }
</style>
