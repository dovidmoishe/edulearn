import Link from "next/link";
import NavBar from "../../../components/Home/NavBar/NavBar";
import Footer from "../../../components/Home/Footer/Footer";
import { MOCK_POSTS } from "@/data/mock-blog-posts";

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
  }).format(new Date(iso));
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#0D0D0D] md:px-[86px] px-[16px] overflow-x-clip">
      <NavBar />

      <div className="py-[40px] md:py-[60px] pb-[80px]">
        <div className="max-w-[1400px] mx-auto">
          <div className="mb-[48px] text-center">
            <h1 className="text-[#E0E0E0] text-[36px] md:text-[48px] font-[700] leading-[44px] md:leading-[56px] mb-[16px]">
              Blog
            </h1>
            <p className="text-[#B3B3B3] text-[16px] md:text-[18px] font-[400] leading-[24px] max-w-[600px] mx-auto">
              Tips for building real skills, staying consistent, and using
              EduLearn effectively
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px] max-w-[960px] mx-auto">
            {MOCK_POSTS.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block bg-[#131313] border border-[#2E3033] rounded-[24px] p-[24px] hover:border-[#00FF80] transition-all duration-300"
              >
                <p className="text-[#B3B3B3] text-[13px] font-[500] mb-[12px]">
                  {formatDate(post.publishedAt)} - {post.readTimeMinutes} min read
                </p>
                <h2 className="text-[#E0E0E0] text-[20px] md:text-[22px] font-[700] leading-[28px] mb-[12px] group-hover:text-[#00FF80] transition-colors">
                  {post.title}
                </h2>
                <p className="text-[#B3B3B3] text-[14px] font-[400] leading-[22px]">
                  {post.excerpt}
                </p>
                <span className="inline-block mt-[16px] text-[#00FF80] text-[14px] font-[600]">
                  Read article {"->"}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
