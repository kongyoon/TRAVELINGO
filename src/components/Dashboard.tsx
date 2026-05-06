import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { UserPreferences, DayPlan, LANGUAGES } from '../types';
import { cn } from '../lib/utils';
import { BookOpen, Trophy, Flame, Star, Settings, CheckCircle2, Calendar } from 'lucide-react';

interface DashboardProps {
  prefs: UserPreferences;
  plans: DayPlan[];
  onStartLesson: (day: number) => void;
  onReset: () => void;
}

export default function Dashboard({ prefs, plans, onStartLesson, onReset }: DashboardProps) {
  const streak = plans.filter(p => p.completed).length;

  const totalDays = plans.length;
  const completedCount = plans.filter(p => p.completed).length;
  const progressValue = (completedCount / totalDays) * 100;

  return (
    <div className="w-full max-w-[1200px] min-h-screen mx-auto flex flex-col bg-bento-bg font-sans overflow-x-hidden">
      {/* Header - Bento Style */}
      <header className="h-20 bg-white border-b-4 border-bento-border flex items-center justify-between px-8 shrink-0 mt-4 mx-4 rounded-3xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-duo-green rounded-xl flex items-center justify-center shadow-[0_4px_0_0_#46A302]">
            <span className="text-white font-black text-xl">L</span>
          </div>
          <span className="text-2xl font-black text-duo-green tracking-tight uppercase">TravelLingo</span>
        </div>
        <div className="flex gap-4">
          <div className="h-10 px-4 flex items-center gap-2 bg-white border-2 border-bento-border rounded-xl font-bold text-sm text-gray-400">
            <Flame className="w-4 h-4 text-duo-orange fill-current" /> {streak} FLAME
          </div>
          <button 
            onClick={onReset}
            className="h-10 w-10 flex items-center justify-center bg-white border-2 border-bento-border rounded-xl hover:bg-red-50 text-red-400 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content - Bento Grid */}
      <main className="flex-1 p-6 grid grid-cols-12 lg:grid-rows-6 gap-6">
        {/* Language & Level Selection - Bento Card */}
        <section className="col-span-12 lg:col-span-8 row-span-4 bento-card flex flex-col overflow-y-auto min-h-[400px]">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-black text-bento-heading">현재 학습 경로</h2>
              <p className="text-gray-400 font-bold">당신을 위한 맞춤형 데일리 미션</p>
            </div>
            <span className="text-duo-green font-black text-xs bg-green-100 px-3 py-1 rounded-full uppercase">
              {LANGUAGES[prefs.targetLanguage].name} 마스터 중
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 py-4">
            {plans.map((plan, i) => {
              const isCurrent = !plan.completed && (i === 0 || plans[i-1].completed);
              const isLocked = !plan.completed && i > 0 && !plans[i-1].completed;
              
              return (
                <div key={plan.day} className="flex flex-col items-center">
                  <button
                    disabled={isLocked}
                    onClick={() => onStartLesson(plan.day)}
                    className={cn(
                      "w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-150 transform active:translate-y-1 relative",
                      plan.completed 
                        ? "bg-duo-green shadow-[0_4px_0_0_#46A302]" 
                        : isCurrent 
                          ? "bg-duo-blue shadow-[0_4px_0_0_#1899D6]" 
                          : "bg-gray-100 border-2 border-bento-border grayscale opacity-50 cursor-not-allowed"
                    )}
                  >
                    {plan.completed ? (
                      <CheckCircle2 className="w-10 h-10 text-white" />
                    ) : isLocked ? (
                      <Star className="w-10 h-10 text-gray-300" />
                    ) : (
                      <Star className="w-10 h-10 text-white fill-current animate-pulse" />
                    )}
                    
                    {isCurrent && (
                      <span className="absolute -top-3 -right-3 w-6 h-6 bg-duo-red rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white font-black">
                        !
                      </span>
                    )}
                  </button>
                  <span className={cn(
                    "mt-3 font-black text-sm uppercase tracking-wider",
                    isLocked ? "text-gray-300" : "text-bento-text"
                  )}>
                    Day {plan.day}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Stats - Bento Blue Card */}
        <div className="col-span-12 lg:col-span-4 row-span-2 bg-duo-blue rounded-3xl p-6 text-white border-b-6 border-duo-blue-dark relative overflow-hidden flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-black">나의 학습 기간</h2>
            <p className="opacity-80 text-sm font-bold">{prefs.duration === '1-week' ? '1주일 집중 코스' : prefs.duration === '2-weeks' ? '2주일 마라톤' : '장기 학습 계획'}</p>
          </div>
          <div className="mt-4 bg-white/20 p-4 rounded-2xl border border-white/30 backdrop-blur-sm">
            <div className="flex items-center justify-between font-black text-xl">
              <span>{completedCount} / {totalDays}</span>
              <Calendar className="w-6 h-6" />
            </div>
          </div>
          <span className="absolute -bottom-6 -right-6 text-9xl opacity-10 rotate-12">✈️</span>
        </div>

        {/* Level - Bento Yellow Card */}
        <div className="col-span-12 lg:col-span-4 row-span-2 bg-duo-yellow rounded-3xl p-6 text-amber-900 border-b-6 border-duo-yellow-dark flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-black">나의 레벨</h2>
            <p className="opacity-80 text-sm font-bold">현재 당신은 수련 중입니다</p>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs font-black uppercase tracking-wider mt-4">
            <div className={cn("p-2 rounded-lg text-center", prefs.level === 'beginner' ? "bg-amber-900 text-white" : "bg-amber-900/10")}>입문</div>
            <div className={cn("p-2 rounded-lg text-center", prefs.level === 'intermediate' ? "bg-amber-900 text-white" : "bg-amber-900/10")}>기초</div>
            <div className={cn("p-2 rounded-lg text-center", prefs.level === 'advanced' ? "bg-amber-900 text-white" : "bg-amber-900/10")}>심화</div>
          </div>
        </div>

        {/* Goal Progress - Bento Card */}
        <section className="col-span-12 lg:col-span-6 row-span-2 bento-card flex items-center gap-6">
          <div className="flex-1">
            <h2 className="text-lg font-black text-bento-heading uppercase">학습 달성도</h2>
            <p className="text-gray-400 text-sm mb-4 font-bold">목표인 "{prefs.goal}" 테마를 정복하세요!</p>
            <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden border-2 border-bento-border relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressValue}%` }}
                className="bg-duo-red h-full" 
              />
            </div>
            <div className="flex justify-between mt-2 text-xs font-black text-gray-400">
              <span>START</span>
              <span className="text-duo-red">{Math.round(progressValue)}% 완료</span>
              <span>GOAL</span>
            </div>
          </div>
          <div className="w-20 h-20 bg-duo-red rounded-3xl flex items-center justify-center text-white text-3xl shadow-[0_4px_0_0_#D33131] shrink-0">
            🎯
          </div>
        </section>

        {/* Bottom Banner - Bento Banner Style */}
        <section className="col-span-12 lg:col-span-6 row-span-2 bento-card flex flex-col justify-between bg-green-50 border-duo-green">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-duo-green uppercase">준비 완료?</h2>
            <span className="text-xs font-black text-duo-green bg-white px-2 py-1 rounded-lg border-2 border-duo-green">GO LIVE</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex-1">
                <p className="text-sm font-bold text-gray-600">여행지에서도 당황하지 않도록 매일 단 5분만 투자하세요. 당신의 {LANGUAGES[prefs.targetLanguage].name}가 빛납니다.</p>
             </div>
             <div className="text-5xl">🏰</div>
          </div>
        </section>
      </main>

      <footer className="h-20 bg-white border-t-4 border-bento-border flex items-center justify-center px-8 shrink-0 gap-6 mt-4 mx-4 rounded-t-3xl">
        <p className="text-gray-400 font-bold text-sm">준비가 되셨나요? 여행 전 완벽한 언어 마스터를 시작하세요!</p>
        <button className="duo-button duo-button-green h-12 px-12">앱 계속하기</button>
      </footer>
    </div>
  );
}
