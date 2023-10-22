import { ref } from "vue";

export function useDrawerMenuItems(props, emit) {
  /*
    由於題目說到需考慮100層時的效能問題
    所以先創建一個itemMap用來記錄每個item的groupId，以及對應的item方便查找
    這樣尋找任何項目的時間複雜度都是 O(1)
    activePath則用來記錄每個層級被點擊的group id
    確保沒有被點擊的group id都是關閉狀態
  */
  const itemMap = ref({});
  const activePath = ref([]);

  // 建立 itemMap，以便快速查找特定的 groupId
  const createItemMap = (items) => {
    items.forEach((item) => {
      itemMap.value[item.groupId] = item;
      if (item.children) {
        createItemMap(item.children);
      }
    });
  };

  // 初始化 itemMap
  createItemMap(props.list);

  // 當選單項目被點擊時的處理函數
  const handleItemClicked = (clickedGroupId, clickedGroupParentId) => {
    // 更新 activePath 以反映當前的活動路徑
    activePath.value = updateActivePath(clickedGroupId, clickedGroupParentId);
    console.log(activePath.value);

    let updatedList = closeAllExcept(props.list, clickedGroupId);
    updatedList = updateIsOpenStatus(updatedList);

    emit("update:list", updatedList);
  };

  // 根據 activePath 更新每個項目的 isOpen 狀態
  const updateIsOpenStatus = (list) => {
    return list.map((item) => {
      item.isOpen = activePath.value.includes(item.groupId);
      if (item.children) {
        item.children = updateIsOpenStatus(item.children);
      }
      return item;
    });
  };

  // 關閉除了指定 groupId 以外的所有項目
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

  // 根據點擊的 groupId 和 groupParentId 更新 activePath
  const updateActivePath = (clickedGroupId, clickedGroupParentId) => {
    // 如果沒有 groupParentId，表示點擊的是 root，因此提前RETURN
    if (!clickedGroupParentId) {
      return [clickedGroupId];
    }

    // 尋找 parent 在 activePath 中的位置
    const indexOfParent = activePath.value.indexOf(clickedGroupParentId);

    // 如果找到了 parent，更新 activePath 並返回
    if (indexOfParent !== -1) {
      return [...activePath.value.slice(0, indexOfParent + 1), clickedGroupId];
    }

    // 沒有找到 parent，則印出錯誤並返回當前的 activePath，但應該不會發生
    console.error("Unexpected error: Parent ID not found in activePath.");
    return activePath.value;
  };

  /** 額外需求: 需要一個select來展開選單對應的路徑 */

  const selectActivePathHandler = (
    targetGroupId,
    list = props.list,
    path = []
  ) => {
    // 如果找到對應的 groupId，則返回當前的路徑加上該 groupId
    const foundItem = list.find((item) => item.groupId === targetGroupId);

    if (foundItem) {
      return [...path, targetGroupId];
    }

    for (const item of list) {
      // 如果該項目有子項目，則遞迴找出對應的路徑
      if (!item.children) {
        continue;
      }
      const childPath = selectActivePathHandler(targetGroupId, item.children, [
        ...path,
        item.groupId,
      ]);
      if (childPath.length) {
        return childPath;
      }
    }

    return [];
  };

  return {
    handleItemClicked,
    closeAllExcept,
    updateActivePath,
    updateIsOpenStatus,
    selectActivePathHandler,
    createItemMap,
    itemMap,
    activePath,
  };
}
