'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import {
  BarChart3, FileText, ImageIcon, LogOut, Mail, MessageSquare,
  Package, PencilLine, Plus, Save, Settings, Star, Upload, X,
} from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { formatINR } from '@/lib/pricing';
import { getDefaultSettings } from '@/lib/settings';
import type {
  Artwork, ContactEnquiry, Order, ShopProduct, SiteSetting, Testimonial,
} from '@/types';

type Tab = 'overview' | 'artworks' | 'testimonials' | 'shop' | 'settings' | 'orders' | 'enquiries';
type ArtworkDraft = Omit<Artwork, 'id' | 'created_at' | 'updated_at'>;
type ShopCollection = 'print' | 'original';
type ShopProductDraft = Omit<ShopProduct, 'id' | 'created_at' | 'updated_at'>;

const ADMIN_ACCOUNTS: Record<string, string> = {
  monuadmin: 'ms00582508@gmail.com',
};
const menu: { key: Tab; label: string; icon: typeof BarChart3 }[] = [
  { key: 'overview', label: 'Overview', icon: BarChart3 },
  { key: 'artworks', label: 'Portfolio', icon: ImageIcon },
  { key: 'testimonials', label: 'Testimonials', icon: Star },
  { key: 'shop', label: 'Shop', icon: Package },
  { key: 'settings', label: 'Website content', icon: Settings },
  { key: 'orders', label: 'Orders', icon: FileText },
  { key: 'enquiries', label: 'Contact queries', icon: Mail },
];

const emptyArtwork = (): ArtworkDraft => ({
  title: '', category: 'pencil', medium: 'pencil', description: '', size: 'A4',
  price: 0, year: new Date().getFullYear(), image_url: '', featured: false,
  published: true, watermark: false, sort_order: 0,
});

const emptyShopProduct = (): ShopProductDraft => ({
  title: '', category: 'pencil', medium: 'pencil', description: '', size: 'A4',
  price: 0, year: new Date().getFullYear(), image_url: '', featured: false,
  published: true, watermark: false, sort_order: 0,
});

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="block text-sm font-medium text-stone-700" data-image-url-field={label === 'Image URL' ? 'true' : undefined}><label className="mb-1.5 block">{label}</label>{children}{label === 'Image URL' && <ImageUploader />}</div>;
}

const inputClass = 'w-full rounded-md border border-stone-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-stone-800 focus:ring-2 focus:ring-stone-200';

