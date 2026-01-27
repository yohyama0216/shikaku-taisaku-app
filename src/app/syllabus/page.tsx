import Link from 'next/link';

export default function SyllabusPage() {
  return (
    <main>
      <h1 className="mb-4">試験範囲</h1>
      
      <div className="card mb-4">
        <div className="card-body">
          <h2 className="h4 card-title">Webデザイン技能検定3級 試験範囲</h2>
          <p className="text-muted">学科試験の出題範囲</p>
        </div>
      </div>

      <section className="mb-5">
        <h3 className="h5 bg-primary text-white p-3 rounded">［１］インターネット概論</h3>
        
        <div className="ms-3">
          <h4 className="h6 mt-3 fw-bold">●インターネット</h4>
          <p>以下のインターネットの仕組みについての一般的な知識</p>
          <ul>
            <li>インターネットの仕組み</li>
            <li>ワールドワイドウェブ(WWW)</li>
            <li>通信プロトコル</li>
            <li>ハイパテキスト転送プロトコル(HTTP)</li>
            <li>その他、インターネットについての一般的な知識</li>
          </ul>

          <h4 className="h6 mt-3 fw-bold">●ネットワーク技術</h4>
          <p>以下のインターネット接続法についての一般的な知識</p>
          <ul>
            <li>アクセス方式</li>
            <li>ネットワーク接続法</li>
            <li>サーバ･クライアントモデル</li>
            <li>端末と接続機器</li>
            <li>その他、インターネットに関わるネットワーク技術についての一般的な知識</li>
          </ul>

          <h4 className="h6 mt-3 fw-bold">●インターネットにおける標準規格、関連規格の動向</h4>
          <p>以下のワールドワイドウェブ(WWW)における各種標準化団体及び標準規格及び関連規格、動向についての一般的な知識</p>
          <ul>
            <li>日本産業規格(JIS)</li>
            <li>国際標準化機構(ISO)</li>
            <li>ワールドワイドウェブコンソーシアム(W3C:World Wide Web Consortium)</li>
            <li>インターネット技術タスクフォース(IETF: Internet Engineering Task Force)</li>
            <li>欧州電子計算機工業会(ECMA:ECMA International)</li>
            <li>ウェブ・ハイパテキスト・アプリケーション・テクノロジー・ワーキング・グループ（WHATWG:Web Hypertext Application Technology Working Group）</li>
            <li>その他、ウェブデザインに関わる各種規格、技術動向についての一般的な知識</li>
          </ul>

          <h4 className="h6 mt-3 fw-bold">●ウェブブラウジング</h4>
          <p>以下のウェブブラウジング技術における一般的な知識</p>
          <ul>
            <li>ブラウジング</li>
            <li>端末</li>
            <li>ウェブブラウザの種類と仕様</li>
            <li>サービス</li>
            <li>認証サービス</li>
          </ul>
          <p>以下のウェブ表示端末についての一般的な知識</p>
          <ul>
            <li>携帯端末</li>
          </ul>
          <p>各種端末に向けてウェブサイトを表示するための技術についての一般的な知識</p>

          <h4 className="h6 mt-3 fw-bold">●ワールドワイドウェブ(WWW)セキュリティ技術</h4>
          <p>以下のワールドワイドウェブ(WWW)における各種セキュリティ技術についての一般的な知識</p>
          <ul>
            <li>ウェブブラウザの種類と各種仕様</li>
            <li>公開鍵暗号基盤(PKI)</li>
            <li>ファイル転送</li>
          </ul>
          <p>以下の各種法令に関する一般的な知識</p>
          <ul>
            <li>不正アクセス行為の禁止等に関する法律</li>
            <li>個人情報の保護に関する法律</li>
          </ul>
          <p>以下のインターネットにおける各種セキュリティ及びマルウェア等の攻撃についての一般的な知識</p>
          <ul>
            <li>インターネットにおける不正アクセスの種類・方法</li>
            <li>マルウェアの攻撃方法</li>
            <li>対処、対策方法</li>
          </ul>

          <h4 className="h6 mt-3 fw-bold">●インターネット最新動向と事例</h4>
          <ul>
            <li>インターネット及びワールドワイドウェブ(WWW)に関わる各種最新動向についての一般的な知識</li>
            <li>ウェブデザインに関わる最新事例についての一般的な知識</li>
          </ul>
        </div>
      </section>

      <section className="mb-5">
        <h3 className="h5 bg-primary text-white p-3 rounded">［２］ワールドワイドウェブ(WWW)法務</h3>
        
        <div className="ms-3">
          <h4 className="h6 mt-3 fw-bold">●知的財産権とインターネット</h4>
          <p>以下のワールドワイドウェブ(WWW)及びウェブ構築に関わる知的財産権及び関連する権利についての一般的な知識</p>
          <ul>
            <li>産業財産権</li>
            <li>著作権</li>
            <li>その他の権利</li>
          </ul>
        </div>
      </section>

      <section className="mb-5">
        <h3 className="h5 bg-primary text-white p-3 rounded">［３］ウェブデザイン技術</h3>
        
        <div className="ms-3">
          <h4 className="h6 mt-3 fw-bold">●ハイパテキストマーク付け言語及び拡張可能なハイパテキストマーク付け言語(HTML・XHTML)とそのコーディング技術</h4>
          <p>以下の記述言語についての一般的な知識</p>
          <ul>
            <li>ハイパテキストマーク付け言語(HTML)</li>
            <li>拡張可能なハイパテキストマーク付け言語(XHTML)</li>
            <li>拡張可能なマークアップ言語(XML)</li>
          </ul>
          <p>以上のハイパテキストマーク付け言語における各種タグ及びコーディングについての一般的な知識</p>

          <h4 className="h6 mt-3 fw-bold">●スタイルシート(CSS)とそのコーディング技術</h4>
          <ul>
            <li>スタイルシート(CSS)のスタイル及びコーディング利用についての一般的な知識</li>
            <li>スタイルシート(CSS)のレベル、各ウェブブラウザの対応状況に関しての一般的な知識</li>
          </ul>

          <h4 className="h6 mt-3 fw-bold">●スクリプト</h4>
          <ul>
            <li>エクマスクリプト(ECMAScript)のコーディング及びシステムについての一般的な知識</li>
          </ul>
        </div>
      </section>

      <section className="mb-5">
        <h3 className="h5 bg-primary text-white p-3 rounded">［４］ウェブ標準</h3>
        
        <div className="ms-3">
          <ul>
            <li>ウェブ標準に基づいたウェブサイトの制作手法についての一般的な知識</li>
          </ul>
        </div>
      </section>

      <section className="mb-5">
        <h3 className="h5 bg-primary text-white p-3 rounded">［５］ウェブビジュアルデザイン</h3>
        
        <div className="ms-3">
          <h4 className="h6 mt-3 fw-bold">●ページデザイン及びレイアウト</h4>
          <p>以下のウェブサイトにおけるページデザインに関する要件についての一般的な知識</p>
          <ul>
            <li>テキストの種類と利用</li>
            <li>画像(イメージ) データの種類と加工、利用</li>
            <li>ウェブカラーデザイン</li>
            <li>構成について</li>
            <li>レイアウト手法</li>
          </ul>
          <p>ウェブサイトのページデザイン、サイト構築についての一般的な知識</p>

          <h4 className="h6 mt-3 fw-bold">●マルチメディアと動的表現</h4>
          <p>以下のマルチメディアデータに関わる各項目についての一般的な知識</p>
          <ul>
            <li>マルチメディアデータの種類(動画・音声・アニメーション等)</li>
            <li>マルチメディアデータの作成と加工</li>
            <li>組込</li>
            <li>配信</li>
          </ul>
          <p>マルチメディアデータを利用したウェブサイトのコンテンツデザイン、サイト構築についての一般的な知識</p>
        </div>
      </section>

      <section className="mb-5">
        <h3 className="h5 bg-primary text-white p-3 rounded">［６］ウェブインフォメーションデザイン</h3>
        
        <div className="ms-3">
          <h4 className="h6 mt-3 fw-bold">●インフォメーションデザイン</h4>
          <p>以下のウェブサイト構築を目的とした情報デザイン手法についての一般的な知識</p>
          <ul>
            <li>情報の構造化</li>
            <li>サイトマップの構成と設計</li>
          </ul>

          <h4 className="h6 mt-3 fw-bold">●インタフェースデザイン</h4>
          <p>ユーザーに配慮し目的に合致したインタフェースに関する要件についての一般的な知識</p>
          <ul>
            <li>ナビゲーション</li>
            <li>インタラクション</li>
            <li>グラフィカルユーザインタフェース</li>
          </ul>

          <h4 className="h6 mt-3 fw-bold">●ユーザビリティ</h4>
          <p>以下のウェブサイト構築におけるユーザビリティに関するデザイン手法についての一般的な知識</p>
          <ul>
            <li>人間工学</li>
            <li>ISO9241-11</li>
          </ul>
        </div>
      </section>

      <section className="mb-5">
        <h3 className="h5 bg-primary text-white p-3 rounded">［７］アクセシビリティ・ユニバーサルデザイン</h3>
        
        <div className="ms-3">
          <p>以下のウェブサイト構築におけるアクセシビリティに配慮したデザイン手法及びユニバーサルデザイン手法についての一般的な知識</p>
          <ul>
            <li>ウェブコンテンツ JIS(JIS X 8341-3)</li>
            <li>ユニバーサルデザイン</li>
          </ul>
          <p>以上を用いてウェブサイトの構築及びページデザインについての一般的な知識</p>
        </div>
      </section>

      <section className="mb-5">
        <h3 className="h5 bg-primary text-white p-3 rounded">［８］ウェブサイト設計・構築技術</h3>
        
        <div className="ms-3">
          <p>以下の各種ウェブサイト構築に関わる一般的な知識</p>
          <ul>
            <li>サービスサイト</li>
            <li>バナー広告のタイプと作成</li>
          </ul>
          <p>以下の各種設計・構築技術においての一般的な知識</p>
          <ul>
            <li>コミュニケーション</li>
            <li>企画</li>
            <li>プランニング</li>
            <li>サイト設計</li>
            <li>サイト構築</li>
          </ul>
        </div>
      </section>

      <section className="mb-5">
        <h3 className="h5 bg-primary text-white p-3 rounded">［９］ウェブサイト運用・管理技術</h3>
        
        <div className="ms-3">
          <p>以下の各種ウェブサイト運用・管理技術においての一般的な知識</p>
          <ul>
            <li>サイト管理</li>
            <li>システム保守</li>
          </ul>
        </div>
      </section>

      <section className="mb-5">
        <h3 className="h5 bg-primary text-white p-3 rounded">［１０］安全衛生・作業環境構築</h3>
        
        <div className="ms-3">
          <p>ウェブデザイン作業に伴う安全衛生に関する以下の事項についての一般的な知識</p>
          <ul>
            <li>機械、器工具、原材料等の危険性又は有害性及びこれらの取扱い方法</li>
            <li>安全装置、有害物抑制装置又は保護具の性能及び取扱い方法</li>
            <li>作業手順</li>
            <li>作業開始時の点検</li>
            <li>ウェブデザイン作業に関して発生するおそれのある疾病の原因及び予防</li>
            <li>人間工学に配慮したコンテンツの設計、配信</li>
            <li>VDT 作業等に適した作業環境の設定</li>
            <li>整理整頓及び清潔の保持</li>
            <li>事故時等における応急措置及び退避</li>
            <li>その他ウェブデザイン作業に関わる安全又は衛生のために必要なこと</li>
            <li>労働安全衛生法関連法令(ウェブデザイン作業に関わる部分に限る)についての一般的な知識</li>
          </ul>
        </div>
      </section>

      <div className="mt-4">
        <Link href="/" className="btn btn-primary">← トップページに戻る</Link>
      </div>
    </main>
  );
}
