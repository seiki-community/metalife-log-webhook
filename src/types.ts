// 共通のペイロードインターフェース
export interface BasePayload {
  spaceId: string;
  floorId: string;
  name: string;
  id: string;
  timestamp: string;
  text: string;
}

// スペースイベントのペイロード
export interface SpaceEventPayload extends BasePayload {
  when: 'enter' | 'leave';
}

// 勤怠打刻のペイロード
export interface TimecardPayload extends BasePayload {
  when: 'timecardCreate';
  recordType: 'start' | 'end' | 'pause' | 'resume';
  recordTypeText: string;
  recordedAt: string;
  recordedAtText: string;
  ip: string;
  stampId: string;
  parentStampId: string;
}

// 勤怠修正のペイロード
export interface TimecardUpdatePayload extends BasePayload {
  when: 'timecardUpdate';
  targetName: string;
  targetId: string;
  recordType: string;
  recordTypeText: string;
  beforeRecordedAt: string;
  beforeRecordedAtText: string;
  afterRecordedAt: string;
  afterRecordedAtText: string;
  ip: string;
  stampId: string;
  parentStampId: string;
}

// 勤怠打刻削除のペイロード
export interface TimecardDeletePayload extends BasePayload {
  when: 'timecardDelete';
  targetName: string;
  targetId: string;
  recordType: string;
  recordTypeText: string;
  recordedAt: string;
  recordedAtText: string;
  ip: string;
  stampId: string;
  parentStampId: string;
}

// ペイロードの型ユニオン
export type WebhookPayload = SpaceEventPayload | TimecardPayload | TimecardUpdatePayload | TimecardDeletePayload;
