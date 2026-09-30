
# 絵本専門店POS（Lv1簡易POSアプリ）

Tech0 12期 個人宿題。絵本専門店向けの簡易POS（レジ）アプリです。

## つまり何を作ったか

店員が会員ID（または非会員）を確認し、商品コードを入力して購入リストを作り、購入を確定すると税抜・税込の合計金額が表示される、シンプルなレジアプリです。

## 使用技術

- バックエンド：Python / FastAPI / SQLAlchemy
- フロントエンド：Next.js（App Router）/ TypeScript
- データベース：Azure Database for MySQL Flexible Server
- 認証：セッションベース（FastAPIのSessionMiddleware）
- パスワード：bcryptでハッシュ化して保存

## ローカルでの動かし方

### バックエンド

```
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

`.env`に以下を設定：

```
DB_USER=（ユーザー名）
DB_PASSWORD=（パスワード）
DB_HOST=（ホスト名）
DB_NAME=（DB名）
SESSION_SECRET=（任意の文字列）
```

```
python create_tables.py
python seed.py
uvicorn app.main:app --reload
```

`http://localhost:8000/docs` でAPIを確認できます。

### フロントエンド

```
cd frontend
npm install
```

`.env.local`に以下を設定：

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

```
npm run dev
```

`http://localhost:3000/login` からログインできます（テスト用担当者：S001 / やまだ）。

## 実装できた範囲

- [x] DB設計・テーブル作成（6テーブル）
- [x] API（税率取得・商品検索・会員照会・ログイン/ログアウト・購入確定）
- [x] 画面（ログイン・会員確認・商品検索・購入リスト・購入確定・リセット）
- [x] 画面のレスポンシブ対応
- [x] Azure MySQLへのDB接続切り替え
- [ ] バックエンドの単体テスト（pytest）
- [ ] フロントエンドの単体テスト（jest）
- [ ] Azure App Service / Static Web Appsへのデプロイ

## 生成AIの使い方

コーディングは自分の手で1行ずつ書きました。生成AI（Claude）は以下の用途で使いました。

- エラーメッセージの意味の解説（直し方は自分で考える）
- 設計判断で詰まったときの考え方の説明（例：セッション認証の仕組み、トランザクションの原子性、パスワードのハッシュ化の必要性）
- 自分で書いたコードのレビュー（「このコードでテストC-07は防げているか」といった観点での確認）
- 実装途中で見つかった設計仕様書との食い違い（購入確定APIの単価の受け取り方）の指摘