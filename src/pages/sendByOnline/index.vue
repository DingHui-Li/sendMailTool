<template lang='pug'>
.page 
  Tools
  .task
    el-table(
      :data="accountList",
      stripe,
      @selection-change="handleSelectionChange"
    )
      el-table-column(type="selection", width="55")
      el-table-column(label="编号", type="index", width="100")
      el-table-column(label="头像")
        template(#default="{ row }")
          img.avatar(v-if="row.avatar", :src="row.avatar")
      el-table-column(label="账号", property="id")
      el-table-column(label="名称", property="name")
      el-table-column(label="总数")
        template(#default="{ row }")
          div {{ sendRecordMap[row?.id]?.length || 0 }}
      el-table-column(label="已发送")
      el-table-column(label="状态")
        template(#default="scope")
          el-tag(
            :color="statusTagColor[scope.row.status]",
            :style="`color:${statusTagColor[scope.row.status] ? '#fff' : '#448AFF'}`"
          ) {{ scope.row.status }}
      el-table-column
        template(#default="{ row }")
          el-button(
            v-if="sendRecordMap[row.id] && sendRecordMap[row.id].length",
            type="success",
            text,
            @click="handleOpenDialog(row)"
          ) 发送记录
  el-dialog(
    v-model="dialog.open",
    :title="`${dialog.name}(${dialog.id})的发送记录`"
  )
    el-table(:data="sendRecordMap[dialog.id]", height="60vh", stripe)
      el-table-column(label="编号", type="index", width="100")
      el-table-column(label="来源", property="type", width="100")
      el-table-column(label="vip")
        template(#default="{ row }")
          el-tag(
            v-if="row['is-vip']",
            size="small",
            color="#FFEB3B",
            style="color: #fff"
          ) VIP
      el-table-column(label="账号", property="id")
      el-table-column(label="id", property="public-id")
      el-table-column(label="名称", property="name")
      el-table-column(label="状态", property="status")
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import Tools from "./__com__/tools.vue";
import { accountMap, sendRecordMap, selectedList } from "./provider/index";
import { Loading } from "@element-plus/icons-vue";
import { upload } from "./provider/send";

let accountList = computed(() => {
  return Object.values(accountMap.value);
});
let dialog = ref({
  open: false,
  id: "",
});

onMounted(() => {});
function handleOpenDialog(e) {
  dialog.value.open = true;
  dialog.value.id = e.id;
  dialog.value.name = e.name;
  console.log(sendRecordMap.value);
}

const statusTagColor = {
  就绪: "#FF9800",
  登录中: "#673AB7",
  "登录失败,5s后重试": "#FF5252",
  查询在线: "#3F51B5",
  查询联系人: "#3F51B5",
  查询收件箱: "#3F51B5",
  发信中: "#8BC34A",
};

function handleSelectionChange(e) {
  selectedList.value = e;
}
</script>
<style scoped lang="less">
.page {
  padding: 15px;
  &:deep(.el-tag) {
    border: none;
  }
  &:deep(.el-overlay) {
    backdrop-filter: blur(5px);
    .el-dialog {
      width: 80vw;
      border-radius: 10px;
      overflow: hidden;
      .el-dialog__header {
        background: #448aff;
        margin: 0;
        .el-dialog__title {
          color: #fff;
        }
        .el-icon {
          background: red;
          border-radius: 50%;
          color: #fff;
          padding: 3px;
          font-size: 12px;
        }
      }
    }
  }

  .avatar {
    width: 40px;
    height: 40px;
    background: #f5f5f5;
    object-fit: cover;
    border-radius: 50%;
  }
}
</style>
