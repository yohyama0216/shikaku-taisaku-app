import Link from 'next/link';
import questionsData from '@/data/questions.json';
import { Question } from '@/types/quiz';

const questions = questionsData as Question[];

export default function Home() {
  // Get unique categories
  const categories = Array.from(new Set(questions.map(q => q.category)));

  return (
    <main>
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">危険物乙４試験対策クイズ</h1>
          <p className="lead">
            危険物取扱者乙種第4類の試験対策クイズアプリです。<br />
            カテゴリを選択して学習を始めましょう。
          </p>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <h2 className="h4 mb-3">カテゴリ選択</h2>
          <div className="list-group">
            <Link 
              href="/quiz?category=all" 
              className="list-group-item list-group-item-action"
            >
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">全ての問題</h5>
                <span className="badge bg-primary rounded-pill">{questions.length}問</span>
              </div>
              <p className="mb-1">すべてのカテゴリから出題</p>
            </Link>
            {categories.map((category) => {
              const count = questions.filter(q => q.category === category).length;
              return (
                <Link 
                  key={category}
                  href={`/quiz?category=${encodeURIComponent(category)}`}
                  className="list-group-item list-group-item-action"
                >
                  <div className="d-flex w-100 justify-content-between">
                    <h5 className="mb-1">{category}</h5>
                    <span className="badge bg-secondary rounded-pill">{count}問</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <Link href="/stats" className="btn btn-info btn-lg w-100">
            統計を見る
          </Link>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="alert alert-info">
            <h5 className="alert-heading">クイズの仕組み</h5>
            <ul className="mb-0">
              <li>各問題には20秒の制限時間があります</li>
              <li>4回正解した問題は次回から出題されません</li>
              <li>正解・不正解の記録はブラウザに保存されます</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
