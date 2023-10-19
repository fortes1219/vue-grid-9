<template>
  <div class="neu-layout">
    <HeaderBar />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import HeaderBar from "@/components/HeaderBar.vue";

const menuData = ref([]);

const getMenuDataURL = () => {
  return import.meta.env.MODE === 'production'
    ? "/vue-grid-9/data.json"
    : "/data.json";
};

const fetchMenuData = async () => {
  try {
    const response = await fetch(getMenuDataURL());
    if (!response.ok) {
      throw new Error(`Failed to fetch menu data: ${response.statusText}`);
    }
    menuData.value = await response.json();
    console.log("Fetched menu data:", menuData.value);
  } catch (error) {
    console.error(error.message);
  }
};

onMounted(() => {
  fetchMenuData();
});
</script>
