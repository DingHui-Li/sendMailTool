<template lang='pug'>
.page-container
  el-tabs(v-model="tabs.activeIndex", tabPosition="left")
    el-tab-pane(
      v-for="(item, index) in tabs.list",
      :name="index",
      :label="item.label"
    )
      .content
        component(:is="components[item.component]") 
</template>
<script setup>
import { tabs } from "@/provider/sys.js";
import SendByOnline from "@/pages/sendByOnline/index.vue";
import SendByAppoint from "@/pages/sendByAppoint/index.vue";
import Search from "@/pages/search/index.vue";

const components = {
  SendByOnline,
  SendByAppoint,
  Search,
};
</script>
<style scoped lang="less">
.page-container {
  width: 100%;
  height: 100%;
  .content {
    height: 100%;
    overflow: auto;
  }
  &:deep(.el-tabs) {
    .el-tabs__header {
      &.is-left {
        height: 100vh;
      }
      background: #f5f5f5;
      .el-tabs__nav-wrap {
        &::after {
          display: none;
        }
      }
    }
    .el-tabs__active-bar {
      position: relative;
      width: 100%;
      z-index: 1;
    }
    .el-tabs__item {
      position: relative;
      z-index: 2;
      transition: all 0.3s;
      &.is-active {
        color: #fff;
      }
    }
  }
}
</style>