function ImageUploader() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  async function uploadImage(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith('image/')) { setError('Please choose an image file.'); return; }
    if (file.size > 10 * 1024 * 1024) { setError('Image must be 10 MB or smaller.'); return; }

    setUploading(true); setError('');
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const path = `admin/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage.from('artwork-images').upload(path, file, {
      cacheControl: '3600',
      contentType: file.type,
      upsert: false,
    });
    if (uploadError) {
      setError(uploadError.message);
    } else {
      const { data } = supabase.storage.from('artwork-images').getPublicUrl(path);
      const input = document.querySelector('[data-image-url-field="true"] input') as HTMLInputElement | null;
      const valueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
      if (input && valueSetter) {
        valueSetter.call(input, data.publicUrl);
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
    setUploading(false);
  }

  return <div className="mt-2 flex flex-wrap items-center gap-3"><button type="button" onClick={(event) => (event.currentTarget.querySelector('input') as HTMLInputElement)?.click()} className={`inline-flex items-center gap-2 rounded-md border border-stone-300 bg-stone-50 px-3 py-2 text-sm font-medium transition hover:bg-stone-100 ${uploading ? 'pointer-events-none opacity-60' : ''}`}><Upload className="h-4 w-4" />{uploading ? 'Uploading…' : 'Upload image'}<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="sr-only" disabled={uploading} onChange={(e) => { void uploadImage(e.target.files?.[0]); e.currentTarget.value = ''; }} /></button><span className="text-xs font-normal text-stone-500">PNG, JPG, WebP or GIF · max 10 MB</span>{error && <p className="w-full text-xs font-normal text-red-700">Upload failed: {error}. Run the storage migration in Supabase first.</p>}</div>;
}

export default function AdminPage() {
  const [sessionReady, setSessionReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [tab, setTab] = useState<Tab>('overview');
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('');
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [printDesigns, setPrintDesigns] = useState<ShopProduct[]>([]);
  const [originalDrawings, setOriginalDrawings] = useState<ShopProduct[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>(getDefaultSettings());
  const [orders, setOrders] = useState<Order[]>([]);
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>([]);
  const [artworkDraft, setArtworkDraft] = useState<ArtworkDraft>(emptyArtwork());
  const [editingArtwork, setEditingArtwork] = useState<string | null>(null);
  const [shopDraft, setShopDraft] = useState<ShopProductDraft>(emptyShopProduct());
  const [editingShopProduct, setEditingShopProduct] = useState<{ id: string; collection: ShopCollection } | null>(null);
  const [testimonialDraft, setTestimonialDraft] = useState({ customer_name: '', review: '', rating: 5, published: true, sort_order: 0 });
  const [editingTestimonial, setEditingTestimonial] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setAuthenticated(Boolean(data.session));
      setSessionReady(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setAuthenticated(Boolean(nextSession)));
    return () => listener.subscription.unsubscribe();
  }, []);

  async function loadDashboard() {
    setLoading(true);
    const [artworkResult, printResult, originalResult, testimonialResult, settingsResult, orderResult, enquiryResult] = await Promise.all([
      supabase.from('artworks').select('*').order('sort_order'),
      supabase.from('print_designs').select('*').order('sort_order'),
      supabase.from('original_drawings').select('*').order('sort_order'),
      supabase.from('testimonials').select('*').order('sort_order'),
      supabase.from('site_settings').select('key,value'),
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
      supabase.from('contact_enquiries').select('*').order('created_at', { ascending: false }),
    ]);
    setArtworks((artworkResult.data ?? []) as Artwork[]);
    setPrintDesigns((printResult.data ?? []) as ShopProduct[]);
    setOriginalDrawings((originalResult.data ?? []) as ShopProduct[]);
    setTestimonials((testimonialResult.data ?? []) as Testimonial[]);
    setOrders((orderResult.data ?? []) as Order[]);
    setEnquiries((enquiryResult.data ?? []) as ContactEnquiry[]);
    const receivedSettings = Object.fromEntries(((settingsResult.data ?? []) as SiteSetting[]).map((item) => [item.key, item.value]));
    setSettings((current) => ({ ...current, ...receivedSettings }));
    setLoading(false);
  }

  useEffect(() => { if (authenticated) void loadDashboard(); }, [authenticated]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const username = String(form.get('username') || '').trim();
    const password = String(form.get('password') || '');
    setLoginError('');
    const email = ADMIN_ACCOUNTS[username.toLowerCase()];
    if (!email) { setLoginError('Username is not authorised for this dashboard.'); return; }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setLoginError('Login failed. Check the username/password and create the admin user in Supabase Auth first.');
  }

  function showNotice(message: string) { setNotice(message); window.setTimeout(() => setNotice(''), 3500); }

  async function saveArtwork(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const payload = { ...artworkDraft, price: Number(artworkDraft.price) || 0, year: Number(artworkDraft.year) || null, sort_order: Number(artworkDraft.sort_order) || 0 };
    const result = editingArtwork
      ? await supabase.from('artworks').update(payload).eq('id', editingArtwork)
      : await supabase.from('artworks').insert(payload);
    if (result.error) { showNotice(result.error.message); return; }
    setArtworkDraft(emptyArtwork()); setEditingArtwork(null); showNotice('Artwork saved.'); void loadDashboard();
  }

  function editArtwork(item: Artwork) {
    const { id, created_at, updated_at, ...draft } = item;
    setArtworkDraft(draft); setEditingArtwork(id);
  }

  async function deleteArtwork(id: string) {
    if (!window.confirm('Delete this artwork?')) return;
    const { error } = await supabase.from('artworks').delete().eq('id', id);
    showNotice(error ? error.message : 'Artwork deleted.'); if (!error) void loadDashboard();
  }

  async function saveShopProduct(event: FormEvent<HTMLFormElement>, collection: ShopCollection) {
    event.preventDefault();
    const table = collection === 'print' ? 'print_designs' : 'original_drawings';
    const payload = { ...shopDraft, price: Number(shopDraft.price) || 0, year: Number(shopDraft.year) || null, sort_order: Number(shopDraft.sort_order) || 0 };
    const result = editingShopProduct
      ? await supabase.from(table).update(payload).eq('id', editingShopProduct.id)
      : await supabase.from(table).insert(payload);
    if (result.error) { showNotice(result.error.message); return; }
    setShopDraft(emptyShopProduct()); setEditingShopProduct(null); showNotice('Shop item saved.'); void loadDashboard();
  }

  function editShopProduct(item: ShopProduct, collection: ShopCollection) {
    const { id, created_at, updated_at, ...draft } = item;
    setShopDraft(draft); setEditingShopProduct({ id, collection }); setTab('shop');
  }

  async function deleteShopProduct(id: string, collection: ShopCollection) {
    if (!window.confirm('Delete this shop item?')) return;
    const table = collection === 'print' ? 'print_designs' : 'original_drawings';
    const { error } = await supabase.from(table).delete().eq('id', id);
    showNotice(error ? error.message : 'Shop item deleted.'); if (!error) void loadDashboard();
  }

  async function saveTestimonial(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = editingTestimonial
      ? await supabase.from('testimonials').update(testimonialDraft).eq('id', editingTestimonial)
      : await supabase.from('testimonials').insert(testimonialDraft);
    if (result.error) { showNotice(result.error.message); return; }
    setTestimonialDraft({ customer_name: '', review: '', rating: 5, published: true, sort_order: 0 });
    setEditingTestimonial(null); showNotice('Testimonial saved.'); void loadDashboard();
  }

  async function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const rows = Object.entries(settings).map(([key, value]) => ({ key, value }));
    const { error } = await supabase.from('site_settings').upsert(rows, { onConflict: 'key' });
    showNotice(error ? error.message : 'Website content updated.'); if (!error) void loadDashboard();
  }

  async function updateRecord(table: 'orders' | 'contact_enquiries', id: string, changes: Record<string, string>) {
    const { error } = await supabase.from(table).update(changes).eq('id', id);
    showNotice(error ? error.message : 'Updated.'); if (!error) void loadDashboard();
  }

  const stats = useMemo(() => ({
    artworks: artworks.length, orders: orders.filter((order) => order.order_status === 'new').length,
    enquiries: enquiries.filter((item) => item.status === 'new').length, testimonials: testimonials.length,
  }), [artworks, orders, enquiries, testimonials]);

  if (!sessionReady) return <div className="min-h-screen bg-stone-950" />;
  if (!authenticated) return <Login onSubmit={login} error={loginError} />;

  return <div className="min-h-screen bg-stone-100 text-stone-900" style={{ backgroundColor: '#f5f3ef' }}>
    <header className="sticky top-0 z-20 border-b border-stone-800 bg-stone-950 px-5 py-4 text-stone-50 sm:px-8" style={{ backgroundColor: '#1c1917', color: '#fafaf9' }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between"><div><p className="font-serif text-2xl">MSARTIK</p><p className="text-xs uppercase tracking-[0.24em] text-stone-400">Studio administration</p></div><button onClick={() => void supabase.auth.signOut()} className="inline-flex items-center gap-2 text-sm text-stone-300 hover:text-white"><LogOut className="h-4 w-4" />Log out</button></div>
    </header>
    <div className="mx-auto grid max-w-7xl lg:grid-cols-[220px_1fr]">
      <aside className="border-r border-stone-200 bg-white p-3 lg:min-h-[calc(100vh-78px)] lg:p-5"><nav className="flex gap-1 overflow-x-auto lg:flex-col">{menu.map((item) => { const Icon = item.icon; return <button key={item.key} onClick={() => setTab(item.key)} className={`flex shrink-0 items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm transition ${tab === item.key ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'}`}><Icon className="h-4 w-4" />{item.label}</button>; })}</nav></aside>
      <main className="min-w-0 p-5 sm:p-8">
        {notice && <div className="mb-5 rounded-md border border-stone-300 bg-white px-4 py-3 text-sm shadow-sm">{notice}</div>}
        {loading ? <p className="py-16 text-center text-stone-500">Loading your studio…</p> : <>
          {tab === 'overview' && <Overview stats={stats} orders={orders} enquiries={enquiries} setTab={setTab} />}
          {tab === 'artworks' && <ArtworkManager artworks={artworks} draft={artworkDraft} setDraft={setArtworkDraft} editing={editingArtwork} onSave={saveArtwork} onEdit={editArtwork} onDelete={deleteArtwork} cancel={() => { setArtworkDraft(emptyArtwork()); setEditingArtwork(null); }} />}
          {tab === 'testimonials' && <TestimonialManager testimonials={testimonials} draft={testimonialDraft} setDraft={setTestimonialDraft} editing={editingTestimonial} setEditing={setEditingTestimonial} onSave={saveTestimonial} reload={loadDashboard} notice={showNotice} />}
          {tab === 'shop' && <ShopManager printDesigns={printDesigns} originalDrawings={originalDrawings} draft={shopDraft} setDraft={setShopDraft} editing={editingShopProduct} setEditing={setEditingShopProduct} onSave={saveShopProduct} onEdit={editShopProduct} onDelete={deleteShopProduct} />}
          {tab === 'settings' && <SettingsManager settings={settings} setSettings={setSettings} onSave={saveSettings} />}
          {tab === 'orders' && <OrdersManager orders={orders} update={updateRecord} />}
          {tab === 'enquiries' && <EnquiryManager enquiries={enquiries} update={updateRecord} />}
        </>}
      </main>
    </div>
  </div>;
}

