import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getAllBlogPosts, formatBlogDate } from '@/lib/blog';
import { ArrowRightIcon } from '@/components/Icons';

export const metadata: Metadata = {
  title: 'Repair Advice Blog',
  description: 'Helpful repair advice from We Repair Mac covering MacBooks, laptops, data recovery, gaming PCs, PlayStation, Xbox, Nintendo Switch, and more.',
  alternates: { canonical: 'https://werepairmac.co.uk/blog' },
};

export const revalidate = 86400;

export default function BlogIndexPage() {
  const posts = getAllBlogPosts();
  const [featuredPost, ...morePosts] = posts;

  return (
    <>
      <section className="bg-brand-dark text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <span className="tag bg-white/10 text-white">Repair Advice</span>
          <h1 className="text-4xl md:text-5xl font-extrabold mt-4 mb-4">Helpful repair advice from working engineers</h1>
          <p className="text-blue-100 max-w-3xl text-lg leading-relaxed">
            New articles publish automatically every 2 days, covering Mac, laptop, PC, PlayStation, Xbox, Nintendo Switch, data recovery, and practical fault-finding tips for London customers.
          </p>
        </div>
      </section>

      {featuredPost && (
        <section className="py-14 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-10 items-center">
              <div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
                  <span className="tag">{featuredPost.category}</span>
                  <span>{formatBlogDate(featuredPost.publishedAt)}</span>
                  <span>{featuredPost.readingTime} min read</span>
                </div>
                <h2 className="section-heading mb-4">{featuredPost.title}</h2>
                <p className="text-gray-500 text-base leading-relaxed mb-6">{featuredPost.excerpt}</p>
                <Link href={`/blog/${featuredPost.slug}`} className="btn-primary">
                  Read the article
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
              </div>
              <Link href={`/blog/${featuredPost.slug}`} className="relative h-[320px] rounded-2xl overflow-hidden shadow-lg block">
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-brand-dark/10 to-transparent" />
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {morePosts.map((post) => (
              <article key={post.slug} className="card p-0 overflow-hidden">
                <Link href={`/blog/${post.slug}`} className="block relative h-52">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />
                </Link>
                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mb-3">
                    <span className="font-semibold text-brand">{post.category}</span>
                    <span>{formatBlogDate(post.publishedAt)}</span>
                    <span>{post.readingTime} min read</span>
                  </div>
                  <h2 className="font-bold text-xl text-gray-900 leading-snug mb-3">
                    <Link href={`/blog/${post.slug}`} className="hover:text-brand transition-colors">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">{post.excerpt}</p>
                  <Link href={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:gap-3 transition-all">
                    Read more
                    <ArrowRightIcon className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
