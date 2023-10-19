<template>
  <div class="neu-layout">
    <HeaderBar :list="menuData" />
    <div class="neu-container">
      <GridView />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watchEffect, watch } from "vue";
import HeaderBar from "@/components/HeaderBar.vue";
import GridView from "@/components/GridView.vue";

const menuData = ref([]);

let groupIdCounter = 1;

const assignGroupIds = (items, parentGroupId = null) => {
  items.forEach(item => {
    item.groupId = groupIdCounter++;
    item.groupParentId = parentGroupId;
    if (item.children) {
      assignGroupIds(item.children, item.groupId);
    }
  });
};

/** 處理本地環境與線上環境的差別 */
const getMenuDataURL = () => {
  return import.meta.env.MODE === 'production'
    ? "/vue-grid-9/data.json"
    : "/data.json";
};

/** 給每一項 list item 添加 isOpen 屬性 */
const addIsOpenProperty = (items) => {
  items.forEach(item => {
    item.isOpen = false;
    if (item.children) {
      addIsOpenProperty(item.children);
    }
  });
};


/** 取得JSON中的選單資料集 */
const fetchMenuData = async () => {
  try {
    const response = await fetch(getMenuDataURL());
    if (!response.ok) {
      throw new Error(`Failed to fetch menu data: ${response.statusText}`);
    }
    menuData.value = await response.json();
    assignGroupIds(menuData.value); // 為取得的資料分配 groupId 和 groupParentId
    addIsOpenProperty(menuData.value);
    console.log("Fetched menu data:", menuData.value);
  } catch (error) {
    console.error(error.message);
  }
};


onMounted(() => {
  fetchMenuData();
});
</script>
