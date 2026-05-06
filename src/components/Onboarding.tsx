import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language, Level, Goal, Duration, LANGUAGES, UserPreferences } from '../types';
import { cn } from '../lib/utils';
import { ArrowLeft, Check, Globe, Calendar, BarChart, Target } from 'lucide-react';

interface OnboardingProps {
  onComplete: (prefs: UserPreferences) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [prefs, setPrefs] = useState<Partial<UserPreferences>>({
    sourceLanguage: 'ko',
    hasOnboarded: true,
  });

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2 mb-10">
              <h1 className="text-4xl font-black text-bento-heading tracking-tight">어떤 언어를 배우고 싶나요?</h1>
              <p className="text-gray-400 font-bold">배우고 싶은 여행지의 언어를 선택하세요.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              {(Object.entries(LANGUAGES) as [Language, any][]).map(([key, lang]) => (
                key !== 'ko' && (
                  <button
                    key={key}
                    onClick={() => {
                      setPrefs({ ...prefs, targetLanguage: key });
                      nextStep();
                    }}
                    className={cn(
                      "flex flex-col items-center justify-center p-8 border-2 rounded-3xl transition-all hover:bg-gray-50 group active:translate-y-1 relative",
                      prefs.targetLanguage === key 
                        ? "border-duo-green bg-green-50 shadow-[0_4px_0_0_#46A302]" 
                        : "border-bento-border bg-white shadow-[0_4px_0_0_#E5E5E5]"
                    )}
                  >
                    <span className="text-5xl mb-4 transition-transform group-hover:scale-110">{lang.flag}</span>
                    <span className="font-black text-lg text-bento-heading">{lang.name}</span>
                    <span className="text-xs font-bold text-gray-400 mt-1">{lang.native}</span>
                    {prefs.targetLanguage === key && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-duo-green rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </button>
                )
              ))}
            </div>
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2 mb-10">
              <h1 className="text-4xl font-black text-bento-heading tracking-tight">얼마 동안 배우고 싶나요?</h1>
              <p className="text-gray-400 font-bold">여행 일정에 맞춰 학습 기간을 정해보세요.</p>
            </div>
            <div className="space-y-4 max-w-md mx-auto">
              {[
                { id: '1-week', label: '1주일 (벼락치기)', icon: '⚡', color: 'bg-duo-yellow text-amber-900 border-duo-yellow-dark' },
                { id: '2-weeks', label: '2주일 (단기 집중)', icon: '🔥', color: 'bg-duo-blue text-white border-duo-blue-dark' },
                { id: '1-month', label: '1개월 (차근차근)', icon: '🌱', color: 'bg-duo-green text-white border-duo-green-dark' },
                { id: '3-months', label: '3개월 (완벽 대비)', icon: '🏆', color: 'bg-duo-purple text-white border-purple-600' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setPrefs({ ...prefs, duration: item.id as Duration });
                    nextStep();
                  }}
                  className={cn(
                    "w-full flex items-center p-6 border-2 rounded-3xl transition-all active:translate-y-1",
                    prefs.duration === item.id 
                      ? `${item.color} shadow-[0_4px_0_0_currentcolor]` 
                      : "border-bento-border bg-white text-bento-text shadow-[0_4px_0_0_#E5E5E5] hover:bg-gray-50"
                  )}
                >
                  <span className="text-3xl mr-6">{item.icon}</span>
                  <span className="font-black flex-1 text-left text-lg">{item.label}</span>
                </button>
              ))}
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2 mb-10">
              <h1 className="text-4xl font-black text-bento-heading tracking-tight">현재 실력은 어떤가요?</h1>
              <p className="text-gray-400 font-bold">수준에 맞는 학습 계획을 세워드릴게요.</p>
            </div>
            <div className="grid grid-cols-1 gap-4 max-w-md mx-auto">
              {[
                { id: 'beginner', label: '왕초보', sub: '아무것도 몰라요', icon: '👣' },
                { id: 'intermediate', label: '중급', sub: '어느 정도 알아요', icon: '🚶' },
                { id: 'advanced', label: '고급', sub: '자유로운 대화', icon: '🏃' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setPrefs({ ...prefs, level: item.id as Level });
                    nextStep();
                  }}
                  className={cn(
                    "w-full flex items-center p-6 border-2 rounded-3xl transition-all active:translate-y-1 text-left",
                    prefs.level === item.id 
                      ? "border-duo-blue bg-blue-50 shadow-[0_4px_0_0_#1899D6]" 
                      : "border-bento-border bg-white shadow-[0_4px_0_0_#E5E5E5] hover:bg-gray-50"
                  )}
                >
                  <span className="text-4xl mr-6">{item.icon}</span>
                  <div className="flex-1">
                    <span className={cn("block font-black text-xl", prefs.level === item.id ? "text-duo-blue" : "text-bento-heading")}>{item.label}</span>
                    <span className="text-sm font-bold text-gray-400">{item.sub}</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        );
      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center space-y-2 mb-10">
              <h1 className="text-4xl font-black text-bento-heading tracking-tight">학습 목표를 선택하세요</h1>
              <p className="text-gray-400 font-bold">여행에서 가장 필요한 상황을 골라주세요.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto">
              {[
                { id: 'ordering-food', label: '식당 주문', sub: '메뉴 주문 및 계산', icon: '🍕' },
                { id: 'transportation', label: '교통 이용', sub: '길 찾기, 대중교통', icon: '🚕' },
                { id: 'shopping', label: '쇼핑', sub: '흥정 및 상점 대화', icon: '🛍️' },
                { id: 'socializing', label: '친구 사귀기', sub: '기본 인사 및 자기소개', icon: '🤝' },
                { id: 'emergency', label: '긴급 상황', sub: '병원, 분실, 사고', icon: '🆘' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    const finalPrefs = { ...prefs, goal: item.id as Goal, hasOnboarded: true } as UserPreferences;
                    setPrefs(finalPrefs);
                    onComplete(finalPrefs);
                  }}
                  className={cn(
                    "flex flex-col items-start p-6 border-2 rounded-3xl transition-all active:translate-y-1 text-left",
                    prefs.goal === item.id 
                      ? "border-duo-red bg-red-50 shadow-[0_4px_0_0_#D33131]" 
                      : "border-bento-border bg-white shadow-[0_4px_0_0_#E5E5E5] hover:bg-gray-50"
                  )}
                >
                  <span className="text-4xl mb-4">{item.icon}</span>
                  <div>
                    <span className={cn("block font-black text-lg", prefs.goal === item.id ? "text-duo-red" : "text-bento-heading")}>{item.label}</span>
                    <span className="text-xs font-bold text-gray-400">{item.sub}</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-bento-bg">
      <div className="w-full max-w-3xl bento-card shadow-xl p-8 md:p-12">
        <div className="flex items-center mb-16">
          {step > 1 && (
            <button onClick={prevStep} className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-6">
              <ArrowLeft className="w-6 h-6 text-gray-400" />
            </button>
          )}
          <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden border-2 border-bento-border">
            <motion.div
              className="h-full bg-duo-green"
              initial={{ width: '0%' }}
              animate={{ width: `${(step / 4) * 100}%` }}
              transition={{ type: 'spring', bounce: 0.1, duration: 0.6 }}
            />
          </div>
          <div className="ml-6 font-black text-gray-300 text-sm">{step} / 4</div>
        </div>

        <AnimatePresence mode="wait">
          {renderStep()}
        </AnimatePresence>
      </div>
    </div>
  );
}
