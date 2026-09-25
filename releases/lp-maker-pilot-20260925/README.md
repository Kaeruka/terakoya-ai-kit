# LP制作ツール固定版（ワークショップ試験用）

参加者へ渡す文は [START_HERE.txt](START_HERE.txt) の2行だけ。これが [WORKSHOP_PROMPT.md](WORKSHOP_PROMPT.md) を読み、同じフォルダにある固定版のHTML/CSS/JSを本人限定のWorkサイトとして完成させる二段構成を試す。

`index.html` と依存ファイルの相対パスを保持してブラウザで開く。必要ならフォルダ内で `python -m http.server 8811 --bind 127.0.0.1` を実行する。外部API、ログイン、デプロイは不要。`node --test tests/*.test.cjs` でローカルの自動テストを実行できる。

固定版に入れるものは `index.html`、`styles.css`、`overrides.css`、`core.js`、`sheet.js`、`app.js`、2つの `assets/*.js`。画像見本はJSに埋め込み済み。各参加者の入力や写真はGitHubへ保存しない。このブランチは試験用で、採用が決まるまでは正式版と呼ばない。

実際のWorkがGitHubから全ファイルを取得し、Sitesへ保存・非公開発行まで一回で行えるかを試す。回答待ちで止めない。アクセスできない時は再創作やZIPだけで成功扱いにせず、制約を報告する。
