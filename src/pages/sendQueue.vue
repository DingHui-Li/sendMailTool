<template lang='pug'>
.page 
  .sending
    el-table(:data="tableData", height="calc(100vh - 30px)")
      el-table-column(label="来源", property="type", width="100")
      el-table-column(label="发送人ID", property="accountId")
      el-table-column(label="接收人ID", property="public-id")
      el-table-column(label="vip")
        template(#default="{ row }")
          el-tag(
            v-if="row['is-vip']",
            size="small",
            color="#FFEB3B",
            style="color: #fff"
          ) VIP
      el-table-column(label="状态")
        template(#default="{ row }")
          el-tag(:color="statusTagColor[row.status]", style="color: #fff") {{ row.status }}
</template>
<script setup>
import { computed, watch } from "vue";
import { taskQueue, sendSetting, send } from "./sendByOnline/provider/send";
import { sendRecordMap } from "./sendByOnline/provider/index";

const statusTagColor = {
  等待中: "#FFC107",
  发送中: "#4CAF50",
};

watch(
  () => taskQueue.value.sending,
  () => {
    pushToSendingQueue();
  },
  { deep: true }
);
watch(
  () => taskQueue.value.pending,
  () => {
    pushToSendingQueue();
  },
  { deep: true }
);

let tableData = computed(() => {
  return [...taskQueue.value.sending, ...taskQueue.value.pending];
});

function checkRepeat(task) {
  if (!sendRecordMap.value[task.accountId]) {
    return false;
  }
  for (const item of sendRecordMap.value[task.accountId]) {
    if (item["public-id"] == task["public-id"]) {
      return true;
    }
  }
  return false;
}

function updateRecordStatus(task) {
  if (!sendRecordMap.value[task.accountId]) {
    sendRecordMap.value[task.accountId] = [];
  }
  sendRecordMap.value[task.accountId].push(task);
}

function pushToSendingQueue() {
  console.log("pushToSendingQueue");
  while (
    taskQueue.value.sending.length < sendSetting.value.concurrency &&
    taskQueue.value.pending.length > 0
  ) {
    let queueHead = taskQueue.value.pending.shift();
    if (sendSetting.value.checkRepeat && checkRepeat(queueHead)) {
      queueHead.status = "已跳过(重复发送)";
      updateRecordStatus(queueHead);
      continue;
    }
    if (sendSetting.value.onlyVip && !queueHead["is-vip"]) {
      queueHead.status = "已跳过(非vip)";
      updateRecordStatus(queueHead);
      continue;
    }
    queueHead.status = "发送中";
    taskQueue.value.sending.push(queueHead);
    updateRecordStatus(queueHead);
    send(queueHead);
  }
}
</script>
<style scoped lang="less">
.page {
  height: calc(100vh - 30px);
  padding: 15px;
  .sending {
    &:deep(.el-table) {
      .el-table__header {
        position: sticky;
        top: 0;
      }
      .el-table__empty-block {
        display: none;
      }
    }
  }
  .pending {
    &:deep(.el-table__header) {
      display: none;
    }
  }
}
</style>
