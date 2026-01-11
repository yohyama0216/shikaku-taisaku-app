'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import { Question } from '@/types/quiz';
import { saveQuestionProgress, shouldShowQuestion, saveLastExamType, getLastExamType, getTodayActivity } from '@/utils/storageDB';
import { getExamTypeFromSlug } from '@/utils/examMapping';
import { getQuestionsByExamType } from '@/utils/questionLoader';

export default function QuizContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const examSlug = params.examType as string;
  const examType = getExamTypeFromSlug(examSlug);
  
  const category = searchParams.get('category') || 'all';
  const difficulty = searchParams.get('difficulty') || 'all';

  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [shuffledChoices, setShuffledChoices] = useState<Array<{ text: string; originalIndex: number }>>([]);
  const [todayStats, setTodayStats] = useState({ questionsAnswered: 0, correctAnswers: 0 });

  // Handle invalid exam type
  if (!examType) {
    return (
      <main>
        <div className="alert alert-danger">
          <h4>エラー</h4>
          <p>指定された試験が見つかりません。</p>
          <button 
            onClick={() => router.push('/')} 
            className="btn btn-primary"
          >
            ホームに戻る
          </button>
        </div>
      </main>
    );
  }

  // Save the exam type to localStorage when it changes (only if different from stored value)
  useEffect(() => {
    if (!examType) return;
    const storedExamType = getLastExamType();
    if (storedExamType !== examType) {
      saveLastExamType(examType);
    }
  }, [examType]);

  // Update today's statistics
  useEffect(() => {
    if (!examType) return;
    const updateStats = async () => {
      const activity = await getTodayActivity(examType);
      setTodayStats({
        questionsAnswered: activity.questionsAnswered,
        correctAnswers: activity.correctAnswers,
      });
    };
    updateStats();
  }, [examType]);
  
  // Function to update statistics
  const updateTodayStats = async () => {
    if (!examType) return;
    const activity = await getTodayActivity(examType);
    setTodayStats({
      questionsAnswered: activity.questionsAnswered,
      correctAnswers: activity.correctAnswers,
    });
  };

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
  }, [currentQuestionIndex, availableQuestions.length, availableQuestions]);

  // Filter questions by examType, category, difficulty and availability
  useEffect(() => {
    if (!examType) return;
    
    const filterQuestions = async () => {
      // Get questions for this exam type
      const questions = getQuestionsByExamType(examType);
      
      const filtered = [];
      for (const q of questions) {
        const matchesCategory = category === 'all' || q.category === category;
        const matchesDifficulty = difficulty === 'all' || q.difficulty === difficulty;
        const shouldShow = await shouldShowQuestion(q.id);
        if (matchesCategory && matchesDifficulty && shouldShow) {
          filtered.push(q);
        }
      }

      if (filtered.length === 0) {
        // No more questions available
        router.push(`/${examSlug}/stats`);
        return;
      }

      setAvailableQuestions(filtered);
    };

    filterQuestions();
  }, [examType, category, difficulty, router]);

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

  const handleTimeUp = async () => {
    const currentQuestion = availableQuestions[currentQuestionIndex];
    if (currentQuestion && examType) {
      await saveQuestionProgress(currentQuestion.id, false, examType);
      setShowResult(true);
      await updateTodayStats();
    }
  };

  const handleAnswer = async (shuffledIndex: number) => {
    if (showResult || isTimeUp || shuffledIndex >= shuffledChoices.length) return;

    const originalIndex = shuffledChoices[shuffledIndex].originalIndex;
    setSelectedAnswer(shuffledIndex);
    const currentQuestion = availableQuestions[currentQuestionIndex];
    const isCorrect = originalIndex === currentQuestion.correctAnswer;
    
    if (examType) {
      await saveQuestionProgress(currentQuestion.id, isCorrect, examType);
      setShowResult(true);
      await updateTodayStats();
    }
  };


  const handleNext = () => {
    if (currentQuestionIndex < availableQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeLeft(20);
      setIsTimeUp(false);
    } else {
      router.push(`/${examSlug}/stats`);
    }
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
      case 'terminology':
        return { color: 'bg-info', label: '用語' };
      default:
        return { color: 'bg-secondary', label: '不明' };
    }
  };
  
  const difficultyBadge = getDifficultyBadge(currentQuestion.difficulty);
  const difficultyBadgeColor = difficultyBadge.color;
  const difficultyLabel = difficultyBadge.label;

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

          {/* Today's Statistics Panel */}
          <div className="card mb-3 border-success">
            <div className="card-body py-2">
              <div className="row g-2 align-items-center">
                <div className="col-auto">
                  <span className="fw-bold text-muted">今日の学習</span>
                </div>
                <div className="col-auto">
                  <span className="badge bg-primary fs-6">
                    学習数: {todayStats.questionsAnswered}問
                  </span>
                </div>
                <div className="col-auto">
                  <span className="badge bg-success fs-6">
                    正解数: {todayStats.correctAnswers}問
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h3 className="card-title h5 mb-4">{currentQuestion.question}</h3>

              <div className="d-grid gap-2">
                {shuffledChoices.map((choice, shuffledIndex) => {
                  let buttonClass = 'btn btn-outline-primary text-start';
                  
                  if (showResult) {
                    if (choice.originalIndex === currentQuestion.correctAnswer) {
                      buttonClass = 'btn btn-success text-start';
                    } else if (shuffledIndex === selectedAnswer) {
                      buttonClass = 'btn btn-danger text-start';
                    } else {
                      buttonClass = 'btn btn-outline-secondary text-start';
                    }
                  } else if (selectedAnswer === shuffledIndex) {
                    buttonClass = 'btn btn-primary text-start';
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
              onClick={() => router.push(`/${examSlug}`)}
            >
              ← 試験ページに戻る
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
