
import React, { useState, useRef, useMemo } from 'react';
import { GeminiService } from './services/geminiService';
import { marked } from 'marked';
import { Golongan } from './types';
import { 
  ClipboardDocumentIcon, 
  ArrowPathIcon, 
  CheckCircleIcon,
  CalendarIcon,
  BriefcaseIcon,
  CpuChipIcon,
  PaperClipIcon,
  XMarkIcon,
  DocumentArrowUpIcon,
  ShieldCheckIcon,
  PresentationChartBarIcon,
  SparklesIcon,
  UserIcon,
  IdentificationIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline';

const GOLONGAN_OPTIONS: Golongan[] = [
  'II/a', 'II/b', 'II/c', 'II/d',
  'III/a', 'III/b', 'III/c', 'III/d',
  'IV/a', 'IV/b', 'IV/c', 'IV/d'
];

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<string>('');
  const [topic, setTopic] = useState<string>('');
  const [jabatan, setJabatan] = useState<string>('Pengendali Ekosistem Hutan');
  const [golongan, setGolongan] = useState<Golongan>('II/a');
  const [includeFullPackage, setIncludeFullPackage] = useState<boolean>(true);
  const [copied, setCopied] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        alert("Hanya file PDF yang diperbolehkan.");
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        setFileBase64(base64String);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setFileBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleGenerate = async () => {
    if (!topic && !file) {
      alert("Masukkan topik atau unggah dokumen disposisi/surat.");
      return;
    }
    
    setLoading(true);
    setCopied(false);
    try {
      const gemini = new GeminiService();
      
      let prompt = `TAHAP AWAL - IDENTIFIKASI PENGGUNA:
      - Jabatan Fungsional: ${jabatan}
      - Golongan/Pangkat: ${golongan}
      
      MASUKAN KEGIATAN: ${topic || 'Menganalisis dokumen PDF terlampir'}.
      
      INSTRUKSI KHUSUS:
      ${includeFullPackage 
        ? "Susun Paket Lengkap: Laporan Harian (Tabel), Rekap Mingguan, dan Rekap Bulanan." 
        : "Susun Laporan Harian saja dalam bentuk tabel."}
      
      Patuhi seluruh Logika Kepatutan Tugas, Level Kecakapan, dan Beban Kerja (8 Jam) sesuai profil di atas.`;

      if (file) {
        prompt += `\n\nEkstrak detail dari PDF untuk memperkaya uraian tugas teknis yang pantas untuk ${jabatan} ${golongan}.`;
      }
      
      const pdfData = fileBase64 ? { data: fileBase64, mimeType: 'application/pdf' } : undefined;
      const result = await gemini.generateReport(prompt, pdfData);
      setReport(result);
    } catch (err) {
      alert("Terjadi kesalahan saat menghubungi server.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderedReport = useMemo(() => {
    if (!report) return null;
    return marked.parse(report);
  }, [report]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f4f8]">
      {/* Header */}
      <header className="bg-white text-emerald-900 shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-emerald-600 p-2.5 rounded-2xl shadow-emerald-200 shadow-lg transform rotate-3 transition-transform hover:rotate-0">
              <SparklesIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="heading-font text-2xl font-black tracking-tight uppercase leading-none">MASRIAN</h1>
              <p className="text-xs font-bold text-emerald-700/80 -mt-0.5 leading-tight italic">Master Laporan Harian</p>
              <p className="text-[9px] text-slate-400 uppercase tracking-[0.2em] font-black mt-1">#jangan sampai dipotong</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-2">
             <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sistem Inteligensi ASN</span>
                <span className="text-sm font-bold text-slate-700 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100 text-emerald-700">Tahap Identifikasi Aktif</span>
             </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-1 space-y-8">
          <section className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white p-7 transition-all hover:shadow-2xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-emerald-100 p-2 rounded-xl">
                <CpuChipIcon className="w-5 h-5 text-emerald-600" />
              </div>
              <h2 className="heading-font text-xl font-extrabold text-slate-800 tracking-tight">Identitas Pegawai</h2>
            </div>
            
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Golongan</label>
                  <div className="relative group">
                    <IdentificationIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    <select 
                      value={golongan}
                      onChange={(e) => setGolongan(e.target.value as Golongan)}
                      className="w-full pl-10 pr-4 py-3 text-sm font-bold bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer"
                    >
                      {GOLONGAN_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Jabatan</label>
                  <div className="relative group">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    <input 
                      type="text"
                      value={jabatan}
                      onChange={(e) => setJabatan(e.target.value)}
                      placeholder="Misal: PEH"
                      className="w-full pl-10 pr-4 py-3 text-sm font-bold bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Konfigurasi Output</label>
                <div className="flex bg-slate-100 p-1 rounded-2xl">
                  <button 
                    onClick={() => setIncludeFullPackage(false)}
                    className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${!includeFullPackage ? 'bg-white shadow-sm text-emerald-700' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    Harian Saja
                  </button>
                  <button 
                    onClick={() => setIncludeFullPackage(true)}
                    className={`flex-1 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${includeFullPackage ? 'bg-white shadow-sm text-emerald-700' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    Paket Lengkap
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Input Kerja (PDF/Teks)</label>
                {!file ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="group border-2 border-dashed border-slate-200 rounded-[2rem] p-6 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50 transition-all duration-300 active:scale-95 bg-slate-50/30"
                  >
                    <DocumentArrowUpIcon className="w-6 h-6 text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
                    <span className="text-[9px] font-black text-slate-400 group-hover:text-emerald-700 uppercase tracking-wider">Unggah Disposisi</span>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".pdf" className="hidden" />
                  </div>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3 flex items-center justify-between shadow-inner">
                    <div className="flex items-center space-x-2 overflow-hidden">
                      <PaperClipIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-[11px] font-bold text-emerald-800 truncate">{file.name}</span>
                    </div>
                    <button onClick={removeFile} className="p-1.5 hover:bg-white rounded-full text-emerald-600 shadow-sm">
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <textarea 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Ceritakan aktivitas hari ini..."
                  className="w-full h-28 mt-4 px-5 py-4 text-sm font-medium border border-slate-100 bg-slate-50/50 rounded-[1.5rem] focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 focus:bg-white transition-all outline-none placeholder:text-slate-300 shadow-inner"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={loading || (!topic && !file)}
                className="w-full group bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-black py-4 rounded-full flex items-center justify-center space-x-3 transition-all duration-300 disabled:opacity-50 shadow-lg shadow-emerald-600/30 active:scale-95"
              >
                {loading ? (
                  <>
                    <ArrowPathIcon className="w-6 h-6 animate-spin" />
                    <span className="tracking-wide uppercase">Memproses Inteligensi...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheckIcon className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                    <span className="tracking-wide uppercase">Susun Laporan</span>
                  </>
                )}
              </button>
            </div>
          </section>

          <section className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-[2rem] p-6 text-white shadow-xl shadow-indigo-200">
            <h3 className="font-black text-[10px] mb-4 flex items-center tracking-widest uppercase">
              <Squares2X2Icon className="w-5 h-5 mr-2" />
              Sistem Klasifikasi ASN
            </h3>
            <div className="space-y-3">
              <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/10">
                <p className="text-[10px] font-bold leading-relaxed text-indigo-50">
                  <span className="text-white block font-black mb-0.5">Automated Mapping</span>
                  Identifikasi kategori Jabatan & Golongan secara internal.
                </p>
              </div>
              <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/10">
                <p className="text-[10px] font-bold leading-relaxed text-indigo-50">
                  <span className="text-white block font-black mb-0.5">Context Locking</span>
                  Menjaga konsistensi narasi harian hingga bulanan.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-white flex flex-col h-full overflow-hidden min-h-[750px]">
            <div className="bg-white border-b border-slate-100 px-8 py-5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-slate-100 p-2 rounded-xl">
                  <CalendarIcon className="w-5 h-5 text-slate-500" />
                </div>
                <h2 className="heading-font text-lg font-black text-slate-800 tracking-tight">Draf Kinerja Terintegrasi</h2>
              </div>
              
              {report && (
                <button 
                  onClick={copyToClipboard}
                  className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest px-6 py-3 bg-emerald-50 text-emerald-700 rounded-full hover:bg-emerald-100 transition-all shadow-sm active:scale-95"
                >
                  {copied ? (
                    <>
                      <CheckCircleIcon className="w-4 h-4" />
                      <span>Berhasil!</span>
                    </>
                  ) : (
                    <>
                      <ClipboardDocumentIcon className="w-4 h-4" />
                      <span>Salin Semua</span>
                    </>
                  )}
                </button>
              )}
            </div>
            
            <div className="flex-1 p-8 overflow-y-auto bg-white custom-scroll">
              {report ? (
                <div 
                  className="prose prose-sm max-w-none text-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-500"
                  dangerouslySetInnerHTML={{ __html: renderedReport as string }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-slate-300 space-y-6 py-20">
                  <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 shadow-inner">
                    <BriefcaseIcon className="w-20 h-20 opacity-20" />
                  </div>
                  <div className="text-center space-y-3">
                    <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">Menunggu Inisialisasi</p>
                    <p className="text-[11px] font-medium text-slate-400/80 max-w-sm px-6 leading-relaxed">
                      Sistem MASRIAN akan mengidentifikasi profil Anda dan menyusun laporan terpadu yang aman secara administratif.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center">
          <div className="bg-white/80 backdrop-blur-md px-8 py-2 rounded-full border border-white shadow-sm flex items-center space-x-4">
            <p className="text-[9px] text-slate-400 uppercase tracking-[0.5em] font-black">
              go_one_tech @ 2026
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
