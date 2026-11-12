# AXT-Studio Talks

綾坂ことによるプレゼン・セッション・講演などのスライドアーカイブです。

**スライド一覧：<https://axt-studio.github.io/Talks/>**

スライドは[AXT Presen'it!](https://github.com/AXT-Studio/presen-it)で作成しています。
各スライドはブラウザでそのまま閲覧でき、URLは`https://axt-studio.github.io/Talks/slides/<slug>/`です。

## Markdownソースを読む

各スライドの元になったMarkdownは、このリポジトリの[`src/slides/`](src/slides/)以下にあります。

```text
src/slides/<slug>/index.md   # スライド本体
src/slides/<slug>/assets/    # 画像など
```

スライド一覧ページの各講演にある「Markdownソース」からも、GitHub上のファイルを直接開けます。

## PDFとして保存する

PDFファイルは配布していません。必要な場合は、スライドのビューワーから保存してください。

1. スライドを開き、画面下部の操作バーにあるメニュー（︙）から「PDFとして保存」を選びます。
2. ブラウザの印刷画面で、送信先に「PDFに保存」を選びます。
3. 余白なし・倍率100%・ヘッダーとフッターなしを指定し、必要に応じて背景のグラフィックを有効にして保存します。

## 開発

このリポジトリは[Vite+](https://viteplus.dev/)を使っています。
コマンドはすべて`vp`で実行してください。

```sh
vp install   # 依存関係のインストール
vp dev       # 開発サーバー（http://localhost:5173/Talks/）
vp check     # フォーマット・Lint・型検査
vp test      # テスト
vp build     # 一覧ページと全スライドを dist/ にビルド
vp preview   # ビルド結果の確認
```

`main`へのPushで、GitHub Actionsが自動的にビルドしてGitHub Pagesへデプロイします。

### 管理の分担

- `src/slides/`は制作用リポジトリから自動同期される領域です。このリポジトリでは直接編集しないでください。
- それ以外（一覧ページ、設定ファイル、Workflow、このREADMEなど）はこのリポジトリで管理しています。
- スライドの追加・削除に合わせて一覧ページのコードを変更する必要はありません。

### 一覧ページで使うfrontmatter

一覧ページは、Presen'it!の標準キーに加えて次の独自キーを表示します。どれも省略できます。

```yaml
---
title: 講演タイトル
description: 一覧ページに表示する短い説明
date: 2026-11-12 # 講演日（YYYY-MM-DD）。新しい順の並べ替えに使います
event: "Example Conf #1" # イベント名。「#」を含む場合は引用符で囲んでください
---
```
