import type { Metadata } from "next";
import GuidePage, { guideH2, guideList, guideP, guideSteps } from "@/components/GuidePage";

export const metadata: Metadata = {
  title: "Home educating with Twinkl, White Rose Maths and other schemes",
  description:
    "How to use Twinkl, White Rose Maths and other schemes together when you home educate: one plan for the week, one record of what was done, and scores in one place.",
};

export default function SchemesGuide() {
  return (
    <GuidePage
      title="Home educating with Twinkl, White Rose Maths and other schemes"
      minutes={5}
      intro="Most home-educating families don't use one thing. It might be White Rose for maths, Twinkl for English and topic work, a library book for history and a video for science. That mix is a strength, as long as you can still see the whole week. Here is how to keep it together."
      offerTitle="One planner for everything you use"
      offer="In Bright Roots you add each lesson with a link to where it lives and the name of the scheme. Your child opens it from their own page, you type in a score if there is one, and it all lands in one record you can show the council. Your materials stay on the scheme's own site."
    >
      <h2 className={guideH2}>Pick a main scheme for each subject</h2>
      <p className={guideP}>
        Mixing schemes works best when each subject has one backbone. A scheme teaches things in an order, and each
        step leans on the one before. If you hop between two for the same subject, it is easy to skip a step without
        noticing.
      </p>
      <ul className={guideList}>
        <li>Choose one scheme to lead maths and one to lead English. Use anything else as extra practice.</li>
        <li>For science, history and geography, a looser mix is fine. Follow what interests your child.</li>
        <li>Check what each one costs before you commit. Many have free parts and paid parts, and they change, so look at their own websites.</li>
      </ul>

      <h2 className={guideH2}>Go by what your child can do</h2>
      <p className={guideP}>
        Year names are a guide, not a rule. Start where your child feels confident, even if that is a year below their
        age, and use a different level for each subject if you need to. Most schemes have a short check or an overview
        of what each year covers, which helps you find the right starting place.
      </p>

      <h2 className={guideH2}>Plan a week, not a term</h2>
      <ol className={guideSteps}>
        <li><strong>Write down the current unit</strong> for each subject: its name and where to find it.</li>
        <li><strong>Pick this week&apos;s lessons</strong> from that unit. Three or four for maths and English is plenty.</li>
        <li><strong>Put each one on a day,</strong> with the link, so nobody is hunting for a worksheet at 9am.</li>
        <li><strong>Leave gaps.</strong> A lesson that runs over, a good day out or a bad morning all need somewhere to go.</li>
      </ol>

      <h2 className={guideH2}>Keep one record, whatever you use</h2>
      <p className={guideP}>
        Worksheets and workbooks don&apos;t keep a record for you. A simple habit covers it:
      </p>
      <ul className={guideList}>
        <li>Tick each lesson off on the day it is done.</li>
        <li>If there is a mark, write it down as a score out of a total: 8 out of 10.</li>
        <li>Keep one piece of work a week for each subject. A photo is enough.</li>
        <li>Note which scheme each subject follows. Councils often ask what resources you use.</li>
      </ul>

      <h2 className={guideH2}>Printed or on screen?</h2>
      <ul className={guideList}>
        <li>Print the week&apos;s sheets in one go on a Sunday, and put them in a folder by day.</li>
        <li>Younger children usually do better on paper. Save screens for videos and games.</li>
        <li>Follow a worksheet with something real when you can: measuring in the kitchen after a lesson on length.</li>
      </ul>

      <h2 className={guideH2}>A note on sharing</h2>
      <p className={guideP}>
        Paid resources are for your own family&apos;s use. Keep a link to where a resource lives rather than passing
        copies around, and check each scheme&apos;s terms if you teach with another family.
      </p>

      <p className={`${guideP} text-sm text-[#6E5A46]`}>
        Bright Roots is not connected to Twinkl, White Rose Education or any other scheme named here. The names belong
        to their owners.
      </p>
    </GuidePage>
  );
}
