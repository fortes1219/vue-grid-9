<template>
  <div class="neu-layout" style="height: 200vh">
    <HeaderBar :list="menuData" @update:list="updateList" />
    <div class="neu-container">
      <input v-model="price" v-format-currency="{ locale: 'en-US', currency: 'USD' }" type="text" />
      <GridView />
    </div>
    <div @click="dialogs.isVisible = true">OPEN Dialog</div>
    <DialogComponent v-model:isVisible.lazy="dialogs.isVisible" v-model:title.trim="dialogs.title" v-model:message.trim="dialogs.message" />
    <div v-scroll-display="{ newText: '現在可以看到我了！', originalText: '滾動看看！' }" style="height: 200px; color: #fff">滾動看看！</div>
    <ul>
      <ChildMenu v-for="category in menuData" :key="category.key" :category="category" />
    </ul>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted, nextTick, watchEffect, watch } from 'vue';
  import HeaderBar from '@/components/HeaderBar.vue';
  import GridView from '@/components/GridView.vue';
  import DialogComponent from '@/components/Dialog.vue';
  import ChildMenu from '@/components/ChildMenu.vue';

  const menuData = ref([]);
  const price = ref(0);
  const dialogs = ref({ isVisible: false, title: 'Dialog 1', message: 'Message 1' });

  let groupIdCounter = 1;

  const assignGroupIds = (items, parentGroupId = null) => {
    items.forEach((item) => {
      item.groupId = groupIdCounter++;
      item.groupParentId = parentGroupId;
      if (item.children) {
        assignGroupIds(item.children, item.groupId);
      }
    });
  };

  /** 處理本地環境與線上環境的差別 */
  const getMenuDataURL = () => {
    return import.meta.env.MODE === 'production' ? '/vue-grid-9/data.json' : '/data.json';
  };

  /** 給每一項 list item 添加 isOpen 屬性 */
  const addIsOpenProperty = (items) => {
    items.forEach((item) => {
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
      console.log('Fetched menu data:', menuData.value);
    } catch (error) {
      console.error(error.message);
    }
  };

  const updateList = (newList) => {
    menuData.value = newList;
  };

  onMounted(() => {
    fetchMenuData();
  });
</script>
