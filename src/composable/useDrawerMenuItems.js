import { ref } from "vue";

export function useDrawerMenuItems(props, emit) {
    const itemMap = ref({});

    const createItemMap = (items) => {
      items.forEach((item) => {
        itemMap.value[item.groupId] = item;
        if (item.children) {
          createItemMap(item.children);
        }
      });
    };

    createItemMap(props.list);

    const handleItemClicked = (clickedGroupId, clickedGroupParentId) => {
      let updatedList;

      if (!clickedGroupParentId) {
        updatedList = closeAllExcept(props.list, clickedGroupId);
      } else {
        updatedList = [...props.list];
        const parentItemIndex = updatedList.findIndex(
          (item) => item.groupId === clickedGroupParentId
        );
        if (parentItemIndex !== -1 && updatedList[parentItemIndex].children) {
          updatedList[parentItemIndex].children = closeAllExcept(
            updatedList[parentItemIndex].children,
            clickedGroupId
          );
        }
      }
      emit("update:list", updatedList);
    };

    const closeItemsExcept = (excludeId) => {
      const clickedItem = itemMap[excludeId];
      const itemsToClose = clickedItem.groupParentId
        ? itemMap[clickedItem.groupParentId].children
        : props.list;

      itemsToClose.forEach((item) => {
        if (item.groupId !== excludeId) {
          item.isOpen = false;
        }
      });
    };

    const handleCloseItemsInHierarchy = (items, clickedGroupId) => {
      if (items.some((item) => item.groupId === clickedGroupId)) {
        closeItemsExcept(items, clickedGroupId);
        return;
      }

      items.forEach((item) => {
        if (item.children) {
          handleCloseItemsInHierarchy(item.children, clickedGroupId);
        }
      });
    };

    const closeAllExcept = (list, exceptionId) => {
      return list.map((item) => {
        if (item.groupId !== exceptionId) {
          item.isOpen = false;
        }
        if (item.children) {
          item.children = closeAllExcept(item.children, exceptionId);
        }
        return item;
      });
    };

    return { handleItemClicked };
}