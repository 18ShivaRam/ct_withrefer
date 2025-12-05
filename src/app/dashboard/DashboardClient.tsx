'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { FaFileAlt, FaComments, FaBell } from 'react-icons/fa';
import dynamic from 'next/dynamic';
import imageCompression from 'browser-image-compression';
const FaEye = dynamic(() => import('react-icons/fa').then(m => m.FaEye), { ssr: false });
const FaDownload = dynamic(() => import('react-icons/fa').then(m => m.FaDownload), { ssr: false });
const FaCalendarAlt = dynamic(() => import('react-icons/fa').then(m => m.FaCalendarAlt), { ssr: false });

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState<string | null>(null);

  // Upload panel state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const currentYear = new Date().getFullYear();
  const years = [currentYear,currentYear - 1, currentYear - 2, currentYear - 3];
  const [selectedYear, setSelectedYear] = useState<number>(years[0]);

  // new state for recent documents
  const [recentFiles, setRecentFiles] = useState<any[]>([]);
  const [recentLoading, setRecentLoading] = useState(false);
  const [viewAll, setViewAll] = useState(false);
  const [selectedFinancialYear, setSelectedFinancialYear] = useState<number | null>(null);

  // preview modal state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState<string | null>(null);
  // previewType: 'image' | 'pdf' | 'office' | 'other'
  const [previewType, setPreviewType] = useState<'image'|'pdf'|'office'|'other'>('image');
  // Referral modal state
  const [referralOpen, setReferralOpen] = useState(false);
  const [refName, setRefName] = useState('');
  const [refEmail, setRefEmail] = useState('');
  const [refPhone, setRefPhone] = useState('');
  const [refSubmitting, setRefSubmitting] = useState(false);
  const [refError, setRefError] = useState<string | null>(null);
  const [refSuccess, setRefSuccess] = useState<string | null>(null);
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const officeExtensions = ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'];

  // debug helpers
  const [debugMode, setDebugMode] = useState(false);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const addLog = (msg: string, obj?: any) => {
    try { console.debug(msg, obj); } catch (e) {}
    const line = `${new Date().toISOString()} - ${msg}${obj ? ' - ' + (typeof obj === 'string' ? obj : JSON.stringify(obj, Object.getOwnPropertyNames(obj))) : ''}`;
    setDebugLogs((prev) => [line, ...prev].slice(0, 100));
  };

  useEffect(() => {
    checkUser();
  }, []);

  // fetch recent uploaded documents for current user
  const fetchRecent = async () => {
    try {
      setRecentLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id || user?.id;
      if (!userId) {
        setRecentFiles([]);
        return;
      }
      const { data, error } = await supabase
        .from('uploaded_documents')
        .select('*')
        .eq('user_id', userId)
        .order('upload_date', { ascending: false })
        .limit(100);
      if (error) throw error;
      setRecentFiles(data || []);
    } catch (err) {
      console.error('Error fetching recent documents:', err);
    } finally {
      setRecentLoading(false);
    }
  };

  // fetch recent files when user is set (so files from previous sessions show on login)
  useEffect(() => {
    if (user) fetchRecent();
  }, [user]);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }
      setUser(user);
    } catch (error) {
      console.error('Error checking user:', error);
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setSelectedFiles(files);
  };

  const handleSubmitFiles = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select files to upload.');
      return;
    }
    setUploading(true);
    addLog('Starting upload', { fileCount: selectedFiles.length, selectedYear });

    try {
      // Ensure we have a fresh session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session found. Please sign in again.');
      }

      const userId = session.user.id;
      if (!userId) {
        throw new Error('User ID not found in session');
      }

      addLog('Using authenticated user', {
        userId,
        email: session.user.email,
        sessionExpires: new Date(session.expires_at! * 1000).toISOString()
      });

      // Upload via server API to bypass client-side RLS
      for (let i = 0; i < selectedFiles.length; i++) {
        let file = selectedFiles[i];
        
        // Compress image if applicable
        if (file.type.startsWith('image/')) {
          try {
            addLog('Compressing image', { name: file.name, originalSize: file.size });
            const options = {
              maxSizeMB: 1,
              maxWidthOrHeight: 1920,
              useWebWorker: true,
            };
            const compressedFile = await imageCompression(file, options);
            addLog('Image compressed', { name: file.name, newSize: compressedFile.size });
            // Create a new File object to preserve the name
            file = new File([compressedFile], file.name, { type: file.type });
          } catch (error) {
            console.error('Image compression failed:', error);
            addLog('Image compression failed, using original', { error });
          }
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', userId);
        formData.append('financialYear', String(selectedYear));

        addLog('Calling /api/upload for file', { name: file.name, size: file.size, type: file.type });

        const resp = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        const contentType = resp.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const json = await resp.json();
          addLog('Server upload response', { status: resp.status, json });
          if (!resp.ok) {
            throw new Error(json?.error || `Upload failed with status ${resp.status}`);
          }
        } else {
          const text = await resp.text();
          addLog('Server upload non-JSON response', { status: resp.status, sample: text.slice(0, 200) });
          if (!resp.ok) {
            throw new Error(`Upload failed (non-JSON): status ${resp.status}`);
          }
        }

        setUploadProgress(Math.round(((i + 1) / selectedFiles.length) * 100));
      }

      setSelectedFiles([]);
      addLog('All files uploaded successfully');
      alert('Files uploaded successfully.');
      // refresh list after successful upload
      fetchRecent();
    } catch (err: any) {
      addLog('Upload error caught', err);
      console.error('Upload error:', err);
      const message = err?.message || err?.msg || JSON.stringify(err) || 'Unknown error';
      alert(`Error uploading files: ${message}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    setSignOutError(null);
    try {
      await supabase.auth.signOut();
      router.push('/auth/login');
    } catch (error: any) {
      console.error('Error signing out:', error);
      setSignOutError(error?.message || 'Error signing out');
    } finally {
      setSigningOut(false);
    }
  };

  // helper: request signed url from server for a given storage path
  const requestSignedUrl = async (storagePath: string) => {
    try {
      const res = await fetch('/api/signed-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: storagePath })
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Signed-url request failed: ${res.status} ${txt}`);
      }
      const json = await res.json();
      return json?.signedUrl || null;
    } catch (err) {
      console.error('requestSignedUrl error', err);
      return null;
    }
  };

  // open preview: derive storage path and get signed URL then open modal
  const handleView = async (file: any) => {
    let storagePath: string | null = null;
    try {
      if (file.file_url) {
        const idx = file.file_url.indexOf('/user-documents/');
        if (idx >= 0) {
          storagePath = file.file_url.slice(idx + '/user-documents/'.length);
        }
      }
      if (!storagePath && (file.storage_path || file.path)) {
        storagePath = file.storage_path || file.path;
      }
      if (!storagePath) {
        console.error('Cannot determine storage path for file', file);
        alert('Cannot preview this file (storage path missing).');
        return;
      }

      addLog('Requesting signed URL for', storagePath);
      const signed = await requestSignedUrl(storagePath);
      if (!signed) {
        alert('Could not get preview URL.');
        return;
      }

      const nameOrPath = (file.file_name || storagePath).toString();
      const lower = nameOrPath.toLowerCase();
      // determine preview type
      if (imageExtensions.some(ext => lower.endsWith(ext))) {
        setPreviewType('image');
        setPreviewUrl(signed);
      } else if (lower.endsWith('.pdf')) {
        setPreviewType('pdf');
        setPreviewUrl(signed);
      } else if (officeExtensions.some(ext => lower.endsWith(ext))) {
        setPreviewType('office');
        // Office viewer requires a publicly accessible URL; signedUrl works for short time
        const officeViewer = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(signed)}`;
        setPreviewUrl(officeViewer);
      } else {
        setPreviewType('other');
        setPreviewUrl(signed);
      }

      setPreviewName(`${(file.file_name || storagePath)}${file.uploaded_by_admin ? ' (Admin)' : ''}`);
      setPreviewOpen(true);
    } catch (err) {
      console.error('handleView error', err);
      alert('Error preparing preview.');
    }
  };

  const handleDownload = async (file: any) => {
    // reuse same signed-url flow and trigger download
    let storagePath: string | null = null;
    if (file.file_url) {
      const idx = file.file_url.indexOf('/user-documents/');
      if (idx >= 0) storagePath = file.file_url.slice(idx + '/user-documents/'.length);
    }
    if (!storagePath && (file.storage_path || file.path)) storagePath = file.storage_path || file.path;
    if (!storagePath) {
      alert('Cannot download this file (storage path missing).');
      return;
    }
    const signed = await requestSignedUrl(storagePath);
    if (!signed) {
      alert('Could not get download URL.');
      return;
    }
    // force download
    const a = document.createElement('a');
    a.href = signed;
    a.download = `${(file.file_name || 'download')}${file.uploaded_by_admin ? ' (Admin)' : ''}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleReferralSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRefError(null);
    setRefSuccess(null);
    if (!refName.trim()) {
      setRefError('Name is required');
      return;
    }
    try {
      setRefSubmitting(true);
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id || user?.id;
      if (!userId) throw new Error('Not authenticated');
      const payload = {
        name: refName.trim(),
        email: refEmail.trim() || null,
        phone: refPhone.trim() || null,
        referred_by: userId,
        created_at: new Date().toISOString(),
      };
      const { data: inserted, error: insertError } = await supabase
        .from('referrals')
        .insert([payload])
        .select();
      if (insertError) throw insertError;
      setRefSuccess('Referral submitted successfully');
      setRefName('');
      setRefEmail('');
      setRefPhone('');
      // Optionally auto-close after success
      setTimeout(() => setReferralOpen(false), 1500);
    } catch (err: any) {
      console.error('Submit referral error', err);
      setRefError(err?.message || 'Failed to submit referral');
    } finally {
      setRefSubmitting(false);
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#006666] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // derive a friendly display name from available metadata
  const displayName = (
    user?.user_metadata?.first_name ||
    user?.user_metadata?.full_name ||
    (user?.email ? user.email.split('@')[0] : null) ||
    'Client'
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="bg-[#006666] text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Welcome, {displayName}</h1>
              <p className="text-green-100">Manage your tax documents and communications</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setReferralOpen(true)}
                className="px-4 py-2 bg-white text-[#006666] rounded hover:bg-green-50 transition-colors"
              >
                Refer a Friend
              </button>
            </div>
          </div>
        </div>
      </div>

      {signOutError && (
        <div className="container mx-auto px-4 mt-2">
          <div className="bg-red-50 text-red-700 text-sm rounded px-3 py-2 inline-block">{signOutError}</div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
        >
        
          {/* Upload Documents (always visible) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6 mb-8"
          >
            <div className="mb-4 text-center">
              <FaFileAlt className="text-4xl text-[#087830] mx-auto mb-2" />
              <h2 className="text-lg font-semibold text-gray-900">Upload Documents</h2>
              <p className="text-sm text-gray-600">Submit your tax documents securely</p>
            </div>

            {/* <div className="flex items-center justify-end gap-2 mb-4">
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={debugMode} onChange={() => setDebugMode(!debugMode)} />
                Debug mode
              </label>
            </div> */}

            <label className="block mb-3 text-gray-800">
              <span className="text-sm text-gray-700">Select Financial Year</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="mt-1 block w-48 rounded-md border border-gray-300 bg-white text-gray-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#006666]"
              >
                {years.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </label>

            <label className="block mb-4 text-gray-800">
              <span className="text-sm text-gray-700">Upload documents</span>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="mt-2 block w-full text-gray-700 bg-white border border-gray-300 rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-[#006666]"
              />
            </label>

            {selectedFiles.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-800 mb-2">Selected files</h4>
                <ul className="list-disc ml-6 text-gray-700">
                  {selectedFiles.map((f, i) => (
                    <li key={i}>{f.name} ({Math.round(f.size / 1024)} KB)</li>
                  ))}
                </ul>
              </div>
            )}

            {uploading && (
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-1">Uploading... {uploadProgress}%</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div style={{ width: `${uploadProgress}%` }} className="bg-[#006666] h-2 rounded-full"></div>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSubmitFiles}
                disabled={uploading || selectedFiles.length === 0}
                className="bg-[#006666] text-white px-4 py-2 rounded disabled:opacity-50 border border-transparent hover:border-[#005a5a] transition-colors"
              >
                {uploading ? 'Uploading...' : 'Submit'}
              </button>
              <button
                onClick={() => setSelectedFiles([])}
                disabled={uploading}
                className="px-4 py-2 border border-gray-300 rounded bg-white text-gray-900 hover:bg-gray-50"
              >
                Clear
              </button>
            </div>
          </motion.div>
          
          {/* Debug panel (visible when debugMode) */}
          {debugMode && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-black/5 rounded-md p-4 mb-8">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium text-gray-800">Debug logs (latest first)</h4>
                <button onClick={() => setDebugLogs([])} className="text-sm text-gray-500">Clear</button>
              </div>
              <div className="max-h-60 overflow-auto bg-gray-100 p-2 rounded text-xs">
                {debugLogs.length === 0 ? <div className="text-gray-500">No logs yet</div> : (
                  <pre className="whitespace-pre-wrap text-xs text-gray-800">{debugLogs.join('\n\n')}</pre>
                )}
              </div>
            </motion.div>
          )}

          {/* Recent Documents - Financial Year Grouping */}
          <motion.div variants={fadeIn} className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recent Documents</h2>
              <div className="text-sm text-gray-600">
                {recentLoading ? 'Loading...' : `${recentFiles.length} document${recentFiles.length !== 1 ? 's' : ''}`}
              </div>
            </div>

            {recentFiles.length === 0 ? (
              <div className="text-gray-600">No documents found</div>
            ) : (
              <div className="space-y-4">
                {/* Group files by financial year */}
                {(() => {
                  // Group files by financial year
                  const groupedByYear: Record<number, any[]> = {};
                  recentFiles.forEach(file => {
                    const year = file.financial_year || new Date(file.upload_date).getFullYear();
                    if (!groupedByYear[year]) {
                      groupedByYear[year] = [];
                    }
                    groupedByYear[year].push(file);
                  });

                  // Sort years in descending order
                  const sortedYears = Object.keys(groupedByYear)
                    .map(Number)
                    .sort((a, b) => b - a);

                  return sortedYears.map(year => (
                    <div key={year} className="border border-gray-200 rounded-lg overflow-hidden">
                      <button 
                        onClick={() => setSelectedFinancialYear(selectedFinancialYear === year ? null : year)}
                        className="w-full flex items-center justify-between bg-gray-50 p-3 hover:bg-gray-100 transition-colors"
                      >
                        <div className="font-medium text-gray-900 flex items-center">
                          <FaCalendarAlt className="mr-2 text-[#006666]" />
                          Financial Year {year}
                        </div>
                        <div className="text-sm text-gray-600">
                          {groupedByYear[year].length} document{groupedByYear[year].length !== 1 ? 's' : ''}
                        </div>
                      </button>
                      
                      {/* Show files for selected year */}
                      {selectedFinancialYear === year && (
                        <div className="divide-y divide-gray-100">
                          {groupedByYear[year].map((f: any) => (
                            <div
                              key={f.id || f.file_url}
                              className={`flex items-center justify-between p-3 ${f.uploaded_by_admin ? 'bg-blue-50' : ''}`}
                            >
                              <div>
                                <div className="font-medium text-gray-900 flex items-center">
                                  {`${f.file_name}${f.uploaded_by_admin ? ' (Admin)' : ''}`}
                                  {f.uploaded_by_admin && (
                                    <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                                      Admin Upload
                                    </span>
                                  )}
                                </div>
                                <div className="text-xs text-gray-600">{new Date(f.upload_date).toLocaleString()}</div>
                              </div>
                              <div className="flex items-center gap-3">
                                <button title="Preview" onClick={() => handleView(f)} className="p-2 rounded hover:bg-gray-100">
                                  <FaEye className="text-gray-700" />
                                </button>
                                <button title="Download" onClick={() => handleDownload(f)} className="p-2 rounded hover:bg-gray-100">
                                  <FaDownload className="text-gray-700" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ));
                })()}
              </div>
            )}
          </motion.div>

          {/* Preview modal */}
          {previewOpen && previewUrl && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/60" onClick={() => setPreviewOpen(false)} />
              <div className="relative bg-white rounded-lg shadow-lg max-w-3xl w-full mx-4 p-4 z-10">
                <div className="flex justify-between items-center mb-2 text-black">
                  <div className="font-medium ">{previewName}</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        if (!previewUrl) return;
                        const a = document.createElement('a');
                        // for office viewer, previewUrl is the viewer URL; download direct signed url when possible
                        const downloadUrl = previewType === 'office'
                          ? null
                          : previewUrl;
                        if (downloadUrl) {
                          a.href = downloadUrl;
                          a.download = previewName || 'download';
                          document.body.appendChild(a);
                          a.click();
                          a.remove();
                        } else {
                          // if office preview, ask server for signed url again for direct download
                          alert('Download not available from viewer. Please use the Download icon in the list.');
                        }
                      }}
                      className="px-3 py-1 border rounded"
                    >
                      Download
                    </button>
                    
                    </div>
                </div>
                <div className="max-h-[70vh] overflow-auto flex items-center justify-center">
                  {previewType === 'image' && (
                    <div className="max-h-[70vh]">
                      <Image
                        src={previewUrl || ''}
                        alt={previewName || 'preview'}
                        width={1200}
                        height={800}
                        unoptimized
                        className="object-contain"
                      />
                    </div>
                  )}
                  {previewType === 'pdf' && (
                    <iframe src={previewUrl} title={previewName || 'preview'} className="w-full h-[60vh]" />
                  )}
                  {previewType === 'office' && (
                    // office viewer embed
                    <iframe src={previewUrl} title={previewName || 'office-preview'} className="w-full h-[70vh]" />
                  )}
                  {previewType === 'other' && (
                    <div className="p-6 text-center">
                      <p className="mb-4">Preview not available for this file type.</p>
                      <a href={previewUrl || '#'} className="text-[#006666] underline" target="_blank" rel="noreferrer">Open / Download file</a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Referral modal */}
          {referralOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/60" onClick={() => setReferralOpen(false)} />
              <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-4 z-10">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-xl font-semibold text-black">Refer a Friend</div>
                  <button onClick={() => setReferralOpen(false)} className="px-3 py-1 border rounded text-black bg-white z-50 relative">Close</button>
                </div>
                <form onSubmit={handleReferralSubmit} className="space-y-4 text-black">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Name *</label>
                    <input
                      type="text"
                      value={refName}
                      onChange={(e) => setRefName(e.target.value)}
                      required
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#006666] text-black"
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Email</label>
                    <input
                      type="email"
                      value={refEmail}
                      onChange={(e) => setRefEmail(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#006666]"
                      placeholder="name@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">Phone</label>
                    <input
                      type="tel"
                      value={refPhone}
                      onChange={(e) => setRefPhone(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#006666]"
                      placeholder="Phone number"
                    />
                  </div>

                  {refError && <div className="bg-red-50 text-red-700 p-3 rounded">{refError}</div>}
                  {refSuccess && <div className="bg-green-50 text-green-700 p-3 rounded">{refSuccess}</div>}

                  <button
                    type="submit"
                    disabled={refSubmitting}
                    className={`w-full px-4 py-2 bg-[#006666] text-white rounded hover:bg-[#005a5a] transition-colors ${refSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {refSubmitting ? 'Submitting…' : 'Submit Referral'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}