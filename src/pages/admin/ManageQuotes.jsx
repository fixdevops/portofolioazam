import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import Layout from '../../components/Layout';
import { Search, Pencil, Trash2, X, Save, Quote, Plus } from 'lucide-react';

const emptyForm = { text: '', author: '', status: 'active' };

const ManageQuotes = () => {
  const [quotes, setQuotes]       = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modal, setModal]         = useState(null); // null | 'add' | quote object
  const [form, setForm]           = useState(emptyForm);
  const [saving, setSaving]       = useState(false);

  const fetchQuotes = async () => {
    let query = supabase.from('my_quotes').select('*').order('created_at', { ascending: false });
    if (statusFilter !== 'all') query = query.eq('status', statusFilter);
    const { data, error } = await query;
    if (!error) setQuotes(data || []);
  };

  useEffect(() => { fetchQuotes(); }, [statusFilter]);

  const filteredQuotes = quotes.filter(q =>
    !searchTerm ||
    q.text?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    q.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAdd  = () => { setForm(emptyForm); setModal('add'); };
  const openEdit = (q) => { setForm({ text: q.text, author: q.author || '', status: q.status }); setModal(q); };
  const closeModal = () => { setModal(null); setSaving(false); };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        text:       form.text,
        author:     form.author,
        status:     form.status,
        updated_at: new Date().toISOString(),
      };
      if (modal === 'add') {
        const { error } = await supabase.from('my_quotes').insert([{ ...payload, created_at: new Date().toISOString() }]);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('my_quotes').update(payload).eq('id', modal.id);
        if (error) throw error;
      }
      await fetchQuotes();
      closeModal();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleStatusToggle = async (id, current) => {
    const next = current === 'active' ? 'inactive' : 'active';
    await supabase.from('my_quotes').update({ status: next, updated_at: new Date().toISOString() }).eq('id', id);
    setQuotes(qs => qs.map(q => q.id === id ? { ...q, status: next } : q));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus quote ini?')) return;
    await supabase.from('my_quotes').delete().eq('id', id);
    setQuotes(qs => qs.filter(q => q.id !== id));
  };

  return (
    <Layout>
      <div className="min-h-screen">

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari quote atau author..."
              className="w-full py-2.5 pl-9 pr-4 rounded-lg border border-gray-200 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className="w-full sm:w-44 p-2.5 rounded-lg border border-gray-200 bg-white text-gray-800 text-sm"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="all">Semua Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button
            onClick={openAdd}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gray-800 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors flex-shrink-0"
          >
            <Plus size={14} /> Tambah Quote
          </button>
        </div>

        {/* Modal Tambah / Edit */}
        {modal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold flex items-center gap-2 text-gray-800">
                    {modal === 'add'
                      ? <><Plus size={15} className="text-gray-500" /> Tambah Quote</>
                      : <><Pencil size={15} className="text-gray-500" /> Edit Quote</>
                    }
                  </h2>
                  <button onClick={closeModal} className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                    <X size={15} />
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quote <span className="text-red-400">*</span></label>
                    <textarea
                      rows={4} required
                      placeholder="Tulis quote di sini..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 resize-none"
                      value={form.text}
                      onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                    <input
                      type="text"
                      placeholder="Nama penulis / sumber..."
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                      value={form.author}
                      onChange={e => setForm(f => ({ ...f, author: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
                      value={form.status}
                      onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button type="button" onClick={closeModal}
                      className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-1.5 transition-colors">
                      <X size={13} /> Batal
                    </button>
                    <button type="submit" disabled={saving}
                      className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-700 flex items-center gap-1.5 transition-colors disabled:opacity-50">
                      <Save size={13} /> {saving ? 'Menyimpan...' : 'Simpan'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Tabel */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 bg-gray-100 p-3 font-medium text-gray-700 text-xs">
            <div className="col-span-8 sm:col-span-7">Quote</div>
            <div className="col-span-4 sm:col-span-3">Author</div>
            <div className="hidden sm:block sm:col-span-1">Status</div>
            <div className="hidden sm:block sm:col-span-1">Aksi</div>
          </div>

          {filteredQuotes.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <Quote size={28} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">Belum ada quotes. Klik "Tambah Quote" untuk mulai.</p>
            </div>
          ) : (
            filteredQuotes.map(q => (
              <div key={q.id} className="grid grid-cols-12 p-3 border-b border-gray-100 hover:bg-gray-50 items-center">
                <div className="col-span-8 sm:col-span-7 text-sm text-gray-800 line-clamp-2 pr-2">
                  "{q.text}"
                </div>
                <div className="col-span-2 sm:col-span-3 text-xs text-gray-500 truncate pr-2">
                  {q.author || <span className="italic text-gray-300">—</span>}
                </div>

                {/* Mobile actions */}
                <div className="col-span-2 sm:hidden flex flex-col gap-1 items-end">
                  <button onClick={() => openEdit(q)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                    <Pencil size={13} />
                  </button>
                  <button onClick={() => handleDelete(q.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>

                {/* Desktop: status toggle */}
                <div className="hidden sm:block sm:col-span-1">
                  <button
                    onClick={() => handleStatusToggle(q.id, q.status)}
                    className={`text-xs px-2 py-1 rounded-full font-medium transition-colors ${
                      q.status === 'active'
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {q.status === 'active' ? 'Active' : 'Inactive'}
                  </button>
                </div>

                {/* Desktop: edit & delete */}
                <div className="hidden sm:flex sm:col-span-1 items-center gap-1.5">
                  <button onClick={() => openEdit(q)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors">
                    <Pencil size={13} />
                  </button>
                  <button onClick={() => handleDelete(q.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </Layout>
  );
};

export default ManageQuotes;
