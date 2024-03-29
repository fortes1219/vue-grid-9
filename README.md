# Vue 3 + Vite

## 應試規格

vue 版本 3.3.4 以上
vite 版本 4.4.5 以上

### 在 手機版面 390 \* 844px (Chrome: iphone 12 Pro 模擬器) 大小之下，依照指定提供的資料內容，製作一個有可收合側邊選單的展示頁面，包含三個部分:

- 主頁面-側邊選單收合按鈕
- 主頁面-九宮格動畫
- 側邊選單

## 指定資料內容如下 (假設收到後端給的 API 內容)

```
// data.json
    [
      {
        key: "64f",
        text: "好喝黑糖",
        children: [{
          key: "445",
          text: "黑糖鮮奶",
          children: [{
            key: "37a",
            text: "黑糖珍珠鮮奶"
          }, {
            key: "feb",
            text: "黑糖芋圓鮮奶"
          }, {
            key: "59c",
            text: "黑糖蒟蒻鮮奶"
          }]
        }, {
          key: "29e",
          text: "黑糖冬瓜",
          children: [{
            key: "ac3",
            text: "黑糖冬瓜牛奶"
          }, {
            key: "ca0",
            text: "黑糖冬瓜珍珠"
          }]
        }]
      },
      {
        key: "6c3",
        text: "茶",
        children: [{
          key: "5dc",
          text: "烏龍綠"
        }, {
          key: "b5f",
          text: "綠茶"
        }, {
          key: "b09",
          text: "紅茶"
        }, {
          key: "887",
          text: "青茶"
        }]
      }, {
        key: "c81",
        text: "咖啡",
        children: [{
          key: "e02",
          text: "黑咖啡",
          children: [{
            key: "d20",
            text: "濃縮咖啡"
          }, {
            key: "1f8",
            text: "美式咖啡"
          }]
        }, {
          key: "d7a",
          text: "牛奶咖啡",
          children: [{
            key: "c09",
            text: "拿鐵",
            children: [{
              key: "db2",
              text: "黑糖拿鐵"
            }, {
              key: "9f6",
              text: "榛果拿鐵"
            }, {
              key: "b61",
              text: "香草拿鐵"
            }]
          }, {
            key: "9ac",
            text: "卡布奇諾"
          }, {
            key: "ce8",
            text: "摩卡"
          }]
        }]
      }
    ];
```
---

## 主頁面

### 主頁面-側邊選單收合按鈕

製作一個按鈕，無指定樣式，可開啟/收合側邊選單即可

### 主頁面-九宮格動畫

切出一個九宮格，部分格子會不停閃爍。並且在指定的格子內(四個角落)有一顆球，球會向右移動一段距離

九宮格需要垂直置中於下方區塊 (示意圖中灰色底色區塊)

每個格子的規格如下 (寬度為螢幕寬均分, 間隔距離自行決定即可)

height: 100px;
border: black solid 2px;
background: radial-gradient(circle, rgba(113,81,95,1) 81%, rgba(0,0,0,1) 100%);
指定格子(右上, 正中, 右下) 會不停閃爍 (需有漸變or淡入淡出效果)
透明度 100% -> 60% -> 100% -> 60% ...
指定的球 (四個角落)
width: 30px;
height: 30px;
background-color: #A5F12B;
球往右方移動時會在所有九宮格的上方，不被任一九宮格蓋住，且全程保持透明度 100%
請務必使球不會閃爍 (因動畫透明度影響 or 其他原因導致)

---

### 側邊選單

請依照上方給定的資料，產出側邊選單

主頁面的按鈕可以開啟側邊選單，點擊空白處可以關閉選單
側邊選單內每個項目都可以點擊，點擊後 highlight 選取中的項目，若該項目有子元素，會展開該層。
一次只會有一個展開且 highlight 的項目。

---

# 額外需求

## 主頁面九宮格動畫
+ 使用兩種以上的動畫執行方式，來繪製動畫
+ 四顆球同時朝同一個座標點移動
+ 在效能考量下，設計可同時存在一百顆球、且指定飛行起終點的結構

## 側邊選單
+ 另提供一個下拉選單，需包含所有種類。從下拉選單中選取任一項目時，等同點擊該項目
+ 實作記憶功能，關閉分頁後再開啟，可以顯示上次選取的項目
+ 在效能考量下，設計可收合、展開最多一百層的選單

---
