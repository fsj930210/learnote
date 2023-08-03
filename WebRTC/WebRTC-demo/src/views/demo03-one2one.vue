<template>
  <div style="width: 98%; height: 98vh; margin-top: 30px">
    <el-row :gutter="20">
      <el-col :span="6">
        <div style="width: 100%; height: 800px">
          <ul v-for="(item, index) in roomUserList" :key="index">
            <el-tag size="small" @click="getStats" type="success">{{
              '用户' + item.nickname
            }}</el-tag>
            <el-tag
              v-if="userInfo.userId === item.userId"
              type="danger"
              size="small"
              @click="changeBitRate()"
              >增加比特率</el-tag
            >
            <el-button
              size="small"
              type="primary"
              v-if="userInfo.userId !== item.userId"
              @click="call(item)"
              >通话</el-button
            >
            <el-button
              v-if="userInfo.userId === item.userId"
              size="small"
              type="danger"
              @click="openVideoOrNot"
              >切换</el-button
            >
          </ul>
        </div>
      </el-col>
      <el-col :span="18">
        <el-row>
          <div
            style="
              width: 800px;
              height: 200px;
              display: flex;
              flex-direction: row;
              align-items: center;
            "
          >
            <el-form :model="formInline" label-width="250px" class="demo-form-inline">
              <el-form-item label="发送消息">
                <el-input v-model="formInline.rtcmessage" placeholder="消息"></el-input>
              </el-form-item>
              <el-form-item label="远端消息">
                <div>{{ formInline.rtcmessageRes }}</div>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="sendMessageUserRtcChannel">点击发送</el-button>
              </el-form-item>
            </el-form>
          </div>
        </el-row>
        <el-row>
          <div style="display: flex; flex-direction: row; justify-content: flex-start">
            <video
              @click="streamInfo('localdemo01')"
              id="localdemo01"
              autoplay
              controls
              muted
            ></video>
            <video
              @click="streamInfo('remoteVideo01')"
              id="remoteVideo01"
              autoplay
              controls
              muted
            ></video>
          </div>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ElRow, ElCol, ElForm, ElFormItem, ElButton, ElInput, ElMessage } from 'element-plus'
import { ref, onBeforeMount } from 'vue'
import { io } from 'socket.io-client'
import { serverSocketUrl } from '@/utils'
function handleError(error) {
  // alert("摄像头无法正常使用，请检查是否占用或缺失")
  console.error('navigator.MediaDevices.getUserMedia error: ', error.message, error.name)
}

const PeerConnection =
  window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection
function getParams(queryName) {
  let url = window.location.href
  let query = decodeURI(url.split('?')[1])
  let vars = query.split('&')
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=')
    if (pair[0] === queryName) {
      return pair[1]
    }
  }
  return null
}
let linkSocket = undefined
let localRtcPc = undefined
let channel = undefined
// const rtcPcParams = ref({
//   iceServers: [
//     { url: 'stun:stun.l.google.com:19302' } // 谷歌的公共服务
//   ]
// })
const userInfo = ref({})
const roomUserList = ref([])
const formInline = ref({
  rtcmessage: undefined,
  rtcmessageRes: undefined //响应
})

// const rtcmessage = ref(undefined)
const mapSender = ref([])

onBeforeMount(() => {
  if (getParams('userId')) {
    init(getParams('userId'), getParams('roomId'), getParams('nickname'))
  }
})

