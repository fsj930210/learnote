<template>
  <div style="width: 98%; height: 98%; margin-top: 20px">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="选择摄像头">
            <el-select v-model="formInline.videoId" placeholder="摄像头">
              <el-option
                v-for="(item, index) in localDevice.videoIn"
                :key="index"
                :label="item.label"
                :value="item.deviceId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择麦克风">
            <el-select v-model="formInline.audioInId" placeholder="麦克风">
              <el-option
                v-for="(item, index) in localDevice.audioIn"
                :key="index"
                :label="item.label"
                :value="item.deviceId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择听筒">
            <el-select v-model="formInline.audioOutId" placeholder="听筒">
              <el-option
                v-for="(item, index) in localDevice.audioOut"
                :key="index"
                :label="item.label"
                :value="item.deviceId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="分辨率:Width">
            <el-input v-model="formInline.width"></el-input>
          </el-form-item>
          <el-form-item label="分辨率:Height">
            <el-input v-model="formInline.height"></el-input>
          </el-form-item>
          <el-form-item label="FPS">
            <el-input v-model="formInline.frameRate"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">确定</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <video id="localdemo01" autoplay controls muted></video>
    </el-row>
  </div>
</template>
<script setup>
import {
  ElRow,
  ElCol,
  ElForm,
  ElFormItem,
  ElSelect,
  ElOption,
  ElInput,
  ElButton
} from 'element-plus'
import { onBeforeMount, ref } from 'vue'
const localDevice = ref({
  // 音频输入设备 耳机等
  audioIn: [],
  // 视频输入设备 摄像头
  videoIn: [],
  // 音频输出设备 听筒
  audioOut: []
})
const formInline = ref({
  videoId: undefined,
  audioInId: undefined,
  audioOutId: undefined,
  width: 1080,
  height: 720,
  frameRate: 24
})
function handleError(error) {
  console.error('navigator.MediaDevices.getUserMedia error: ', error.message, error.name)
}
function initInnerLocalDevice() {
  // 设备列表
  let constraints = { video: true, audio: true }
  if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
    console.log('浏览器不支持获取媒体设备')
    return
  }
  navigator.mediaDevices
    // 获取用户层面的媒体，当你的计算机通过 USB 或者其他网络形式接入了 N 多个摄像头或虚拟设备时，都是可以通过这个 API 获取到的
    // 为获取摄像头或者麦克风权限集合的探路函数
    .getUserMedia(constraints)
    .then((stream) => {
      // 清除当前标签页中没有销毁的媒体流
      stream.getTracks().forEach((trick) => {
        trick.stop()
      })
      // 获取当前设备所有的摄像头和麦克风信息；
      navigator.mediaDevices
        .enumerateDevices()
        .then((devices) => {
          devices.forEach(function (device) {
            if (device.kind === 'audioinput') {
              if (localDevice.value.audioIn.filter((e) => e.id === device.deviceId).length === 0) {
                localDevice.value.audioIn.push(device)
              }
            }
            if (device.kind === 'audiooutput') {
              if (localDevice.value.audioOut.filter((e) => e.id === device.deviceId).length === 0) {
                localDevice.value.audioOut.push(device)
              }
            } else if (device.kind === 'videoinput') {
              if (localDevice.value.videoIn.filter((e) => e.id === device.deviceId).length === 0) {
                localDevice.value.videoIn.push(device)
              }
            }
          })
        })
        .catch(handleError)
    })
    .then(() => {
      console.log(localDevice)
      console.log('audioIn', localDevice.value.audioIn)
      console.log('audioOut', localDevice.value.audioOut)
      console.log('videoIn', localDevice.value.videoIn)
    })
    .catch(handleError)
}
onBeforeMount(() => {
  initInnerLocalDevice()
})
const onSubmit = async () => {
  let domId = 'localdemo01'
  let video = document.getElementById(domId)
  let stream = video.srcObject
  if (stream) {
    stream.getAudioTracks().forEach((e) => {
      stream.removeTrack(e)
    })
    stream.getVideoTracks().forEach((e) => {
      stream.removeTrack(e)
    })
  }

  let newStream = await getTargetDeviceMedia(formInline.value.videoId, formInline.value.audioInId)
  video.srcObject = newStream
  video.muted = true
}
const getLocalUserMedia = async (constraints) => {
  return await navigator.mediaDevices.getUserMedia(constraints)
}
/**
 * 获取指定媒体设备id对应的媒体流
 * @author suke
 * @param videoId
 * @param audioId
 * @returns {Promise<void>}
 */
const getTargetDeviceMedia = async (videoId, audioId) => {
  const constraints = {
    audio: { deviceId: audioId ? { exact: audioId } : undefined },
    video: {
      deviceId: videoId ? { exact: videoId } : undefined,
      width: formInline.value.width,
      height: formInline.value.height,
      frameRate: { ideal: formInline.value.frameRate, max: 24 }
    }
  }
  if (window.stream) {
    window.stream.getTracks().forEach((track) => {
      track.stop()
    })
  }
  //被调用方法前面有，此处不再重复
  return await getLocalUserMedia(constraints).catch(handleError)
}
/**
 * 获取屏幕分享的媒体流
 * @author suke
 * @returns {Promise<void>}
 */
// eslint-disable-next-line no-unused-vars
async function getShareMedia() {
  const constraints = {
    // 屏幕分享不能设置video为false
    video: { width: 1920, height: 1080 },
    audio: false
  }
  if (window.stream) {
    window.stream.getTracks().forEach((track) => {
      track.stop()
    })
  }
  return await navigator.mediaDevices.getDisplayMedia(constraints).catch(handleError)
}
</script>
<style scoped></style>
