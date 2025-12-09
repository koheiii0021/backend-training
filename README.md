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
- PostgreSQL + Docker
- CRUD API（GET/POST/PUT/DELETE）
- try-catchエラーハンドリング
- 認証（JWT）：signup, login, authMiddleware

#### 学んだ「なぜ」
- Pool → 接続を使い回して高速化
- $1 → SQLインジェクション対策
- RESTful → 業界標準、可読性
- bcrypt → パスワードを暗号化してDB流出時の被害を防ぐ
- JWT → ログイン状態をトークンで管理

#### 詰まったポイント（認証）
- bcrypt.hash / bcrypt.compare の使い分け
- jwt.sign にパスワードを入れない
- split(' ')[1] でトークン部分を取り出す

## Day 4: エラーハンドリング + JWT認証

### 学んだこと
- 400 vs 404の違い（クライアント責任 vs サーバー責任）
- try-catchがないと非同期処理でサーバーが落ちる
- authMiddlewareは門番。NGなら次の処理に進ませない

### 実装したもの
- PUT/DELETE に authMiddleware を追加
- 適切なステータスコードの使い分け

### 覚えるべきこと
- ステータスコード: 400, 401, 404, 500 の使い分け
- jwt.verify の基本的な使い方
- ミドルウェアの実行順序