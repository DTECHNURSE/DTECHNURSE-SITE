import { motion } from 'framer-motion';
import { Target, Eye, Users } from 'lucide-react';
import { usePageContent } from '../hooks/usePageContent';

const ICONS = [Target, Eye, Users];

export default function About() {
  const { content, loading } = usePageContent('about');

  if (loading) {
    return (
      <div className="section-container py-16 md:py-24">
        <div className="max-w-4xl mx-auto animate-pulse">
          <div className="text-center mb-16 space-y-4">
            <div className="h-12 bg-gray-200 rounded w-2/3 mx-auto"></div>
            <div className="h-5 bg-gray-200 rounded w-full mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {[1,2,3].map(i => (
              <div key={i} className="bg-brand-light p-8 rounded-2xl space-y-3">
                <div className="h-10 w-10 bg-gray-200 rounded-full mx-auto"></div>
                <div className="h-5 bg-gray-200 rounded w-2/3 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-container py-16 md:py-24">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6"
            dangerouslySetInnerHTML={{ __html: content.heading.replace(' & ', ' &amp; ').replace('&amp; ', '& ').replace('\n', '<br/>') }}
          />
          <p className="text-lg text-brand-gray leading-relaxed">{content.intro}</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mt-16">
          {content.cards.map((card, i) => {
            const Icon = ICONS[i] || Target;
            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-brand-light p-8 rounded-2xl text-center"
              >
                <Icon className="w-10 h-10 text-brand-blue mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">{card.title}</h3>
                <p className="text-brand-gray text-sm leading-relaxed">{card.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
