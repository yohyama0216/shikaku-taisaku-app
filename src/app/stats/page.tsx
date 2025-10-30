'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import questionsData from '@/data/questions-en.json';
import { Question, QuestionProgress } from '@/types/quiz';
import { getAllProgress, clearAllProgress } from '@/utils/storage';

const questions = questionsData as Question[];

export default function StatsPage() {
  const [progress, setProgress] = useState<Record<number, QuestionProgress>>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadProgress();
  }, []);

  const loadProgress = () => {
    const data = getAllProgress();
    setProgress(data);
  };

  const handleClearProgress = () => {
    if (confirm('Are you sure you want to delete all learning progress?')) {
      clearAllProgress();
      loadProgress();
    }
  };

  if (!mounted) {
    return (
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const totalAnswered = Object.keys(progress).length;
  const totalCorrect = Object.values(progress).reduce((sum, p) => sum + p.correctCount, 0);
  const totalIncorrect = Object.values(progress).reduce((sum, p) => sum + p.incorrectCount, 0);
  const totalAttempts = totalCorrect + totalIncorrect;

  // Get questions with incorrect answers
  const incorrectQuestions = questions
    .filter(q => progress[q.id] && progress[q.id].incorrectCount > 0)
    .map(q => ({
      question: q,
      progress: progress[q.id],
    }))
    .sort((a, b) => b.progress.incorrectCount - a.progress.incorrectCount);

  // Get mastered questions (4+ correct)
  const masteredQuestions = questions
    .filter(q => progress[q.id] && progress[q.id].correctCount >= 4)
    .length;

  // Calculate accuracy
  const accuracy = totalAttempts > 0 ? ((totalCorrect / totalAttempts) * 100).toFixed(1) : '0';

  // Category statistics
  const categories = Array.from(new Set(questions.map(q => q.category)));
  const categoryStats = categories.map(category => {
    const categoryQuestions = questions.filter(q => q.category === category);
    const categoryAnswered = categoryQuestions.filter(q => progress[q.id]).length;
    const categoryCorrect = categoryQuestions.reduce(
      (sum, q) => sum + (progress[q.id]?.correctCount || 0),
      0
    );
    const categoryIncorrect = categoryQuestions.reduce(
      (sum, q) => sum + (progress[q.id]?.incorrectCount || 0),
      0
    );
    const categoryTotal = categoryCorrect + categoryIncorrect;
    const categoryAccuracy = categoryTotal > 0 ? ((categoryCorrect / categoryTotal) * 100).toFixed(1) : '0';

    return {
      category,
      totalQuestions: categoryQuestions.length,
      answered: categoryAnswered,
      correct: categoryCorrect,
      incorrect: categoryIncorrect,
      accuracy: categoryAccuracy,
    };
  });

  return (
    <main>
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">Learning Statistics</h1>
        </div>
      </div>

      {/* Overall Statistics */}
      <div className="row mb-4">
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-muted">Questions Answered</h5>
              <p className="card-text display-6">{totalAnswered}</p>
              <small className="text-muted">/ {questions.length} questions</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-muted">Correct</h5>
              <p className="card-text display-6 text-success">{totalCorrect}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-muted">Incorrect</h5>
              <p className="card-text display-6 text-danger">{totalIncorrect}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-muted">Accuracy</h5>
              <p className="card-text display-6 text-primary">{accuracy}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mastered Questions */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="alert alert-info">
            <h5 className="alert-heading">Mastered Questions</h5>
            <p className="mb-0">
              Questions answered correctly 4+ times: <strong>{masteredQuestions}</strong> questions
              {masteredQuestions > 0 && ' (These questions won\'t appear again)'}
            </p>
          </div>
        </div>
      </div>

      {/* Category Statistics */}
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="h4 mb-3">Category Statistics</h2>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Category</th>
                  <th className="text-center">Answered</th>
                  <th className="text-center">Correct</th>
                  <th className="text-center">Incorrect</th>
                  <th className="text-center">Accuracy</th>
                </tr>
              </thead>
              <tbody>
                {categoryStats.map(stat => (
                  <tr key={stat.category}>
                    <td>{stat.category}</td>
                    <td className="text-center">
                      {stat.answered} / {stat.totalQuestions}
                    </td>
                    <td className="text-center text-success">{stat.correct}</td>
                    <td className="text-center text-danger">{stat.incorrect}</td>
                    <td className="text-center">
                      <strong>{stat.accuracy}%</strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Incorrect Questions */}
      {incorrectQuestions.length > 0 && (
        <div className="row mb-4">
          <div className="col-12">
            <h2 className="h4 mb-3">Incorrect Questions</h2>
            <div className="list-group">
              {incorrectQuestions.map(({ question, progress }) => (
                <div key={question.id} className="list-group-item">
                  <div className="d-flex w-100 justify-content-between">
                    <h5 className="mb-1">{question.question}</h5>
                    <small>
                      <span className="badge bg-success me-1">Correct {progress.correctCount}</span>
                      <span className="badge bg-danger">Incorrect {progress.incorrectCount}</span>
                    </small>
                  </div>
                  <p className="mb-1 text-muted">
                    <small>Category: {question.category}</small>
                  </p>
                  <small className="text-muted">
                    <strong>Correct Answer:</strong> {question.choices[question.correctAnswer]}
                  </small>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="row mb-4">
        <div className="col-md-6 mb-3">
          <Link href="/" className="btn btn-primary btn-lg w-100">
            Back to Home
          </Link>
        </div>
        <div className="col-md-6 mb-3">
          <button
            className="btn btn-danger btn-lg w-100"
            onClick={handleClearProgress}
          >
            Reset Progress
          </button>
        </div>
      </div>
    </main>
  );
}
