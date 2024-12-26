import { HttpFunction } from '@google-cloud/functions-framework';
import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';
import { SpaceEventPayload, TimecardPayload, TimecardUpdatePayload, TimecardDeletePayload, WebhookPayload } from './types';

// Google Sheets設定
const SPREADSHEET_ID = '1ctkzyt5OorqBcVrI1oqf5I90taMu60GPaIO4UxyRpRE';
const SHEET_NAMES = {
  ENTER: 'スペース入室',
  LEAVE: 'スペース退出',
  TIMECARD: '勤怠打刻',
  TIMECARD_UPDATE: '勤怠打刻_修正',
  TIMECARD_DELETE: '勤怠打刻_削除',
};

// Google認証の設定
const auth = new GoogleAuth({
  keyFile: 'credentials/jwt.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Google Sheetsクライアントの初期化
const sheets = google.sheets({ version: 'v4', auth });

// タイムスタンプをフォーマットする関数
const formatTimestamp = (timestamp: string): string => {
  // UTC時間をJST（UTC+9）に変換
  const date = new Date(Number(timestamp));
  const jstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);

  const year = jstDate.getFullYear();
  const month = String(jstDate.getMonth() + 1).padStart(2, '0');
  const day = String(jstDate.getDate()).padStart(2, '0');
  const hour = String(jstDate.getHours()).padStart(2, '0');
  const minute = String(jstDate.getMinutes()).padStart(2, '0');
  const second = String(jstDate.getSeconds()).padStart(2, '0');

  return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
};

// シートに行を追加する関数
const appendToSheet = async (sheetName: string, values: (string | number)[]): Promise<void> => {
  try {
    console.log(`[${sheetName}] データを追加します:`, values);

    // A、B、C列に前の行の関数をコピー
    const rowData = [
      '=ROW()-1',
      '=IFERROR(QUERY(IMPORTRANGE("14o3-wervAs2fPsR6NtjgHqyjh6rQcxZFcGapxcSncCQ", "生徒情報管理マスタ!A3:S1000"), "select Col1 where Col19 = \'"&INDIRECT("G"&ROW())&"\' limit 1"), "データが合致しません")',
      '=IFERROR(CONCATENATE(QUERY(IMPORTRANGE("14o3-wervAs2fPsR6NtjgHqyjh6rQcxZFcGapxcSncCQ", "生徒情報管理マスタ!A3:S1000"), "select Col2 where Col19 = \'"&INDIRECT("G"&ROW())&"\' limit 1"), " ", QUERY(IMPORTRANGE("14o3-wervAs2fPsR6NtjgHqyjh6rQcxZFcGapxcSncCQ", "生徒情報管理マスタ!A3:S1000"), "select Col3 where Col19 = \'"&INDIRECT("G"&ROW())&"\' limit 1")), "データが合致しません")',
      ...values,
    ];
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sheetName}!A1`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [rowData],
      },
    });
    console.log(`[${sheetName}] データの追加が完了しました`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Error appending to sheet ${sheetName}: ${errorMessage}`);
  }
};

// スペース入退室のデータを処理する関数
const handleSpaceEvent = async (payload: SpaceEventPayload): Promise<void> => {
  console.log(`スペースイベントを処理します: ${payload.when}`);
  const values = [payload.spaceId, payload.floorId, payload.name, payload.id, payload.when, payload.text, formatTimestamp(payload.timestamp)];

  const sheetName = payload.when === 'enter' ? SHEET_NAMES.ENTER : SHEET_NAMES.LEAVE;
  await appendToSheet(sheetName, values);
};

// 勤怠打刻のデータを処理する関数
const handleTimecardEvent = async (payload: TimecardPayload | TimecardUpdatePayload | TimecardDeletePayload): Promise<void> => {
  console.log(`勤怠イベントを処理します: ${payload.when} (${payload.recordTypeText})`);
  if (payload.when === 'timecardUpdate') {
    // 勤怠修正の処理
    const values = [
      payload.spaceId,
      payload.floorId,
      payload.name,
      payload.id,
      payload.recordTypeText,
      payload.beforeRecordedAtText,
      payload.when,
      payload.text,
      formatTimestamp(payload.timestamp),
    ];
    await appendToSheet(SHEET_NAMES.TIMECARD_UPDATE, values);
  } else if (payload.when === 'timecardDelete') {
    // 勤怠削除の処理
    const values = [
      payload.spaceId,
      payload.floorId,
      payload.name,
      payload.id,
      payload.recordTypeText,
      payload.recordedAtText,
      payload.when,
      payload.text,
      formatTimestamp(payload.timestamp),
    ];
    await appendToSheet(SHEET_NAMES.TIMECARD_DELETE, values);
  } else {
    // 通常の勤怠打刻の処理
    const values = [
      payload.spaceId,
      payload.floorId,
      payload.name,
      payload.id,
      payload.recordTypeText,
      payload.recordedAtText,
      payload.when,
      payload.text,
      formatTimestamp(payload.timestamp),
    ];
    await appendToSheet(SHEET_NAMES.TIMECARD, values);
  }
};

export const webhook: HttpFunction = async (req, res) => {
  try {
    // リクエストメソッドの確認
    if (req.method !== 'POST') {
      res.status(405).send('Method Not Allowed');
      return;
    }

    console.log('Webhookリクエストを受信しました');
    const payload = req.body as WebhookPayload;
    console.log('受信データ:', JSON.stringify(payload, null, 2));

    // ペイロードの検証
    if (!payload) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid payload',
      });
      return;
    }

    // ペイロードの種類に応じた処理
    if (payload.when === 'enter' || payload.when === 'leave') {
      await handleSpaceEvent(payload);
    } else if (payload.when === 'timecardCreate' || payload.when === 'timecardUpdate' || payload.when === 'timecardDelete') {
      await handleTimecardEvent(payload);
    }

    // 処理が成功したことを通知
    console.log('Webhook処理が正常に完了しました');
    res.status(200).json({
      status: 'success',
      message: 'Webhook received and processed successfully',
      data: payload,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error processing webhook:', errorMessage);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error while processing webhook',
    });
  }
};