const setDomVideoStream = async (domId, newStream) => {
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
  video.srcObject = newStream
  video.muted = true
}
const setRemoteDomVideoStream = (domId, track) => {
  const video = document.getElementById(domId)
  const stream = video.srcObject
  if (stream) {
    stream.addTrack(track)
  } else {
    const newStream = new MediaStream()
    newStream.addTrack(track)
    video.srcObject = newStream
    video.muted = true
  }
}
const init = (userId, roomId, nickname) => {
  userInfo.value = {
    userId,
    roomId,
    nickname
  }
  linkSocket = io(serverSocketUrl, {
    reconnectionDelayMax: 10000,
    transports: ['websocket'],
    query: {
      userId,
      roomId,
      nickname
    }
  })
  linkSocket.on('connect', (e) => {
    console.log('server init connect success', linkSocket, e)
  })
  linkSocket.on('roomUserList', (e) => {
    console.log('roomUserList', e)
    roomUserList.value = e
  })
  linkSocket.on('msg', async (e) => {
    console.log('msg', e)
    if (e['type'] === 'join' || e['type'] === 'leave') {
      setTimeout(() => {
        let params = { roomId: getParams('roomId') }
        linkSocket.emit('roomUserList', params)
      }, 1000)
    }
    if (e['type'] === 'call') {
      await onCall(e)
    }
    if (e['type'] === 'offer') {
      await onRemoteOffer(e['data']['userId'], e['data']['offer'])
    }
    if (e['type'] === 'answer') {
      await onRemoteAnswer(e['data']['userId'], e['data']['answer'])
    }
    if (e['type'] === 'candidate') {
      localRtcPc.addIceCandidate(e.data.candidate)
    }
  })
  linkSocket.on('error', (e) => {
    console.log('error', e)
  })
}
/**
 * 获取设备 stream
 * @param constraints
 * @returns {Promise<MediaStream>}
 */
const getLocalUserMedia = async (constraints) => {
  return await navigator.mediaDevices.getUserMedia(constraints).catch(handleError)
}
const call = async (item) => {
  initCallerInfo(getParams('userId'), item.userId)
  let params = {
    userId: getParams('userId'),
    targetUid: item.userId
  }
  linkSocket.emit('call', params)
}
const onCall = async (e) => {
  console.log('远程呼叫：', e)
  await initCalleeInfo(e.data['targetUid'], e.data['userId'])
}
const initCalleeInfo = async (localUid, fromUid) => {
  //初始化pc
  localRtcPc = new PeerConnection()
  //初始化本地媒体信息
  let localStream = await getLocalUserMedia({ audio: true, video: true })
  for (const track of localStream.getTracks()) {
    localRtcPc.addTrack(track)
  }
  // dom渲染
  await setDomVideoStream('localdemo01', localStream)
  //监听
  onPcEvent(localRtcPc, localUid, fromUid)
}
const initCallerInfo = async (callerId, calleeId) => {
  mapSender.value = []
  //初始化pc
  localRtcPc = new PeerConnection()
  //获取本地媒体并添加到pc中
  let localStream = await getLocalUserMedia({ audio: true, video: true })
  for (const track of localStream.getTracks()) {
    mapSender.value.push(localRtcPc.addTrack(track))
  }
  // 本地dom渲染
  await setDomVideoStream('localdemo01', localStream)
  //回调监听
  onPcEvent(localRtcPc, callerId, calleeId)
  //创建offer
  let offer = await localRtcPc.createOffer({ iceRestart: true })
  //设置offer未本地描述
  await localRtcPc.setLocalDescription(offer)
  //发送offer给被呼叫端
  let params = { targetUid: calleeId, userId: callerId, offer: offer }
  linkSocket.emit('offer', params)
}
const onPcEvent = (pc, localUid, remoteUid) => {
  channel = pc.createDataChannel('chat')
  pc.ontrack = function (event) {
    console.log(event)
    setRemoteDomVideoStream('remoteVideo01', event.track)
  }
  pc.onnegotiationneeded = function (e) {
    console.log('重新协商', e)
  }
  pc.ondatachannel = function (ev) {
    console.log('Data channel is created!')
    ev.channel.onopen = function () {
      console.log('Data channel ------------open----------------')
    }
    ev.channel.onmessage = function (data) {
      console.log('Data channel ------------msg----------------', data)
      formInline.value.rtcmessageRes = data.data
    }
    ev.channel.onclose = function () {
      console.log('Data channel ------------close----------------')
    }
  }
  pc.onicecandidate = (event) => {
    if (event.candidate) {
      linkSocket.emit('candidate', {
        targetUid: remoteUid,
        userId: localUid,
        candidate: event.candidate
      })
    } else {
      /* 在此次协商中，没有更多的候选了 */
      console.log('在此次协商中，没有更多的候选了')
    }
  }
}
const sendMessageUserRtcChannel = () => {
  if (!channel) {
    ElMessage.error('请先建立webrtc连接')
  }
  channel.send(formInline.value.rtcmessage)
  formInline.value.rtcmessage = undefined
}
const onRemoteOffer = async (fromUid, offer) => {
  localRtcPc.setRemoteDescription(offer)
  let answer = await localRtcPc.createAnswer()
  await localRtcPc.setLocalDescription(answer)
  let params = { targetUid: fromUid, userId: getParams('userId'), answer: answer }
  linkSocket.emit('answer', params)
}
const onRemoteAnswer = async (fromUid, answer) => {
  await localRtcPc.setRemoteDescription(answer)
}
// const sendMsgToOne = (event, params) => {}

