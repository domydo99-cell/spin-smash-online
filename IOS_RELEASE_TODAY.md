# iPhoneリリース手順（本日用）

## 0. 前提
- Apple Developer Program 登録済み
- Xcode 最新版インストール済み
- Render 本番URLが有効（現在設定: `https://spin-smash-online.onrender.com`）

## 1. iOSプロジェクト準備
```bash
cd "/Users/riki/Documents/New project"
npm run ios:prepare
npm run ios:open
```

## 2. Xcodeで設定
1. `App` ターゲットを選択
2. `Signing & Capabilities`
3. Team を選択
4. Bundle Identifier を一意に調整（例: `com.domydo99cell.spinsmash`）
5. Deployment Target を iOS 15+ などに設定

## 3. 見た目設定
- App Icon（1024x1024）
- Launch Screen（必要なら）
- Display Name（`Spin Smash`）

## 4. アップロード
1. Xcode: `Product` -> `Archive`
2. Organizer: `Distribute App` -> `App Store Connect` -> `Upload`

## 5. App Store Connect
- アプリ説明文
- スクリーンショット
- 年齢レーティング
- プライバシーポリシーURL
- 審査提出

## 補足
- 今日できるのは「申請/提出」まで。
- 一般公開はApple審査完了後になります。
