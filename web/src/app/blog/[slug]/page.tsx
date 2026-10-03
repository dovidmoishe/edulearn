import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NavBar from "../../../../components/Home/NavBar/NavBar";
import Footer from "../../../../components/Home/Footer/Footer";
import {
  getPostBySlug,
  MOCK_POSTS,
} from "@/data/mock-blog-posts";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
  }).format(new Date(iso));
}

export function generateStaticParams(): { slug: string }[] {
  return MOCK_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    return { title: "Post" };
  }
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: `${post.title} | EduLearn`,
      description: post.excerpt,
      url: `https://edulearn.fun/blog/${post.slug}`,
    },
    twitter: {
      title: `${post.title} | EduLearn`,
      description: post.excerpt,
    },
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    notFound();
  }

  const paragraphs = post.content.split(/\n\n+/).filter(Boolean);

  return (
    <div className="min-h-screen bg-[#0D0D0D] md:px-[86px] px-[16px] overflow-x-clip">
      <NavBar />

      <article className="py-[40px] md:py-[56px] pb-[80px]">
        <div className="max-w-[720px] mx-auto">
          <Link
            href="/blog"
            className="inline-block text-[#00FF80] text-[14px] font-[600] mb-[32px] hover:underline"
          >
            ← Back to Blog
          </Link>

          <header className="mb-[32px]">
            <p className="text-[#B3B3B3] text-[14px] font-[500] mb-[16px]">
              {formatDate(post.publishedAt)} · {post.readTimeMinutes} min read
            </p>
            <h1 className="text-[#E0E0E0] text-[32px] md:text-[40px] font-[700] leading-[40px] md:leading-[48px]">
              {post.title}
            </h1>
          </header>

          <div className="prose prose-invert prose-sm max-w-none prose-headings:text-[#E0E0E0] prose-p:text-[#B3B3B3] prose-p:leading-relaxed">
            {paragraphs.map((block, index) => (
              <p key={`${post.slug}-${index}`} className="mb-[20px] last:mb-0">
                {block}
              </p>
            ))}
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
