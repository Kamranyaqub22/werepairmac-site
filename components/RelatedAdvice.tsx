import Link from 'next/link';
import Image from 'next/image';
import { formatBlogDate, type BlogPost } from '@/lib/blog';
import { ArrowRightIcon } from '@/components/Icons';

/**
 * Related repair-advice cards.
 *
 * Extracted so town hubs and service×town pages can carry blog links without a
 * third copy of this markup. `intro` is passed in rather than templated here so
 * each page type frames the block in its own words — an identical sentence on
 * 200+ pages is the boilerplate this block exists to avoid.
 */
export default function RelatedAdvice({
  posts,
  heading = 'Related Repair Advice',
  intro,
}: {
  posts: BlogPost[];
  heading?: string;
  intro: string;
}) {
  if (!posts.length) return null;

  return (
    <section className="py-14 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="section-heading text-center">{heading}</h2>
        <p className="text-center text-gray-500 mt-2 mb-10 max-w-2xl mx-auto">{intro}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article key={post.slug} className="card p-0 overflow-hidden">
              <Link href={`/blog/${post.slug}`} className="block relative h-40">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                />
              </Link>
              <div className="p-5">
                <div className="text-xs text-gray-400 mb-2">{formatBlogDate(post.publishedAt)}</div>
                <h3 className="font-bold text-gray-900 leading-snug mb-2">
                  <Link href={`/blog/${post.slug}`} className="hover:text-brand transition-colors">
                    {post.title}
                  </Link>
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-3">{post.excerpt}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:gap-2.5 transition-all"
                >
                  Read more <ArrowRightIcon className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
