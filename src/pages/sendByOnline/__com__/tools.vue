<template lang='pug'>
.tools
  .row
    .btns
      el-button.btn(@click="chooseConfigFile", color="#607D8B") {{ ifAccountEmpty ? '选择配置文件夹' : '重新选择配置文件夹' }}
      el-button.btn(
        color="#FF5252",
        style="color: #fff",
        :disabled="ifAccountEmpty",
        @click="clearList"
      ) 清空列表
      el-button.btn(
        color="#FF5252",
        style="color: #fff",
        :disabled="ifAccountEmpty",
        @click="resetProgress"
      ) 重置进度
    el-button(
      v-if="!isStartOfTask",
      :disabled="ifAccountEmpty",
      type="success",
      @click="start"
    ) 全部开始
    el-button(v-else, color="#FF9800", style="color: #fff") 全部暂停
  .title 发送设置
  .row.setting
    .btns
      el-button.btn(
        @click="sendSetting.checkRepeat = !sendSetting.checkRepeat"
      )
        span(style="margin-right: 10px") 校验重复
        el-switch(
          v-model="sendSetting.checkRepeat",
          style="pointer-events: none"
        )
      el-button.btn(@click="sendSetting.onlyVip = !sendSetting.onlyVip")
        span(style="margin-right: 10px") 只发送VIP
        el-switch(v-model="sendSetting.onlyVip", style="pointer-events: none")
      .task-num
        el-button
          span 同时发送任务数
          el-input-number(
            v-model="sendSetting.concurrency",
            style="width: 110px; margin-left: 10px",
            :min="1",
            :max="100"
          )
    .other-btns(v-if="selectedList.length")
      el-button(type="danger", @click="removeSelected") 删除({{ selectedList.length }})
      el-button(type="warning", @click="resetSelected") 重置登录({{ selectedList.length }})
</template>
<script setup>
import { computed, ref } from "vue";
import { chooseConfigFile, isStartOfTask, sendSetting } from "../provider/send";
import {
  start,
  accountMap,
  sendRecordMap,
  resetSendRecord,
  clear,
  selectedList,
  loginAccount,
} from "../provider/index";

import { ElMessageBox } from "element-plus";

let ifAccountEmpty = computed(() => {
  return !Boolean(Object.keys(accountMap.value).length);
});

function clearList() {
  ElMessageBox.confirm("确定要清空当前列表吗？").then(() => {
    clear();
  });
}
function resetProgress() {
  ElMessageBox.confirm("确定要重置发送进度吗？重置后无法恢复").then(() => {
    resetSendRecord();
  });
}
function removeSelected() {
  selectedList.value.map((item) => {
    delete accountMap.value[item.id];
  });
}
function resetSelected() {
  selectedList.value.map((item) => {
    loginAccount(item.id);
  });
}
</script>
<style scoped lang="less">
.tools {
  &:deep(.el-button) {
    margin: 0;
    margin-right: 10px;
    margin-bottom: 10px;
  }
  .row {
    display: flex;
    align-items: flex-start;
    .btns {
      flex: 1;
      overflow: hidden;
      flex-wrap: wrap;
      display: flex;
      align-items: flex-start;
    }
    &.setting {
      display: flex;
      align-items: center;
      .task-num {
        margin-right: 10px;
        &:deep(.el-button) {
          padding-right: 0;
        }
      }
    }
  }
  .title {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 5px;
  }
}
</style>
