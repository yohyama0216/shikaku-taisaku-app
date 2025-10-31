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
  const [shuffledChoices, setShuffledChoices] = useState<Array<{ text: string; originalIndex: number }>>([]);

  // Get unique categories for dropdown
  const allCategories = Array.from(new Set(questions.map(q => q.category)));

  // Shuffle choices whenever the current question changes
  useEffect(() => {
    if (availableQuestions.length > 0 && availableQuestions[currentQuestionIndex]) {
      const currentQuestion = availableQuestions[currentQuestionIndex];
      const choicesWithIndices = currentQuestion.choices.map((text, index) => ({
        text,
        originalIndex: index
      }));
      
      // Fisher-Yates shuffle algorithm
      const shuffled = [...choicesWithIndices];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      
      setShuffledChoices(shuffled);
    }
  }, [currentQuestionIndex, availableQuestions.length]);

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

  const handleAnswer = (shuffledIndex: number) => {
    if (showResult || isTimeUp || shuffledIndex >= shuffledChoices.length) return;

    const originalIndex = shuffledChoices[shuffledIndex].originalIndex;
    setSelectedAnswer(shuffledIndex);
    const currentQuestion = availableQuestions[currentQuestionIndex];
    const isCorrect = originalIndex === currentQuestion.correctAnswer;
    
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
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p aria-busy="true">読み込み中...</p>
      </div>
    );
  }

  const currentQuestion = availableQuestions[currentQuestionIndex];
  const isCorrect = selectedAnswer !== null && selectedAnswer < shuffledChoices.length && shuffledChoices[selectedAnswer].originalIndex === currentQuestion.correctAnswer;
  
  // Get difficulty badge color
  const getDifficultyBadge = (difficulty?: string) => {
    switch (difficulty) {
      case 'exam':
        return { color: 'bg-danger', label: '試験' };
      case 'basic':
        return { color: 'bg-success', label: '基礎' };
      case 'comparison':
        return { color: 'bg-warning', label: '比較' };
      default:
        return { color: 'bg-secondary', label: '不明' };
    }
  };
  
  const difficultyBadge = getDifficultyBadge(currentQuestion.difficulty);
  const difficultyBadgeColor = difficultyBadge.color;
  const difficultyLabel = difficultyBadge.label;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ margin: 0 }}>
          問題 {currentQuestionIndex + 1} / {availableQuestions.length}
        </h3>
        <div>
          <span className={`badge ${difficultyBadgeColor === 'bg-danger' ? 'badge-danger' : difficultyBadgeColor === 'bg-success' ? 'badge-success' : 'badge-warning'}`}>{difficultyLabel}</span>
          <span className="badge badge-secondary">{currentQuestion.category}</span>
          {!showResult && (
            <span className={`badge ${timeLeft <= 5 ? 'badge-danger' : 'badge-primary'}`}>
              ⏱️ 残り{timeLeft}秒
            </span>
          )}
        </div>
      </div>

      {/* Settings Panel */}
      <article style={{ padding: '1rem', marginBottom: '1rem' }}>
        <div className="grid grid-2">
          <div>
            <label htmlFor="difficulty-select">
              <small>難易度</small>
            </label>
            <select 
              id="difficulty-select"
              value={difficulty}
              onChange={handleDifficultyChange}
            >
              <option value="all">すべて</option>
              <option value="exam">試験レベル</option>
              <option value="basic">基礎レベル</option>
              <option value="comparison">比較問題</option>
            </select>
          </div>
          <div>
            <label htmlFor="category-select">
              <small>カテゴリ</small>
            </label>
            <select 
              id="category-select"
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
      </article>

      <article>
        <header>
          <strong>{currentQuestion.question}</strong>
        </header>

        <div className="choices-grid">
          {shuffledChoices.map((choice, shuffledIndex) => {
            let buttonClass = 'choice-button';
            
            if (showResult) {
              if (choice.originalIndex === currentQuestion.correctAnswer) {
                buttonClass = 'choice-button correct';
              } else if (shuffledIndex === selectedAnswer) {
                buttonClass = 'choice-button incorrect';
              }
            } else if (selectedAnswer === shuffledIndex) {
              buttonClass = 'choice-button selected';
            }

            return (
              <button
                key={shuffledIndex}
                className={buttonClass}
                onClick={() => handleAnswer(shuffledIndex)}
                disabled={showResult}
              >
                {choice.text}
              </button>
            );
          })}
        </div>

        {showResult && (
          <div style={{ marginTop: '1.5rem' }}>
            <div className={`alert ${isTimeUp ? 'alert-warning' : (isCorrect ? 'alert-success' : 'alert-danger')}`}>
              <strong>
                {isTimeUp ? '⏰ 時間切れ' : (isCorrect ? '✓ 正解！' : '✗ 不正解')}
              </strong>
              <p style={{ marginTop: '0.5rem', marginBottom: 0 }}>
                <strong>解説：</strong> {currentQuestion.explanation}
              </p>
            </div>

            <button
              onClick={handleNext}
              style={{ width: '100%', marginTop: '1rem' }}
            >
              {currentQuestionIndex < availableQuestions.length - 1 ? '次の問題へ' : '統計を表示'}
            </button>
          </div>
        )}
      </article>

      <button
        className="secondary"
        onClick={() => router.push('/')}
        style={{ marginTop: '1rem' }}
      >
        ← ホームに戻る
      </button>
    </>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <p aria-busy="true">読み込み中...</p>
      </div>
    }>
      <QuizContent />
    </Suspense>
  );
}
