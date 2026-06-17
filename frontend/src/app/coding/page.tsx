"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getCodingProgress, markCodingComplete, markCodingIncomplete } from "@/lib/api";
import Navbar from "@/components/Navbar";

interface Lesson {
  id: string;
  title: string;
  desc: string;
  url: string;
  duration: string;
}

interface Track {
  id: string;
  name: string;
  icon: string;
  textColor: string;
  bg: string;
  border: string;
  barColor: string;
  lessons: Lesson[];
}

const TRACKS: Track[] = [
  {
    id: "scratch", name: "Scratch — Block Coding", icon: "🐱",
    textColor: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200", barColor: "bg-orange-400",
    lessons: [
      { id: "s1", title: "Getting Started with Scratch", duration: "30 min", url: "https://scratch.mit.edu/projects/editor/?tutorial=getStarted", desc: "Create your first sprite animation and learn the Scratch interface." },
      { id: "s2", title: "Make a Pong Game", duration: "45 min", url: "https://scratch.mit.edu/projects/editor/?tutorial=pong", desc: "Build the classic Pong game with paddles, a ball, and a score counter." },
      { id: "s3", title: "Maze Navigator", duration: "30 min", url: "https://scratch.mit.edu/projects/editor/?tutorial=maze", desc: "Program a character to navigate through a maze using arrow keys." },
      { id: "s4", title: "Catch Game", duration: "45 min", url: "https://scratch.mit.edu/projects/editor/?tutorial=catch-game", desc: "Build a game where you catch falling objects — add lives and a score!" },
    ],
  },
  {
    id: "codeorg", name: "Code.org — Hour of Code", icon: "🕹️",
    textColor: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200", barColor: "bg-blue-400",
    lessons: [
      { id: "c1", title: "Minecraft: Adventurer", duration: "1 hour", url: "https://studio.code.org/s/mc/lessons/1/levels/1", desc: "Use code blocks to guide your character through a Minecraft world." },
      { id: "c2", title: "Dance Party", duration: "1 hour", url: "https://studio.code.org/s/dance-2019/lessons/1/levels/1", desc: "Program a dance show using loops, events, and functions." },
      { id: "c3", title: "Star Wars: Resistance", duration: "1 hour", url: "https://studio.code.org/s/starwarsblocks/lessons/1/levels/1", desc: "Help Rey and BB-8 escape by writing your first lines of JavaScript." },
      { id: "c4", title: "Flappy Bird", duration: "30 min", url: "https://studio.code.org/flappy/1", desc: "Build your own Flappy Bird game — tweak gravity, speed, and obstacles." },
      { id: "c5", title: "Hot Air Balloon", duration: "1 hour", url: "https://studio.code.org/s/courseb-2023/lessons/9/levels/1", desc: "Control a hot air balloon with sequences and events." },
    ],
  },
  {
    id: "python", name: "Python — Your First Language", icon: "🐍",
    textColor: "text-green-700", bg: "bg-green-50", border: "border-green-200", barColor: "bg-green-500",
    lessons: [
      { id: "p1", title: "Hello, Python!", duration: "20 min", url: "https://www.w3schools.com/python/python_intro.asp", desc: "Run your first Python program with print() and learn about variables." },
      { id: "p2", title: "Getting User Input", duration: "25 min", url: "https://www.w3schools.com/python/python_user_input.asp", desc: "Use input() to make your programs interactive — ask questions!" },
      { id: "p3", title: "If / Elif / Else Decisions", duration: "30 min", url: "https://www.w3schools.com/python/python_conditions.asp", desc: "Write programs that make different decisions based on conditions." },
      { id: "p4", title: "For Loops", duration: "30 min", url: "https://www.w3schools.com/python/python_for_loops.asp", desc: "Repeat actions over a list of items with the for loop." },
      { id: "p5", title: "While Loops", duration: "25 min", url: "https://www.w3schools.com/python/python_while_loops.asp", desc: "Keep looping while a condition is True — great for games!" },
      { id: "p6", title: "Lists", duration: "30 min", url: "https://www.w3schools.com/python/python_lists.asp", desc: "Store many values in one place and access them by position." },
      { id: "p7", title: "Functions", duration: "40 min", url: "https://www.w3schools.com/python/python_functions.asp", desc: "Write reusable code blocks with def — the key to bigger programs." },
      { id: "p8", title: "Number Guessing Game Project", duration: "45 min", url: "https://replit.com/languages/python3", desc: "Build a complete guess-the-number game using everything you've learnt!" },
    ],
  },
  {
    id: "web", name: "Web Dev — HTML & CSS", icon: "🌐",
    textColor: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200", barColor: "bg-purple-400",
    lessons: [
      { id: "w1", title: "What is HTML?", duration: "20 min", url: "https://www.w3schools.com/html/html_intro.asp", desc: "Learn the building blocks of every webpage on the internet." },
      { id: "w2", title: "Headings, Paragraphs & Links", duration: "25 min", url: "https://www.w3schools.com/html/html_basic.asp", desc: "Add text, headings, and clickable links to your page." },
      { id: "w3", title: "Images & Tables", duration: "25 min", url: "https://www.w3schools.com/html/html_images.asp", desc: "Add pictures and organise data neatly in tables." },
      { id: "w4", title: "Introduction to CSS", duration: "30 min", url: "https://www.w3schools.com/css/css_intro.asp", desc: "Style your page with colours, fonts, borders, and backgrounds." },
      { id: "w5", title: "CSS Flexbox Layout", duration: "40 min", url: "https://www.w3schools.com/css/css3_flexbox.asp", desc: "Position elements perfectly on the page with flexbox." },
      { id: "w6", title: "Build Your Profile Page", duration: "60 min", url: "https://replit.com/languages/html", desc: "Put it all together — design your very own personal profile page!" },
    ],
  },
];

