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
      <van-field
        v-model="selectVal"
        is-link
        readonly
        label="飲料"
        placeholder="選擇飲料"
        @click="showPicker = true"
      />
      <van-popup v-model:show="showPicker" round position="bottom">
        <van-picker
          :columns="columns"
          @cancel="showPicker = false"
          @confirm="onConfirm"
        />
      </van-popup>
      <ul class="mt-[0.16rem]">
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

const selectVal = ref("");
const showPicker = ref(false);

const menuList = ref([]);

watch(
  () => props.list,
  (newVal) => {
    menuList.value = [...newVal];
    columns.value = columnDataAdaptor(props.list);
  }
);

/** 使用 useDrawerMenuItems composable */

const {
  handleItemClicked,
  updateActivePath,
  updateIsOpenStatus,
  closeAllExcept,
  selectActivePathHandler,
  itemMap,
  activePath,
} = useDrawerMenuItems(props, emit);

/** van-field & picker 資料轉換*/
const columnDataAdaptor = (list) => {
  let result = [];
  list.forEach((item) => {
    result.push({
      text: item.text,
      groupId: item.groupId,
      groupParentId: item.groupParentId,
      key: item.key,
      isOpen: item.isOpen,
      value: item.groupId,
    });
    if (item.children) {
      result = result.concat(columnDataAdaptor(item.children));
    }
  });
  return result;
};

const columns = ref(columnDataAdaptor(props.list));

const onConfirm = ({ selectedOptions }) => {
  console.log(
    selectedOptions,
    selectedOptions[0].value,
    itemMap.value,
    columns.value
  );
  const selectedItem = selectedOptions[0];
  showPicker.value = false;
  selectVal.value = selectedItem.text;

  const newPath = selectActivePathHandler(selectedItem.value);
  activePath.value = newPath;
  let updatedList = closeAllExcept(props.list, selectedItem.value);
  updatedList = updateIsOpenStatus(updatedList);
  handleItemClicked(
    selectedOptions[0].groupId,
    selectedOptions[0].groupParentId
  );
};

/** Drawer 開關事件 */

const isDrawerOpen = ref(false);
const drawerRef = useClickOutside(() => {
  isDrawerOpen.value = false;
});

const toggleDrawer = () => {
  isDrawerOpen.value = !isDrawerOpen.value;
};

const handleDrawerOpen = debounce(toggleDrawer, 300);

onMounted(() => {
  console.log("HeaderBar props:", props.list);
});
</script>
