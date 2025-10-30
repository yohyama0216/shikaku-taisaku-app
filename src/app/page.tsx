import Link from 'next/link';
import questionsData from '@/data/questions-en.json';
import { Question } from '@/types/quiz';

const questions = questionsData as Question[];

export default function Home() {
  // Get unique categories
  const categories = Array.from(new Set(questions.map(q => q.category)));
  
  // Count questions by difficulty
  const examQuestions = questions.filter(q => q.difficulty === 'exam').length;
  const basicQuestions = questions.filter(q => q.difficulty === 'basic').length;

  return (
    <main>
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">Hazmat Class 4 Exam Quiz</h1>
          <p className="lead">
            Study app for Hazardous Materials Handler Class 4 Exam.<br />
            Select a difficulty level and category to start learning.
          </p>
        </div>
      </div>

      {/* Difficulty Level Selection */}
      <div className="row mt-4">
        <div className="col-12">
          <h2 className="h4 mb-3">Select Difficulty Level</h2>
          <div className="row">
            <div className="col-md-6 mb-3">
              <div className="card border-primary">
                <div className="card-body">
                  <h5 className="card-title">
                    <i className="bi bi-mortarboard-fill"></i> Exam Level
                  </h5>
                  <p className="card-text">Challenging questions at actual exam difficulty</p>
                  <p className="mb-2"><strong>{examQuestions} questions</strong></p>
                  <Link href="/quiz?difficulty=exam&category=all" className="btn btn-primary w-100 mb-2">
                    Start All Questions
                  </Link>
                  <details className="mt-2">
                    <summary className="btn btn-outline-primary btn-sm w-100">Select by Category</summary>
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
            
            <div className="col-md-6 mb-3">
              <div className="card border-success">
                <div className="card-body">
                  <h5 className="card-title">
                    <i className="bi bi-book-fill"></i> Basic Level
                  </h5>
                  <p className="card-text">Fundamental questions for beginners</p>
                  <p className="mb-2"><strong>{basicQuestions} questions</strong></p>
                  <Link href="/quiz?difficulty=basic&category=all" className="btn btn-success w-100 mb-2">
                    Start All Questions
                  </Link>
                  <details className="mt-2">
                    <summary className="btn btn-outline-success btn-sm w-100">Select by Category</summary>
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
