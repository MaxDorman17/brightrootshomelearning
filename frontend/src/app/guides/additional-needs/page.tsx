import type { Metadata } from "next";
import GuidePage, { guideH2, guideList, guideP } from "@/components/GuidePage";

export const metadata: Metadata = {
  title: "Home educating a child with additional needs",
  description:
    "Practical ideas for home educating a child with additional needs: going at their pace, shorter days, making the week predictable, and keeping a record that shows real progress.",
};

export default function AdditionalNeedsGuide() {
  return (
    <GuidePage
      title="Home educating a child with additional needs"
      minutes={6}
      intro="Many families come to home education because school wasn't working for their child. If that is you, you already know more about how your child learns than any timetable does. This guide is a set of practical ideas to try. Take what helps and leave the rest."
      offerTitle="A planner that goes at your child's pace"
      offer="Bright Roots lets you pick a different level for each subject, plan as little or as much as suits the day, and move a whole day along when it isn't happening. Or skip the plan and just note down what you did. Either way the record builds itself."
    >
      <h2 className={guideH2}>Start with what your child can do</h2>
      <p className={guideP}>
        Age and school year matter much less at home. Choose work your child can succeed at this week, even if it is
        years below or above their age, and use a different level for each subject. A child can be working at one level
        in maths and a very different one in reading, and that is fine.
      </p>

      <h2 className={guideH2}>Short and often beats long and rare</h2>
      <ul className={guideList}>
        <li>Ten or fifteen focused minutes is a real lesson. Stop while it is still going well.</li>
        <li>Put the hardest thing at your child&apos;s best time of day, whenever that is.</li>
        <li>Count movement, cooking, building and talking as learning. They are.</li>
        <li>Have an easier version ready for tired days, so the day still ends with a win.</li>
      </ul>

      <h2 className={guideH2}>Make the day easy to see</h2>
      <p className={guideP}>
        Knowing what is coming lowers worry for a lot of children. A short list for today, in the same order most days,
        often works better than a full week on the wall.
      </p>
      <ul className={guideList}>
        <li>Show only today, and only a few things. Three is plenty to begin with.</li>
        <li>Let your child tick things off themselves. Finishing is its own reward.</li>
        <li>Say what comes after the hard bit: &quot;maths, then the trampoline&quot;.</li>
        <li>When plans change, change the list too, so it stays something they can trust.</li>
      </ul>

      <h2 className={guideH2}>Plan for the days that don&apos;t happen</h2>
      <p className={guideP}>
        Appointments, poor sleep and hard days are part of the week, not a failure of it. Build the week with gaps in
        it, and when a day goes, move it along rather than trying to catch up. Nobody is timing you.
      </p>

      <h2 className={guideH2}>Rewards: use them if they help</h2>
      <p className={guideP}>
        Some children love earning stars. For others, a reward chart is one more thing to worry about. You know which
        child you have. If rewards cause upset, leave them out, and if siblings compare scores, keep each child&apos;s
        targets their own.
      </p>

      <h2 className={guideH2}>Keep a record of small steps</h2>
      <p className={guideP}>
        Progress can be hard to see week to week, and easy to see over a term. A light record does that for you, and it
        is also what your council will want to see if they ask.
      </p>
      <ul className={guideList}>
        <li>Note what was done, in a line. A photo counts.</li>
        <li>Write down firsts: the first time they read a sign aloud, or asked to carry on.</li>
        <li>Keep one piece of work a month for each main subject, so you can lay them side by side.</li>
        <li>If your child has an EHC plan or a similar plan where you live, note anything that relates to it.</li>
      </ul>

      <h2 className={guideH2}>Where to get proper advice</h2>
      <p className={guideP}>
        This guide is general. For your child&apos;s own needs, speak to the professionals who know them, and to your
        local authority about the support your child is entitled to while home educated. Local home education groups
        are also a good place to meet families a few years further down the same road.
      </p>
    </GuidePage>
  );
}
