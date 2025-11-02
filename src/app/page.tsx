import Link from 'next/link';
import questionsData from '@/data/questions.json';
import { Question } from '@/types/quiz';

const questions = questionsData as Question[];

export default function Home() {
  // Get unique categories
  const categories = Array.from(new Set(questions.map(q => q.category)));
  
  // Count questions by difficulty
  const examQuestions = questions.filter(q => q.difficulty === 'exam').length;
  const basicQuestions = questions.filter(q => q.difficulty === 'basic').length;
  const comparisonQuestions = questions.filter(q => q.difficulty === 'comparison').length;

  return (
    <>
      <hgroup>
        <h2>危険物乙４試験対策クイズ</h2>
        <p>危険物取扱者乙種第4類試験の学習用アプリです。難易度とカテゴリを選択して学習を開始してください。</p>
      </hgroup>

      <h3>難易度を選択</h3>
      <div className="grid grid-3">
        <article>
          <header>
            <strong>🎓 試験レベル</strong>
          </header>
          <p>実際の試験に近い難易度の問題</p>
          <p><strong>{examQuestions}問</strong></p>
          <Link href="/quiz?difficulty=exam&category=all" role="button">
            全問題を開始
          </Link>
          <details>
            <summary role="button" className="secondary" style={{ marginTop: '0.5rem' }}>カテゴリ別に選択</summary>
            <ul style={{ marginTop: '0.5rem', paddingLeft: 0, listStyle: 'none' }}>
              {categories.map((category) => {
                const count = questions.filter(q => q.category === category && q.difficulty === 'exam').length;
                if (count === 0) return null;
                return (
                  <li key={category} style={{ marginBottom: '0.25rem' }}>
                    <Link href={`/quiz?difficulty=exam&category=${encodeURIComponent(category)}`}>
                      {category} <span className="badge badge-primary">{count}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </details>
        </article>
        
        <article>
          <header>
            <strong>📚 基礎レベル</strong>
          </header>
          <p>初心者向けの基本問題</p>
          <p><strong>{basicQuestions}問</strong></p>
          <Link href="/quiz?difficulty=basic&category=all" role="button" className="secondary">
            全問題を開始
          </Link>
          <details>
            <summary role="button" className="secondary" style={{ marginTop: '0.5rem' }}>カテゴリ別に選択</summary>
            <ul style={{ marginTop: '0.5rem', paddingLeft: 0, listStyle: 'none' }}>
              {categories.map((category) => {
                const count = questions.filter(q => q.category === category && q.difficulty === 'basic').length;
                if (count === 0) return null;
                return (
                  <li key={category} style={{ marginBottom: '0.25rem' }}>
                    <Link href={`/quiz?difficulty=basic&category=${encodeURIComponent(category)}`}>
                      {category} <span className="badge badge-success">{count}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </details>
        </article>

        <article>
          <header>
            <strong>↔️ 比較問題</strong>
          </header>
          <p>似た用語・概念の違いを理解する問題</p>
          <p><strong>{comparisonQuestions}問</strong></p>
          <Link href="/quiz?difficulty=comparison&category=all" role="button" className="contrast">
            全問題を開始
          </Link>
          <details>
            <summary role="button" className="secondary" style={{ marginTop: '0.5rem' }}>カテゴリ別に選択</summary>
            <ul style={{ marginTop: '0.5rem', paddingLeft: 0, listStyle: 'none' }}>
              {categories.map((category) => {
                const count = questions.filter(q => q.category === category && q.difficulty === 'comparison').length;
                if (count === 0) return null;
                return (
                  <li key={category} style={{ marginBottom: '0.25rem' }}>
                    <Link href={`/quiz?difficulty=comparison&category=${encodeURIComponent(category)}`}>
                      {category} <span className="badge badge-warning">{count}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </details>
        </article>
      </div>

      <div className="grid grid-2">
        <Link href="/stats" role="button" className="secondary">
          📊 統計を表示
        </Link>
        <Link href="/history" role="button" className="secondary">
          📜 学習履歴を表示
        </Link>
      </div>

      <article className="alert alert-info">
        <header><strong>使い方</strong></header>
        <ul>
          <li>各問題には20秒の制限時間があります</li>
          <li>4回正解した問題は自動的にスキップされます</li>
          <li>学習進捗はブラウザに保存されます</li>
        </ul>
      </article>
    </>
  );
}
