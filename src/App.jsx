import { useState, useEffect } from 'react';
import { Music, Star, Trophy, Check, Sparkles, Flame, Crown, Lock, Wand2, BookOpen, Smile } from 'lucide-react';
import { playTaskComplete, playAllTasksComplete, playLevelUp } from './sounds';

/**
 * Piano Princess Quest - Hebrew Version (Offline Magic ✨)
 * A gamified habit tracker for a 7-year-old pianist.
 */

// --- Assets & Data ---
const LEVEL_THRESHOLDS = [0, 100, 250, 450, 700, 1000, 1500, 2200];

const STICKERS = [
  { level: 1, icon: "🦄", name: "פוני נוצץ" },
  { level: 2, icon: "🍦", name: "ממתק טעים" },
  { level: 3, icon: "🎹", name: "מקצוענית" },
  { level: 4, icon: "🏰", name: "טירת החלומות" },
  { level: 5, icon: "👑", name: "כתר המלכה" },
  { level: 6, icon: "🧜‍♀️", name: "שירת הים" },
  { level: 7, icon: "🌈", name: "שביל הקשת" },
  { level: 8, icon: "🚀", name: "נוסעת בכוכבים" },
];

const DAILY_TASKS_DEFAULT = [
  { id: 1, text: "שירים קלים", icon: "🎵", xp: 15, completed: false },
  { id: 2, text: "התקווה", icon: "🇮🇱", xp: 25, completed: false },
  { id: 3, text: "השיר שלי", icon: "🎼", xp: 20, completed: false },
];

// --- Offline Magic Content ---
const MAGIC_CHALLENGES = [
  "לנגן עם האף בעדינות!",
  "לנגן בעיניים עצומות סולם אחד.",
  "לנגן עם הזרתות בלבד!",
  "לנגן מהר כמו ארנב בורח!",
  "לנגן לאט כמו צב ישנוני...",
  "לנגן ולעשות פרצוף מצחיק בכל תו.",
  "לנגן בעמידה על רגל אחת (בזהירות!).",
  "לנגן ביד אחת מאחורי הגב.",
  "לנגן ולשיר את שמות התווים בקול מצחיק.",
  "לנגן כאילו האצבעות עשויות ממרשמלו."
];

const MAGIC_STORIES = [
  "פעם אחת הייתה נסיכה שגילתה שכל פעם שהיא מנגנת דו, פרח ורוד נפתח בגינה שלה.",
  "הפסנתר של הנסיכה היה מכושף: בלילה כשהיא ישנה, הוא היה מנגן שירי ערש לחתולים בארמון.",
  "הנסיכה ניגנה כל כך יפה, שאפילו הדרקון הגדול הפסיק לשאוג והתיישב להקשיב בשקט.",
  "יום אחד הנסיכה ניגנה סולם עולה מהר מאוד, והיא הרגישה שהיא מתחילה לרחף באוויר!",
  "הנסיכה מצאה תו סודי בפסנתר, וכשהיא לחצה עליו, ירד גשם של נצנצים בחדר.",
  "בממלכה הרחוקה, הפסנתרים היו עשויים משוקולד, אבל הנסיכה לא אכלה אותם, היא רק ניגנה.",
  "הנסיכה לימדה את הסוס שלה לנגן אקורד אחד עם האף, וכולם מחאו לו כפיים."
];

// --- Helper Components ---

const ConfettiParticle = ({ color, left, delay }) => (
  <div 
    className={`absolute top-0 w-3 h-3 rounded-full animate-fall opacity-0`}
    style={{ 
      backgroundColor: color, 
      left: `${left}%`, 
      animationDelay: `${delay}s`,
      animationDuration: `${2 + Math.random()}s`
    }}
  />
);

const Celebration = ({ active }) => {
  if (!active) return null;
  const colors = ['#FF69B4', '#FFD700', '#00BFFF', '#FF4500', '#32CD32'];
  const particles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    color: colors[Math.floor(Math.random() * colors.length)],
    left: Math.random() * 100,
    delay: Math.random() * 0.5
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map(p => (
        <ConfettiParticle key={p.id} color={p.color} left={p.left} delay={p.delay} />
      ))}
    </div>
  );
};

