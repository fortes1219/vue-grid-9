<template>
  <div class="neu-header-bar">
    <div class="neu-header-bar__btn"></div>
    <p class="neu-header-bar__title">Neu-TEST</p>
    <div class="neu-header-bar__btn" @click="handleDrawerOpen">
      <van-icon name="apps-o" class="neu-header-bar__icons" />
    </div>
  </div>
  <div ref="drawerRef" :class="[`neu-drawer`, isDrawerOpen ? `is-open` : ``]">
    <div class="neu-drawer__body">
      <ul>
        <DrawerItem
          v-for="item in list"
          :key="item.key"
          :item="item"
          @item-clicked="handleItemClicked"
        />
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useClickOutside } from "@/composable/useClickOutside";
import debounce from "lodash/debounce";
import DrawerItem from "@/components/DrawerItem.vue";

const props = defineProps({
  list: {
    type: Array,
    required: true,
    default: [],
  },
});

const isDrawerOpen = ref(false);
const drawerRef = useClickOutside(() => {
  isDrawerOpen.value = false;
});


const toggleDrawer = () => {
  isDrawerOpen.value = !isDrawerOpen.value;
};

const handleDrawerOpen = debounce(toggleDrawer, 300);

/** 觸發 list item 點擊事件 */
const closeItemsExcept = (items, excludeId) => {
  items.filter(item => item.groupId !== excludeId).forEach(item => item.isOpen = false);
}

const handleCloseItemsInHierarchy = (items, clickedGroupId) => {
  // 如果當前層級找到了被點擊的項目，則關閉同級的其他項目
  if (items.some(item => item.groupId === clickedGroupId)) {
    closeItemsExcept(items, clickedGroupId);
    return;
  }
  
  // 如果沒有找到，則遍歷子項目並進行遞歸搜索
  items.forEach(item => {
    if (item.children) {
      handleCloseItemsInHierarchy(item.children, clickedGroupId);
    }
  });
};

/** 觸發 list item 點擊事件 */
const handleItemClicked = (clickedGroupId, clickedGroupParentId) => {
  if (clickedGroupParentId) {
    handleCloseItemsInHierarchy(props.list, clickedGroupId);
  } else {
    closeItemsExcept(props.list, clickedGroupId);
  }
};


onMounted(() => {
  console.log("HeaderBar props:", props.list);
});
</script>
