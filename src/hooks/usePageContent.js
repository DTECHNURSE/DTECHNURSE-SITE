import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const DEFAULTS = {
  privacy: {
    lastUpdated: 'October 24, 2023',
    sections: [
      {
        id: 's1',
        heading: '1. Data Collection',
        body: 'We respect your privacy. When you use our contact form or subscribe to our newsletter, we collect only the information you explicitly provide (e.g., name, email address). We do not use tracking cookies that violate your privacy, nor do we sell your personal data to third parties.'
      },
      {
        id: 's2',
        heading: '2. Cookies',
        body: 'Our website uses strictly necessary cookies to ensure the basic functionality of the site (such as remembering your layout preferences). We do not use invasive advertising trackers or third-party analytics cookies without your explicit consent.'
      },
      {
        id: 's3',
        heading: '3. User Rights',
        body: 'You have the right to access, correct, or delete any personal data we hold about you at any time. If you wish to exercise these rights, please contact us via our contact page, and we will respond within 30 days.'
      },
      {
        id: 's4',
        heading: '4. Contact Information',
        body: 'If you have any questions about this Privacy Policy, please reach out to us through our Contact Page. We are committed to transparency and will address any concerns promptly.'
      }
    ]
  },
  about: {
    heading: 'Bridging Clinical Care & Digital Innovation',
    intro: 'DTECHNURSE was founded on a simple truth: the most powerful technology in healthcare is only as good as the nurse using it. We exist to ensure no nurse is left behind in the digital revolution.',
    cards: [
      { id: 'c1', title: 'Our Mission', text: 'To democratize health tech education for nurses globally, providing the skills needed to lead technological change in clinical environments.' },
      { id: 'c2', title: 'Our Vision', text: 'A healthcare system where every nurse is a confident, empowered digital advocate, shaping the tools that impact patient outcomes.' },
      { id: 'c3', title: 'Our Audience', text: 'We serve student nurses, seasoned RNs, nurse leaders, and healthcare professionals looking to pivot into health-tech roles.' }
    ]
  },
  footer: {
    tagline: 'Empowering nurses with the technology skills needed to revolutionize healthcare. Bridging the gap between clinical expertise and digital innovation.',
    twitterUrl: '#',
    linkedinUrl: '#',
    githubUrl: '#'
  }
};

export function usePageContent(pageKey) {
  const [content, setContent] = useState(DEFAULTS[pageKey]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) { setLoading(false); return; }
    const ref = doc(db, 'sitePages', pageKey);
    getDoc(ref).then(snap => {
      if (snap.exists()) setContent(snap.data());
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [pageKey]);

  return { content, loading };
}

export async function savePageContent(pageKey, data) {
  if (!db) throw new Error('Firebase not configured');
  await setDoc(doc(db, 'sitePages', pageKey), data);
}

export { DEFAULTS };
