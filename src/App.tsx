import { useState, useEffect } from 'react';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import Lesson from './components/Lesson';
import { UserPreferences, DayPlan } from './types';

export default function App() {
  const [prefs, setPrefs] = useState<UserPreferences | null>(null);
  const [plans, setPlans] = useState<DayPlan[]>([]);
  const [activeLessonDay, setActiveLessonDay] = useState<number | null>(null);

  useEffect(() => {
    const savedPrefs = localStorage.getItem('travel_user_prefs');
    if (savedPrefs) {
      setPrefs(JSON.parse(savedPrefs));
    }
  }, []);

  useEffect(() => {
    if (!prefs) return;

    const daysMap: Record<string, number> = {
      '1-week': 7,
      '2-weeks': 14,
      '1-month': 30,
      '3-months': 90,
    };
    const totalDaysNeeded = daysMap[prefs.duration] || 7;
    
    const saved = localStorage.getItem('travel_plans');
    let existingPlans: DayPlan[] = saved ? JSON.parse(saved) : [];
    
    if (existingPlans.length !== totalDaysNeeded) {
      const newPlans: DayPlan[] = Array.from({ length: totalDaysNeeded }, (_, i) => {
        const existing = existingPlans.find(p => p.day === i + 1);
        return existing || {
          day: i + 1,
          completed: false,
          title: `Day ${i + 1}`,
        };
      });
      setPlans(newPlans);
      localStorage.setItem('travel_plans', JSON.stringify(newPlans));
    } else {
      setPlans(existingPlans);
    }
  }, [prefs]);

  const handleOnboardingComplete = (newPrefs: UserPreferences) => {
    localStorage.setItem('travel_user_prefs', JSON.stringify(newPrefs));
    setPrefs(newPrefs);
  };

  const handleStartLesson = (day: number) => {
    setActiveLessonDay(day);
  };

  const handleLessonClose = (completed: boolean) => {
    if (completed && activeLessonDay !== null) {
      const newPlans = plans.map(p => 
        p.day === activeLessonDay ? { ...p, completed: true } : p
      );
      setPlans(newPlans);
      localStorage.setItem('travel_plans', JSON.stringify(newPlans));
    }
    setActiveLessonDay(null);
  };

  const handleReset = () => {
    if (confirm('모든 진행 상황과 설정을 초기화하시겠습니까?')) {
      localStorage.removeItem('travel_user_prefs');
      localStorage.removeItem('travel_plans');
      setPrefs(null);
    }
  };

  if (!prefs) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="relative min-h-screen">
      <Dashboard 
        prefs={prefs} 
        plans={plans}
        onStartLesson={handleStartLesson} 
        onReset={handleReset}
      />
      
      {activeLessonDay !== null && (
        <Lesson 
          day={activeLessonDay} 
          prefs={prefs} 
          onClose={handleLessonClose} 
        />
      )}
    </div>
  );
}
