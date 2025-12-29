# Choice Lab (choice-lab)

UI（初期値・提示順・多数派表示）が意思決定に与える影響を、3分で体験できるミニ実験サイトです。  
ビルド不要・外部依存なし・端末内（localStorage）のみで集計します。

## Experiments
- Default（デフォルト効果）：初期値がON/OFFで選択が変わる
- Anchoring（アンカリング）：最初の数字が推定を引きずる
- Social Proof（社会的証明）：「多くの人が選ぶ」が安心感として働く

## Notes
- 「モデル予測」は簡易ロジット/線形モデルによる比較用ベースラインです（真理の主張ではありません）。
- 個人情報の送信は行いません。

## Deploy (GitHub Pages)
1. Settings → Pages
2. Source: Deploy from a branch
3. Branch: `main` / folder: `/ (root)`
4. Save → 数十秒後に公開URLが表示されます
