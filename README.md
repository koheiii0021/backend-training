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
- SQL基礎（CREATE TABLE, INSERT, SELECT, WHERE）
- ExpressからDB接続（pg, Pool）
- プレースホルダー（$1）でSQLインジェクション対策
- CRUD APIをDB対応

#### 詰まったポイント
- app.post('users') → '/users' のスラッシュ忘れ
- $1 と [値] の対応関係

#### 理解度
- 概念は理解（プレースホルダーはヒント必要だった）