'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import questionsData from '@/data/questions-en.json';
import { Question } from '@/types/quiz';
import { saveQuestionProgress, shouldShowQuestion } from '@/utils/storage';

const questions = questionsData as Question[];

function QuizContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const category = searchParams.get('category') || 'all';

  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isTimeUp, setIsTimeUp] = useState(false);

  // Filter questions by category and availability
  useEffect(() => {
    const filtered = questions.filter((q) => {
      const matchesCategory = category === 'all' || q.category === category;
      const shouldShow = shouldShowQuestion(q.id);
      return matchesCategory && shouldShow;
    });

    if (filtered.length === 0) {
      // No more questions available
      router.push('/stats');
      return;
    }

    setAvailableQuestions(filtered);
  }, [category, router]);

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

  if (availableQuestions.length === 0) {
    return (
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const currentQuestion = availableQuestions[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  return (
    <main>
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h5 mb-0">
              Question {currentQuestionIndex + 1} / {availableQuestions.length}
            </h2>
            <div>
              <span className="badge bg-secondary me-2">{currentQuestion.category}</span>
              {!showResult && (
                <span className={`badge ${timeLeft <= 5 ? 'bg-danger' : 'bg-primary'} fs-6`}>
                  {timeLeft}s left
                </span>
              )}
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
                      {isTimeUp ? '⏰ Time Up' : (isCorrect ? '✓ Correct!' : '✗ Incorrect')}
                    </h5>
                    <hr />
                    <p className="mb-0">
                      <strong>Explanation:</strong> {currentQuestion.explanation}
                    </p>
                  </div>

                  <button
                    className="btn btn-primary btn-lg w-100"
                    onClick={handleNext}
                  >
                    {currentQuestionIndex < availableQuestions.length - 1 ? 'Next Question' : 'View Statistics'}
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
              ← Back to Home
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
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    }>
      <QuizContent />
    </Suspense>
  );
}
