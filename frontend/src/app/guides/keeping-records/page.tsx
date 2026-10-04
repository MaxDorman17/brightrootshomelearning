import type { Metadata } from "next";
import GuidePage, { guideH2, guideList, guideP } from "@/components/GuidePage";

export const metadata: Metadata = {
  title: "Keeping a record of home education without it taking over",
  description:
    "What's worth writing down when you home educate, how little you can get away with, and how to have something ready if your council asks.",
};

export default function RecordsGuide() {
  return (
    <GuidePage
      title="Keeping a record of home education without it taking over"
      minutes={5}
      intro="When I started, I had notebooks everywhere and still couldn't have told you what we'd covered that month. A good record takes five minutes a day, and it is as much for you as for anyone else."
      offerTitle="A record that writes itself"
      offer="In Bright Roots, the record builds up as you go. When your child ticks off a lesson, logs a book or you add a photo from a trip, it goes into their record. When you need to show someone, the council report pulls it all together, ready to print."
    >
      <h2 className={guideH2}>Why bother?</h2>
      <ul className={guideList}>
        <li><strong>For you.</strong> On a bad day it shows how much you&apos;ve really done.</li>
        <li><strong>For your child.</strong> Seeing their own progress is one of the best motivators there is.</li>
        <li>
          <strong>For the council.</strong> If your local authority asks about your child&apos;s education, a simple
          record makes that conversation easy.
        </li>
        <li><strong>For later.</strong> Colleges, exam centres and employers sometimes ask what a young person has studied.</li>
      </ul>

      <h2 className={guideH2}>What&apos;s worth writing down</h2>
      <p className={guideP}>You don&apos;t need lesson plans or marking schemes. These five things cover it:</p>
      <ul className={guideList}>
        <li><strong>What you did, by subject.</strong> One line is enough: &quot;Maths: fractions of amounts&quot;.</li>
        <li><strong>Books read.</strong> Title and date finished.</li>
        <li><strong>Examples of work.</strong> A photo of a piece of writing, a model, a science experiment.</li>
        <li><strong>Trips, clubs and activities.</strong> Swimming, a museum, chess club, a beach clean. They all count.</li>
        <li><strong>The odd note on progress.</strong> &quot;Can now tell the time to five minutes&quot;.</li>
      </ul>

      <h2 className={guideH2}>A five-minute routine</h2>
      <p className={guideP}>
        Pick one moment each day, such as when you clear the table after lunch. Write the day&apos;s lines, take one
        photo and you&apos;re done. Once a week, add a sentence about anything that went well. Little and often beats a
        big catch-up at the end of term, which never happens.
      </p>

      <h2 className={guideH2}>Photos are your friend</h2>
      <p className={guideP}>
        A lot of home education leaves no paper behind: a conversation on a walk, a den in the woods, a cake. A quick
        photo with a line underneath captures it. Keep them in one place and they become a picture of the whole year.
      </p>

      <h2 className={guideH2}>If the council gets in touch</h2>
      <p className={guideP}>
        Councils make enquiries about home-educated children, and what they can ask for is different in England, Wales,
        Scotland and Northern Ireland. Whatever applies where you live, it helps to have a short summary ready:
      </p>
      <ul className={guideList}>
        <li>your approach, in a paragraph or two;</li>
        <li>the subjects and topics you&apos;ve covered;</li>
        <li>a few examples of work;</li>
        <li>reading, activities and trips;</li>
        <li>what you plan to do next.</li>
      </ul>
      <p className={guideP}>
        Check your own council&apos;s website for what it asks for, and{" "}
        <a href="https://www.gov.uk/home-education" className="font-bold text-brand-sage underline">gov.uk/home-education</a>{" "}
        for the official guidance.
      </p>

      <h2 className={guideH2}>What you can skip</h2>
      <ul className={guideList}>
        <li>Marking everything. Talk it through instead.</li>
        <li>Recording every minute. Days and subjects are enough.</li>
        <li>Making it pretty. Nobody is grading your folder.</li>
      </ul>
    </GuidePage>
  );
}
