import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, HeartPulse, Shield, BookOpen, Stethoscope, Cpu, TrendingUp, ChevronRight, Star, Users, FileText } from 'lucide-react';
import { useBlogs } from '../hooks/useBlogData.js';
import SkeletonCard from '../components/SkeletonCard.jsx';

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } }
};

const STATS = [
  { value: '10K+', label: 'Nurses Reached', icon: Users },
  { value: '120+', label: 'Expert Articles', icon: FileText },
  { value: '4.9', label: 'Avg. Rating', icon: Star },
];

const PILLARS = [
  {
    icon: HeartPulse,
    tag: 'Core Focus',
    title: 'Health Tech Literacy',
    desc: 'Breaking down AI, IoT, EHRs, and wearables into nurse-friendly concepts you can apply at the bedside immediately.',
    color: 'from-blue-500/10 to-cyan-400/10',
    accent: 'text-brand-blue',
    border: 'border-blue-100',
  },
  {
    icon: TrendingUp,
    tag: 'Career Growth',
    title: 'Career Transitioning',
    desc: 'Step-by-step pathways from bedside care to informatics, UX research, health tech sales, and clinical leadership roles.',
    color: 'from-violet-500/10 to-blue-400/10',
    accent: 'text-violet-600',
    border: 'border-violet-100',
  },
  {
    icon: BookOpen,
    tag: 'Quality Content',
    title: 'Evidence-Based Insights',
    desc: 'Every article is researched, written, and reviewed by practicing nurses and verified health-tech professionals.',
    color: 'from-emerald-500/10 to-teal-400/10',
    accent: 'text-emerald-600',
    border: 'border-emerald-100',
  },
];

const TOPICS = [
  'Artificial Intelligence', 'Electronic Health Records', 'Telehealth',
  'Nursing Informatics', 'Digital Health', 'Clinical Workflow',
  'Wearable Tech', 'Career Pivot',
];

