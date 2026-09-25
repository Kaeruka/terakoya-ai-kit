# LP制作ツール固定版（ワークショップ試験用）

参加者へ渡す文は [START_HERE.txt](START_HERE.txt) の2行だけ。これが [WORKSHOP_PROMPT.md](WORKSHOP_PROMPT.md) を読み、同じフォルダにある固定版のHTML/CSS/JSを本人限定のWorkサイトとして完成させる二段構成を試す。

`index.html` と依存ファイルの相対パスを保持してブラウザで開く。必要ならフォルダ内で `python -m http.server 8811 --bind 127.0.0.1` を実行する。ローカル表示に外部API、ログイン、デプロイは不要。`node --test tests/*.test.cjs` で自動テストを実行できる。

固定版の実行に必要なものは `index.html`、`styles.css`、`overrides.css`、`core.js`、`sheet.js`、`app.js` の6ファイル。旧サンプル画像ファイルは履歴として残るが画面では読み込まない。写真未指定なら「画像」の仮枠にする。各参加者の入力や写真はGitHubへ保存しない。このブランチは試験用で、採用が決まるまでは正式版と呼ばない。

実際のWorkがGitHubから6ファイルを取得し、Sitesへ保存・非公開発行まで一回で行えるかを試す。回答待ちで止めない。アクセスできない時は再創作やZIPだけで成功扱いにせず、制約を報告する。