function Login({ onSubmit, error }: { onSubmit: (event: FormEvent<HTMLFormElement>) => void; error: string }) {
  return <main className="grid min-h-screen place-items-center bg-stone-950 p-6"><form onSubmit={onSubmit} className="w-full max-w-sm rounded-xl border border-stone-700 bg-stone-900 p-7 text-stone-50 shadow-2xl"><p className="font-serif text-4xl">MSARTIK</p><p className="mt-1 text-sm text-stone-400">Admin dashboard</p><div className="mt-8 space-y-4"><Field label="Username"><input required name="username" defaultValue="MonuAdmin" autoCapitalize="none" className={`${inputClass} text-stone-900`} /></Field><Field label="Password"><input required name="password" type="password" className={`${inputClass} text-stone-900`} /></Field></div>{error && <p className="mt-4 text-sm text-red-300">{error}</p>}<button className="mt-6 w-full rounded-md bg-white px-4 py-3 text-sm font-semibold text-stone-950 hover:bg-stone-200">Sign in</button></form></main>;
}

function SectionTitle({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) { return <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">{eyebrow}</p><h1 className="mt-1 font-serif text-4xl">{title}</h1></div>{children}</div>; }

function Overview({ stats, orders, enquiries, setTab }: { stats: Record<string, number>; orders: Order[]; enquiries: ContactEnquiry[]; setTab: (tab: Tab) => void }) { const cards = [{ label: 'Portfolio works', value: stats.artworks, tab: 'artworks' as Tab }, { label: 'New orders', value: stats.orders, tab: 'orders' as Tab }, { label: 'New queries', value: stats.enquiries, tab: 'enquiries' as Tab }, { label: 'Testimonials', value: stats.testimonials, tab: 'testimonials' as Tab }]; return <><SectionTitle eyebrow="Dashboard" title="Welcome back" /><p className="-mt-5 mb-7 max-w-2xl text-sm leading-6 text-stone-600">Manage every part of your portrait studio—from the work you show to client requests and website copy.</p><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map((card) => <button key={card.label} onClick={() => setTab(card.tab)} className="rounded-lg border border-stone-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow"><p className="text-sm text-stone-500">{card.label}</p><p className="mt-3 font-serif text-5xl">{card.value}</p><span className="mt-4 inline-block text-xs font-semibold uppercase tracking-wider text-stone-500">Open section →</span></button>)}</div><div className="mt-8 grid gap-6 xl:grid-cols-2"><ListCard title="Recent orders" empty="No portrait orders yet.">{orders.length ? orders.slice(0, 5).map((item) => <p key={item.id} className="flex justify-between gap-4 py-2 text-sm"><span>{item.customer_name}</span><span className="text-stone-500">{item.order_status.replaceAll('_', ' ')}</span></p>) : null}</ListCard><ListCard title="Latest contact queries" empty="No contact queries yet.">{enquiries.length ? enquiries.slice(0, 5).map((item) => <p key={item.id} className="flex justify-between gap-4 py-2 text-sm"><span>{item.name}</span><span className="truncate text-stone-500">{item.subject}</span></p>) : null}</ListCard></div></>; }
function ListCard({ title, children, empty }: { title: string; children: React.ReactNode; empty: string }) { return <section className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm"><h2 className="font-serif text-2xl">{title}</h2><div className="mt-3 divide-y divide-stone-100">{children || <p className="py-6 text-sm text-stone-500">{empty}</p>}</div></section>; }

function ArtworkManager({ artworks, draft, setDraft, editing, onSave, onEdit, onDelete, cancel }: any) { return <><SectionTitle eyebrow="Portfolio" title={editing ? 'Edit artwork' : 'Add artwork'} /><form onSubmit={onSave} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm"><div className="grid gap-4 md:grid-cols-2"><Field label="Title"><input required className={inputClass} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></Field><Field label="Image URL"><input required type="url" className={inputClass} value={draft.image_url} onChange={(e) => setDraft({ ...draft, image_url: e.target.value })} /></Field><Field label="Category"><select className={inputClass} value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })}>{['pencil','charcoal','hyper_realistic','couple','family','celebrity','pet','custom'].map((x) => <option key={x}>{x}</option>)}</select></Field><Field label="Medium"><select className={inputClass} value={draft.medium} onChange={(e) => setDraft({ ...draft, medium: e.target.value })}>{['pencil','charcoal','colour'].map((x) => <option key={x}>{x}</option>)}</select></Field><Field label="Size"><input className={inputClass} value={draft.size ?? ''} onChange={(e) => setDraft({ ...draft, size: e.target.value })} /></Field><Field label="Price (₹)"><input type="number" className={inputClass} value={draft.price ?? 0} onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })} /></Field><Field label="Year"><input type="number" className={inputClass} value={draft.year ?? ''} onChange={(e) => setDraft({ ...draft, year: Number(e.target.value) })} /></Field><Field label="Display order"><input type="number" className={inputClass} value={draft.sort_order} onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })} /></Field></div><div className="mt-4"><Field label="Description"><textarea className={inputClass} rows={3} value={draft.description ?? ''} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></Field></div><div className="mt-4 flex flex-wrap gap-5 text-sm">{['published','featured','watermark'].map((key) => <label key={key} className="flex items-center gap-2 capitalize"><input type="checkbox" checked={Boolean(draft[key])} onChange={(e) => setDraft({ ...draft, [key]: e.target.checked })} />{key}</label>)}</div><div className="mt-5 flex gap-3"><button className="inline-flex items-center gap-2 rounded-md bg-stone-900 px-4 py-2.5 text-sm font-medium text-white"><Save className="h-4 w-4" />Save artwork</button>{editing && <button type="button" onClick={cancel} className="rounded-md border border-stone-300 px-4 py-2.5 text-sm">Cancel</button>}</div></form><div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{artworks.map((item: Artwork) => <article key={item.id} className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm"><img src={item.image_url} alt="" className="h-44 w-full object-cover" /><div className="p-4"><div className="flex justify-between gap-3"><h2 className="font-serif text-xl">{item.title}</h2><span className="text-xs text-stone-500">{item.published ? 'Live' : 'Hidden'}</span></div><p className="mt-1 text-sm text-stone-500">{formatINR(Number(item.price || 0))}</p><div className="mt-4 flex gap-3"><button onClick={() => onEdit(item)} className="text-sm font-medium underline">Edit</button><button onClick={() => onDelete(item.id)} className="text-sm font-medium text-red-700 underline">Delete</button></div></div></article>)}</div></>; }

