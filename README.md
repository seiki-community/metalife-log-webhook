# metalife-log-webhook

## 概要

- メタライフのログを受け取るWebhookのサーバー

## 処理フロー

1. メタライフのログをPOSTで受け取る
2. ログを解析
3. Googleスプレッドシートに書き込む

## Webhook URL

```bash
https://asia-northeast1-seiki-218912.cloudfunctions.net/metalife-log-webhook
```

## Google Cloud Functions 管理画面

```bash
https://console.cloud.google.com/functions/details/asia-northeast1/metalife-log-webhook?env=gen2&inv=1&invt=AblLeA&project=seiki-218912&tab=source
```


## 技術スタック

- Node.js (Typescript)
- Google Cloud Functions
- Google Sheets API

## 開発環境テスト

```
# 1. ローカルサーバ起動
npm run start

# 2. ローカルサーバをインターネット上に公開してテスト (ngrokなどでも)
cloudflared tunnel --url localhost:8080

# 3. Webhook URLとしてMetalifeに設定
Metalifeの管理画面で操作

# 4. Metalifeで操作
ルームに入室、ルームから退出など
```

## 本番環境デプロイ

```bash
gcloud functions deploy metalife-log-webhook \
    --runtime nodejs18 \
    --trigger-http \
    --allow-unauthenticated \
    --entry-point webhook \
    --region asia-northeast1
```

## Google Sheets

### ファイルURL

https://docs.google.com/spreadsheets/d/1ctkzyt5OorqBcVrI1oqf5I90taMu60GPaIO4UxyRpRE/edit?gid=0#gid=0

### ファイルID

1ctkzyt5OorqBcVrI1oqf5I90taMu60GPaIO4UxyRpRE

### シート名

```
### スペース入室
https://docs.google.com/spreadsheets/d/1ctkzyt5OorqBcVrI1oqf5I90taMu60GPaIO4UxyRpRE/edit?gid=0#gid=0

### スペース退出
https://docs.google.com/spreadsheets/d/1ctkzyt5OorqBcVrI1oqf5I90taMu60GPaIO4UxyRpRE/edit?gid=1561406576#gid=1561406576

### 勤怠打刻
https://docs.google.com/spreadsheets/d/1ctkzyt5OorqBcVrI1oqf5I90taMu60GPaIO4UxyRpRE/edit?gid=1336099809#gid=1336099809

### 勤怠打刻_修正
https://docs.google.com/spreadsheets/d/1ctkzyt5OorqBcVrI1oqf5I90taMu60GPaIO4UxyRpRE/edit?gid=1458756902#gid=1458756902

### 勤怠打刻_退勤
https://docs.google.com/spreadsheets/d/1ctkzyt5OorqBcVrI1oqf5I90taMu60GPaIO4UxyRpRE/edit?gid=674940313#gid=674940313

```
## Metalife Webhook Payload

### スペース入室

```json
{
  spaceId: 'FxgrjujbfAU23QZ1MhIN',
  floorId: 'hKhzWLjbUAK6ZBS2wZCV',
  name: 'むらかみみゆう（シンガク先生）',
  id: 'zmQSMM15Y7VutVHj23nkDBHTr6V2',
  when: 'enter',
  text: '「むらかみみゆう（シンガク先生）」さんがスペースに入室しました。',
  timestamp: '1735212472057'
}
```

### スペース退出

```json
{
  spaceId: 'FxgrjujbfAU23QZ1MhIN',
  floorId: 'hKhzWLjbUAK6ZBS2wZCV',
  name: 'むらかみみゆう（シンガク先生）',
  id: 'zmQSMM15Y7VutVHj23nkDBHTr6V2',
  when: 'leave',
  text: '「むらかみみゆう（シンガク先生）」さんがスペースから退出しました。',
  timestamp: '1735212411809'
}
```

### 勤怠打刻

```json
{
  spaceId: 'FxgrjujbfAU23QZ1MhIN',
  floorId: 'hKhzWLjbUAK6ZBS2wZCV',
  name: 'むらかみみゆう（シンガク先生）',
  id: 'zmQSMM15Y7VutVHj23nkDBHTr6V2',
  recordType: 'start',
  recordTypeText: '出勤',
  recordedAt: '1735212512161',
  recordedAtText: '2024/12/26 20:28',
  ip: '2400:2413:8ce2:ac00:c5b3:8288:7693:a99c',
  stampId: 'g8tJ1InLdUZGvhnnYL64',
  parentStampId: 'g8tJ1InLdUZGvhnnYL64',
  when: 'timecardCreate',
  text: 'むらかみみゆう（シンガク先生）が出勤しました。',
  timestamp: '1735212512955'
}
```

### 勤怠打刻(退勤)

```json
{
  spaceId: 'FxgrjujbfAU23QZ1MhIN',
  floorId: 'hKhzWLjbUAK6ZBS2wZCV',
  name: 'むらかみみゆう（シンガク先生）',
  id: 'zmQSMM15Y7VutVHj23nkDBHTr6V2',
  recordType: 'end',
  recordTypeText: '退勤',
  recordedAt: '1735212562487',
  recordedAtText: '2024/12/26 20:29',
  ip: '2400:2413:8ce2:ac00:c5b3:8288:7693:a99c',
  stampId: '18LJgBSqOfNCU0XITFwD',
  parentStampId: 'g8tJ1InLdUZGvhnnYL64',
  when: 'timecardCreate',
  text: 'むらかみみゆう（シンガク先生）が退勤しました。',
  timestamp: '1735212564051'
}
```