export default function App() {
  // --- State ---
  const [tasks, setTasks] = useState(DAILY_TASKS_DEFAULT);
  const [stats, setStats] = useState({
    level: 1,
    xp: 0,
    streak: 0,
    gems: 0,
    lastPlayed: null
  });
  
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks', 'stickers', 'fun'

  // AI State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiContent, setAiContent] = useState(null); // { type: 'challenge' | 'story', text: '' }
  const [showAiModal, setShowAiModal] = useState(false);

  // --- Magic Logic (Offline) ---
  const generateMagicContent = (type) => {
    setAiLoading(true);
    setAiContent(null);
    setShowAiModal(true);

    // Simulate "thinking" time for magical effect
    setTimeout(() => {
      let text = "";
      if (type === 'challenge') {
        text = MAGIC_CHALLENGES[Math.floor(Math.random() * MAGIC_CHALLENGES.length)];
      } else {
        text = MAGIC_STORIES[Math.floor(Math.random() * MAGIC_STORIES.length)];
      }
      
      setAiContent({ type, text });
      setAiLoading(false);
    }, 1500); // 1.5 second delay
  };

  // --- Effects ---
  useEffect(() => {
    const savedStats = localStorage.getItem('piano-princess-stats-he');
    const savedTasks = localStorage.getItem('piano-princess-tasks-he');
    
    if (savedStats) {
      const parsedStats = JSON.parse(savedStats);
      const today = new Date().toDateString();
      const lastPlayed = parsedStats.lastPlayed;
      let newStreak = parsedStats.streak;
      let newTasks = savedTasks ? JSON.parse(savedTasks) : DAILY_TASKS_DEFAULT;

      if (lastPlayed !== today) {
        newTasks = DAILY_TASKS_DEFAULT.map(t => ({...t, completed: false}));
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (lastPlayed !== yesterday.toDateString() && lastPlayed) {
             const d1 = new Date(lastPlayed);
             const d2 = new Date();
             const diffTime = Math.abs(d2 - d1);
             const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
             if (diffDays > 1) newStreak = 0;
        }
      }
      setStats({ ...parsedStats, streak: newStreak });
      setTasks(newTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('piano-princess-stats-he', JSON.stringify(stats));
    localStorage.setItem('piano-princess-tasks-he', JSON.stringify(tasks));
  }, [stats, tasks]);

  // --- Logic ---
  const handleTaskComplete = (taskId) => {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (tasks[taskIndex].completed) return;
    const newTasks = [...tasks];
    newTasks[taskIndex].completed = true;
    setTasks(newTasks);
    const xpGain = newTasks[taskIndex].xp;
    addXp(xpGain);
    playTaskComplete();
    triggerCelebration();
    if (newTasks.every(t => t.completed)) completeDay();
  };

  const addXp = (amount) => {
    let newXp = stats.xp + amount;
    let newLevel = stats.level;
    let newGems = stats.gems + (amount / 5);
    const nextLevelThreshold = LEVEL_THRESHOLDS[newLevel];
    if (newXp >= nextLevelThreshold) {
      newLevel++;
      setShowLevelUp(true);
      playLevelUp();
      newGems += 50;
    }
    setStats(prev => ({
      ...prev,
      xp: newXp,
      level: newLevel,
      gems: Math.floor(newGems),
      lastPlayed: new Date().toDateString()
    }));
  };

  const completeDay = () => {
    setTimeout(() => {
      setStats(prev => ({ ...prev, streak: prev.streak + 1, gems: prev.gems + 20 }));
      playAllTasksComplete();
      triggerCelebration();
    }, 500);
  };

  const triggerCelebration = () => {
    setCelebrating(true);
    setTimeout(() => setCelebrating(false), 3000);
  };

  // --- Render Helpers ---
  const currentLevelThreshold = LEVEL_THRESHOLDS[stats.level] || 10000;
  const prevLevelThreshold = LEVEL_THRESHOLDS[stats.level - 1] || 0;
  const xpProgress = ((stats.xp - prevLevelThreshold) / (currentLevelThreshold - prevLevelThreshold)) * 100;

  return (
    <div className="min-h-screen bg-pink-50 font-['Heebo',sans-serif] selection:bg-pink-200">

      <Celebration active={celebrating} />

      {/* Main Content Container */}
      <div className="max-w-md mx-auto min-h-screen relative flex flex-col pb-24">
        
        {/* Header Section */}
        <div className="pt-[max(2rem,env(safe-area-inset-top))] pb-12 px-6 bg-gradient-to-b from-pink-400 to-pink-200 rounded-b-[40px] shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-10 -mt-10 blur-xl"></div>
          <div className="absolute top-20 left-10 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>

          <div className="flex justify-between items-center mb-6 relative z-10">
            <div className="flex items-center space-x-2 bg-white/90 px-3 py-1.5 rounded-full shadow-sm">
              <div className="bg-yellow-400 p-1 rounded-full"><Crown size={14} className="text-white" /></div>
              <span className="font-bold text-pink-500 text-sm">רמה {stats.level}</span>
            </div>
            <div className="flex items-center space-x-2 bg-white/90 px-3 py-1.5 rounded-full shadow-sm">
              <div className="bg-blue-400 p-1 rounded-full"><Sparkles size={14} className="text-white" /></div>
              <span className="font-bold text-blue-500 text-sm">{stats.gems} יהלומים</span>
            </div>
          </div>

          <div className="text-center relative z-10">
            <h1 className="text-3xl font-extrabold text-white drop-shadow-md mb-2">נסיכת הפסנתר</h1>
            <div className="mt-4 bg-black/20 rounded-full h-6 p-1 relative w-full max-w-[80%] mx-auto">
              <div 
                className="bg-gradient-to-l from-yellow-300 to-yellow-500 h-4 rounded-full transition-all duration-1000 ease-out shadow-sm relative"
                style={{ width: `${Math.min(xpProgress, 100)}%` }}
              >
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-white/40 rounded-full animate-pulse"></div>
              </div>
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                 <span className="text-[10px] font-bold text-white tracking-wide uppercase drop-shadow">
                   {stats.xp} / {currentLevelThreshold} נקודות
                 </span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Stats Card (Streak) */}
        <div className="-mt-8 mx-6 bg-white rounded-3xl shadow-xl p-4 flex items-center justify-between relative z-20 border-b-4 border-pink-100">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">רצף נוכחי</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                {stats.streak}
              </span>
              <span className="text-sm font-bold text-gray-500">ימים</span>
            </div>
          </div>
          <div className="h-14 w-14 bg-orange-100 rounded-full flex items-center justify-center relative">
            <Flame className="text-orange-500 animate-pulse" size={32} fill="currentColor" />
            <div className="absolute -top-1 -left-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white shadow-sm">
              אש
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="px-6 mt-8 flex-1">
          {activeTab === 'tasks' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-pink-500 mb-4 px-2">המשימות להיום 🎵</h2>
              {tasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => handleTaskComplete(task.id)}
                  disabled={task.completed}
                  className={`w-full group relative overflow-hidden transition-all duration-300 transform 
                    ${task.completed 
                      ? 'bg-green-50 border-green-100 scale-[0.98] opacity-80' 
                      : 'bg-white hover:scale-[1.02] shadow-lg shadow-pink-100/50 border-2 border-transparent hover:border-pink-200'
                    } rounded-3xl p-4 flex items-center text-right`}
                >
                  <div className={`
                    h-12 w-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner ml-4 flex-shrink-0
                    ${task.completed ? 'bg-green-100 grayscale-0' : 'bg-pink-100'}
                  `}>
                    {task.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-bold text-lg ${task.completed ? 'text-green-700 line-through decoration-green-300' : 'text-gray-700'}`}>
                      {task.text}
                    </h3>
                    {!task.completed && (
                      <span className="text-xs font-semibold text-pink-400 flex items-center mt-1">
                        <Star size={10} className="ml-1 fill-current" /> +{task.xp} נק'
                      </span>
                    )}
                  </div>
                  <div className={`
                    w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors
                    ${task.completed ? 'bg-green-500 border-green-500' : 'border-gray-200 group-hover:border-pink-300'}
                  `}>
                    {task.completed && <Check size={16} className="text-white" strokeWidth={4} />}
                  </div>
                </button>
              ))}
              {tasks.every(t => t.completed) && (
                <div className="mt-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-3xl p-6 text-center text-white shadow-lg shine transform animate-bounce">
                  <div className="flex justify-center mb-2">
                    <Trophy size={48} className="text-yellow-300 drop-shadow-sm" fill="currentColor" />
                  </div>
                  <h3 className="text-2xl font-black mb-1">!כל הכבוד</h3>
                  <p className="opacity-90 font-medium">!את כוכבת פסנתר אמיתית</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'stickers' && (
            <div>
              <h2 className="text-xl font-bold text-pink-500 mb-4 px-2">המדבקות שלי ✨</h2>
              <div className="grid grid-cols-2 gap-4">
                {STICKERS.map((sticker, idx) => {
                  const isUnlocked = stats.level >= sticker.level;
                  return (
                    <div 
                      key={idx}
                      className={`
                        aspect-square rounded-3xl flex flex-col items-center justify-center p-4 border-2
                        ${isUnlocked 
                          ? 'bg-white border-pink-100 shadow-md' 
                          : 'bg-gray-50 border-gray-100 opacity-70'}
                      `}
                    >
                      <div className="text-5xl mb-3 relative">
                        {isUnlocked ? sticker.icon : <Lock className="text-gray-300" size={40} />}
                        {isUnlocked && <div className="absolute -top-2 -left-2"><Sparkles className="text-yellow-400 animate-spin-slow" size={16} /></div>}
                      </div>
                      <span className={`text-sm font-bold text-center ${isUnlocked ? 'text-gray-700' : 'text-gray-400'}`}>
                        {sticker.name}
                      </span>
                      {!isUnlocked && (
                        <span className="text-[10px] font-bold text-pink-400 bg-pink-50 px-2 py-0.5 rounded-full mt-2">
                          רמה {sticker.level}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'fun' && (
             <div className="space-y-6">
               <h2 className="text-xl font-bold text-purple-500 mb-4 px-2">קסם בינה מלאכותית ✨</h2>
               
               <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-[30px] p-6 text-white shadow-xl relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent opacity-30"></div>
                  <Wand2 className="w-12 h-12 mb-4 text-yellow-300 animate-pulse" />
                  <h3 className="text-2xl font-black mb-2">פסנתר הקסם</h3>
                  <p className="mb-6 opacity-90 text-sm">בחרי קסם למטה והפסנתר ימציא לך משהו מיוחד!</p>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <button 
                      onClick={() => generateMagicContent('challenge')}
                      className="bg-white/20 backdrop-blur-md border border-white/40 hover:bg-white/30 transition-all rounded-xl p-4 flex items-center space-x-4 rtl:space-x-reverse"
                    >
                       <div className="bg-yellow-400 rounded-full p-2"><Smile className="text-white" size={20}/></div>
                       <div className="text-right">
                         <div className="font-bold">אתגר מצחיק</div>
                         <div className="text-xs opacity-80">לנגן בדרך משוגעת</div>
                       </div>
                    </button>

                    <button 
                      onClick={() => generateMagicContent('story')}
                      className="bg-white/20 backdrop-blur-md border border-white/40 hover:bg-white/30 transition-all rounded-xl p-4 flex items-center space-x-4 rtl:space-x-reverse"
                    >
                       <div className="bg-pink-400 rounded-full p-2"><BookOpen className="text-white" size={20}/></div>
                       <div className="text-right">
                         <div className="font-bold">סיפור קסום</div>
                         <div className="text-xs opacity-80">אגדה מוזיקלית קצרה</div>
                       </div>
                    </button>
                  </div>
               </div>
             </div>
          )}
        </div>

      </div>

      {/* AI Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[40px] p-8 max-w-sm w-full text-center shadow-2xl relative animate-in fade-in zoom-in duration-300">
             <button onClick={() => setShowAiModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">✕</button>
             
             {aiLoading ? (
               <div className="py-12 flex flex-col items-center">
                 <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-pink-500 mb-4"></div>
                 <p className="text-pink-500 font-bold animate-pulse">הקסם קורה... ✨</p>
               </div>
             ) : (
               <div className="py-4">
                 <div className="mx-auto bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    {aiContent?.type === 'challenge' ? <Smile className="text-purple-500" size={32} /> : <BookOpen className="text-purple-500" size={32} />}
                 </div>
                 <h3 className="text-2xl font-black text-purple-600 mb-4">
                   {aiContent?.type === 'challenge' ? 'האתגר שלך:' : 'הסיפור שלך:'}
                 </h3>
                 <div className="bg-purple-50 p-6 rounded-2xl text-gray-700 font-medium text-lg leading-relaxed mb-6 border border-purple-100">
                   "{aiContent?.text}"
                 </div>
                 <button 
                   onClick={() => setShowAiModal(false)}
                   className="w-full bg-pink-500 text-white font-bold py-3 rounded-xl hover:bg-pink-600 transition-colors"
                 >
                   תודה פסנתר קסום!
                 </button>
               </div>
             )}
          </div>
        </div>
      )}

      {/* Level Up Modal */}
      {showLevelUp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[40px] p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-yellow-300 to-transparent opacity-20"></div>
            <div className="mb-6 flex justify-center">
              <div className="bg-yellow-100 p-6 rounded-full inline-block relative">
                 <div className="absolute inset-0 animate-ping bg-yellow-200 rounded-full opacity-75"></div>
                 <Crown size={64} className="text-yellow-500 relative z-10" fill="currentColor" />
              </div>
            </div>
            <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 mb-2">
              !עלית רמה
            </h2>
            <p className="text-gray-500 font-bold text-lg mb-8">!הגעת לרמה {stats.level}</p>
            <div className="bg-pink-50 rounded-2xl p-4 mb-8">
              <div className="flex items-center justify-center space-x-2 text-pink-600 font-bold">
                 <Sparkles size={20} />
                 <span>50 יהלומים במתנה</span>
              </div>
            </div>
            <button 
              onClick={() => setShowLevelUp(false)}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xl py-4 rounded-2xl shadow-lg shadow-pink-300/50 hover:scale-105 transition-transform"
            >
              !יש
            </button>
          </div>
        </div>
      )}

      {/* Footer / Nav */}
      <div className="fixed bottom-0 w-full bg-white/95 backdrop-blur-xl border-t border-pink-100 py-2 safe-bottom flex justify-around text-gray-400 max-w-md left-1/2 transform -translate-x-1/2 z-40 rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.05)] px-2">
         <button 
           onClick={() => setActiveTab('tasks')}
           className={`flex flex-col items-center p-2 rounded-2xl transition-all ${activeTab === 'tasks' ? 'text-pink-500 bg-pink-50' : 'hover:text-pink-400'}`}
         >
            <Music size={24} className={activeTab === 'tasks' ? 'fill-current' : ''} />
            <span className="text-[10px] font-bold mt-1">אימון</span>
         </button>
         
         <button 
           onClick={() => setActiveTab('fun')}
           className={`flex flex-col items-center p-2 rounded-2xl transition-all ${activeTab === 'fun' ? 'text-purple-500 bg-purple-50' : 'hover:text-purple-400'}`}
         >
            <Wand2 size={24} className={activeTab === 'fun' ? 'animate-pulse' : ''} />
            <span className="text-[10px] font-bold mt-1">כיף ✨</span>
         </button>

         <button 
           onClick={() => setActiveTab('stickers')}
           className={`flex flex-col items-center p-2 rounded-2xl transition-all ${activeTab === 'stickers' ? 'text-blue-500 bg-blue-50' : 'hover:text-blue-400'}`}
         >
            <Trophy size={24} className={activeTab === 'stickers' ? 'fill-current' : ''} />
            <span className="text-[10px] font-bold mt-1">פרסים</span>
         </button>
      </div>
    </div>
  );
}
