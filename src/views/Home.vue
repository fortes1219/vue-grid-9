<template>
  <div class="neu-layout">
    <HeaderBar />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import HeaderBar from "@/components/HeaderBar.vue";

const menuData = ref([]);

const getDrawerMenuData = async () => {
  const res = await fetch("/data.json");
  if (res.ok) {
    menuData.value = await res.json();
    console.log("menuData.value:", menuData.value);
  } else {
    console.error("Failed to fetch menu data:", res.statusText);
  }
};

onMounted(() => {
  getDrawerMenuData();
});
</script>
