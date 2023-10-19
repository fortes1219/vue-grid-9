<template>
  <div class="neu-header-bar">
    <div class="neu-header-bar__btn"></div>
    <p class="neu-header-bar__title">Neu-TEST</p>
    <div class="neu-header-bar__btn" @click="handleDrawerOpen">
      <van-icon name="apps-o" class="neu-header-bar__icons" />
    </div>
  </div>
  <div ref="drawerRef" :class="['neu-drawer', isDrawerOpen ? 'is-open' : '']">
    <div class="neu-drawer__body">
      <ul>
        <li v-for="item in list" :key="item.key">
          {{ item.text }}
          <ul v-if="item.children">
            <li v-for="child in item.children" :key="child.key">
              {{ child.text }}
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watchEffect, watch } from "vue";
import { useClickOutside } from "@/composable/useClickOutside";
import debounce from 'lodash/debounce'

const props = defineProps({
  list: {
    type: Array,
    required: true,
    default: []
  }
});

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