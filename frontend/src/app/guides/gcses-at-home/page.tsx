import type { Metadata } from "next";
import GuidePage, { guideH2, guideList, guideP, guideSteps } from "@/components/GuidePage";

export const metadata: Metadata = {
  title: "GCSEs for home-educated teenagers: how it works",
  description:
    "How home-educated teenagers in the UK sit GCSEs and IGCSEs as private candidates: finding an exam centre, entry deadlines, fees, coursework and a simple plan.",
};

export default function GcsesGuide() {
  return (
    <GuidePage
      title="GCSEs for home-educated teenagers: how it works"
      minutes={7}
      intro="Home-educated teenagers can sit the same GCSEs as everyone else. The difference is that you arrange it yourself. Here is how it works, in the order you'll need it."
      offerTitle="Keep every exam in one place"
      offer="Bright Roots has an exam planner for home-educated teenagers. Add each paper with its centre, entry deadline, fee and date. It counts down the days, warns you when an entry deadline is close, and puts revision sessions into the weekly planner."
    >
      <h2 className={guideH2}>The short version</h2>
      <p className={guideP}>
        Your teenager sits their exams as a <strong>private candidate</strong>. That means they take the papers at an
        approved school or college, called an exam centre, without being a pupil there. You choose the subjects, do the
        learning at home, book the exams through the centre and pay the fees.
      </p>

      <h2 className={guideH2}>Step by step</h2>
      <ol className={guideSteps}>
        <li>
          <strong>Choose the subjects.</strong> There is no set number. Many home-educated teenagers take five to eight,
          and often spread them over two or three years instead of sitting them all at once. Maths and English are the
          two most often asked for by colleges and employers.
        </li>
        <li>
          <strong>Choose the qualification and exam board.</strong> Check the exact course, called the specification,
          before you start studying, because each board teaches slightly different content. Many home-educating families
          choose International GCSEs (IGCSEs), because most are assessed by written exams only.
        </li>
        <li>
          <strong>Find an exam centre early.</strong> Not every school or college takes private candidates. The Joint
          Council for Qualifications has a search tool for centres that do, and exam boards list theirs too. Ask a
          centre which boards and subjects it can offer before you commit to a course.
        </li>
        <li>
          <strong>Book the exams.</strong> You enter through the centre, not the exam board. Centres set their own
          deadlines, usually months before the exams, and charge more for late entries. Ask for the deadline in writing.
        </li>
        <li>
          <strong>Sit the exams.</strong> Your teenager will need photo ID and their candidate number. Most GCSE exams
          are in May and June, with results in August.
        </li>
      </ol>

      <h2 className={guideH2}>What it costs</h2>
      <p className={guideP}>
        Families pay for exams themselves. Each centre sets its own prices, and the total for one subject includes the
        exam board&apos;s fee and the centre&apos;s own charge. Prices vary a lot, so ask two or three centres for a full
        price list, including any extra for late entry.
      </p>

      <h2 className={guideH2}>Coursework and practical work</h2>
      <p className={guideP}>
        Some subjects include coursework, known as non-exam assessment. A centre has to agree to supervise and mark it,
        and many won&apos;t for private candidates. Always ask the centre before choosing a subject with coursework. This
        is the main reason exam-only courses are popular with home educators.
      </p>

      <h2 className={guideH2}>Extra time and other support</h2>
      <p className={guideP}>
        If your teenager needs extra time, a reader, a scribe or other support, this is called an access arrangement. It
        has to be arranged with the exam centre when you make the entry, and centres usually need evidence, so raise it
        in your very first conversation.
      </p>

      <h2 className={guideH2}>A rough timeline for summer exams</h2>
      <ul className={guideList}>
        <li><strong>A year or more before:</strong> choose subjects and boards, and start the courses.</li>
        <li><strong>The autumn before:</strong> contact centres, ask about subjects, prices, deadlines and support.</li>
        <li><strong>Winter:</strong> make the entries and pay. Don&apos;t leave this until spring.</li>
        <li><strong>Spring:</strong> past papers, under timed conditions, marked with the board&apos;s mark schemes.</li>
        <li><strong>May and June:</strong> the exams.</li>
        <li><strong>August:</strong> results.</li>
      </ul>

      <h2 className={guideH2}>Where to check the details</h2>
      <p className={guideP}>
        Rules and dates change, so check with the centre and the exam board each year. The{" "}
        <a href="https://www.jcq.org.uk/exams-office/private-candidates/" className="font-bold text-brand-sage underline">
          JCQ page for private candidates
        </a>{" "}
        is the best starting point, and each exam board has its own page too.
      </p>
    </GuidePage>
  );
}
