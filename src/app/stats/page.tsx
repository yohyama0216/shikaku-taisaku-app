'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import questionsData from '@/data/questions.json';
import { Question, QuestionProgress, DailyStats, Badge } from '@/types/quiz';
import { getAllProgress, clearAllProgress, getDailyStatsHistory } from '@/utils/storage';
import { getAllBadges, getBadgeStats } from '@/utils/badges';

const questions = questionsData as Question[];

export default function StatsPage() {
  const [progress, setProgress] = useState<Record<number, QuestionProgress>>({});
  const [statsHistory, setStatsHistory] = useState<DailyStats[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadProgress();
  }, []);

  const loadProgress = () => {
    const data = getAllProgress();
    setProgress(data);
    const history = getDailyStatsHistory();
    setStatsHistory(history);
    
    // Load badges
    const totalAnswered = Object.keys(data).length;
    const totalMastered = Object.values(data).filter(p => p.correctCount >= 4).length;
    const allBadges = getAllBadges(totalAnswered, totalMastered, history);
    setBadges(allBadges);
  };

  const handleClearProgress = () => {
    if (confirm('すべての学習進捗を削除してもよろしいですか？')) {
      clearAllProgress();
      loadProgress();
    }
  };

  if (!mounted) {
    return (
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">読み込み中...</span>
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

  // Difficulty level statistics
  const difficulties = Array.from(new Set(questions.map(q => q.difficulty).filter(Boolean))) as string[];
  const difficultyStats = difficulties.map(difficulty => {
    const difficultyQuestions = questions.filter(q => q.difficulty === difficulty);
    const difficultyAnswered = difficultyQuestions.filter(q => progress[q.id]).length;
    const difficultyCorrect = difficultyQuestions.reduce(
      (sum, q) => sum + (progress[q.id]?.correctCount || 0),
      0
    );
    const difficultyIncorrect = difficultyQuestions.reduce(
      (sum, q) => sum + (progress[q.id]?.incorrectCount || 0),
      0
    );
    const difficultyTotal = difficultyCorrect + difficultyIncorrect;
    const difficultyAccuracy = difficultyTotal > 0 ? ((difficultyCorrect / difficultyTotal) * 100).toFixed(1) : '0';

    return {
      difficulty,
      totalQuestions: difficultyQuestions.length,
      answered: difficultyAnswered,
      correct: difficultyCorrect,
      incorrect: difficultyIncorrect,
      accuracy: difficultyAccuracy,
    };
  });

  return (
    <main>
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">学習統計</h1>
        </div>
      </div>

      {/* Overall Statistics */}
      <div className="row mb-4">
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-muted">回答済み問題数</h5>
              <p className="card-text display-6">{totalAnswered}</p>
              <small className="text-muted">/ {questions.length}問</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-muted">正解数</h5>
              <p className="card-text display-6 text-success">{totalCorrect}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-muted">不正解数</h5>
              <p className="card-text display-6 text-danger">{totalIncorrect}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-6 mb-3">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title text-muted">正答率</h5>
              <p className="card-text display-6 text-primary">{accuracy}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mastered Questions */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="alert alert-info">
            <h5 className="alert-heading">マスター済み問題</h5>
            <p className="mb-0">
              4回以上正解した問題：<strong>{masteredQuestions}</strong>問
              {masteredQuestions > 0 && '（これらの問題は今後表示されません）'}
            </p>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="h4 mb-3">バッジ</h2>
          <div className="card">
            <div className="card-body">
              <div className="row g-3">
                {badges.map(badge => (
                  <div key={badge.id} className="col-md-4 col-sm-6">
                    <div 
                      className={`card h-100 ${badge.achieved ? 'border-success' : 'border-secondary'}`}
                      style={{ opacity: badge.achieved ? 1 : 0.5 }}
                    >
                      <div className="card-body text-center">
                        <div style={{ fontSize: '2.5rem' }}>{badge.icon}</div>
                        <h5 className="card-title mt-2">{badge.name}</h5>
                        <p className="card-text text-muted small">{badge.description}</p>
                        {badge.achieved && (
                          <span className="badge bg-success">達成済み</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-3">
                <small className="text-muted">
                  獲得バッジ数：<strong>{badges.filter(b => b.achieved).length}</strong> / {badges.length}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Trend Chart */}
      {statsHistory.length > 0 && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card">
              <div className="card-body">
                <h2 className="h4 mb-3">学習の推移</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={statsHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tickFormatter={(date) => {
                        const d = new Date(date);
                        return `${d.getMonth() + 1}/${d.getDate()}`;
                      }}
                    />
                    <YAxis />
                    <Tooltip 
                      labelFormatter={(date) => {
                        const d = new Date(date);
                        return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="answeredCount" 
                      stroke="#0d6efd" 
                      name="回答済み問題数" 
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="masteredCount" 
                      stroke="#198754" 
                      name="達成済み問題数" 
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Difficulty Level Statistics */}
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="h4 mb-3">レベル別統計</h2>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>レベル</th>
                  <th className="text-center">回答済み</th>
                  <th className="text-center">正解数</th>
                  <th className="text-center">不正解数</th>
                  <th className="text-center">正答率</th>
                </tr>
              </thead>
              <tbody>
                {difficultyStats.map(stat => (
                  <tr key={stat.difficulty}>
                    <td>
                      {stat.difficulty === 'basic' ? '基本レベル' : 
                       stat.difficulty === 'exam' ? '試験レベル' : stat.difficulty}
                    </td>
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

      {/* Category Statistics */}
      <div className="row mb-4">
        <div className="col-12">
          <h2 className="h4 mb-3">カテゴリ別統計</h2>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>カテゴリ</th>
                  <th className="text-center">回答済み</th>
                  <th className="text-center">正解数</th>
                  <th className="text-center">不正解数</th>
                  <th className="text-center">正答率</th>
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
            <h2 className="h4 mb-3">間違えた問題</h2>
            <div className="list-group">
              {incorrectQuestions.map(({ question, progress }) => (
                <div key={question.id} className="list-group-item">
                  <div className="d-flex w-100 justify-content-between">
                    <h5 className="mb-1">{question.question}</h5>
                    <small>
                      <span className="badge bg-success me-1">正解 {progress.correctCount}</span>
                      <span className="badge bg-danger">不正解 {progress.incorrectCount}</span>
                    </small>
                  </div>
                  <p className="mb-1 text-muted">
                    <small>カテゴリ：{question.category}</small>
                  </p>
                  <small className="text-muted">
                    <strong>正しい答え：</strong> {question.choices[question.correctAnswer]}
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
            ホームに戻る
          </Link>
        </div>
        <div className="col-md-6 mb-3">
          <button
            className="btn btn-danger btn-lg w-100"
            onClick={handleClearProgress}
          >
            進捗をリセット
          </button>
        </div>
      </div>
    </main>
  );
}