function TestimonialManager({ testimonials, draft, setDraft, editing, setEditing, onSave, reload, notice }: any) { const edit = (item: Testimonial) => { setDraft({ customer_name: item.customer_name, review: item.review, rating: item.rating, published: item.published, sort_order: item.sort_order }); setEditing(item.id); }; const remove = async (id: string) => { if (!window.confirm('Delete this testimonial?')) return; const { error } = await supabase.from('testimonials').delete().eq('id', id); notice(error ? error.message : 'Testimonial deleted.'); if (!error) void reload(); }; return <><SectionTitle eyebrow="Social proof" title={editing ? 'Edit testimonial' : 'Testimonials'} /><form onSubmit={onSave} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm"><div className="grid gap-4 md:grid-cols-2"><Field label="Client name"><input required className={inputClass} value={draft.customer_name} onChange={(e) => setDraft({ ...draft, customer_name: e.target.value })} /></Field><Field label="Rating"><select className={inputClass} value={draft.rating} onChange={(e) => setDraft({ ...draft, rating: Number(e.target.value) })}>{[5,4,3,2,1].map((n) => <option key={n} value={n}>{n} stars</option>)}</select></Field></div><div className="mt-4"><Field label="Review"><textarea required rows={4} className={inputClass} value={draft.review} onChange={(e) => setDraft({ ...draft, review: e.target.value })} /></Field></div><div className="mt-4 flex gap-5 text-sm"><label className="flex items-center gap-2"><input type="checkbox" checked={draft.published} onChange={(e) => setDraft({ ...draft, published: e.target.checked })} />Published</label><label className="flex items-center gap-2">Order <input type="number" className="w-20 rounded border px-2 py-1" value={draft.sort_order} onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })} /></label></div><div className="mt-5 flex gap-3"><button className="rounded-md bg-stone-900 px-4 py-2.5 text-sm font-medium text-white">Save testimonial</button>{editing && <button type="button" className="rounded-md border px-4 py-2.5 text-sm" onClick={() => { setEditing(null); setDraft({ customer_name: '', review: '', rating: 5, published: true, sort_order: 0 }); }}>Cancel</button>}</div></form><div className="mt-8 grid gap-4 lg:grid-cols-2">{testimonials.map((item: Testimonial) => <article key={item.id} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm"><div className="flex justify-between"><p className="font-medium">{item.customer_name}</p><p>{'★'.repeat(item.rating)}</p></div><p className="mt-3 text-sm leading-6 text-stone-600">{item.review}</p><div className="mt-4 flex gap-3"><button onClick={() => edit(item)} className="text-sm underline">Edit</button><button onClick={() => void remove(item.id)} className="text-sm text-red-700 underline">Delete</button></div></article>)}</div></>; }

