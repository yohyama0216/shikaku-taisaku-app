'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import questionsData from '@/data/questions.json';
import { Question } from '@/types/quiz';
import { saveQuestionProgress, shouldShowQuestion } from '@/utils/storage';

const questions = questionsData as Question[];

function QuizContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const category = searchParams.get('category') || 'all';
  const difficulty = searchParams.get('difficulty') || 'all';

  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isTimeUp, setIsTimeUp] = useState(false);

  // Get unique categories for dropdown
  const allCategories = Array.from(new Set(questions.map(q => q.category)));

  // Filter questions by category, difficulty and availability
  useEffect(() => {
    const filtered = questions.filter((q) => {
      const matchesCategory = category === 'all' || q.category === category;
      const matchesDifficulty = difficulty === 'all' || q.difficulty === difficulty;
      const shouldShow = shouldShowQuestion(q.id);
      return matchesCategory && matchesDifficulty && shouldShow;
    });

    if (filtered.length === 0) {
      // No more questions available
      router.push('/stats');
      return;
    }

    setAvailableQuestions(filtered);
  }, [category, difficulty, router]);

  // Timer countdown
  useEffect(() => {
    if (showResult || availableQuestions.length === 0) return;

    if (timeLeft === 0) {
      setIsTimeUp(true);
      handleTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showResult, availableQuestions.length]);

  const handleTimeUp = () => {
    const currentQuestion = availableQuestions[currentQuestionIndex];
    if (currentQuestion) {
      saveQuestionProgress(currentQuestion.id, false);
      setShowResult(true);
    }
  };

  const handleAnswer = (answerIndex: number) => {
    if (showResult || isTimeUp) return;

    setSelectedAnswer(answerIndex);
    const currentQuestion = availableQuestions[currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correctAnswer;
    
    saveQuestionProgress(currentQuestion.id, isCorrect);
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < availableQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeLeft(20);
      setIsTimeUp(false);
    } else {
      router.push('/stats');
    }
  };

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDifficulty = e.target.value;
    router.push(`/quiz?difficulty=${newDifficulty}&category=${category}`);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    router.push(`/quiz?difficulty=${difficulty}&category=${encodeURIComponent(newCategory)}`);
  };

  if (availableQuestions.length === 0) {
    return (
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">読み込み中...</span>
        </div>
      </div>
    );
  }

  const currentQuestion = availableQuestions[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
  
  // Get difficulty badge color
  const difficultyBadgeColor = currentQuestion.difficulty === 'exam' ? 'bg-danger' : 'bg-success';
  const difficultyLabel = currentQuestion.difficulty === 'exam' ? '試験' : '基礎';

  return (
    <main>
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h5 mb-0">
              問題 {currentQuestionIndex + 1} / {availableQuestions.length}
            </h2>
            <div>
              <span className={`badge ${difficultyBadgeColor} me-2`}>{difficultyLabel}</span>
              <span className="badge bg-secondary me-2">{currentQuestion.category}</span>
              {!showResult && (
                <span className={`badge ${timeLeft <= 5 ? 'bg-danger' : 'bg-primary'} fs-6`}>
                  残り{timeLeft}秒
                </span>
              )}
            </div>
          </div>

          {/* Settings Panel */}
          <div className="card mb-3 border-info">
            <div className="card-body py-2">
              <div className="row g-2">
                <div className="col-md-6">
                  <label htmlFor="difficulty-select" className="form-label small mb-1">難易度</label>
                  <select 
                    id="difficulty-select"
                    className="form-select form-select-sm"
                    value={difficulty}
                    onChange={handleDifficultyChange}
                  >
                    <option value="all">すべて</option>
                    <option value="exam">試験レベル</option>
                    <option value="basic">基礎レベル</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="category-select" className="form-label small mb-1">カテゴリ</label>
                  <select 
                    id="category-select"
                    className="form-select form-select-sm"
                    value={category}
                    onChange={handleCategoryChange}
                  >
                    <option value="all">すべて</option>
                    {allCategories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h3 className="card-title h5 mb-4">{currentQuestion.question}</h3>

              <div className="d-grid gap-2">
                {currentQuestion.choices.map((choice, index) => {
                  let buttonClass = 'btn btn-outline-primary text-start';
                  
                  if (showResult) {
                    if (index === currentQuestion.correctAnswer) {
                      buttonClass = 'btn btn-success text-start';
                    } else if (index === selectedAnswer) {
                      buttonClass = 'btn btn-danger text-start';
                    } else {
                      buttonClass = 'btn btn-outline-secondary text-start';
                    }
                  } else if (selectedAnswer === index) {
                    buttonClass = 'btn btn-primary text-start';
                  }

                  return (
                    <button
                      key={index}
                      className={buttonClass}
                      onClick={() => handleAnswer(index)}
                      disabled={showResult}
                    >
                      {index + 1}. {choice}
                    </button>
                  );
                })}
              </div>

              {showResult && (
                <div className="mt-4">
                  <div className={`alert ${isTimeUp ? 'alert-warning' : (isCorrect ? 'alert-success' : 'alert-danger')}`}>
                    <h5 className="alert-heading">
                      {isTimeUp ? '⏰ 時間切れ' : (isCorrect ? '✓ 正解！' : '✗ 不正解')}
                    </h5>
                    <hr />
                    <p className="mb-0">
                      <strong>解説：</strong> {currentQuestion.explanation}
                    </p>
                  </div>

                  <button
                    className="btn btn-primary btn-lg w-100"
                    onClick={handleNext}
                  >
                    {currentQuestionIndex < availableQuestions.length - 1 ? '次の問題へ' : '統計を表示'}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-3">
            <button
              className="btn btn-outline-secondary"
              onClick={() => router.push('/')}
            >
              ← ホームに戻る
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">読み込み中...</span>
        </div>
      </div>
    }>
      <QuizContent />
    </Suspense>
  );
}
