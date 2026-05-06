import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LessonContent, UserPreferences } from '../types';
import { generateLesson } from '../lib/gemini';
import { X, Volume2, ArrowRight, Loader2, PartyPopper } from 'lucide-react';
import { cn } from '../lib/utils';

interface LessonProps {
  day: number;
  prefs: UserPreferences;
  onClose: (completed: boolean) => void;
}

export default function Lesson({ day, prefs, onClose }: LessonProps) {
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<LessonContent | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const result = await generateLesson(prefs.targetLanguage, prefs.level, prefs.goal, day);
        setContent(result);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [day, prefs]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-8 text-center">
        <Loader2 className="w-12 h-12 text-duo-green animate-spin mb-4" />
        <h2 className="text-2xl font-bold mb-2">AI가 학습 내용을 준비 중입니다...</h2>
        <p className="text-gray-500">당신의 목표인 '{prefs.goal}'에 딱 맞는 표현들을 찾고 있어요.</p>
      </div>
    );
  }

  if (!content || content.phrases.length === 0) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">학습 내용을 불러올 수 없습니다.</h2>
        <p className="text-gray-500 mb-8">잠시 후 다시 시도해 주세요.</p>
        <button onClick={() => onClose(false)} className="duo-button duo-button-outline px-8">닫기</button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-8 text-center">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-8"
        >
          <PartyPopper className="w-24 h-24 text-duo-orange mx-auto mb-4" />
          <h2 className="text-4xl font-black text-duo-orange mb-4">참 잘했어요!</h2>
          <p className="text-xl text-gray-500 max-w-sm">
            Day {day} 학습을 성공적으로 마쳤습니다. <br/>
            여행 준비에 한 걸음 더 가까워졌네요!
          </p>
        </motion.div>
        
        <div className="w-full max-w-sm space-y-4">
          <button 
            onClick={() => onClose(true)}
            className="duo-button duo-button-green w-full text-xl py-4"
          >
            계속하기
          </button>
        </div>
      </div>
    );
  }

  const phrase = content.phrases[currentIndex];
  const progress = ((currentIndex + 1) / content.phrases.length) * 100;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="max-w-4xl w-full mx-auto p-4 md:p-8 flex items-center gap-4">
        <button onClick={() => onClose(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <X className="w-6 h-6 text-gray-400" />
        </button>
        <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden border-2 border-bento-border">
          <motion.div 
            className="h-full bg-duo-green"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 overflow-hidden">
        <div className="max-w-xl w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: -20 }}
              className="space-y-12"
            >
              <div className="space-y-6">
                <div className="text-sm font-black text-white bg-duo-blue w-fit px-4 py-1.5 rounded-xl uppercase tracking-widest shadow-[0_3px_0_0_#1899D6]">
                  Phrase {currentIndex + 1}
                </div>
                
                <div className="space-y-2">
                  <h1 className="text-5xl md:text-7xl font-black text-bento-heading leading-tight tracking-tighter">
                    {phrase.original}
                  </h1>
                  {phrase.pronunciation && (
                    <div className="flex items-center gap-3 text-duo-blue-dark bg-blue-50 w-fit px-4 py-2 rounded-2xl border-2 border-blue-100">
                      <Volume2 className="w-6 h-6 cursor-pointer hover:scale-110 active:scale-95 transition-transform" />
                      <span className="font-black text-xl italic	">[{phrase.pronunciation}]</span>
                    </div>
                  )}
                </div>

                <div className="bento-card border-duo-green bg-green-50 shadow-[0_6px_0_0_#46A302]">
                  <div className="text-sm font-black text-duo-green uppercase mb-2">Translation</div>
                  <div className="text-3xl font-black text-gray-700">
                    {phrase.translation}
                  </div>
                </div>

                <div className="text-gray-400 font-bold border-l-4 border-bento-border pl-6 italic text-lg">
                  {phrase.explanation}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <div className="border-t-4 border-bento-border p-8 md:p-12 flex justify-center bg-white">
        <div className="max-w-4xl w-full flex justify-end">
          <button
            onClick={() => {
              if (currentIndex < content.phrases.length - 1) {
                setCurrentIndex(currentIndex + 1);
              } else {
                setIsFinished(true);
              }
            }}
            className="duo-button duo-button-green min-w-[240px] h-16 text-2xl flex gap-3"
          >
            {currentIndex === content.phrases.length - 1 ? '학습 완료!' : '다음 단계로'} 
            <ArrowRight className="w-7 h-7" />
          </button>
        </div>
      </div>
    </div>
  );
}
