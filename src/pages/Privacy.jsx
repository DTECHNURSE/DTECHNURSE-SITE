import { motion } from 'framer-motion';
import { usePageContent } from '../hooks/usePageContent';

export default function Privacy() {
  const { content, loading } = usePageContent('privacy');

  if (loading) {
    return (
      <div className="section-container py-16 md:py-24 max-w-3xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          {[1,2,3,4].map(i => (
            <div key={i} className="space-y-2 mt-8">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="section-container py-16 md:py-24 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Privacy Policy</h1>
        <p className="text-sm text-brand-gray mb-12">Last updated: {content.lastUpdated}</p>

        <div className="prose prose-headings:font-bold prose-headings:text-brand-dark prose-p:text-brand-gray prose-p:leading-relaxed prose-a:text-brand-blue space-y-8">
          {content.sections.map((section) => (
            <section key={section.id}>
              <h2 className="text-xl mt-4">{section.heading}</h2>
              <p>{section.body}</p>
            </section>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
