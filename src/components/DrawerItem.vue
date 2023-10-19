<template>
  <li>
    <div @click="toggleItem">
      {{ item.text }}
    </div>
    <ul v-if="item.children && isActive">
      <drawer-item
        v-for="child in item.children"
        :key="child.key"
        :item="child"
        :active-path.sync="activePath"
      ></drawer-item>
    </ul>
  </li>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from "vue";

const props = defineProps({
  item: { type: Object, required: true },
  activePath: { type: Array, required: true },
});

const emits = defineEmits(["update:activePath"]);

const isActive = computed(() => props.activePath.includes(props.item.key));

const toggleItem = () => {
  if (isActive.value) {
    emits("update:activePath", props.activePath.slice(0, -1));
  } else {
    if (props.activePath.length >= 1) {
      emits("update:activePath", [props.item.key]);
    } else {
      emits("update:activePath", [...props.activePath, props.item.key]);
    }
  }
};
</script>
