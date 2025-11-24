'use client';

import { Suspense } from 'react';
import QuizContent from './QuizContent';

export default function QuizContentWrapper() {
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
