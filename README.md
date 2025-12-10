# backend-training

## 学習ログ

## Day1（2025/12/06）
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

## Day3（2025/12/07）
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

## Day 5: Express + PostgreSQL + JWT 認証付き CRUD API の総復習

### 実装したもの／確認したこと

#### プロジェクト構成

- src/index.ts … app.listen(PORT) だけ
- src/app.ts … express() 作成、express.json()、/auth / /users マウント、errorHandler
- src/db.ts … Pool（env から host / port / user / password / database）
- src/middleware/authMiddleware.ts … JWT 検証
- src/routes/auth.ts … signup / login
- src/routes/users.ts … users の CRUD

#### DB

- Docker で PostgreSQL 起動（POSTGRES_PASSWORD, POSTGRES_DB）
- users テーブル作成
- id SERIAL PRIMARY KEY
- name, email UNIQUE NOT NULL, password
- created_at, updated_at

#### 認証フロー

- signup: バリデーション → email 重複チェック → bcrypt.hash → INSERT + RETURNING
- login: email で検索 → bcrypt.compare → jwt.sign → token 返却
- authMiddleware: Authorization: Bearer <token> を検証して req.user に積む

#### ユーザー CRUD

- GET /users : 一覧
- GET /users/:id : 詳細、id バリデーション＋404
- PUT /users/:id : name, email 更新（必須チェック＋404）
- DELETE /users/:id : 削除（204 No Content）

### エラーを通して理解したこと

- password authentication failed for user "postgres"
→ DB ユーザー or パスワードの不一致（.env と Docker の設定を揃える必要）

- relation "users" does not exist
→ テーブル作成（マイグレーション）を忘れている

- トークンなし / Authorization ヘッダ typo
→ authMiddleware が正しく 401 を返すことを確認

- DELETE 後の GET が 404
→ DELETE が実際に効いていることを確認

### 定着したいポイント（覚える）

#### Express 構成パターン

- index.ts = 起動だけ
- app.ts = ミドルウェア / ルーター / エラーハンドラを組み立てる
- routes = URL ごとの担当
- middleware = 共通処理（認証 / エラー）
- db = Pool を 1個 export して全体で使い回す

#### 認証付き API の流れ

- signup → login → token → Authorization: Bearer ... → 認証付きルート