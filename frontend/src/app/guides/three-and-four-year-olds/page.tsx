import type { Metadata } from "next";
import GuidePage, { guideH2, guideList, guideP } from "@/components/GuidePage";

export const metadata: Metadata = {
  title: "Learning at home with a 3 or 4 year old",
  description:
    "Simple, playful ideas for home learning with 3 and 4 year olds: how long, how often, what to cover and ten-minute activities you can do today.",
};

export default function PreschoolGuide() {
  return (
    <GuidePage
      title="Learning at home with a 3 or 4 year old"
      minutes={5}
      intro="At three and four, learning doesn't look like school, and it shouldn't. It looks like counting spoons at a teddy's tea party, hopping like a frog and wondering where your shadow went. You don't need a curriculum or a timetable, just a few minutes of playing together and plenty of talk."
      offerTitle="Little Roots: story books to do together"
      offer="Bright Roots has Little Roots, a set of ten-minute activities for 3 and 4 year olds. Each one is a picture book you read together, with what you need, what to say and an easier version for tired days. There's a new set of three activities and a rhyme each week, and your little one doesn't need a login."
    >
      <h2 className={guideH2}>How much is enough?</h2>
      <p className={guideP}>
        Ten to fifteen minutes, a few times a week, is plenty. Three and four year olds learn all day long through ordinary life:
        helping with the washing, chatting in the car, splashing in puddles. A short, planned activity just adds a little
        extra on top. Stop while it&apos;s still fun, and don&apos;t worry about the days it doesn&apos;t happen.
      </p>

      <h2 className={guideH2}>What to cover</h2>
      <p className={guideP}>
        Early years guidance across the UK groups learning into a handful of areas. In England that&apos;s the EYFS, and in
        Scotland it&apos;s Curriculum for Excellence early level. You don&apos;t need to follow either at home, but they make a
        useful checklist:
      </p>
      <ul className={guideList}>
        <li><strong>Talk.</strong> New words, stories, taking turns in a conversation.</li>
        <li><strong>Early maths.</strong> Counting, sharing out &quot;one each&quot;, bigger and smaller, shapes.</li>
        <li><strong>Letters and sounds.</strong> Listening games, rhymes, hearing the first sound in a word.</li>
        <li><strong>Moving.</strong> Jumping, balancing, throwing, and stopping when the music stops.</li>
        <li><strong>Creating.</strong> Painting, making marks, building and pretend play.</li>
        <li><strong>The world around us.</strong> Bugs, leaves, weather, light and shadows.</li>
      </ul>
      <p className={guideP}>Getting on with people, feelings and turn-taking come into all of them.</p>

      <h2 className={guideH2}>Five ten-minute ideas to try today</h2>
      <ul className={guideList}>
        <li>
          <strong>Teddy&apos;s tea party.</strong> Lay a cup and a spoon for each toy, then share out a snack: &quot;one for
          you, one for you&quot;. That&apos;s early counting.
        </li>
        <li>
          <strong>The mystery bag.</strong> Hide a few everyday things in a pillowcase. They feel one, guess, then say its name
          slowly: &quot;sssss-ock&quot;.
        </li>
        <li>
          <strong>Animal moves.</strong> Hop like a frog, stand on one leg like a flamingo, freeze like a statue when the music
          stops.
        </li>
        <li>
          <strong>Water painting.</strong> A bucket of water and a big brush on a wall or fence outside. Big arm movements now
          make writing easier later.
        </li>
        <li>
          <strong>Shadow play.</strong> A torch in a dark room. Make the shadow big, then small. Can you make a bird?
        </li>
      </ul>

      <h2 className={guideH2}>Talk is the big one</h2>
      <p className={guideP}>
        If you only do one thing, chat. Say what you see (&quot;You found a red leaf!&quot;), wonder out loud (&quot;I wonder
        where the snail lives&quot;) and give them time to answer. Read together every day, even for five minutes. Rhymes and
        songs count too: they help children hear the sounds in words, which makes reading easier later on.
      </p>

      <h2 className={guideH2}>Keeping it safe</h2>
      <ul className={guideList}>
        <li>Stay with them the whole time, especially near water, food and anything small.</li>
        <li>Under 5s can choke on small things: no whole nuts, whole grapes, popcorn, coins, magnets or button batteries.</li>
        <li>Clear a space before any running or jumping, away from stairs and sharp corners.</li>
      </ul>

      <h2 className={guideH2}>Do I have to tell anyone?</h2>
      <p className={guideP}>
        Children in the UK don&apos;t have to be in education until they reach compulsory school age, which is around five and
        depends on where you live and when their birthday falls. Many families use their funded nursery hours, some don&apos;t,
        and lots mix the two. Check your own council&apos;s website for school starting ages and funded early learning where you
        live.
      </p>
    </GuidePage>
  );
}
