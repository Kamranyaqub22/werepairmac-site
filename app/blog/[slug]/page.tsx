import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { formatBlogDate, getAllBlogPosts, getBlogPost } from '@/lib/blog';
import { getService } from '@/lib/services';
import { ArrowRightIcon, PhoneIcon } from '@/components/Icons';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 86400;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return { title: 'Not Found' };
  }

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `https://werepairmac.co.uk/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `https://werepairmac.co.uk/blog/${post.slug}`,
      images: [{ url: post.image }],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) notFound();

  const service = getService(post.serviceSlug);
  const relatedPosts = getAllBlogPosts()
    .filter((candidate) => candidate.slug !== post.slug)
    .slice(0, 3);

  return (
    <>
      <section className="relative bg-brand-dark text-white py-16 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover opacity-20"
            priority
            sizes="100vw"
          />
        </div>
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-blue-100 hover:text-white transition-colors mb-6">
            <ArrowRightIcon className="w-4 h-4 rotate-180" />
            Back to blog
          </Link>
          <div className="flex flex-wrap items-center gap-3 text-sm text-blue-100 mb-4">
            <span className="tag bg-white/10 text-white">{post.category}</span>
            <span>{formatBlogDate(post.publishedAt)}</span>
            <span>{post.readingTime} min read</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-5">{post.title}</h1>
          <p className="text-lg text-blue-100 leading-relaxed max-w-3xl">{post.excerpt}</p>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="space-y-10">
            {post.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.heading}</h2>
                <div className="space-y-4">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-base text-gray-600 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
                {section.bullets && (
                  <ul className="mt-5 space-y-3">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3 text-gray-600">
                        <span className="mt-2 h-2 w-2 rounded-full bg-accent flex-shrink-0" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {service && (
            <div className="mt-12 rounded-2xl bg-gray-50 border border-gray-100 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Need help with this fault?</h2>
                  <p className="text-gray-500 leading-relaxed">
                    We come to your home or office anywhere in Greater London for {service.shortTitle.toLowerCase()}.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <a href="tel:07378349222" className="btn-accent">
                    <PhoneIcon className="w-4 h-4" />
                    Call 0737 834 9222
                  </a>
                  <Link href={`/${service.slug}`} className="btn-outline">
                    View service page
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-14 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between gap-4 mb-8">
            <h2 className="section-heading">More advice from the blog</h2>
            <Link href="/blog" className="text-sm font-semibold text-brand hover:underline">
              View all posts
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <article key={relatedPost.slug} className="card p-0 overflow-hidden">
                <Link href={`/blog/${relatedPost.slug}`} className="block relative h-48">
                  <Image
                    src={relatedPost.image}
                    alt={relatedPost.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </Link>
                <div className="p-6">
                  <div className="text-xs text-gray-400 mb-3">
                    {formatBlogDate(relatedPost.publishedAt)}
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 leading-snug mb-3">
                    <Link href={`/blog/${relatedPost.slug}`} className="hover:text-brand transition-colors">
                      {relatedPost.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{relatedPost.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
