<template>
  <li>
    <!--因為外層有使用useClickOutside，這裡需要防止冒泡，加上.stop-->
    <span :class="{ 'highlight': isActive }" @click.stop="handleClick">{{ item.text }}</span>
    <ul v-if="item.children && item.isOpen">
      <DrawerItem
        v-for="child in item.children"
        :key="child.key"
        :item="child"
        @item-clicked="handleItemClicked"
      />
    </ul>
  </li>
</template>

<script setup>
import { ref, computed } from 'vue';
const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});

/** 送出一個emit通知父層有children被點擊 */
const emit = defineEmits(['item-clicked']);

const handleClick = () => {
  props.item.isOpen = !props.item.isOpen;
  emit('item-clicked', props.item.groupId, props.item.groupParentId);
};

const handleItemClicked = (childGroupId, childGroupParentId) => {
  emit('item-clicked', childGroupId, childGroupParentId);
};

const isActive = computed(() => {
  return props.item.isOpen || (props.item.children && props.item.children.some(child => child.isOpen));
});

</script>

<style scoped lang="scss">
.highlight {
  background-color: #f90;
  color: white;
  span {
    color: white;  // 白色文字對於 #f90 背景會有較好的對比度
  }
}
</style>