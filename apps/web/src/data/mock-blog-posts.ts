export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readTimeMinutes: number;
  coverImage?: string;
  content: string;
};

export const MOCK_POSTS: BlogPost[] = [
  {
    slug: "build-a-daily-skill-routine-that-sticks",
    title: "How to Build a Daily Skill Routine That Actually Sticks",
    excerpt:
      "Small habits beat cram sessions. Use this structure to build momentum and improve consistently.",
    publishedAt: "2026-04-15T12:00:00.000Z",
    readTimeMinutes: 6,
    content: `Becoming skilled is less about motivation spikes and more about repeatable routines. Start with twenty focused minutes at the same time each day, and protect that block like a meeting.

Pick one narrow target each week. For example, one week for component state management, another for layout systems. Narrow focus compounds faster than scattered effort.

At the end of each session, write one sentence about what changed in your understanding. Those short notes become your proof-of-work over time and make review easier.`,
  },
  {
    slug: "why-active-recall-beats-passive-learning",
    title: "Why Active Recall Beats Passive Learning for Real Skills",
    excerpt:
      "Reading and watching can feel productive, but retrieval practice is what builds durable skill.",
    publishedAt: "2026-04-22T12:00:00.000Z",
    readTimeMinutes: 5,
    content: `Passive learning feels smooth, but smooth is not always effective. Real retention comes from trying to retrieve ideas without looking at notes.

Quizzes, flashcards, and short challenges force you to think, decide, and correct mistakes. That pressure is closer to real execution than passive review.

Spacing matters too. Three short practice sessions across the week usually outperform one long session. Pair each session with quick feedback and your weakest points improve the fastest.`,
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return MOCK_POSTS.find((post) => post.slug === slug);
}
