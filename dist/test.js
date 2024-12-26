"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const WEBHOOK_URL = 'http://localhost:8080'; // ローカルでテストする場合のURL
// テストデータの送信関数
const sendTestData = async (data) => {
    try {
        const response = await axios_1.default.post(WEBHOOK_URL, data);
        console.log('送信成功:', response.data);
    }
    catch (error) {
        console.error('送信エラー:', error);
    }
};
// スペース入室のテストデータ
const enterData = {
    when: 'enter',
    spaceId: 'SPACE001',
    floorId: 'FLOOR001',
    name: 'テスト太郎',
    id: 'USER001',
    text: 'テスト入室',
    timestamp: Date.now().toString(),
};
// スペース退出のテストデータ
const leaveData = {
    when: 'leave',
    spaceId: 'SPACE001',
    floorId: 'FLOOR001',
    name: 'テスト太郎',
    id: 'USER001',
    text: 'テスト退出',
    timestamp: Date.now().toString(),
};
// 勤怠打刻のテストデータ
const timecardData = {
    when: 'timecardCreate',
    name: 'テスト太郎',
    id: 'USER001',
    recordTypeText: '出勤',
    recordedAtText: '2024/01/20 09:00',
    ip: '192.168.1.1',
    stampId: 'STAMP001',
    parentStampId: null,
    text: 'テスト出勤',
    timestamp: Date.now().toString(),
};
// 勤怠修正のテストデータ
const timecardUpdateData = {
    when: 'timecardUpdate',
    name: '管理者',
    id: 'ADMIN001',
    targetName: 'テスト太郎',
    targetId: 'USER001',
    recordTypeText: '出勤',
    beforeRecordedAtText: '2024/01/20 09:00',
    afterRecordedAtText: '2024/01/20 08:45',
    ip: '192.168.1.1',
    stampId: 'STAMP002',
    parentStampId: 'STAMP001',
    text: '時刻修正',
    timestamp: Date.now().toString(),
};
// 勤怠削除のテストデータ
const timecardDeleteData = {
    when: 'timecardDelete',
    name: '管理者',
    id: 'ADMIN001',
    targetName: 'テスト太郎',
    targetId: 'USER001',
    recordTypeText: '出勤',
    recordedAtText: '2024/01/20 09:00',
    ip: '192.168.1.1',
    stampId: 'STAMP001',
    parentStampId: null,
    text: '打刻削除',
    timestamp: Date.now().toString(),
};
// テストの実行
const runTests = async () => {
    console.log('テストデータの送信を開始します...');
    // 各テストデータを順番に送信
    await sendTestData(enterData);
    console.log('スペース入室データを送信しました');
    await sendTestData(leaveData);
    console.log('スペース退出データを送信しました');
    await sendTestData(timecardData);
    console.log('勤怠打刻データを送信しました');
    await sendTestData(timecardUpdateData);
    console.log('勤怠修正データを送信しました');
    await sendTestData(timecardDeleteData);
    console.log('勤怠削除データを送信しました');
    console.log('全てのテストデータの送信が完了しました');
};
// テストの実行
runTests().catch(console.error);
