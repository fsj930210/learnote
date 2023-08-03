<template>
  <div style="width: 95%; height: 80vh; margin-top: 30px">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item>
            <el-button type="primary" @click="onSubmit">点击获取当前屏幕分享</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <video id="localdemo02" autoplay controls muted></video>
    </el-row>
  </div>
</template>

<script setup>
import { ElRow, ElCol, ElForm, ElFormItem, ElButton } from 'element-plus'
import { ref } from 'vue'
function handleError(error) {
  // alert("摄像头无法正常使用，请检查是否占用或缺失")
  console.error('navigator.MediaDevices error: ', error.message, error.name)
}
const formInline = ref({})

const onSubmit = async () => {
  const domId = 'localdemo02'
  const video = document.getElementById(domId)
  const stream = video.srcObject
  if (stream) {
    stream.getAudioTracks().forEach((e) => {
      stream.removeTrack(e)
    })
    stream.getVideoTracks().forEach((e) => {
      stream.removeTrack(e)
    })
  }

  const newStream = await getShareMedia()
  video.srcObject = newStream
  video.muted = true
}

/**
 * 获取屏幕分享的媒体流
 * @author suke
 * @returns {Promise<void>}
 */
const getShareMedia = async () => {
  const constraints = {
    video: { width: 1920, height: 1080 },
    audio: false
  }
  if (window.stream) {
    window.stream.getTracks().forEach((track) => {
      track.stop()
    })
  }
  // 屏幕分享
  return await navigator.mediaDevices.getDisplayMedia(constraints).catch(handleError)
}
</script>

<style scoped>
#localdemo02 {
  width: 500px;
  height: 400px;
}
</style>