const TOTAL = TRACKS.reduce((s, t) => s + t.lessons.length, 0);

export default function CodingPage() {
  const router = useRouter();
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) { router.replace("/login"); return; }
    getCodingProgress().then(res => {
      setCompleted(new Set(res.data as string[]));
      setLoading(false);
    });
  }, [router]);

  const toggle = async (id: string) => {
    setToggling(id);
    try {
      if (completed.has(id)) {
        await markCodingIncomplete(id);
        setCompleted(prev => { const n = new Set(prev); n.delete(id); return n; });
      } else {
        await markCodingComplete(id);
        setCompleted(prev => new Set([...prev, id]));
      }
    } finally { setToggling(null); }
  };

  if (loading) return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex items-center justify-center h-64 text-gray-400 text-lg">Loading…</div>
    </div>
  );

  const totalDone = completed.size;
  const overallPct = Math.round((totalDone / TOTAL) * 100);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">💻 Coding Curriculum</h1>
          <p className="text-gray-500 mt-1">Learn to code step by step — from block coding all the way to Python and the web</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-sm p-5 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-gray-700">Overall Progress</span>
            <span className="text-indigo-600 font-bold">{totalDone} / {TOTAL} lessons · {overallPct}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${overallPct}%` }} />
          </div>
          {totalDone === TOTAL && (
            <p className="text-green-600 text-sm font-semibold mt-3 text-center">
              Amazing — you&apos;ve completed the whole curriculum! Future coder unlocked 🚀
            </p>
          )}
        </div>

        <div className="space-y-8">
          {TRACKS.map(track => {
            const done = track.lessons.filter(l => completed.has(l.id)).length;
            const pct = Math.round((done / track.lessons.length) * 100);
            return (
              <div key={track.id} className={`rounded-2xl border ${track.border} ${track.bg} p-6`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{track.icon}</span>
                    <h2 className={`text-lg font-bold ${track.textColor}`}>{track.name}</h2>
                  </div>
                  <span className={`text-sm font-bold ${track.textColor}`}>{done}/{track.lessons.length}</span>
                </div>
                <div className="w-full bg-white/60 rounded-full h-2 mb-5">
                  <div className={`h-2 rounded-full transition-all duration-500 ${track.barColor}`}
                    style={{ width: `${pct}%` }} />
                </div>

                <div className="space-y-3">
                  {track.lessons.map((lesson, idx) => {
                    const isDone = completed.has(lesson.id);
                    const isToggling = toggling === lesson.id;
                    return (
                      <div key={lesson.id}
                        className={`bg-white/90 rounded-xl border-2 p-4 transition-all shadow-sm ${isDone ? "opacity-75 border-green-200" : "border-white hover:border-gray-100"}`}>
                        <div className="flex items-start gap-3">
                          <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-bold border-2 transition-all mt-0.5 ${
                            isDone ? "bg-green-500 border-green-500 text-white" : "border-gray-300 text-gray-400 bg-white"
                          }`}>
                            {isDone ? "✓" : idx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className={`font-semibold ${isDone ? "line-through text-gray-400" : "text-gray-900"}`}>
                                {lesson.title}
                              </h3>
                              <span className="text-xs text-gray-400">⏱ {lesson.duration}</span>
                            </div>
                            <p className="text-sm text-gray-500 mt-0.5 leading-snug">{lesson.desc}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <a href={lesson.url} target="_blank" rel="noopener noreferrer"
                              className={`text-sm px-4 py-1.5 rounded-xl font-bold transition-all ${
                                isDone ? "bg-gray-100 text-gray-500 hover:bg-gray-200" : "gradient-btn"
                              }`}>
                              {isDone ? "Review" : "Start →"}
                            </a>
                            <button onClick={() => toggle(lesson.id)} disabled={isToggling}
                              title={isDone ? "Mark as not done" : "Mark as done"}
                              className={`w-9 h-9 rounded-lg text-sm font-bold border transition-colors disabled:opacity-50 ${
                                isDone
                                  ? "border-green-300 bg-green-50 text-green-600 hover:bg-red-50 hover:border-red-300 hover:text-red-500"
                                  : "border-gray-200 bg-white text-gray-300 hover:border-green-400 hover:text-green-500 hover:bg-green-50"
                              }`}>
                              {isToggling ? "…" : isDone ? "✓" : "○"}
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