export default function Home() {
  const { blogs, loading, error } = useBlogs();
  const featuredPosts = blogs.slice(0, 3);

  return (
    <div className="overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex items-center bg-brand-dark overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_60%_-10%,#0052CC33,transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_100%_80%,#00E5FF15,transparent)]" />
        {/* Grid texture */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)', backgroundSize: '48px 48px' }} />

        {/* Floating blobs */}
        <motion.div
          animate={{ y: [0, -18, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-24 right-[8%] w-72 h-72 rounded-full bg-brand-cyan/8 blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 14, 0], rotate: [0, -4, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute bottom-16 left-[5%] w-56 h-56 rounded-full bg-brand-blue/20 blur-3xl"
        />

        <div className="section-container relative z-10 py-28 md:py-36">
          <div className="max-w-3xl">
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.div variants={fadeInUp}>
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-cyan/30 bg-brand-cyan/10 text-brand-cyan text-xs font-semibold tracking-widest uppercase mb-8">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
                  Healthcare Meets Innovation
                </span>
              </motion.div>

              <motion.h1 variants={fadeInUp}
                className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.08] tracking-tight">
                The Future of<br />
                Nursing is{' '}
                <span className="relative">
                  <span className="text-brand-cyan">Digital</span>
                  <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" fill="none">
                    <path d="M2 6 Q50 2 100 5 Q150 8 198 4" stroke="#00E5FF" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.5" />
                  </svg>
                </span>
              </motion.h1>

              <motion.p variants={fadeInUp}
                className="mt-7 text-lg md:text-xl text-white/60 max-w-xl leading-relaxed font-light">
                Empowering nurses to master healthcare technology, reduce burnout, and advance their careers in the digital age.
              </motion.p>

              <motion.div variants={fadeInUp} className="mt-10 flex flex-wrap gap-4">
                <Link to="/blog"
                  className="group inline-flex items-center gap-2.5 bg-brand-blue hover:bg-blue-700 text-white px-7 py-3.5 rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-brand-blue/30 hover:shadow-brand-blue/50 hover:-translate-y-0.5">
                  Explore the Blog
                  <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/about"
                  className="inline-flex items-center gap-2 border border-white/20 text-white/80 hover:text-white hover:border-white/40 bg-white/5 hover:bg-white/10 px-7 py-3.5 rounded-xl font-semibold transition-all duration-300">
                  Our Mission
                </Link>
              </motion.div>

              {/* Stats row */}
              <motion.div variants={fadeInUp} className="mt-16 flex flex-wrap gap-8">
                {STATS.map(({ value, label, icon: Icon }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-white/8 border border-white/10 flex items-center justify-center">
                      <Icon size={16} className="text-brand-cyan" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-white leading-none">{value}</div>
                      <div className="text-xs text-white/45 mt-0.5">{label}</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ── TOPIC TAGS TICKER ────────────────────────────────────────── */}
      <section className="py-5 border-y border-brand-border bg-brand-light/60 overflow-hidden">
        <div className="flex gap-3 animate-[marquee_30s_linear_infinite] w-max">
          {[...TOPICS, ...TOPICS].map((t, i) => (
            <span key={i} className="whitespace-nowrap px-4 py-1.5 rounded-full border border-brand-border bg-white text-sm text-brand-gray font-medium shadow-sm">
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* ── THREE PILLARS ─────────────────────────────────────────────── */}
      <section className="py-24 section-container">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={stagger}>
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <p className="text-xs font-bold tracking-widest text-brand-blue uppercase mb-3">Why DTECHNURSE</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark max-w-2xl mx-auto leading-tight">
              Everything a modern nurse needs to thrive in tech
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {PILLARS.map((item, i) => (
              <motion.div key={i} variants={fadeInUp}
                className={`relative group p-8 rounded-2xl border ${item.border} bg-gradient-to-br ${item.color} hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
                <div className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest ${item.accent} mb-5 opacity-70`}>
                  {item.tag}
                </div>
                <div className={`w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center mb-5 ${item.accent}`}>
                  <item.icon size={24} />
                </div>
                <h3 className="text-lg font-bold text-brand-dark mb-3">{item.title}</h3>
                <p className="text-brand-gray text-sm leading-relaxed">{item.desc}</p>
                <div className={`absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity ${item.accent}`}>
                  <ChevronRight size={18} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── FEATURED POSTS ────────────────────────────────────────────── */}
      <section className="py-24 bg-[#F7F9FC]">
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={stagger}>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-14">
              <div>
                <p className="text-xs font-bold tracking-widest text-brand-blue uppercase mb-2">Latest Insights</p>
                <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark">Featured Articles</h2>
                <p className="text-brand-gray mt-2 max-w-md">Curated reads at the intersection of nursing and technology.</p>
              </div>
              <Link to="/blog" className="group flex items-center gap-2 text-brand-blue font-semibold text-sm hover:gap-3 transition-all shrink-0">
                View all articles <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {loading ? (
                Array(3).fill(0).map((_, i) => <SkeletonCard key={i} />)
              ) : error ? (
                <p className="text-brand-gray col-span-3 text-center py-8">{error}</p>
              ) : featuredPosts.length === 0 ? (
                <p className="text-brand-gray col-span-3 text-center py-8">No posts yet — check back soon.</p>
              ) : (
                featuredPosts.map((post, i) => (
                  <motion.article key={post.id} variants={fadeInUp}>
                    <Link to={`/blog/${post.id}`}
                      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-brand-border hover:border-brand-blue/30 shadow-sm hover:shadow-xl transition-all duration-300 h-full">
                      <div className="h-52 overflow-hidden relative">
                        <img src={post.image} alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        {post.tags?.[0] && (
                          <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-brand-blue text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                            {post.tags[0]}
                          </span>
                        )}
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <p className="text-xs text-brand-gray mb-2.5">{post.date} · {post.author}</p>
                        <h3 className="text-base font-bold text-brand-dark group-hover:text-brand-blue transition-colors mb-2.5 line-clamp-2 leading-snug">
                          {post.title}
                        </h3>
                        <p className="text-sm text-brand-gray line-clamp-2 leading-relaxed flex-1">{post.excerpt}</p>
                        <div className="mt-5 flex items-center gap-1.5 text-brand-blue text-sm font-semibold">
                          Read more <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────────── */}
      <section className="py-24 section-container">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeInUp}>
          <div className="relative rounded-3xl bg-brand-dark overflow-hidden p-12 md:p-16 text-center">
            {/* BG effects */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_-10%,#0052CC55,transparent)]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-brand-cyan/40 to-transparent" />
            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-cyan/30 bg-brand-cyan/10 text-brand-cyan text-xs font-semibold tracking-widest uppercase mb-6">
                <Stethoscope size={12} />
                Join the Community
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-5 leading-tight">
                Ready to lead the<br className="hidden md:block" /> digital health revolution?
              </h2>
              <p className="text-white/55 max-w-xl mx-auto text-lg mb-10 font-light">
                Explore our full library of articles, guides, and career resources designed specifically for nurses navigating the tech landscape.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/blog"
                  className="group inline-flex items-center gap-2.5 bg-brand-cyan hover:bg-cyan-300 text-brand-dark px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-brand-cyan/20 hover:-translate-y-0.5">
                  Browse All Articles
                  <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/about"
                  className="inline-flex items-center gap-2 border border-white/20 text-white/80 hover:text-white hover:border-white/40 bg-white/5 hover:bg-white/10 px-8 py-4 rounded-xl font-semibold transition-all duration-300">
                  Learn About Us
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
