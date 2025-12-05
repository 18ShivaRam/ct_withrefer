'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { FaEye, FaDownload, FaUpload, FaArrowLeft, FaCalendarAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
// removed experimental React use() import; params are passed directly

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function UserDetailsPage({ id }: { id: string }) {
  const router = useRouter();
  const userId = id;
  
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [userFiles, setUserFiles] = useState<any[]>([]);
  const [selectedFinancialYear, setSelectedFinancialYear] = useState<number | null>(null);
  const [uploadingYear, setUploadingYear] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewType, setPreviewType] = useState<'image' | 'pdf' | 'office' | 'other'>('other');

  // Supported extensions for preview handling
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];
  const officeExtensions = ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'];
  
  // Toggle financial year expansion
  const toggleFinancialYear = (year: number) => {
    setSelectedFinancialYear(selectedFinancialYear === year ? null : year);
  };
  
  // Handle upload button click
  const handleUploadClick = (year: number) => {
    setUploadingYear(year);
    // Trigger the hidden file input
    const fileInput = document.getElementById(`file-upload-${year}`) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  };

  // Check admin access and fetch user details
  useEffect(() => {
    const checkAdminAndFetchUser = async () => {
      if (!userId) {
        console.error('Missing user id in route');
        router.push('/admin/clients');
        return;
      }
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/admin/login');
        return;
      }

      const { data: adminData } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .single();

      if (!adminData || !adminData.is_admin) {
        // Sign out and redirect to admin login
        await supabase.auth.signOut();
        router.push('/admin/login');
        return;
      }

      // Fetch user details via server API (service role) to bypass RLS
      try {
        const resp = await fetch(`/api/admin/profile?id=${encodeURIComponent(userId)}`);
        if (!resp.ok) {
          const j = await resp.json().catch(() => ({}));
          throw new Error(j.error || `Profile fetch failed: ${resp.status}`);
        }
        const j = await resp.json();
        setUserDetails(j.profile);
      } catch (err) {
        console.error('Error fetching user via API:', err);
        router.push('/admin');
        return;
      }
      fetchUserFiles();
    };

    checkAdminAndFetchUser();
  }, [router, userId]);

  // Fetch user files
  const fetchUserFiles = async () => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from('uploaded_documents')
      .select('*')
      .eq('user_id', userId)
      .order('upload_date', { ascending: false });
    
    if (error) {
      console.error('Error fetching files:', error);
    } else {
      setUserFiles(data || []);
    }
    
    setLoading(false);
  };

  // Handle file upload by admin (use server API to bypass RLS)
  const handleAdminUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0 || !uploadingYear) {
      return;
    }

    const file = event.target.files[0];
    setUploading(true);

    try {
      const { data: { user: adminUser } } = await supabase.auth.getUser();
      if (!adminUser) {
        throw new Error('No admin session found');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);
      formData.append('financialYear', String(uploadingYear));
      formData.append('uploadedByAdmin', 'true');

      const resp = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!resp.ok) {
        const msg = await resp.text();
        throw new Error(msg || 'Upload failed');
      }

      // Refresh file list
      fetchUserFiles();
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    } finally {
      setUploading(false);
      setUploadingYear(null);
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

  // Handle file view (derive storage path if file_path missing) via server API
  const handleView = async (file: any) => {
    try {
      let storagePath: string | null = file.file_path || null;
      if (!storagePath && file.file_url) {
        const idx = file.file_url.indexOf('/user-documents/');
        if (idx >= 0) {
          storagePath = file.file_url.slice(idx + '/user-documents/'.length);
        }
      }
      if (!storagePath) {
        throw new Error('Missing storage path');
      }

      const signed = await requestSignedUrl(storagePath);
      if (!signed) {
        throw new Error('Could not get preview URL');
      }

      const nameOrPath = (file.file_name || storagePath).toString().toLowerCase();
      if (imageExtensions.some(ext => nameOrPath.endsWith(ext))) {
        setPreviewType('image');
        setFilePreviewUrl(signed);
      } else if (nameOrPath.endsWith('.pdf')) {
        setPreviewType('pdf');
        setFilePreviewUrl(signed);
      } else if (officeExtensions.some(ext => nameOrPath.endsWith(ext))) {
        setPreviewType('office');
        const officeViewer = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(signed)}`;
        setFilePreviewUrl(officeViewer);
      } else {
        setPreviewType('other');
        setFilePreviewUrl(signed);
      }

      setShowPreviewModal(true);
    } catch (error) {
      console.error('Error preparing preview URL:', error);
      alert('Error viewing file');
    }
  };

  // Handle file download (derive storage path if file_path missing) via server API
  const handleDownload = async (file: any) => {
    try {
      let storagePath: string | null = file.file_path || null;
      if (!storagePath && file.file_url) {
        const idx = file.file_url.indexOf('/user-documents/');
        if (idx >= 0) {
          storagePath = file.file_url.slice(idx + '/user-documents/'.length);
        }
      }
      if (!storagePath) {
        throw new Error('Missing storage path');
      }

      const signed = await requestSignedUrl(storagePath);
      if (!signed) {
        throw new Error('Could not get download URL');
      }

      // Robust download: fetch blob to ensure local save across browsers
      const resp = await fetch(signed);
      if (!resp.ok) throw new Error(`Download failed: ${resp.status}`);
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.file_name || 'download';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Error downloading file');
    }
  };

  // Group files by financial year
  const groupedFiles = userFiles.reduce((acc: Record<number, any[]>, file) => {
    const year = file.financial_year;
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(file);
    return acc;
  }, {});

  // Sort years in descending order
  const sortedYears = Object.keys(groupedFiles)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => router.push('/admin')}
          className="flex items-center text-[#006666] hover:text-[#004444] mb-6"
        >
          <FaArrowLeft className="mr-2" />
          Back to Admin Dashboard
        </button>

        {/* User Details Header */}
        {userDetails && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">User Details</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-black">Full Name</p>
                <p className="text-md font-medium text-black">{userDetails.full_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-md font-medium text-black">{userDetails.email}</p>
              </div>
              {/* <div>
                <p className="text-sm text-gray-500">Username</p>
                <p className="text-lg font-medium">{userDetails.username || 'Not set'}</p>
              </div> */}
              <div>
                <p className="text-sm text-gray-500">Created Date</p>
                <p className="text-md font-medium text-black">
                  {new Date(userDetails.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* User Files */}
        <motion.div variants={fadeIn} className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">User Documents</h2>
            <div className="text-sm text-gray-600">
              {loading ? 'Loading...' : `${userFiles.length} document${userFiles.length !== 1 ? 's' : ''}`}
            </div>
          </div>

          {loading ? (
            <div className="text-center text-black py-4">Loading documents...</div>
          ) : userFiles.length === 0 ? (
            <div className="text-gray-600">No documents found for this user</div>
          ) : (
            <div className="space-y-4">
              {sortedYears.map(year => (
                <div key={year} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between bg-gray-50 p-3">
                    <button 
                      onClick={() => toggleFinancialYear(year)}
                      className="w-full flex items-center justify-between hover:bg-gray-100 transition-colors"
                    >
                      <div className="font-medium text-gray-900 flex items-center">
                        <FaCalendarAlt className="mr-2 text-[#006666]" />
                        Financial Year {year}
                      </div>
                      <div className="text-sm text-gray-600">
                        {groupedFiles[year].length} document{groupedFiles[year].length !== 1 ? 's' : ''}
                      </div>
                    </button>
                    <button
  onClick={() => handleUploadClick(year)}
  className="ml-4 px-4 py-2 min-w-[180px] bg-[#006666] text-white rounded-md hover:bg-[#004444] transition-colors flex items-center justify-center"
  title="Upload tax return copy"
>
  <FaUpload className="mr-2" />
  <span>Upload Return</span>
</button>

                    <input
                      id={`file-upload-${year}`}
                      type="file"
                      onChange={handleAdminUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </div>
                  
                  {/* Upload form for selected year */}
                  {uploadingYear === year && (
                    <div className="p-4 bg-gray-50 border-t border-gray-200">
                      <div className="flex items-center">
                        <input
                          type="file"
                          onChange={handleAdminUpload}
                          className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-md file:border-0
                            file:text-sm file:font-semibold
                            file:bg-[#006666] file:text-white
                            hover:file:bg-[#004444]"
                          disabled={uploading}
                        />
                        {uploading && <span className="ml-2 text-sm text-gray-600">Uploading...</span>}
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Upload a tax return file for this user. The file will be marked as uploaded by admin.
                      </p>
                    </div>
                  )}
                  
                  {/* Show files for selected year */}
                  {selectedFinancialYear === year && (
                    <div className="divide-y divide-gray-100">
                      {groupedFiles[year].map((file: any) => (
                        <div 
                          key={file.id} 
                          className={`flex items-center justify-between p-3 ${file.uploaded_by_admin ? 'bg-blue-50' : ''}`}
                        >
                          <div>
                            <div className="font-medium text-gray-900 flex items-center">
                              {file.file_name}
                              {file.uploaded_by_admin && (
                                <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                                  Admin Upload
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-600">
                              {new Date(file.upload_date).toLocaleString()}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button 
                              title="Preview" 
                              onClick={() => handleView(file)} 
                              className="p-2 rounded hover:bg-gray-100"
                            >
                              <FaEye className="text-gray-700" />
                            </button>
                            <button 
                              title="Download" 
                              onClick={() => handleDownload(file)} 
                              className="p-2 rounded hover:bg-gray-100"
                            >
                              <FaDownload className="text-gray-700" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* File Preview Modal */}
      {showPreviewModal && filePreviewUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-black flex justify-between items-center">
              <h3 className="text-lg text-black font-medium">File Preview</h3>
              <button 
                onClick={() => {
                  setShowPreviewModal(false);
                  setFilePreviewUrl(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {previewType === 'image' ? (
                <div className="max-h-[80vh] mx-auto">
                  <Image
                    src={filePreviewUrl || ''}
                    alt="Preview"
                    width={1200}
                    height={800}
                    unoptimized
                    className="object-contain border border-gray-200 rounded"
                  />
                </div>
              ) : (
                <iframe
                  src={filePreviewUrl || ''}
                  className="w-full h-full min-h-[500px] border border-gray-200 rounded"
                  title="File Preview"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}