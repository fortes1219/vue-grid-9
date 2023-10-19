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
      <!-- <ul>
        <li v-for="item in list" :key="item.key">
          <span @click="toggleItem(item)">{{ item.text }}</span>
          <ul v-if="item.children && item.isOpen">
            <li v-for="child in item.children" :key="child.key">
              <span @click="toggleChildItem(item, child)">{{
                child.text
              }}</span>
              <ul v-if="child.children && child.isOpen">
                <li v-for="grandChild in child.children" :key="grandChild.key">
                  {{ grandChild.text }}
                </li>
              </ul>
            </li>
          </ul>
        </li>
      </ul> -->
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
const handleItemClicked = (clickedGroupId, clickedGroupParentId) => {
  if (clickedGroupParentId) {  // 如果是第二層或第三層的項目
    // 你可以在這裡根據 clickedGroupId 和 clickedGroupParentId 來調整項目的狀態
  } else {  // 如果是第一層的項目
    props.list.forEach(item => {
      if (item.groupId !== clickedGroupId) {
        item.isOpen = false;
      }
    });
  }
};
/** 觸發 child item 點擊事件 */

// const toggleItem = (item) => {
//   item.isOpen = !item.isOpen;
//   props.list.forEach((parent) => {
//     if (parent !== item) {
//       parent.isOpen = false;
//     }
//   });
// };

// const toggleChildItem = (parentItem, childItem) => {
//   childItem.isOpen = !childItem.isOpen;
// };

onMounted(() => {
  console.log("HeaderBar props:", props.list);
});
</script>