function ShopManager({ printDesigns, originalDrawings, draft, setDraft, editing, setEditing, onSave, onEdit, onDelete }: any) {
  const [collection, setCollection] = useState<ShopCollection>('print');
  const isPrint = collection === 'print';
  const collectionLabel = isPrint ? 'Print-ready designs' : 'Original drawings';
  const collectionItems: ShopProduct[] = isPrint ? printDesigns : originalDrawings;

  function switchCollection(next: ShopCollection) {
    setCollection(next);
    setEditing(null);
    setDraft(emptyShopProduct());
  }

  function editItem(item: ShopProduct) {
    onEdit(item, collection);
  }

  function cancel() {
    setEditing(null);
    setDraft(emptyShopProduct());
  }

  return <>
    <SectionTitle eyebrow="Shop manager" title={collectionLabel}>
      <div className="flex rounded-md border border-stone-300 bg-white p-1 text-sm shadow-sm">
        <button type="button" onClick={() => switchCollection('print')} className={`rounded px-3 py-2 ${isPrint ? 'bg-stone-900 text-white' : 'text-stone-600'}`}>Print-ready designs</button>
        <button type="button" onClick={() => switchCollection('original')} className={`rounded px-3 py-2 ${!isPrint ? 'bg-stone-900 text-white' : 'text-stone-600'}`}>Original drawings</button>
      </div>
    </SectionTitle>
    <p className="-mt-4 mb-6 max-w-2xl text-sm leading-6 text-stone-600">Add and edit the items shown in this collection. A design added here will only appear in its matching public shop.</p>
    <form onSubmit={(event) => onSave(event, collection)} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Title"><input required className={inputClass} value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} /></Field>
        <Field label="Image URL"><input required type="url" className={inputClass} value={draft.image_url} onChange={(e) => setDraft({ ...draft, image_url: e.target.value })} /></Field>
        <Field label="Category"><select className={inputClass} value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })}>{['pencil', 'charcoal', 'hyper_realistic', 'couple', 'family', 'celebrity', 'pet', 'custom'].map((item) => <option key={item}>{item}</option>)}</select></Field>
        <Field label="Medium"><select className={inputClass} value={draft.medium} onChange={(e) => setDraft({ ...draft, medium: e.target.value })}>{['pencil', 'charcoal', 'colour'].map((item) => <option key={item}>{item}</option>)}</select></Field>
        <Field label="Size"><input className={inputClass} value={draft.size ?? ''} onChange={(e) => setDraft({ ...draft, size: e.target.value })} /></Field>
        <Field label="Price (₹)"><input type="number" min="0" className={inputClass} value={draft.price ?? 0} onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })} /></Field>
        <Field label="Year"><input type="number" className={inputClass} value={draft.year ?? ''} onChange={(e) => setDraft({ ...draft, year: Number(e.target.value) })} /></Field>
        <Field label="Display order"><input type="number" className={inputClass} value={draft.sort_order} onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })} /></Field>
      </div>
      <div className="mt-4"><Field label="Description"><textarea className={inputClass} rows={3} value={draft.description ?? ''} onChange={(e) => setDraft({ ...draft, description: e.target.value })} /></Field></div>
      <div className="mt-4 flex flex-wrap gap-5 text-sm">{['published', 'featured', 'watermark'].map((key) => <label key={key} className="flex items-center gap-2 capitalize"><input type="checkbox" checked={Boolean(draft[key])} onChange={(e) => setDraft({ ...draft, [key]: e.target.checked })} />{key}</label>)}</div>
      <div className="mt-5 flex gap-3"><button className="inline-flex items-center gap-2 rounded-md bg-stone-900 px-4 py-2.5 text-sm font-medium text-white"><Save className="h-4 w-4" />{editing ? 'Update' : 'Add'} {isPrint ? 'print design' : 'original drawing'}</button>{editing && <button type="button" onClick={cancel} className="rounded-md border border-stone-300 px-4 py-2.5 text-sm">Cancel</button>}</div>
    </form>
    <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{collectionItems.map((item: Artwork) => <article key={item.id} className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm"><img src={item.image_url} alt="" className="h-44 w-full object-cover" /><div className="p-4"><div className="flex justify-between gap-3"><h2 className="font-serif text-xl">{item.title}</h2><span className="text-xs text-stone-500">{item.published ? 'Live' : 'Hidden'}</span></div><p className="mt-1 text-sm text-stone-500">{formatINR(Number(item.price || 0))}</p><div className="mt-4 flex gap-3"><button onClick={() => editItem(item)} className="text-sm font-medium underline">Edit</button><button onClick={() => onDelete(item.id)} className="text-sm font-medium text-red-700 underline">Delete</button></div></div></article>)}</div>
    {!collectionItems.length && <p className="py-12 text-center text-sm text-stone-500">No {collectionLabel.toLowerCase()} yet. Add your first item above.</p>}
  </>;
}

function SettingsManager({ settings, setSettings, onSave }: any) { const labels: Record<string, string> = { artist_name: 'Artist name', brand_name: 'Brand name', tagline: 'Main heading', subtitle: 'Hero subtitle', description: 'Hero description', whatsapp_number: 'WhatsApp number', instagram_url: 'Instagram URL', instagram_handle: 'Instagram handle', email: 'Contact email', phone: 'Phone number', studio_location: 'Studio location', about_intro: 'About introduction', about_style: 'About style', about_inspiration: 'About inspiration', shipping_policy: 'Shipping policy', refund_policy: 'Refund policy', terms_text: 'Terms & conditions', privacy_text: 'Privacy policy' }; const keys = Array.from(new Set([...Object.keys(labels), ...Object.keys(settings)])); return <><SectionTitle eyebrow="Website copy" title="Content & contact details" /><form onSubmit={onSave} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm"><div className="grid gap-5 md:grid-cols-2">{keys.map((key) => <Field key={key} label={labels[key] ?? key}>{['description','about_intro','about_style','about_inspiration','shipping_policy','refund_policy','terms_text','privacy_text'].includes(key) ? <textarea rows={4} className={inputClass} value={settings[key] ?? ''} onChange={(e) => setSettings({ ...settings, [key]: e.target.value })} /> : <input className={inputClass} value={settings[key] ?? ''} onChange={(e) => setSettings({ ...settings, [key]: e.target.value })} />}</Field>)}</div><button className="mt-6 inline-flex items-center gap-2 rounded-md bg-stone-900 px-4 py-2.5 text-sm font-medium text-white"><Save className="h-4 w-4" />Save website content</button></form></>; }

function OrdersManager({ orders, update }: { orders: Order[]; update: (table: 'orders' | 'contact_enquiries', id: string, changes: Record<string, string>) => void }) {
  const label = (value: string) => value.replaceAll('_', ' ');
  const date = (value: string | null) => value ? new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(value)) : 'Not specified';

  return <>
    <SectionTitle eyebrow="Commissions" title="Orders" />
    <div className="space-y-5">{orders.map((item) => <article key={item.id} className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-stone-200 bg-stone-50 p-5 lg:flex-row lg:items-start lg:justify-between">
        <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Order {item.order_number}</p><h2 className="mt-1 font-serif text-3xl">{item.customer_name}</h2><p className="mt-1 text-sm text-stone-500">Received {date(item.created_at)}</p></div>
        <div className="flex flex-wrap items-center gap-4"><p className="font-serif text-2xl">{formatINR(Number(item.final_price ?? item.estimated_price))}</p><label className="text-sm font-medium">Order status <select className="ml-2 rounded border border-stone-300 bg-white px-2 py-1.5 font-normal" value={item.order_status} onChange={(e) => void update('orders', item.id, { order_status: e.target.value })}>{['new', 'payment_pending', 'confirmed', 'drawing_in_progress', 'completed', 'shipped', 'delivered', 'cancelled'].map((value) => <option key={value} value={value}>{label(value)}</option>)}</select></label></div>
      </div>
      <div className="grid gap-7 p-5 lg:grid-cols-3">
        <section><h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Client details</h3><dl className="mt-3 space-y-2 text-sm"><Info label="Email" value={item.email} /><Info label="Phone" value={item.phone} /><Info label="WhatsApp" value={item.whatsapp || 'Not provided'} /></dl></section>
        <section><h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Portrait details</h3><dl className="mt-3 space-y-2 text-sm"><Info label="Medium" value={label(item.medium)} /><Info label="Size" value={item.size.toUpperCase()} /><Info label="People" value={`${item.people_count} ${item.people_count === 1 ? 'person' : 'people'}`} /><Info label="Framing" value={label(item.framing)} /></dl></section>
        <section><h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Timeline & payment</h3><dl className="mt-3 space-y-2 text-sm"><Info label="Timeline" value={label(item.deadline_type)} /><Info label="Preferred date" value={date(item.deadline_date)} /><Info label="Payment" value={label(item.payment_status)} /></dl></section>
        <section className="lg:col-span-2"><h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Delivery address</h3><p className="mt-3 whitespace-pre-line text-sm leading-6 text-stone-700">{[item.address, item.city, item.state, item.pincode].filter(Boolean).join('\n')}</p></section>
        <section><h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-500">Special instructions</h3><p className="mt-3 whitespace-pre-line text-sm leading-6 text-stone-700">{item.special_instructions || 'No special instructions provided.'}</p></section>
      </div>
    </article>)}{!orders.length && <p className="py-16 text-center text-stone-500">No commission requests yet.</p>}</div>
  </>;
}

function Info({ label, value }: { label: string; value: string }) { return <div className="flex justify-between gap-4 border-b border-stone-100 pb-2 last:border-0"><dt className="text-stone-500">{label}</dt><dd className="text-right font-medium capitalize">{value}</dd></div>; }

function EnquiryManager({ enquiries, update }: { enquiries: ContactEnquiry[]; update: (table: 'orders' | 'contact_enquiries', id: string, changes: Record<string, string>) => void }) { return <><SectionTitle eyebrow="Inbox" title="Contact queries" /><div className="space-y-4">{enquiries.map((item) => <article key={item.id} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm"><div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="font-serif text-2xl">{item.subject}</h2><p className="mt-1 text-sm text-stone-500">{item.name} · <a className="underline" href={`mailto:${item.email}`}>{item.email}</a>{item.phone ? ` · ${item.phone}` : ''}</p></div><select className="rounded border border-stone-300 bg-white px-2 py-1.5 text-sm" value={item.status} onChange={(e) => void update('contact_enquiries', item.id, { status: e.target.value })}>{['new','read','responded','archived'].map((x) => <option key={x}>{x}</option>)}</select></div><p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-stone-700">{item.message}</p></article>)}{!enquiries.length && <p className="py-12 text-center text-stone-500">No contact queries yet.</p>}</div></>; }
