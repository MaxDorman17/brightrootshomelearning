"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getRole } from "@/lib/auth";
import { getCodingProgress, markCodingComplete, markCodingIncomplete, getChildren } from "@/lib/api";
import { Child } from "@/types";
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
  const [isParent, setIsParent] = useState(false);
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) { router.replace("/login"); return; }
    const parent = getRole() === "parent";
    setIsParent(parent);
    if (parent) {
      // Parents view a child's progress — default to the first child
      getChildren().then(res => {
        const kids: Child[] = res.data;
        setChildren(kids);
        if (kids.length > 0) {
          setSelectedChildId(kids[0].id);
        } else {
          setLoading(false);
        }
      });
    } else {
      getCodingProgress().then(res => {
        setCompleted(new Set(res.data as string[]));
        setLoading(false);
      });
    }
  }, [router]);

  useEffect(() => {
    if (!selectedChildId) return;
    setLoading(true);
    getCodingProgress(selectedChildId).then(res => {
      setCompleted(new Set(res.data as string[]));
      setLoading(false);
    });
  }, [selectedChildId]);

  const toggle = async (id: string) => {
    setToggling(id);
    const childArg = isParent && selectedChildId ? selectedChildId : undefined;
    try {
      if (completed.has(id)) {
        await markCodingIncomplete(id, childArg);
        setCompleted(prev => { const n = new Set(prev); n.delete(id); return n; });
      } else {
        await markCodingComplete(id, childArg);
        setCompleted(prev => { const n = new Set(prev); n.add(id); return n; });
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-7">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#8FA382] mb-2">
                Learning
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#2E342F]">Coding</h1>
              <p className="text-sm sm:text-base text-[#6E5A46] mt-2 max-w-2xl">
                Work through Scratch, Code.org, Python and web development at your own pace.
              </p>
            </div>

            {isParent && children.length > 0 && (
              <div className="brand-card px-4 py-3 flex items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">Viewing</span>
                <select
                  value={selectedChildId ?? ""}
                  onChange={e => setSelectedChildId(Number(e.target.value))}
                  className="text-sm font-semibold text-[#2E342F] bg-transparent focus:outline-none cursor-pointer"
                >
                  {children.map(c => <option key={c.id} value={c.id}>{c.username}</option>)}
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="brand-card p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">Overall Progress</p>
              <h2 className="text-2xl font-bold text-[#2E342F] mt-1">
                {totalDone} of {TOTAL} lessons complete
              </h2>
              <p className="text-sm text-[#6E5A46] mt-1">
                Progress across the full coding pathway.
              </p>
            </div>

            <div className="lg:text-right">
              <p className="text-4xl font-bold text-[#3F5D46]">{overallPct}%</p>
              <p className="text-xs font-semibold text-[#8FA382] mt-1">curriculum complete</p>
            </div>
          </div>

          <div className="h-3 rounded-full bg-[#F0EADF] overflow-hidden mt-5">
            <div
              className="h-full rounded-full bg-[#8FA382] transition-all duration-500"
              style={{ width: `${overallPct}%` }}
            />
          </div>

          {totalDone === TOTAL && (
            <div className="rounded-xl bg-[#E8F0E8] border border-[#C9D8C6] p-4 mt-5">
              <p className="text-sm font-bold text-[#3F5D46]">
                Full coding pathway completed.
              </p>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {TRACKS.map(track => {
            const done = track.lessons.filter(l => completed.has(l.id)).length;
            const pct = Math.round((done / track.lessons.length) * 100);

            return (
              <div key={track.id} className="brand-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">
                      {track.name.split(" — ")[0]}
                    </p>
                    <p className="text-sm font-bold text-[#2E342F] mt-1">
                      {track.name.includes(" — ") ? track.name.split(" — ")[1] : track.name}
                    </p>
                  </div>
                  <span className="text-lg font-bold text-[#3F5D46]">{done}/{track.lessons.length}</span>
                </div>

                <div className="h-2 rounded-full bg-[#F0EADF] overflow-hidden mt-4">
                  <div
                    className="h-full rounded-full bg-[#8FA382] transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-6">
          {TRACKS.map(track => {
            const done = track.lessons.filter(l => completed.has(l.id)).length;
            const pct = Math.round((done / track.lessons.length) * 100);

            return (
              <div key={track.id} className="brand-card p-6">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-[#8FA382]">
                      Coding Pathway
                    </p>
                    <h2 className="text-xl font-bold text-[#2E342F] mt-1">{track.name}</h2>
                    <p className="text-sm text-[#6E5A46] mt-1">
                      {done} of {track.lessons.length} lessons complete
                    </p>
                  </div>

                  <span className="text-2xl font-bold text-[#3F5D46]">{pct}%</span>
                </div>

                <div className="space-y-3">
                  {track.lessons.map((lesson, idx) => {
                    const isDone = completed.has(lesson.id);
                    const isToggling = toggling === lesson.id;

                    return (
                      <div
                        key={lesson.id}
                        className={`rounded-xl border p-4 transition-colors ${
                          isDone
                            ? "bg-[#F7F2E8] border-[#D8D1C4]"
                            : "bg-[#FFFDF8] border-[#E7DFD1]"
                        }`}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold mt-0.5 ${
                              isDone
                                ? "bg-[#3F5D46] text-white"
                                : "bg-[#F0EADF] text-[#6E5A46]"
                            }`}>
                              {isDone ? "✓" : idx + 1}
                            </div>

                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className={`text-sm font-bold ${
                                  isDone ? "text-[#6E5A46]" : "text-[#2E342F]"
                                }`}>
                                  {lesson.title}
                                </h3>
                                <span className="text-xs font-semibold text-[#8A7A69] bg-[#F0ECE6] px-2 py-1 rounded-full">
                                  {lesson.duration}
                                </span>
                              </div>

                              <p className="text-sm text-[#6E5A46] mt-1 leading-relaxed">
                                {lesson.desc}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <a
                              href={lesson.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                                isDone
                                  ? "border border-[#D8D1C4] bg-[#FFFDF8] text-[#3F5D46] hover:border-[#8FA382]"
                                  : "bg-[#3F5D46] text-white hover:bg-[#354F3B]"
                              }`}
                            >
                              {isDone ? "Review" : "Start lesson"}
                            </a>

                            <button
                              onClick={() => toggle(lesson.id)}
                              disabled={isToggling}
                              className={`px-3 py-2.5 rounded-xl text-sm font-bold border transition-colors disabled:opacity-50 ${
                                isDone
                                  ? "border-[#C9D8C6] bg-[#E8F0E8] text-[#3F5D46] hover:bg-[#FAEEE8] hover:border-[#E5CFC3] hover:text-[#A85F46]"
                                  : "border-[#D8D1C4] bg-[#FFFDF8] text-[#6E5A46] hover:border-[#8FA382] hover:text-[#3F5D46]"
                              }`}
                            >
                              {isToggling ? "Saving…" : isDone ? "Completed" : "Mark done"}
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
