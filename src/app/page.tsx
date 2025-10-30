import Link from 'next/link';
import questionsData from '@/data/questions-en.json';
import { Question } from '@/types/quiz';

const questions = questionsData as Question[];

export default function Home() {
  // Get unique categories
  const categories = Array.from(new Set(questions.map(q => q.category)));

  return (
    <main>
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">Hazmat Class 4 Exam Quiz</h1>
          <p className="lead">
            Study app for Hazardous Materials Handler Class 4 Exam.<br />
            Select a category to start learning.
          </p>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <h2 className="h4 mb-3">Select Category</h2>
          <div className="list-group">
            <Link 
              href="/quiz?category=all" 
              className="list-group-item list-group-item-action"
            >
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">All Questions</h5>
                <span className="badge bg-primary rounded-pill">{questions.length} questions</span>
              </div>
              <p className="mb-1">Questions from all categories</p>
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
                    <span className="badge bg-secondary rounded-pill">{count} questions</span>
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
            View Statistics
          </Link>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="alert alert-info">
            <h5 className="alert-heading">How it works</h5>
            <ul className="mb-0">
              <li>Each question has a 20-second time limit</li>
              <li>Questions answered correctly 4 times won't appear again</li>
              <li>Progress is saved in your browser</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