const changeBitRate = () => {
  console.log(localRtcPc)
  const senders = localRtcPc.getSenders()
  const send = senders.find((s) => s.track.kind === 'video')
  const parameters = send.getParameters()
  parameters.encodings[0].maxBitrate = 1 * 1000 * 1024
  send.setParameters(parameters)
}
/**
 * 打开或关闭摄像头
 */
const openVideoOrNot = () => {
  const senders = localRtcPc.getSenders()
  const send = senders.find((s) => s.track.kind === 'video')
  send.track.enabled = !send.track.enabled //控制视频显示与否
}
/**
 * 获取屏幕分享的媒体流
 * @author suke
 * @returns {Promise<void>}
 */
// const getShareMedia = async () => {
//   const constraints = {
//     video: { width: 1920, height: 1080 },
//     audio: true
//   }
//   if (window.stream) {
//     window.stream.getTracks().forEach((track) => {
//       track.stop()
//     })
//   }
//   return await navigator.mediaDevices.getDisplayMedia(constraints).catch(handleError)
// }
const streamInfo = (domId) => {
  const video = document.getElementById(domId)
  console.log(video.srcObject)
}
const getStats = () => {
  const senders = localRtcPc.getSenders()
  const send = senders.find((s) => s.track.kind === 'video')
  console.log(send.getParameters().encodings)
  let lastResultForStats //上次计算结果
  setInterval(() => {
    localRtcPc.getStats().then((res) => {
      res.forEach((report) => {
        let bytes
        let headerBytes
        let packets
        // console.log(report)
        //出口宽带 outbound-rtp  入口宽带 inbound-rtp
        if (report.type === 'outbound-rtp' && report.kind === 'video') {
          const now = report.timestamp
          bytes = report.bytesSent
          headerBytes = report.headerBytesSent
          packets = report.packetsSent
          console.log(bytes, headerBytes, packets)
          if (lastResultForStats && lastResultForStats.has(report.id)) {
            let bf = bytes - lastResultForStats.get(report.id).bytesSent
            let hbf = headerBytes - lastResultForStats.get(report.id).headerBytesSent
            let pacf = packets - lastResultForStats.get(report.id).packetsSent
            let t = now - lastResultForStats.get(report.id).timestamp
            // calculate bitrate
            const bitrate = Math.floor((8 * bf) / t)
            const headerrate = Math.floor((8 * hbf) / t)
            const packetrate = Math.floor((1000 * pacf) / t)
            console.log(
              `Bitrate ${bitrate} kbps, overhead ${headerrate} kbps, ${packetrate} packets/second`
            )
          }
        }
      })
      lastResultForStats = res
    })
  }, 4000)
}
</script>

<style scoped>
#localdemo01 {
  width: 300px;
  height: 200px;
}
#remoteVideo01 {
  width: 300px;
  height: 200px;
}
</style>
