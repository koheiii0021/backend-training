# backend-training

## 学習ログ

### Day1（2025/12/06）
- Express基礎
- ルーティング（GET）
- 動的パラメータ（:id）
- JSONレスポンス

#### 詰まったポイント
- req vs res：パラメータはリクエスト（req）から取る
- app.listen にはreq, resがない（起動時のコールバック）

#### 理解度
- 何も見ずに書けた（1箇所ヒントあり）

### Day2（2025/12/06）
- POSTリクエスト
- ステータスコード（200, 201, 400, 500）
- バリデーション
- ミドルウェア

#### 詰まったポイント
- app.use(express.json()) の書き方
- ミドルウェアはconsole.log + next()、res.jsonではない
- バリデーション後は return で処理を止める

#### 理解度
- 何も見ずに書けた（3箇所ヒントあり）

### Day3（2025/12/07）
- DockerでPostgreSQL起動
- CRUD API完成（GET/POST/PUT/DELETE）
- SQLインジェクション対策（$1プレースホルダー）

#### 学んだ「なぜ」
- なぜPostgreSQL → 厳密、スケール、求人に合う
- なぜDocker → 環境の再現性
- なぜPool → 接続を使い回して高速化
- なぜRESTful → 業界標準、チームが理解しやすい
- なぜRETURNING → クエリ往復を減らす
- なぜステータスコード → フロントが判断しやすい、監視できる
- なぜasync/await → DBの応答を待つ
- なぜバリデーション → わかりやすいエラー、DB負荷削減