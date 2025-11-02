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
    <main>
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">危険物乙４試験対策クイズ</h1>
          <p className="lead">
            危険物取扱者乙種第4類試験の学習用アプリです。<br />
            難易度とカテゴリを選択して学習を開始してください。
          </p>
        </div>
      </div>

      {/* Difficulty Level Selection */}
      <div className="row mt-4">
        <div className="col-12">
          <h2 className="h4 mb-3">難易度を選択</h2>
          <div className="row">
            <div className="col-md-4 mb-3">
              <div className="card border-primary">
                <div className="card-body">
                  <h5 className="card-title">
                    <i className="bi bi-mortarboard-fill"></i> 試験レベル
                  </h5>
                  <p className="card-text">実際の試験に近い難易度の問題</p>
                  <p className="mb-2"><strong>{examQuestions}問</strong></p>
                  <Link href="/quiz?difficulty=exam&category=all" className="btn btn-primary w-100 mb-2">
                    全問題を開始
                  </Link>
                  <details className="mt-2">
                    <summary className="btn btn-outline-primary btn-sm w-100">カテゴリ別に選択</summary>
                    <div className="list-group mt-2">
                      {categories.map((category) => {
                        const count = questions.filter(q => q.category === category && q.difficulty === 'exam').length;
                        if (count === 0) return null;
                        return (
                          <Link 
                            key={category}
                            href={`/quiz?difficulty=exam&category=${encodeURIComponent(category)}`}
                            className="list-group-item list-group-item-action"
                          >
                            <div className="d-flex justify-content-between">
                              <span>{category}</span>
                              <span className="badge bg-primary rounded-pill">{count}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </details>
                </div>
              </div>
            </div>
            
            <div className="col-md-4 mb-3">
              <div className="card border-success">
                <div className="card-body">
                  <h5 className="card-title">
                    <i className="bi bi-book-fill"></i> 基礎レベル
                  </h5>
                  <p className="card-text">初心者向けの基本問題</p>
                  <p className="mb-2"><strong>{basicQuestions}問</strong></p>
                  <Link href="/quiz?difficulty=basic&category=all" className="btn btn-success w-100 mb-2">
                    全問題を開始
                  </Link>
                  <details className="mt-2">
                    <summary className="btn btn-outline-success btn-sm w-100">カテゴリ別に選択</summary>
                    <div className="list-group mt-2">
                      {categories.map((category) => {
                        const count = questions.filter(q => q.category === category && q.difficulty === 'basic').length;
                        if (count === 0) return null;
                        return (
                          <Link 
                            key={category}
                            href={`/quiz?difficulty=basic&category=${encodeURIComponent(category)}`}
                            className="list-group-item list-group-item-action"
                          >
                            <div className="d-flex justify-content-between">
                              <span>{category}</span>
                              <span className="badge bg-success rounded-pill">{count}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </details>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-3">
              <div className="card border-warning">
                <div className="card-body">
                  <h5 className="card-title">
                    <i className="bi bi-arrow-left-right"></i> 比較問題
                  </h5>
                  <p className="card-text">似た用語・概念の違いを理解する問題</p>
                  <p className="mb-2"><strong>{comparisonQuestions}問</strong></p>
                  <Link href="/quiz?difficulty=comparison&category=all" className="btn btn-warning w-100 mb-2">
                    全問題を開始
                  </Link>
                  <details className="mt-2">
                    <summary className="btn btn-outline-warning btn-sm w-100">カテゴリ別に選択</summary>
                    <div className="list-group mt-2">
                      {categories.map((category) => {
                        const count = questions.filter(q => q.category === category && q.difficulty === 'comparison').length;
                        if (count === 0) return null;
                        return (
                          <Link 
                            key={category}
                            href={`/quiz?difficulty=comparison&category=${encodeURIComponent(category)}`}
                            className="list-group-item list-group-item-action"
                          >
                            <div className="d-flex justify-content-between">
                              <span>{category}</span>
                              <span className="badge bg-warning rounded-pill">{count}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </details>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-md-6 mb-3">
          <Link href="/stats" className="btn btn-info btn-lg w-100">
            統計を表示
          </Link>
        </div>
        <div className="col-md-6 mb-3">
          <Link href="/history" className="btn btn-secondary btn-lg w-100">
            学習履歴を表示
          </Link>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="alert alert-info">
            <h5 className="alert-heading">使い方</h5>
            <ul className="mb-0">
              <li>各問題には20秒の制限時間があります</li>
              <li>4回正解した問題は自動的にスキップされます</li>
              <li>学習進捗はブラウザに保存されます</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
