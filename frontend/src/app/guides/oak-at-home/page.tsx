import type { Metadata } from "next";
import GuidePage, { guideH2, guideList, guideP, guideSteps } from "@/components/GuidePage";

export const metadata: Metadata = {
  title: "Using Oak National Academy for home education",
  description:
    "How to use Oak National Academy's free lessons when you home educate: choosing the right year, how a lesson works, how many to do, and how to keep track.",
};

export default function OakGuide() {
  return (
    <GuidePage
      title="Using Oak National Academy for home education"
      minutes={5}
      intro="Oak National Academy has thousands of free lessons, made by teachers, for every school year. For a lot of home-educating families it is the backbone of the week. Here is how to get the most out of it."
      offerTitle="Oak lessons, already in your planner"
      offer="Bright Roots brings in whole Oak units and spreads the lessons across your timetable for you. Choose your child's year and it fills your first week in one click. When your child finishes a lesson, their quiz score lands in their record."
    >
      <h2 className={guideH2}>What Oak is</h2>
      <p className={guideP}>
        Oak is a free online library of lessons that follows the national curriculum for England. Lessons are grouped
        into units, and units are in a sensible order for each year, so you always know what comes next. There is
        nothing to pay and no account is needed to watch a lesson.
      </p>

      <h2 className={guideH2}>How a lesson works</h2>
      <ol className={guideSteps}>
        <li><strong>A starter quiz</strong> checks what your child already knows.</li>
        <li><strong>A video</strong> where a teacher explains the topic, with pauses for your child to have a go.</li>
        <li><strong>A worksheet</strong> for some lessons, which you can print or do on screen.</li>
        <li><strong>An exit quiz</strong> shows what has sunk in.</li>
      </ol>
      <p className={guideP}>Most lessons take 20 to 45 minutes, depending on the age.</p>

      <h2 className={guideH2}>Choosing the right year</h2>
      <p className={guideP}>
        Go by what your child can do, not their age. If they&apos;ve had time out of school or found a subject hard,
        start a year below. It&apos;s much better for a child to feel clever in week one than to struggle. You can use a
        different year for each subject: Year 5 maths and Year 3 English is perfectly fine.
      </p>

      <h2 className={guideH2}>How many lessons?</h2>
      <ul className={guideList}>
        <li>Start with one maths and one English lesson a day, and one other subject.</li>
        <li>Work through a unit in order. The lessons build on each other.</li>
        <li>If a quiz score is low, do the lesson again another day before moving on. Nobody is timing you.</li>
        <li>You don&apos;t need every subject at once. Add science, history and geography as you settle in.</li>
      </ul>

      <h2 className={guideH2}>Make it more than a screen</h2>
      <ul className={guideList}>
        <li>Sit with younger children for the video, and pause to talk.</li>
        <li>Follow a lesson with something real: a walk after geography, cooking after fractions.</li>
        <li>Ask your child to teach you what they&apos;ve just learned. It&apos;s the best check there is.</li>
      </ul>

      <h2 className={guideH2}>Keeping track</h2>
      <p className={guideP}>
        Oak doesn&apos;t keep a record of what your child has done, so note down each lesson and the quiz score. At the
        end of a lesson Oak offers a link to share the results. Save that link: it&apos;s a ready-made record of the
        work.
      </p>

      <h2 className={guideH2}>One thing to know</h2>
      <p className={guideP}>
        Oak follows the curriculum for England. If you live in Scotland, Wales or Northern Ireland, the lessons are
        still useful, but the year names and some topics won&apos;t match your local curriculum exactly.
      </p>
    </GuidePage>
  );
}
