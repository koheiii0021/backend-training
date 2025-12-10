# ベースイメージ (Node.js)
FROM node:20-alpine

# 作業ディレクトリ
WORKDIR /app

# パッケージ定義だけ先にコピー (依存関係のキャッシュ用)
COPY package*.json ./
COPY tsconfig.json ./

#依存関係インストール
RUN npm install

# アプリ本体をコピー
COPY src ./src

# TypeScriptをビルド (dist/にJS出力)
RUN npm run build

#環境変数(デフォルト値)※本番では docker-compose や AWS 側で上書き
ENV NODE_ENV=production
ENV PORT=3000

# ポート公開
EXPOSE 3000

# app起動コマンド
CMD ["npm", "run", "start"]