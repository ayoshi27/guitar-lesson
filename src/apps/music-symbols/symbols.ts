export type SymbolCategoryId =
  | 'dynamics'
  | 'accidental'
  | 'articulation'
  | 'repeat'
  | 'pedal'
  | 'tempo'
  | 'chart'
  | 'octave'

export type SymbolCategory = {
  id: SymbolCategoryId
  label: string
}

export const CATEGORIES: SymbolCategory[] = [
  { id: 'dynamics', label: '強弱記号' },
  { id: 'accidental', label: '変化記号' },
  { id: 'articulation', label: '奏法記号' },
  { id: 'repeat', label: '反復・進行記号' },
  { id: 'pedal', label: 'ペダル記号' },
  { id: 'tempo', label: '速度変化記号' },
  { id: 'chart', label: 'コード伴奏記号' },
  { id: 'octave', label: '音域記号' },
]

export type SvgGlyphId =
  | 'staccato'
  | 'tenuto'
  | 'accent'
  | 'fermata'
  | 'slur'
  | 'tie'
  | 'breath'
  | 'caesura'
  | 'repeat-start'
  | 'repeat-end'
  | 'segno'
  | 'coda'
  | 'ending-1'
  | 'ending-2'
  | 'rhythm-slash'

export type SymbolDef =
  | { id: string; category: SymbolCategoryId; meaning: string; render: 'text'; text: string }
  | { id: string; category: SymbolCategoryId; meaning: string; render: 'svg'; svgId: SvgGlyphId }

