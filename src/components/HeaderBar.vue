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

const emit = defineEmits();

const isDrawerOpen = ref(false);
const drawerRef = useClickOutside(() => {
  isDrawerOpen.value = false;
});

const toggleDrawer = () => {
  isDrawerOpen.value = !isDrawerOpen.value;
};

const handleDrawerOpen = debounce(toggleDrawer, 300);

const itemMap = ref({});

const createItemMap = (items) => {
  items.forEach((item) => {
    itemMap.value[item.groupId] = item;
    if (item.children) {
      createItemMap(item.children);
    }
  });
};

// 初始化時填充映射
createItemMap(props.list);

/** 觸發 list item 點擊事件 */
const closeItemsExcept = (excludeId) => {
  const clickedItem = itemMap[excludeId];
  const itemsToClose = clickedItem.groupParentId
    ? itemMap[clickedItem.groupParentId].children
    : props.list;

  itemsToClose.forEach((item) => {
    if (item.groupId !== excludeId) {
      item.isOpen = false;
    }
  });
};

const handleCloseItemsInHierarchy = (items, clickedGroupId) => {
  // 如果當前層級找到了被點擊的項目，關閉同級的其他項目
  if (items.some((item) => item.groupId === clickedGroupId)) {
    closeItemsExcept(items, clickedGroupId);
    return;
  }

  // 如果沒有找到任何被點擊的項目，則對後代進行遞迴搜索
  items.forEach((item) => {
    if (item.children) {
      handleCloseItemsInHierarchy(item.children, clickedGroupId);
    }
  });
};

const closeAllExcept = (list, exceptionId) => {
  return list.map((item) => {
    if (item.groupId !== exceptionId) {
      item.isOpen = false;
    }
    if (item.children) {
      item.children = closeAllExcept(item.children, exceptionId);
    }
    return item;
  });
};

const handleItemClicked = (clickedGroupId, clickedGroupParentId) => {
  let updatedList;

  if (!clickedGroupParentId) {
    // 如果是最頂層的父類，就調用closeAllExcept
    updatedList = closeAllExcept(props.list, clickedGroupId);
  } else {
    // 子項目
    updatedList = [...props.list];
    const parentItemIndex = updatedList.findIndex(
      (item) => item.groupId === clickedGroupParentId
    );
    if (parentItemIndex !== -1 && updatedList[parentItemIndex].children) {
      updatedList[parentItemIndex].children = closeAllExcept(
        updatedList[parentItemIndex].children,
        clickedGroupId
      );
    }
  }
  emit("update:list", updatedList);
};

onMounted(() => {
  console.log("HeaderBar props:", props.list);
});
</script>
