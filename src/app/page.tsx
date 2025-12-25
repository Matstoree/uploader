'use client';

import React, { useState, useCallback } from 'react';
import { Upload, Copy, Check, AlertCircle, FileText, Image as ImageIcon, Video, Music, File as FileIcon } from 'lucide-react';

export default function Home() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [fileName, setFileName] = useState('');

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
    setUploadProgress(0);

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
        } else {
          const response = JSON.parse(xhr.responseText);
          setError(response.error || 'Upload failed');
          setIsUploading(false);
        }
      });

      xhr.addEventListener('error', () => {
        setError('Network error occurred');
        setIsUploading(false);
      });

      xhr.open('POST', '/api/upload');
      xhr.send(formData);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
      setIsUploading(false);
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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(uploadedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto pt-12">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">File Uploader</h1>
          <p className="text-gray-600">Upload any file and get a public URL instantly</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          {!uploadedUrl ? (
            <>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-3 border-dashed rounded-xl p-12 text-center transition-all ${
                  isDragging 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 hover:border-blue-400'
                }`}
              >
                <Upload className={`w-16 h-16 mx-auto mb-4 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  {isDragging ? 'Drop your file here' : 'Drag & drop your file here'}
                </p>
                <p className="text-sm text-gray-500 mb-4">or</p>
                <label className="inline-block">
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={isUploading}
                  />
                  <span className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium cursor-pointer hover:bg-blue-700 transition-colors inline-block">
                    Browse Files
                  </span>
                </label>
                <p className="text-xs text-gray-400 mt-4">Max file size: 100MB</p>
              </div>

              {isUploading && (
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getFileIcon(fileName)}
                      <span className="text-sm font-medium text-gray-700">{fileName}</span>
                    </div>
                    <span className="text-sm text-gray-600">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Upload Successful!</h3>
              <p className="text-gray-600 mb-6">Your file is now available at:</p>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4 flex items-center gap-2">
                <input
                  type="text"
                  value={uploadedUrl}
                  readOnly
                  className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 flex-shrink-0"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <button
                onClick={() => {
                  setUploadedUrl('');
                  setUploadProgress(0);
                  setFileName('');
                  setError('');
                }}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Upload Another File
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">API Endpoint</h3>
          <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm overflow-x-auto">
            <div className="mb-2">
              <span className="text-green-400">POST</span> /api/upload
            </div>
            <div className="text-gray-400 text-xs">
              curl -X POST -F &quot;file=@yourfile.jpg&quot; {process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com'}/api/upload
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