export const SYMBOLS: SymbolDef[] = [
  // 強弱記号
  { id: 'pp', category: 'dynamics', render: 'text', text: 'pp', meaning: 'ピアニシモ（とても弱く）' },
  { id: 'p', category: 'dynamics', render: 'text', text: 'p', meaning: 'ピアノ（弱く）' },
  { id: 'mp', category: 'dynamics', render: 'text', text: 'mp', meaning: 'メゾピアノ（やや弱く）' },
  { id: 'mf', category: 'dynamics', render: 'text', text: 'mf', meaning: 'メゾフォルテ（やや強く）' },
  { id: 'f', category: 'dynamics', render: 'text', text: 'f', meaning: 'フォルテ（強く）' },
  { id: 'ff', category: 'dynamics', render: 'text', text: 'ff', meaning: 'フォルティシモ（とても強く）' },
  { id: 'sfz', category: 'dynamics', render: 'text', text: 'sfz', meaning: 'スフォルツァンド（その音を特に強く）' },
  { id: 'fp', category: 'dynamics', render: 'text', text: 'fp', meaning: 'フォルテピアノ（強く弾いてすぐ弱くする）' },
  { id: 'cresc', category: 'dynamics', render: 'text', text: 'cresc.', meaning: 'クレシェンド（だんだん強く）' },
  { id: 'dim', category: 'dynamics', render: 'text', text: 'dim.', meaning: 'デクレシェンド／ディミヌエンド（だんだん弱く）' },

  // 変化記号
  { id: 'sharp', category: 'accidental', render: 'text', text: '♯', meaning: 'シャープ（半音上げる）' },
  { id: 'flat', category: 'accidental', render: 'text', text: '♭', meaning: 'フラット（半音下げる）' },
  { id: 'natural', category: 'accidental', render: 'text', text: '♮', meaning: 'ナチュラル（元の高さに戻す）' },
  { id: 'double-sharp', category: 'accidental', render: 'text', text: '×', meaning: 'ダブルシャープ（全音上げる）' },
  { id: 'double-flat', category: 'accidental', render: 'text', text: '♭♭', meaning: 'ダブルフラット（全音下げる）' },

  // 奏法記号
  { id: 'staccato', category: 'articulation', render: 'svg', svgId: 'staccato', meaning: 'スタッカート（音を短く切って演奏する）' },
  { id: 'tenuto', category: 'articulation', render: 'svg', svgId: 'tenuto', meaning: 'テヌート（音の長さを十分に保って演奏する）' },
  { id: 'accent', category: 'articulation', render: 'svg', svgId: 'accent', meaning: 'アクセント（その音を強調して演奏する）' },
  { id: 'fermata', category: 'articulation', render: 'svg', svgId: 'fermata', meaning: 'フェルマータ（音符を程よく伸ばす）' },
  { id: 'slur', category: 'articulation', render: 'svg', svgId: 'slur', meaning: 'スラー（異なる高さの音符をなめらかにつなげて演奏する）' },
  { id: 'tie', category: 'articulation', render: 'svg', svgId: 'tie', meaning: 'タイ（同じ高さの2つの音符をつなげて1つの音として演奏する）' },
  { id: 'gliss', category: 'articulation', render: 'text', text: 'gliss.', meaning: 'グリッサンド（音から音へ滑るようにつなげる）' },
  { id: 'trill', category: 'articulation', render: 'text', text: 'tr', meaning: 'トリル（隣の音と素早く交互に演奏する）' },
  { id: 'breath', category: 'articulation', render: 'svg', svgId: 'breath', meaning: 'ブレス記号（息継ぎ・小さな間を空ける）' },
  { id: 'caesura', category: 'articulation', render: 'svg', svgId: 'caesura', meaning: 'カエスーラ（フレーズを区切って一瞬止まる）' },

  // 反復・進行記号
  { id: 'repeat-start', category: 'repeat', render: 'svg', svgId: 'repeat-start', meaning: 'リピート開始記号（ここから繰り返す）' },
  { id: 'repeat-end', category: 'repeat', render: 'svg', svgId: 'repeat-end', meaning: 'リピート終了記号（ここまで繰り返して戻る）' },
  { id: 'ending-1', category: 'repeat', render: 'svg', svgId: 'ending-1', meaning: '1番かっこ（1回目に演奏する）' },
  { id: 'ending-2', category: 'repeat', render: 'svg', svgId: 'ending-2', meaning: '2番かっこ（2回目・リピート後に演奏する）' },
  { id: 'segno', category: 'repeat', render: 'svg', svgId: 'segno', meaning: 'セーニョ（D.S.でこの記号の位置に戻る）' },
  { id: 'coda', category: 'repeat', render: 'svg', svgId: 'coda', meaning: 'コーダ（To Codaの指示でこの位置に飛ぶ）' },
  { id: 'dc', category: 'repeat', render: 'text', text: 'D.C.', meaning: 'ダ・カーポ（曲の最初に戻る）' },
  { id: 'ds', category: 'repeat', render: 'text', text: 'D.S.', meaning: 'ダル・セーニョ（セーニョの位置に戻る）' },
  { id: 'ds-al-coda', category: 'repeat', render: 'text', text: 'D.S. al Coda', meaning: 'セーニョに戻り、To Codaの指示でコーダへ進む' },
  { id: 'dc-al-fine', category: 'repeat', render: 'text', text: 'D.C. al Fine', meaning: '曲の最初に戻り、Fineの位置で終わる' },
  { id: 'fine', category: 'repeat', render: 'text', text: 'Fine', meaning: 'フィーネ（曲の終わり）' },
  { id: 'simile', category: 'repeat', render: 'text', text: 'simile', meaning: 'シミレ（直前と同じ奏法・パターンを繰り返す）' },

  // ペダル記号
  { id: 'ped-down', category: 'pedal', render: 'text', text: 'Ped.', meaning: 'ペダル記号（サステインペダルを踏む）' },
  { id: 'ped-up', category: 'pedal', render: 'text', text: '＊', meaning: 'ペダル解放記号（サステインペダルを離す）' },

  // 速度変化記号
  { id: 'rit', category: 'tempo', render: 'text', text: 'rit.', meaning: 'リタルダンド（だんだん遅く）' },
  { id: 'accel', category: 'tempo', render: 'text', text: 'accel.', meaning: 'アッチェレランド（だんだん速く）' },
  { id: 'a-tempo', category: 'tempo', render: 'text', text: 'a tempo', meaning: 'ア・テンポ（元の速さに戻る）' },
  { id: 'rubato', category: 'tempo', render: 'text', text: 'rubato', meaning: 'ルバート（テンポを自由に動かして演奏する）' },

  // コード伴奏記号
  { id: 'nc', category: 'chart', render: 'text', text: 'N.C.', meaning: 'ノーコード（その間は伴奏をつけない）' },
  { id: 'rhythm-slash', category: 'chart', render: 'svg', svgId: 'rhythm-slash', meaning: 'リズムスラッシュ（指定のリズムでコードを自由に演奏する）' },

  // 音域記号
  { id: '8va', category: 'octave', render: 'text', text: '8va', meaning: 'オッターヴァ・アルタ（1オクターブ高く演奏する）' },
  { id: '8vb', category: 'octave', render: 'text', text: '8vb', meaning: 'オッターヴァ・バッサ（1オクターブ低く演奏する）' },
  { id: 'loco', category: 'octave', render: 'text', text: 'loco', meaning: 'ロコ（8va/8vbの指示をやめて元の音域に戻る）' },
]
