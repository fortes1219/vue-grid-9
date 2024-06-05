<template>
  <li>
    <!--因為外層有使用useClickOutside，這裡需要防止冒泡，加上.stop-->
    <span :class="{ highlight: isActive }" @click.stop="handleClick">{{ item.text }}</span>
    <ul v-if="item.children && item.isOpen">
      <DrawerItem v-for="child in item.children" :key="child.key" :item="child" @item-clicked="handleItemClicked" />
    </ul>
  </li>
</template>

<script setup>
  import { ref, computed, watch, triggerRef } from 'vue';

  // 使用 defineModel 接收 item 的綁定
  const item = defineModel('item');

  const emit = defineEmits(['item-clicked']);

  const handleClick = () => {
    item.value.isOpen = !item.value.isOpen;
    emit('item-clicked', item.value.groupId, item.value.groupParentId);
  };

  const handleItemClicked = (childGroupId, childGroupParentId) => {
    emit('item-clicked', childGroupId, childGroupParentId);
  };

  const isActive = computed(() => {
    return item.value.isOpen;
  });
</script>

<style scoped lang="scss">
  .highlight {
    color: #f90;
  }
  li span {
    color: #fff;
  }
  li ul {
    padding-left: 0.1rem;
  }
</style>
