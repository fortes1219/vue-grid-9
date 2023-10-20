import { ref, onMounted, onUnmounted } from 'vue';

export function useClickOutside(callback) {
  const elementRef = ref(null);

  const handleClickOutside = (event) => {
    if (elementRef.value && !elementRef.value.contains(event.target)) {
      callback();
    }
  };

  onMounted(() => {
    document.addEventListener('click', handleClickOutside);
  });

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
  });

  return elementRef;
}