<template lang='pug'>
.page 
  el-table(:data='taskQueue.sending')
    el-table-column(label='from',property='accountId')
    el-table-column(label='to',property='public-id')
    el-table-column(label="vip")
			template(#default="{ row }")
				el-tag(v-if="row['is-vip']",size="small",color="#FFEB3B",style="color: #fff") VIP
    el-table-column(label="状态")
			template(#default="{ row }")
				el-tag( :color="statusTagColor[scope.row.status]",style="color:#fff") {{row.status}}
  el-table(:data='taskQueue.pending')
    el-table-column(label='from',property='accountId')
    el-table-column(label='to',property='public-id')
    el-table-column(label="vip")
			template(#default="{ row }")
				el-tag(v-if="row['is-vip']",size="small",color="#FFEB3B",style="color: #fff") VIP
    el-table-column(label="状态")
			template(#default="{ row }")
				el-tag( :color="statusTagColor[scope.row.status]",style="color:#fff") {{row.status}}
</template>
<script setup>
import { computed,watch } from "vue";
import { taskQueue,sendSetting } from "./sendByOnline/provider/send";
import { sendRecordMap } from "./sendByOnline/provider/index";

const statusTagColor = {
  等待中: "#FFC107",
  发送中: "#4CAF50",
};

watch(()=>taskQueue.value.sending,(v)=>{
	while(v.length<sendSetting.value.concurrency&&taskQueue.value.pending.length>0){
		let queueHead=taskQueue.value.pending.shift()
		if(sendSetting.value.checkRepeat){
			if(checkRepeat(queueHead)){
				queueHead.status='已跳过(重复发送)'
				updateRecordStatus(queueHead)
				continue
			}
		}
		if(sendSetting.value.onlyVip){
			if(queueHead['is-vip']){
				taskQueue.value.sending.push(queueHead)
			}else{
				queueHead.status='已跳过(非vip)'
			}
		}else{
				queueHead.status='发送中'
				taskQueue.value.sending.push(queueHead)
		}
		updateRecordStatus(queueHead)
	}
},{immediate:true})


function checkRepeat(task){
	if(!sendRecordMap.value[task.accountId]){
		return false
	}
	for (const item of sendRecordMap.value[task.accountId]) {
		if(item['public-id']==task['public-id']){
			return true
		}
	}
	return false
}

function updateRecordStatus(task){
	if(!sendRecordMap.value[task.accountId]){
		sendRecordMap.value[task.accountId]=[]
	}
	sendRecordMap.value[task.accountId].push(task)
}


</script>
<style scoped lang="less">
.page {
  height: calc(100vh - 30px);
  padding: 15px;
}
</style>
