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
          v-for="item in menuList"
          :key="item.key"
          :item="item"
          @item-clicked="handleItemClicked"
        />
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useClickOutside } from "@/composable/useClickOutside";
import { useDrawerMenuItems } from "@/composable/useDrawerMenuItems";
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

const menuList = ref([])

watch(
  () => props.list,
  (newVal) => {
    menuList.value = [...newVal];
  }
);

/** Drawer 開關事件 */

const isDrawerOpen = ref(false);
const drawerRef = useClickOutside(() => {
  isDrawerOpen.value = false;
});

const toggleDrawer = () => {
  isDrawerOpen.value = !isDrawerOpen.value;
};

const handleDrawerOpen = debounce(toggleDrawer, 300);

/** 使用 useDrawerMenuItems composable */

const { handleItemClicked } = useDrawerMenuItems(props, emit);

onMounted(() => {
  console.log("HeaderBar props:", props.list);
});
</script>
