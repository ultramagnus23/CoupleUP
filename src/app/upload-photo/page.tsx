'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSessionUser } from '@/hooks/useSessionUser';

export default function UploadPhotoPage() {
  const router = useRouter();
  const { user, loading } = useSessionUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);

  // Redirect if photo already uploaded
  useEffect(() => {
    if (!loading && user?.photoUploaded) {
      router.replace('/setup');
    }
  }, [loading, user, router]);

  function handleFile(f: File) {
    setError('');
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(f.type)) {
      setError('Please upload a JPEG, PNG, or WebP image.');
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError('Photo must be under 5 MB.');
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  }

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('photo', file);

      const res = await fetch('/api/upload-photo', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Upload failed. Please try again.');
        return;
      }

      router.push('/setup');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 py-12 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">📸</div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-600">
            Upload Your Photo
          </h1>
          <p className="text-gray-600 mt-2 max-w-sm mx-auto">
            CoupleUp is a face-forward platform. Add a clear photo so others can see the real you — it&apos;s mandatory before joining.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-lg p-8">
          {/* Preview or drop zone */}
          {preview ? (
            <div className="relative mb-6">
              <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden ring-4 ring-rose-200">
                <Image
                  src={preview}
                  alt="Your photo preview"
                  fill
                  className="object-cover"
                />
              </div>
              <button
                onClick={() => { setPreview(null); setFile(null); }}
                className="absolute top-0 right-1/2 translate-x-16 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                aria-label="Remove photo"
              >
                ✕
              </button>
              <p className="text-center text-sm text-gray-500 mt-3">
                Looking good! Click <strong>Save Photo</strong> to continue.
              </p>
            </div>
          ) : (
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => e.key === 'Enter' && fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`mb-6 border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
                dragging
                  ? 'border-rose-500 bg-rose-50'
                  : 'border-gray-300 hover:border-rose-400 hover:bg-rose-50'
              }`}
            >
              <div className="text-4xl mb-3">🖼️</div>
              <p className="font-medium text-gray-700">Click or drag &amp; drop your photo here</p>
              <p className="text-sm text-gray-400 mt-1">JPEG, PNG, or WebP · Max 5 MB</p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleInputChange}
            className="hidden"
            aria-label="Choose photo file"
          />

          {/* Tips */}
          <div className="bg-rose-50 rounded-2xl p-4 mb-6 text-sm text-rose-700 space-y-1">
            <p className="font-semibold">📌 Photo tips:</p>
            <ul className="list-disc list-inside space-y-0.5 text-rose-600">
              <li>Use a recent, clear face photo</li>
              <li>Make sure your face takes up most of the frame</li>
              <li>No filters, sunglasses, or group photos</li>
              <li>Good lighting makes a huge difference ✨</li>
            </ul>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="w-full bg-gradient-to-r from-rose-500 to-purple-600 text-white font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {uploading ? 'Uploading...' : 'Save Photo & Continue →'}
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full border border-gray-200 text-gray-600 font-medium py-3 rounded-2xl hover:bg-gray-50 transition-all"
            >
              {preview ? 'Choose a different photo' : 'Browse files'}
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          Your photo is only used within CoupleUp. Read our{' '}
          <a href="/privacy" className="text-rose-500 hover:underline">Privacy Policy</a>.
        </p>
      </div>
    </main>
  );
}
