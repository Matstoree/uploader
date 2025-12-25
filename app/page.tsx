'use client';

import React, { useState, useCallback } from 'react';
import { Upload, Copy, Check, AlertCircle, FileText, Image as ImageIcon, Video, Music, File as FileIcon, Loader2 } from 'lucide-react';

export default function Home() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setError('');
    setFileName(file.name);
    setFileSize(file.size);
    setUploadProgress(0);
    setUploadedUrl('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setUploadProgress(Math.round(percentComplete));
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          setUploadedUrl(response.url);
          setIsUploading(false);
          setUploadProgress(100);
        } else {
          const response = JSON.parse(xhr.responseText);
          setError(response.error || 'Upload failed');
          setIsUploading(false);
          setUploadProgress(0);
        }
      });

      xhr.addEventListener('error', () => {
        setError('Network error occurred');
        setIsUploading(false);
        setUploadProgress(0);
      });

      xhr.open('POST', '/api/upload');
      xhr.timeout = 120000;
      xhr.send(formData);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      uploadFile(files[0]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadFile(files[0]);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(uploadedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getFileIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext || '')) 
      return <ImageIcon className="w-5 h-5" />;
    if (['mp4', 'avi', 'mov', 'mkv', 'webm'].includes(ext || '')) 
      return <Video className="w-5 h-5" />;
    if (['mp3', 'wav', 'ogg', 'flac'].includes(ext || '')) 
      return <Music className="w-5 h-5" />;
    if (['pdf', 'doc', 'docx', 'txt'].includes(ext || '')) 
      return <FileText className="w-5 h-5" />;
    return <FileIcon className="w-5 h-5" />;
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-3xl mx-auto pt-12 pb-20">
        <div className="text-center mb-10">
          <div className="inline-block p-3 bg-blue-100 rounded-2xl mb-4">
            <Upload className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-3">File Uploader</h1>
          <p className="text-lg text-gray-600">Upload any file and get a public URL</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6">
          {!uploadedUrl ? (
            <>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-3 border-dashed rounded-2xl p-16 text-center transition-all ${
                  isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
                }`}
              >
                {isUploading ? (
                  <Loader2 className="w-20 h-20 mx-auto mb-6 text-blue-500 animate-spin" />
                ) : (
                  <Upload className={`w-20 h-20 mx-auto mb-6 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
                )}
                
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                  {isDragging ? 'Drop it here!' : isUploading ? 'Uploading...' : 'Drag & drop your file'}
                </h3>
                
                {!isUploading && (
                  <>
                    <p className="text-gray-500 mb-6">or</p>
                    <label className="inline-block">
                      <input
                        type="file"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <span className="px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold cursor-pointer hover:bg-blue-700 transition-all inline-block">
                        Browse Files
                      </span>
                    </label>
                    <p className="text-sm text-gray-400 mt-6">Max: 100MB</p>
                  </>
                )}
              </div>

              {isUploading && fileName && (
                <div className="mt-8 p-6 bg-blue-50 rounded-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getFileIcon(fileName)}
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{fileName}</p>
                        <p className="text-xs text-gray-500">{formatBytes(fileSize)}</p>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-blue-600">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-6 p-5 bg-red-50 border border-red-200 rounded-xl flex gap-3">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                  <div>
                    <h4 className="font-semibold text-red-800">Upload Failed</h4>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-white" />
              </div>
              
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Success!</h3>
              <p className="text-gray-600 mb-8">Your file is now available:</p>
              
              <div className="bg-gray-50 rounded-xl p-5 mb-6">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={uploadedUrl}
                    readOnly
                    className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  setUploadedUrl('');
                  setFileName('');
                  setError('');
                }}
                className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
              >
                Upload Another
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