### 勤怠打刻（中断)

```json
{
  spaceId: 'FxgrjujbfAU23QZ1MhIN',
  floorId: 'hKhzWLjbUAK6ZBS2wZCV',
  name: 'むらかみみゆう（シンガク先生）',
  id: 'zmQSMM15Y7VutVHj23nkDBHTr6V2',
  recordType: 'pause',
  recordTypeText: '中断',
  recordedAt: '1735212556738',
  recordedAtText: '2024/12/26 20:29',
  ip: '2400:2413:8ce2:ac00:c5b3:8288:7693:a99c',
  stampId: 'EVfbzLxRPXExBDpUmrrp',
  parentStampId: 'g8tJ1InLdUZGvhnnYL64',
  when: 'timecardCreate',
  text: 'むらかみみゆう（シンガク先生）が中断しました。',
  timestamp: '1735212557999'
}
```

### 勤怠打刻（再開)

```json
{
  spaceId: 'FxgrjujbfAU23QZ1MhIN',
  floorId: 'hKhzWLjbUAK6ZBS2wZCV',
  name: 'むらかみみゆう（シンガク先生）',
  id: 'zmQSMM15Y7VutVHj23nkDBHTr6V2',
  recordType: 'resume',
  recordTypeText: '再開',
  recordedAt: '1735212559716',
  recordedAtText: '2024/12/26 20:29',
  ip: '2400:2413:8ce2:ac00:c5b3:8288:7693:a99c',
  stampId: 'blel7f7RE9RA55tRiLtx',
  parentStampId: 'g8tJ1InLdUZGvhnnYL64',
  when: 'timecardCreate',
  text: 'むらかみみゆう（シンガク先生）が再開しました。',
  timestamp: '1735212560298'
}
```

### 勤怠打刻(退勤)

```json
{
  spaceId: 'FxgrjujbfAU23QZ1MhIN',
  floorId: 'hKhzWLjbUAK6ZBS2wZCV',
  name: 'むらかみみゆう（シンガク先生）',
  id: 'zmQSMM15Y7VutVHj23nkDBHTr6V2',
  recordType: 'end',
  recordTypeText: '退勤',
  recordedAt: '1735212727385',
  recordedAtText: '2024/12/26 20:32',
  ip: '2400:2413:8ce2:ac00:c5b3:8288:7693:a99c',
  stampId: 'vdBy6JD7Dl42dhAQBYhO',
  parentStampId: 'dK0JdvHk8oe2EScO3auZ',
  when: 'timecardCreate',
  text: 'むらかみみゆう（シンガク先生）が退勤しました。',
  timestamp: '1735212728198'
}
```


### 勤怠打刻（修正)

```json
{
  "spaceId": "FxgrjujbfAU23QZ1MhIN",
  "floorId": "hKhzWLjbUAK6ZBS2wZCV",
  "name": "むらかみみゆう（シンガク先生）",
  "id": "zmQSMM15Y7VutVHj23nkDBHTr6V2",
  "targetName": "自分",
  "targetId": "zmQSMM15Y7VutVHj23nkDBHTr6V2",
  "recordType": "end",
  "recordTypeText": "退勤",
  "beforeRecordedAt": "1735249388154",
  "beforeRecordedAtText": "2024/12/27 06:43",
  "afterRecordedAt": "1735249388154",
  "afterRecordedAtText": "2024/12/27 06:43",
  "ip": "2400:2413:8ce2:ac00:c5b3:8288:7693:a99c",
  "stampId": "cdqp47YNTwbRslXgw14K",
  "parentStampId": "fIUVTQFv9XZuNocLsuFt",
  "when": "timecardUpdate",
  "text": "むらかみみゆう（シンガク先生）が自分の退勤の時刻を2024/12/27 06:43から2024/12/27 06:43に修正しました。",
  "timestamp": "1735249406695"
}
```

### 勤怠打刻（削除)

```json
{
  "spaceId": "FxgrjujbfAU23QZ1MhIN",
  "floorId": "hKhzWLjbUAK6ZBS2wZCV",
  "name": "むらかみみゆう（シンガク先生）",
  "id": "zmQSMM15Y7VutVHj23nkDBHTr6V2",
  "targetName": "自分",
  "targetId": "zmQSMM15Y7VutVHj23nkDBHTr6V2",
  "recordType": "end",
  "recordTypeText": "退勤",
  "recordedAt": "1735249388154",
  "recordedAtText": "2024/12/27 06:43",
  "ip": "2400:2413:8ce2:ac00:c5b3:8288:7693:a99c",
  "stampId": "cdqp47YNTwbRslXgw14K",
  "parentStampId": "fIUVTQFv9XZuNocLsuFt",
  "when": "timecardDelete",
  "text": "むらかみみゆう（シンガク先生）が自分の退勤 (2024/12/27 06:43)を削除しました。",
  "timestamp": "1735249477196"
}
```
