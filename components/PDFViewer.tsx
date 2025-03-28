"use client";

import { useState, useEffect, useRef } from "react";
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { supabase } from "@/lib/supabase";

interface PDFViewerProps {
  bibNo: string;
  onBack: () => void;
}

export default function PDFViewer({ bibNo, onBack }: PDFViewerProps) {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [scale, setScale] = useState(0.7);
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate scale based on container size
  const updateScale = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      // Assuming PDF width is 800px (standard A4 width)
      const newScale = (containerWidth - 32) / 800; // 32px for padding
      setScale(Math.min(newScale, 1)); // Don't scale up beyond 100%
    }
  };

  // Update scale on mount and window resize
  useEffect(() => {
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const handleDownload = async () => {
    if (!pdfUrl) return;
    
    try {
      setDownloading(true);
      
      // Log the certificate download attempt
      await supabase
        .from('certificate_downloads')
        .insert([
          { 
            bib_no: bibNo,
            timestamp: new Date().toISOString(),
            status: 'attempted'
          }
        ]);

      // Wait for the loader to show all messages (2 seconds × 5 messages)
      setTimeout(async () => {
        const response = await fetch(pdfUrl);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `BIB-${bibNo}.pdf`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        window.URL.revokeObjectURL(blobUrl);

        // Update the status to completed
        await supabase
          .from('certificate_downloads')
          .update({ status: 'completed' })
          .eq('bib_no', bibNo)
          .eq('status', 'attempted');

        setDownloading(false);
        setDownloadComplete(true);
      }, 10000);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to download PDF. Please try again.');
      setDownloading(false);
    }
  };

  useEffect(() => {
    const checkAndFetchPdf = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data } = supabase.storage
          .from("bibs")
          .getPublicUrl(`${bibNo}.pdf`);

        if (data?.publicUrl) {
          const response = await fetch(data.publicUrl, { method: 'HEAD' });
          if (response.ok) {
            setPdfUrl(data.publicUrl);
          } else {
            setError("BIB number not found");
          }
        } else {
          setError("Error accessing BIB");
        }
      } catch (err) {
        console.error("Error loading BIB:", err);
        setError("Error loading BIB");
      } finally {
        setLoading(false);
      }
    };

    checkAndFetchPdf();
  }, [bibNo]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[350px]">
        <div className="animate-pulse text-neutral-400">Checking BIB number...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4 text-center">
        <p className="text-red-400">
          Certificate not found. Please check your Name and BIB number, or ensure that you have completed the run.
        </p>
        <button
          onClick={onBack}
          className="w-full bg-gradient-to-br from-neutral-50 to-neutral-400 text-black font-semibold h-10 rounded-md transition-all hover:opacity-90 hover:scale-[0.98] active:scale-[0.97]"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error ? (
        <div className="space-y-4 text-center">
          <p className="text-red-400">
            Certificate not found. Please check your Name and BIB number, or ensure that you have completed the run.
          </p>
          <button
            onClick={onBack}
            className="w-full bg-gradient-to-br from-neutral-50 to-neutral-400 text-black font-semibold h-10 rounded-md transition-all hover:opacity-90 hover:scale-[0.98] active:scale-[0.97]"
          >
            Go Back
          </button>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={onBack}
              className="text-neutral-400 hover:text-white transition-colors"
            >
              ← Back
            </button>
            <p className="text-neutral-400">BIB: {bibNo}</p>
          </div>

          {/* PDF Viewer */}
          <div ref={containerRef} className="h-[350px] w-full overflow-hidden bg-black/50 rounded-lg flex items-center justify-center">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
              {pdfUrl && (
                <div style={{ 
                  height: '100%', 
                  width: '100%', 
                  padding: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Viewer
                    fileUrl={pdfUrl}
                    defaultScale={scale}
                    theme={{
                      theme: 'dark',
                    }}
                    plugins={[]}
                    renderLoader={() => (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="animate-pulse text-neutral-400">
                          Loading PDF...
                        </div>
                      </div>
                    )}
                  />
                </div>
              )}
            </Worker>
          </div>

          {/* Download Button */}
          {pdfUrl && (
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-full bg-gradient-to-br from-neutral-50 to-neutral-400 text-black font-semibold h-10 rounded-md transition-all hover:opacity-90 hover:scale-[0.98] active:scale-[0.97] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {downloading ? 'Downloading...' : downloadComplete ? 'Certificate Downloaded!' : 'Download Certificate'}
            </button>
          )}
        </>
      )}
    </div>
  );
} 