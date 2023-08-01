const http = require('http');
const express = require('express');
const app = express();

const server = http.createServer(app);
const io = require('socket.io')(server, { allowEIO3: true });

const { hSet, hGetAll, hDel } = require('./redis');
const { getMessage, getParams } = require('./utils');

//http server
app.use(express.static('./dist'));
app.use(function (req, res, next) {
	res.sendFile('./dist/index.html'); // 路径根据自己文件配置
});

server.listen(3000, async () => {
	console.log('服务器启动成功 *:3000');
});

io.on('connection', async (socket) => {
	await onListener(socket);
});

const userMap = new Map(); // userId: socket
const roomKey = 'meeting-room::';

/**
 * DB data
 * @author suke
 * @param {Object} userId
 * @param {Object} roomId
 * @param {Object} nickname
 * @param {Object} pub
 */
async function serializeUserInfo(userId, roomId, nickname, pub) {
	const res = JSON.stringify({
		userId,
		roomId,
		nickname,
		pub,
	});
	return res;
}

/**
 * 监听
 * @param {Object} socket
 */
async function onListener(socket) {
	const url = socket.client.request.url;
	const userId = getParams(url, 'userId');
	const roomId = getParams(url, 'roomId');
	const nickname = getParams(url, 'nickname');
	const pub = getParams(url, 'pub');
	console.log('client uid：' + userId + ' roomId: ' + roomId + ' 【' + nickname + '】online ');
	// user map
	userMap.set(userId, socket);
	// room cache
	if (roomId) {
		await hSet(roomKey + roomId, userId, await serializeUserInfo(userId, roomId, nickname, pub));
		console.log('roomId', roomId);
		oneToRoomMany(roomId, getMessage('join', userId + ' join then room', 200, { userId: userId, nickname: nickname }));
	}

	socket.on('msg', async (data) => {
		console.log('msg', data);
		await oneToRoomMany(roomId, data);
	});

	socket.on('disconnect', () => {
		console.log('client uid：' + userId + ' roomId: ' + roomId + ' 【' + nickname + '】 offline ');
		userMap.delete(userId);
		if (roomId) {
			hDel(roomKey + roomId, userId);
			oneToRoomMany(
				roomId,
				getMessage('leave', userId + ' leave the room ', 200, { userId: userId, nickname: nickname })
			);
		}
	});

	socket.on('roomUserList', async (data) => {
		// console.log("roomUserList msg",data)
		socket.emit('roomUserList', await getRoomOnlyUserList(data['roomId']));
	});
	socket.on('call', (data) => {
		const targetUid = data['targetUid'];
		oneToOne(targetUid, getMessage('call', '远程呼叫', 200, data));
	});
	socket.on('candidate', (data) => {
		const targetUid = data['targetUid'];
		oneToOne(targetUid, getMessage('candidate', 'ice candidate', 200, data));
	});
	socket.on('offer', (data) => {
		const targetUid = data['targetUid'];
		oneToOne(targetUid, getMessage('offer', 'rtc offer', 200, data));
	});
	socket.on('answer', (data) => {
		const targetUid = data['targetUid'];
		oneToOne(targetUid, getMessage('answer', 'rtc answer', 200, data));
	});
	socket.on('applyMic', (data) => {
		const targetUid = data['targetUid'];
		oneToOne(targetUid, getMessage('applyMic', 'apply mic', 200, data));
	});
	socket.on('acceptApplyMic', (data) => {
		const targetUid = data['targetUid'];
		oneToOne(targetUid, getMessage('acceptApplyMic', 'acceptApplyMic mic', 200, data));
	});
	socket.on('refuseApplyMic', (data) => {
		const targetUid = data['targetUid'];
		oneToOne(targetUid, getMessage('refuseApplyMic', 'refuseApplyMic mic', 200, data));
	});
}

/**
 * ono to one
 * @author suke
 * @param {Object} uid
 * @param {Object} msg
 */
function oneToOne(uid, msg) {
	const socket = userMap.get(uid);
	if (socket) {
		socket.emit('msg', msg);
	} else {
		console.log(uid + '用户不在线');
	}
}

/**
 * 获取房间用户列表(k-v) 原始KV数据
 * @author suke
 * @param {Object} roomId
 */
async function getRoomUser(roomId) {
	return await hGetAll(roomKey + roomId);
}

/**
 * 获取房间用户列表(list)
 * @author suke
 * @param {Object} roomId
 */
async function getRoomOnlyUserList(roomId) {
	const resList = [];
	const uMap = await hGetAll(roomKey + roomId);
	for (const key in uMap) {
		const detail = JSON.parse(uMap[key]);
		resList.push(detail);
	}
	return resList;
}

/**
 * broadcast
 * @author suc
 * @param {Object} roomId
 * @param {Object} msg
 */
async function oneToRoomMany(roomId, msg) {
	const uMap = await getRoomUser(roomId);
	for (const uid in uMap) {
		oneToOne(uid, msg);
	}
}
