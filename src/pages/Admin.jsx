import { useState, useRef, useEffect, useCallback } from 'react';
import { onAuthStateChanged, signOut } from "firebase/auth";
import { addDoc, collection, serverTimestamp, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import {
  Loader2, Save, LinkIcon, Bold, Italic, List, Image as ImageIcon, LogOut,
  Code, Pencil, Trash2, Plus, ArrowLeft, FileText, Newspaper, Trash,
  ChevronDown, ChevronUp, Twitter, Linkedin, Github, Underline, AlignLeft,
  AlignCenter, AlignRight, AlignJustify, ListOrdered, Quote, Link2, Minus,
  Undo2, Redo2, Type, Strikethrough, RemoveFormatting, RotateCcw,
} from 'lucide-react';
import AdminLogin from '../components/admin/AdminLogin';
import { usePageContent, savePageContent, DEFAULTS } from '../hooks/usePageContent';

// ─── Shared Admin Header ────────────────────────────────────────────────────
function AdminHeader({ user, onLogout }) {
  return (
    <div className="bg-brand-dark text-white px-4 py-3 shadow-lg">
      <div className="section-container flex items-center justify-between mx-auto w-full">
        <div className="flex items-center gap-3">
          {user.photoURL && (
            <img src={user.photoURL} alt="Admin" className="w-8 h-8 rounded-full border-2 border-brand-cyan" />
          )}
          <p className="text-sm font-semibold">{user.displayName || user.email}</p>
        </div>
        <button onClick={onLogout} className="flex items-center gap-2 text-sm text-gray-300 hover:text-white">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
}

// ─── Tab Navigation ─────────────────────────────────────────────────────────
function TabNav({ activeTab, setActiveTab }) {
  const tabs = [
    { key: 'posts', label: 'Blog Posts', icon: Newspaper },
    { key: 'pages', label: 'Site Pages', icon: FileText },
  ];
  return (
    <div className="flex gap-1 border-b border-brand-border mb-8">
      {tabs.map(({ key, label, icon: Icon }) => (
        <button key={key} onClick={() => setActiveTab(key)}
          className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === key ? 'border-brand-blue text-brand-blue' : 'border-transparent text-brand-gray hover:text-brand-dark'
          }`}>
          <Icon size={16} /> {label}
        </button>
      ))}
    </div>
  );
}

// ─── Rich Text Toolbar ───────────────────────────────────────────────────────
function ToolbarDivider() {
  return <span className="w-px h-5 bg-gray-300 mx-1 self-center" />;
}

function ToolbarBtn({ onClick, title, active, children, className = '' }) {
  return (
    <button
      type="button"
      onMouseDown={e => { e.preventDefault(); onClick(); }}
      title={title}
      className={`p-1.5 rounded text-sm transition-colors ${
        active ? 'bg-brand-blue text-white' : 'hover:bg-gray-200 text-gray-700'
      } ${className}`}
    >
      {children}
    </button>
  );
}

function ToolbarSelect({ value, onChange, title, children }) {
  return (
    <select
      title={title}
      value={value}
      onChange={e => onChange(e.target.value)}
      onMouseDown={e => e.stopPropagation()}
      className="text-xs border border-gray-300 rounded px-1.5 py-1 bg-white text-gray-700 hover:border-brand-blue focus:outline-none focus:border-brand-blue cursor-pointer"
    >
      {children}
    </select>
  );
}

function RichToolbar({ editorRef, isHtmlView, onToggleHtml, wordCount }) {
  const exec = useCallback((cmd, val = null) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, val);
  }, [editorRef]);

  const handleHeading = (val) => {
    editorRef.current?.focus();
    if (val === 'p') document.execCommand('formatBlock', false, '<p>');
    else document.execCommand('formatBlock', false, `<${val}>`);
  };

  const handleFontSize = (val) => {
    editorRef.current?.focus();
    document.execCommand('fontSize', false, val);
  };

  const handleLink = () => {
    const url = window.prompt('Enter URL (e.g. https://example.com):');
    if (url) exec('createLink', url);
  };

  const handleImage = () => {
    const url = window.prompt('Paste image URL:');
    if (url) exec('insertImage', url);
  };

  const handleColor = (e) => {
    exec('foreColor', e.target.value);
  };

  const handleHighlight = (e) => {
    exec('hiliteColor', e.target.value);
  };

  const queryCmd = (cmd) => {
    try { return document.queryCommandState(cmd); } catch { return false; }
  };

  return (
    <div className="border border-b-0 border-brand-border rounded-t-lg bg-gray-50 overflow-x-auto">
      {/* Row 1 */}
      <div className="flex flex-wrap items-center gap-0.5 p-1.5 border-b border-gray-200">
        {/* Undo / Redo */}
        <ToolbarBtn onClick={() => exec('undo')} title="Undo (Ctrl+Z)"><Undo2 size={15} /></ToolbarBtn>
        <ToolbarBtn onClick={() => exec('redo')} title="Redo (Ctrl+Y)"><Redo2 size={15} /></ToolbarBtn>
        <ToolbarDivider />

        {/* Block format */}
        <ToolbarSelect title="Paragraph style" value="" onChange={handleHeading}>
          <option value="" disabled>Style</option>
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="blockquote">Blockquote</option>
          <option value="pre">Code block</option>
        </ToolbarSelect>

        {/* Font size */}
        <ToolbarSelect title="Font size" value="" onChange={handleFontSize}>
          <option value="" disabled>Size</option>
          <option value="1">XS</option>
          <option value="2">Small</option>
          <option value="3">Normal</option>
          <option value="4">Medium</option>
          <option value="5">Large</option>
          <option value="6">XL</option>
          <option value="7">XXL</option>
        </ToolbarSelect>

        <ToolbarDivider />

        {/* Inline formatting */}
        <ToolbarBtn onClick={() => exec('bold')} title="Bold (Ctrl+B)" active={queryCmd('bold')}><Bold size={15} /></ToolbarBtn>
        <ToolbarBtn onClick={() => exec('italic')} title="Italic (Ctrl+I)" active={queryCmd('italic')}><Italic size={15} /></ToolbarBtn>
        <ToolbarBtn onClick={() => exec('underline')} title="Underline (Ctrl+U)" active={queryCmd('underline')}><Underline size={15} /></ToolbarBtn>
        <ToolbarBtn onClick={() => exec('strikeThrough')} title="Strikethrough" active={queryCmd('strikeThrough')}><Strikethrough size={15} /></ToolbarBtn>
        <ToolbarDivider />

        {/* Color pickers */}
        <label title="Text colour" className="relative cursor-pointer">
          <span className="flex items-center gap-0.5 px-1.5 py-1 rounded hover:bg-gray-200 text-gray-700 text-xs font-bold">
            <Type size={13} />
            <span className="text-[10px]">A</span>
          </span>
          <input type="color" defaultValue="#000000" onChange={handleColor}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
        </label>
        <label title="Highlight colour" className="relative cursor-pointer">
          <span className="flex items-center gap-0.5 px-1.5 py-1 rounded hover:bg-gray-200 text-yellow-500 text-xs">
            <Type size={13} />
            <span className="text-[10px]">H</span>
          </span>
          <input type="color" defaultValue="#FFFF00" onChange={handleHighlight}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
        </label>
        <ToolbarDivider />

        {/* Alignment */}
        <ToolbarBtn onClick={() => exec('justifyLeft')} title="Align left" active={queryCmd('justifyLeft')}><AlignLeft size={15} /></ToolbarBtn>
        <ToolbarBtn onClick={() => exec('justifyCenter')} title="Align centre" active={queryCmd('justifyCenter')}><AlignCenter size={15} /></ToolbarBtn>
        <ToolbarBtn onClick={() => exec('justifyRight')} title="Align right" active={queryCmd('justifyRight')}><AlignRight size={15} /></ToolbarBtn>
        <ToolbarBtn onClick={() => exec('justifyFull')} title="Justify" active={queryCmd('justifyFull')}><AlignJustify size={15} /></ToolbarBtn>
      </div>

      {/* Row 2 */}
      <div className="flex flex-wrap items-center gap-0.5 p-1.5">
        {/* Lists */}
        <ToolbarBtn onClick={() => exec('insertUnorderedList')} title="Bullet list" active={queryCmd('insertUnorderedList')}><List size={15} /></ToolbarBtn>
        <ToolbarBtn onClick={() => exec('insertOrderedList')} title="Numbered list" active={queryCmd('insertOrderedList')}><ListOrdered size={15} /></ToolbarBtn>
        <ToolbarDivider />

        {/* Indent */}
        <ToolbarBtn onClick={() => exec('indent')} title="Indent">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="11" y1="12" x2="21" y2="12"/><line x1="11" y1="18" x2="21" y2="18"/><polyline points="7 9 3 12 7 15"/></svg>
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec('outdent')} title="Outdent">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="11" y1="12" x2="21" y2="12"/><line x1="11" y1="18" x2="21" y2="18"/><polyline points="3 9 7 12 3 15"/></svg>
        </ToolbarBtn>
        <ToolbarDivider />

        {/* Link / Image / HR / Quote */}
        <ToolbarBtn onClick={handleLink} title="Insert link"><Link2 size={15} /></ToolbarBtn>
        <ToolbarBtn onClick={() => exec('unlink')} title="Remove link">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18.84 12.25l1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07 5.006 5.006 0 0 0-6.95 0l-1.72 1.71"/><path d="M5.17 11.75l-1.71 1.71a5.004 5.004 0 0 0 .12 7.07 5.006 5.006 0 0 0 6.95 0l1.71-1.71"/><line x1="8" y1="2" x2="8" y2="5"/><line x1="2" y1="8" x2="5" y2="8"/><line x1="16" y1="19" x2="16" y2="22"/><line x1="19" y1="16" x2="22" y2="16"/></svg>
        </ToolbarBtn>
        <ToolbarBtn onClick={handleImage} title="Insert image"><ImageIcon size={15} /></ToolbarBtn>
        <ToolbarBtn onClick={() => exec('insertHorizontalRule')} title="Horizontal rule"><Minus size={15} /></ToolbarBtn>
        <ToolbarDivider />

        {/* Clear formatting */}
        <ToolbarBtn onClick={() => exec('removeFormat')} title="Clear formatting"><RemoveFormatting size={15} /></ToolbarBtn>
        <ToolbarDivider />

        {/* Word count */}
        <span className="ml-auto text-[11px] text-gray-400 pr-1 select-none whitespace-nowrap">
          {wordCount} word{wordCount !== 1 ? 's' : ''}
        </span>

        {/* HTML toggle */}
        <ToolbarBtn
          onClick={onToggleHtml}
          title="Toggle HTML source"
          active={isHtmlView}
          className="font-mono text-xs ml-1"
        >
          <Code size={14} />
          <span className="ml-0.5 text-[10px]">HTML</span>
        </ToolbarBtn>
      </div>
    </div>
  );
}

// ─── Pages Editor ───────────────────────────────────────────────────────────
function PagesEditor({ user }) {
  const [activePage, setActivePage] = useState('privacy');
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setForm(null);
    setLoading(true);
    const run = async () => {
      try {
        const base = JSON.parse(JSON.stringify(DEFAULTS[activePage]));
        if (db) {
          const snap = await getDoc(doc(db, 'sitePages', activePage));
          if (!cancelled && snap.exists()) {
            setForm({ ...base, ...snap.data() });
          } else if (!cancelled) {
            setForm(base);
          }
        } else if (!cancelled) {
          setForm(base);
        }
      } catch {
        if (!cancelled) setForm(JSON.parse(JSON.stringify(DEFAULTS[activePage])));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => { cancelled = true; };
  }, [activePage]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await savePageContent(activePage, form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      alert('Failed to save. Check Firestore rules.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-brand-blue w-8 h-8" /></div>;
  }

  return (
    <div>
      <div className="flex gap-2 mb-8">
        {[
          { key: 'privacy', label: 'Privacy Policy' },
          { key: 'about', label: 'About Page' },
          { key: 'footer', label: 'Footer' },
        ].map(p => (
          <button key={p.key} onClick={() => setActivePage(p.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              activePage === p.key ? 'bg-brand-blue text-white border-brand-blue' : 'bg-white text-brand-gray border-brand-border hover:border-brand-blue'
            }`}>
            {p.label}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 md:p-10 rounded-2xl border border-brand-border shadow-sm space-y-8">
        {activePage === 'privacy' && (
          <>
            <div>
              <label className="block text-sm font-semibold mb-2">Last Updated Date</label>
              <input type="text" value={form.lastUpdated} onChange={e => setForm({ ...form, lastUpdated: e.target.value })}
                className="w-full md:w-80 px-4 py-2 rounded-lg border border-brand-border focus:ring-2 focus:ring-brand-blue outline-none"
                placeholder="e.g. October 24, 2023" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-semibold">Policy Sections</label>
                <button type="button" onClick={() => setForm({ ...form, sections: [...form.sections, { id: `s${Date.now()}`, heading: 'New Section', body: '' }] })}
                  className="flex items-center gap-1 text-sm text-brand-blue hover:underline">
                  <Plus size={14} /> Add Section
                </button>
              </div>
              <div className="space-y-5">
                {form.sections.map((section, idx) => (
                  <div key={section.id} className="border border-brand-border rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <input type="text" value={section.heading}
                        onChange={e => { const s = [...form.sections]; s[idx] = { ...s[idx], heading: e.target.value }; setForm({ ...form, sections: s }); }}
                        className="flex-1 px-3 py-2 rounded-lg border border-brand-border focus:ring-2 focus:ring-brand-blue outline-none font-semibold"
                        placeholder="Section heading" />
                      <div className="flex gap-1">
                        <button type="button" disabled={idx === 0} onClick={() => { const s = [...form.sections]; [s[idx-1],s[idx]]=[s[idx],s[idx-1]]; setForm({...form,sections:s}); }} className="p-1 text-brand-gray hover:text-brand-dark disabled:opacity-30"><ChevronUp size={16}/></button>
                        <button type="button" disabled={idx === form.sections.length-1} onClick={() => { const s=[...form.sections]; [s[idx+1],s[idx]]=[s[idx],s[idx+1]]; setForm({...form,sections:s}); }} className="p-1 text-brand-gray hover:text-brand-dark disabled:opacity-30"><ChevronDown size={16}/></button>
                        <button type="button" onClick={() => { if (!window.confirm('Delete this section?')) return; setForm({...form,sections:form.sections.filter((_,i)=>i!==idx)}); }} className="p-1 text-red-400 hover:text-red-600"><Trash size={16}/></button>
                      </div>
                    </div>
                    <textarea rows={4} value={section.body}
                      onChange={e => { const s=[...form.sections]; s[idx]={...s[idx],body:e.target.value}; setForm({...form,sections:s}); }}
                      className="w-full px-3 py-2 rounded-lg border border-brand-border focus:ring-2 focus:ring-brand-blue outline-none resize-none text-brand-gray text-sm"
                      placeholder="Section body text..." />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activePage === 'about' && (
          <>
            <div>
              <label className="block text-sm font-semibold mb-2">Page Heading</label>
              <input type="text" value={form.heading} onChange={e => setForm({ ...form, heading: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-brand-border focus:ring-2 focus:ring-brand-blue outline-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Intro Paragraph</label>
              <textarea rows={4} value={form.intro} onChange={e => setForm({ ...form, intro: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-brand-border focus:ring-2 focus:ring-brand-blue outline-none resize-none text-brand-gray" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-4">Cards (Mission / Vision / Audience)</label>
              <div className="space-y-5">
                {form.cards.map((card, idx) => (
                  <div key={card.id} className="border border-brand-border rounded-xl p-4 space-y-3">
                    <input type="text" value={card.title}
                      onChange={e => { const c=[...form.cards]; c[idx]={...c[idx],title:e.target.value}; setForm({...form,cards:c}); }}
                      className="w-full px-3 py-2 rounded-lg border border-brand-border focus:ring-2 focus:ring-brand-blue outline-none font-semibold"
                      placeholder="Card title" />
                    <textarea rows={3} value={card.text}
                      onChange={e => { const c=[...form.cards]; c[idx]={...c[idx],text:e.target.value}; setForm({...form,cards:c}); }}
                      className="w-full px-3 py-2 rounded-lg border border-brand-border focus:ring-2 focus:ring-brand-blue outline-none resize-none text-brand-gray text-sm"
                      placeholder="Card body text..." />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activePage === 'footer' && (
          <>
            <div>
              <label className="block text-sm font-semibold mb-2">Footer Tagline</label>
              <textarea rows={3} value={form.tagline} onChange={e => setForm({ ...form, tagline: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-brand-border focus:ring-2 focus:ring-brand-blue outline-none resize-none text-brand-gray"
                placeholder="Short tagline shown under the logo..." />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {[['twitterUrl','Twitter',Twitter],['linkedinUrl','LinkedIn',Linkedin],['githubUrl','GitHub',Github]].map(([key,label,Icon]) => (
                <div key={key}>
                  <label className="block text-sm font-semibold mb-2 flex items-center gap-1"><Icon size={14}/> {label} URL</label>
                  <input type="text" value={form[key]} onChange={e => setForm({...form,[key]:e.target.value})}
                    className="w-full px-3 py-2 rounded-lg border border-brand-border focus:ring-2 focus:ring-brand-blue outline-none text-sm"
                    placeholder={`https://${label.toLowerCase()}.com/...`} />
                </div>
              ))}
            </div>
          </>
        )}

        <div className="flex items-center gap-4 pt-4 border-t border-brand-border">
          <button onClick={() => { if (!window.confirm('Reset to defaults?')) return; setForm(JSON.parse(JSON.stringify(DEFAULTS[activePage]))); }}
            className="text-sm text-brand-gray hover:text-red-500 transition-colors">
            Reset to defaults
          </button>
          <button onClick={handleSave} disabled={saving}
            className="btn-primary ml-auto flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            {saving ? <><Loader2 className="animate-spin" size={18}/> Saving...</> : saved ? <><Save size={18}/> Saved ✓</> : <><Save size={18}/> Save Changes</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Blog Editor ─────────────────────────────────────────────────────────────
function BlogEditor({ user }) {
  const editorRef = useRef(null);
  const [posts, setPosts] = useState([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [view, setView] = useState('list');
  const [editingId, setEditingId] = useState(null);

  const emptyForm = { title: '', author: '', excerpt: '', content: '', coverUrl: '', tags: '' };
  const [formData, setFormData] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isHtmlView, setIsHtmlView] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [readTime, setReadTime] = useState(0);
  const [lastSaved, setLastSaved] = useState(null);
  const autoSaveTimer = useRef(null);

  const fetchPosts = async () => {
    setIsLoadingPosts(true);
    const querySnapshot = await getDocs(collection(db, 'blogPosts'));
    const postsData = querySnapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    postsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setPosts(postsData);
    setIsLoadingPosts(false);
  };

  useEffect(() => { if (user) fetchPosts(); }, [user]);

  // Sync visual editor content from formData when switching views
  useEffect(() => {
    if (!isHtmlView && editorRef.current && view === 'editor') {
      if (editorRef.current.innerHTML !== formData.content) {
        editorRef.current.innerHTML = formData.content;
        updateStats(formData.content);
      }
    }
  }, [isHtmlView, view, formData.content]);

  const updateStats = (html) => {
    const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    const words = text ? text.split(' ').filter(Boolean).length : 0;
    setWordCount(words);
    setCharCount(text.length);
    setReadTime(Math.max(1, Math.ceil(words / 200)));
  };

  const handleEditorInput = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    updateStats(html);
    // Auto-save draft to localStorage
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      try {
        localStorage.setItem('dtechnurse_draft', JSON.stringify({ ...formData, content: html, savedAt: new Date().toISOString() }));
        setLastSaved(new Date().toLocaleTimeString());
      } catch (_) {}
    }, 2000);
  };

  const handleEditorBlur = () => {
    if (editorRef.current && !isHtmlView) {
      setFormData(prev => ({ ...prev, content: editorRef.current.innerHTML }));
    }
  };

  const switchToVisual = () => setIsHtmlView(false);
  const switchToHtml = () => {
    if (editorRef.current) setFormData(prev => ({ ...prev, content: editorRef.current.innerHTML }));
    setIsHtmlView(true);
  };
  const onToggleHtml = () => isHtmlView ? switchToVisual() : switchToHtml();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleCreateNew = () => {
    // Restore draft if exists
    try {
      const draft = JSON.parse(localStorage.getItem('dtechnurse_draft') || 'null');
      if (draft && window.confirm(`Restore unsaved draft from ${new Date(draft.savedAt).toLocaleString()}?`)) {
        setFormData(draft);
        setEditingId(null);
        setIsHtmlView(false);
        setView('editor');
        return;
      }
    } catch (_) {}
    setFormData(emptyForm);
    setEditingId(null);
    setIsHtmlView(false);
    setWordCount(0); setCharCount(0); setReadTime(0);
    setView('editor');
  };

  const handleEditPost = (post) => {
    const content = post.content || '';
    setFormData({ title: post.title, author: post.author, excerpt: post.excerpt, content, coverUrl: post.image, tags: (post.tags || []).join(', ') });
    setEditingId(post.id);
    setIsHtmlView(false);
    updateStats(content);
    setView('editor');
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm("Delete this post? This cannot be undone.")) {
      await deleteDoc(doc(db, 'blogPosts', postId));
      fetchPosts();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalContent = isHtmlView ? formData.content : (editorRef.current?.innerHTML || '');
    if (!formData.title || !finalContent || !formData.coverUrl) return alert("Please fill out Title, Content, and Cover Image URL.");
    setIsSubmitting(true);
    try {
      const tags = formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [];
      const postPayload = {
        title: formData.title,
        author: formData.author || "DTECHNURSE Admin",
        excerpt: formData.excerpt,
        content: finalContent,
        image: formData.coverUrl,
        tags,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      };
      if (editingId) {
        await updateDoc(doc(db, 'blogPosts', editingId), postPayload);
        alert("Post updated!");
      } else {
        await addDoc(collection(db, 'blogPosts'), { ...postPayload, createdAt: serverTimestamp() });
        localStorage.removeItem('dtechnurse_draft');
        alert("Post published!");
      }
      setView('list');
      fetchPosts();
    } catch (error) {
      console.error(error);
      alert("Failed to save post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // LIST VIEW
  if (view === 'list') {
    return (
      <div>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-extrabold">Manage Posts</h2>
            <p className="text-brand-gray mt-1">View, edit, or delete your articles.</p>
          </div>
          <button onClick={handleCreateNew} className="btn-primary flex items-center gap-2">
            <Plus size={18} /> New Post
          </button>
        </div>

        {isLoadingPosts ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin text-brand-blue w-8 h-8" /></div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl border border-brand-border">
            <p className="text-brand-gray text-lg">No posts yet.</p>
            <button onClick={handleCreateNew} className="text-brand-blue font-semibold mt-2 hover:underline">Create your first post</button>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <div key={post.id} className="flex items-center gap-4 p-4 bg-white border border-brand-border rounded-xl hover:shadow-sm transition-shadow">
                <img src={post.image} alt="" className="w-16 h-16 rounded-lg object-cover hidden sm:block flex-shrink-0" />
                <div className="flex-grow min-w-0">
                  <h3 className="font-bold text-brand-dark truncate">{post.title}</h3>
                  <p className="text-sm text-brand-gray">{post.date} • {post.author}</p>
                  {post.tags?.length > 0 && (
                    <div className="flex gap-1 flex-wrap mt-1">
                      {post.tags.map(t => <span key={t} className="text-[10px] bg-brand-light text-brand-blue px-2 py-0.5 rounded-full">{t}</span>)}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => handleEditPost(post)} className="p-2 text-brand-blue hover:bg-brand-light rounded-lg transition-colors" title="Edit"><Pencil size={18}/></button>
                  <button onClick={() => handleDeletePost(post.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete"><Trash2 size={18}/></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // EDITOR VIEW
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <button onClick={() => setView('list')} className="text-brand-gray hover:text-brand-dark"><ArrowLeft size={24}/></button>
          <div>
            <h2 className="text-2xl font-extrabold">{editingId ? 'Edit Post' : 'New Post'}</h2>
            <p className="text-brand-gray mt-1 text-sm">{editingId ? 'Update your article.' : 'Write a new article for DTECHNURSE'}</p>
          </div>
        </div>
        {/* Stats bar */}
        <div className="hidden md:flex items-center gap-4 text-xs text-brand-gray bg-gray-50 border border-brand-border rounded-lg px-4 py-2">
          <span><strong className="text-brand-dark">{wordCount}</strong> words</span>
          <span><strong className="text-brand-dark">{charCount}</strong> chars</span>
          <span>~<strong className="text-brand-dark">{readTime}</strong> min read</span>
          {lastSaved && <span className="text-green-500">✓ Draft saved {lastSaved}</span>}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Cover image */}
        <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-sm">
          <label className="block text-sm font-semibold mb-3 flex items-center gap-2"><LinkIcon size={16}/> Cover Image URL</label>
          <input type="url" name="coverUrl" value={formData.coverUrl} onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-brand-border focus:ring-2 focus:ring-brand-blue outline-none mb-4"
            placeholder="https://images.unsplash.com/photo-xxxxx..." required />
          <div className="border-2 border-dashed border-brand-border rounded-xl h-52 flex items-center justify-center bg-gray-50 overflow-hidden">
            {formData.coverUrl
              ? <img src={formData.coverUrl} alt="Cover" className="w-full h-full object-cover" onError={e => e.target.src=''} />
              : <p className="text-brand-gray text-sm">Paste a URL above to preview</p>
            }
          </div>
        </div>

        {/* Meta fields */}
        <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-sm space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Blog Title <span className="text-red-400">*</span></label>
              <input type="text" name="title" value={formData.title} onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-brand-border focus:ring-2 focus:ring-brand-blue outline-none"
                placeholder="e.g., The Future of Nursing..." required />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Author Name</label>
              <input type="text" name="author" value={formData.author} onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-brand-border focus:ring-2 focus:ring-brand-blue outline-none"
                placeholder="e.g., Jane Doe, RN" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Short Excerpt <span className="text-red-400">*</span></label>
            <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} rows={2}
              className="w-full px-4 py-3 rounded-lg border border-brand-border focus:ring-2 focus:ring-brand-blue outline-none resize-none"
              placeholder="A brief, compelling summary shown in the blog list..." required />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Tags <span className="text-brand-gray font-normal text-xs">(comma-separated)</span></label>
            <input type="text" name="tags" value={formData.tags} onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-brand-border focus:ring-2 focus:ring-brand-blue outline-none"
              placeholder="e.g., Nursing, Health Tech, EHR" />
          </div>
        </div>

        {/* Rich Content Editor */}
        <div className="bg-white rounded-2xl border border-brand-border shadow-sm overflow-hidden">
          <div className="px-6 pt-5 pb-3 border-b border-brand-border">
            <label className="block text-sm font-semibold">Article Content <span className="text-red-400">*</span></label>
            <p className="text-xs text-brand-gray mt-0.5">Use the toolbar to format. Toggle HTML view for source editing.</p>
          </div>

          <div className="p-4">
            <RichToolbar
              editorRef={editorRef}
              isHtmlView={isHtmlView}
              onToggleHtml={onToggleHtml}
              wordCount={wordCount}
            />

            {isHtmlView ? (
              <textarea
                value={formData.content}
                onChange={e => { setFormData({ ...formData, content: e.target.value }); updateStats(e.target.value); }}
                className="w-full h-[420px] p-4 border border-brand-border rounded-b-lg focus:ring-2 focus:ring-brand-blue outline-none text-sm font-mono bg-gray-900 text-green-400 resize-none"
                placeholder="<p>Type raw HTML here...</p>"
              />
            ) : (
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleEditorInput}
                onBlur={handleEditorBlur}
                data-placeholder="Start writing your article here..."
                className="min-h-[420px] p-5 border border-brand-border border-t-0 rounded-b-lg focus:ring-2 focus:ring-brand-blue outline-none leading-relaxed
                  [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:my-4 [&_h1]:text-brand-dark
                  [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:my-3 [&_h2]:text-brand-dark
                  [&_h3]:text-xl [&_h3]:font-bold [&_h3]:my-2 [&_h3]:text-brand-dark
                  [&_p]:mb-3 [&_p]:text-brand-gray [&_p]:leading-relaxed
                  [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3 [&_ul]:text-brand-gray
                  [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-3 [&_ol]:text-brand-gray
                  [&_li]:mb-1
                  [&_a]:text-brand-blue [&_a]:underline
                  [&_blockquote]:border-l-4 [&_blockquote]:border-brand-blue [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-gray-500 [&_blockquote]:my-4
                  [&_pre]:bg-gray-900 [&_pre]:text-green-400 [&_pre]:p-4 [&_pre]:rounded-lg [&_pre]:font-mono [&_pre]:text-sm [&_pre]:my-4 [&_pre]:overflow-x-auto
                  [&_hr]:border-brand-border [&_hr]:my-4
                  [&_img]:rounded-lg [&_img]:max-w-full [&_img]:my-4 [&_img]:shadow-sm
                  empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400 empty:before:pointer-events-none"
              />
            )}
          </div>

          {/* Mobile stats */}
          <div className="md:hidden px-4 pb-3 flex gap-4 text-xs text-brand-gray">
            <span>{wordCount} words • {charCount} chars • ~{readTime} min read</span>
            {lastSaved && <span className="text-green-500">✓ Draft saved {lastSaved}</span>}
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3 justify-end pb-8">
          <button type="button" onClick={() => setView('list')} className="px-5 py-2.5 rounded-xl border border-brand-border text-brand-gray hover:text-brand-dark text-sm font-medium transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            {isSubmitting ? <><Loader2 className="animate-spin" size={18}/> Saving...</> : <><Save size={18}/> {editingId ? 'Update Post' : 'Publish Post'}</>}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─── Main Admin ──────────────────────────────────────────────────────────────
export default function Admin() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => { setUser(u); setAuthLoading(false); });
    return () => unsub();
  }, []);

  const handleLogout = async () => { await signOut(auth); };

  if (authLoading) return <div className="section-container py-32 flex justify-center"><Loader2 className="animate-spin text-brand-blue w-10 h-10"/></div>;
  if (!user) return <AdminLogin authLoading={authLoading} />;

  return (
    <div>
      <AdminHeader user={user} onLogout={handleLogout} />
      <div className="section-container py-12 md:py-16 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold">Admin Dashboard</h1>
          <p className="text-brand-gray mt-1">Manage your blog posts and site content.</p>
        </div>
        <TabNav activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === 'posts' && <BlogEditor user={user} />}
        {activeTab === 'pages' && <PagesEditor user={user} />}
      </div>
    </div>
  );
}
