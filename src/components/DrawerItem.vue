<template>
  <li>
    <!--因為外層有使用useClickOutside，這裡需要防止冒泡，加上.stop-->
    <span @click.stop="handleClick">{{ item.text }}</span>
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
import { ref } from 'vue';
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

</script>