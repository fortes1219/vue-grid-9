<template>
  <li>
    <div @click="toggle">
      {{ category.text }}
      <span v-if="hasChildren">{{ isOpen ? '-' : '+' }}</span>
    </div>
    <ul v-if="isOpen && hasChildren">
      <ChildMenu v-for="child in category.children" :key="child.id" :category="child" />
    </ul>
  </li>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import { defineProps } from 'vue';

  const props = defineProps({
    category: {
      type: Object,
      required: true,
    },
  });

  const isOpen = ref(false);

  const toggle = () => {
    isOpen.value = !isOpen.value;
  };

  const hasChildren = computed(() => {
    return props.category.children && props.category.children.length > 0;
  });
</script>

<style scoped>
  ul {
    list-style-type: none;
    padding-left: 20px;
  }
  div {
    cursor: pointer;
    user-select: none;
    color: #fff;
  }
</style>
