"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/app/hooks/useUser";
import { FileText, Upload, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import Image from "next/image";

export default function LicenseVerificationPage() {
  const { data, isLoading } = useUser();
  const user = data?.user;
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("type", "license");

      const res = await fetch("/api/upload-file", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (res.ok) {
        toast.success("License uploaded successfully! Please wait for verification.");
        window.location.reload();
      } else {
        toast.error(result.message || "Upload failed");
      }
    } catch (err) {
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const getStatusIcon = () => {
    switch (user?.license_status) {
      case "approved":
        return <CheckCircle size={24} className="text-green-500" />;
      case "rejected":
        return <XCircle size={24} className="text-red-500" />;
      case "pending":
        return <Clock size={24} className="text-yellow-500" />;
      default:
        return <AlertCircle size={24} className="text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (user?.license_status) {
      case "approved":
        return { text: "Approved", color: "text-green-600" };
      case "rejected":
        return { text: "Rejected", color: "text-red-600" };
      case "pending":
        return { text: "Pending Review", color: "text-yellow-600" };
      default:
        return { text: "Not Uploaded", color: "text-gray-600" };
    }
  };

  const getStatusMessage = () => {
    switch (user?.license_status) {
      case "approved":
        return "Your license has been verified and approved. You can now book vehicles.";
      case "rejected":
        return "Your license was rejected. Please upload a clear, valid license document.";
      case "pending":
        return "Your license is under review. We'll notify you once it's processed.";
      default:
        return "Please upload your driving license to book vehicles.";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen px-6 py-20 text-gray-800 bg-gradient-to-b from-white via-slate-300 to-white">
      <Toaster position="top-right" />
      
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <FileText size={48} className="text-indigo-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">
            License Verification
          </h1>
          <p className="mt-2 text-gray-600">
            Upload your driving license to book vehicles
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Current Status</h2>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              {getStatusIcon()}
              <div>
                <p className={`font-medium ${getStatusText().color}`}>
                  {getStatusText().text}
                </p>
                <p className="text-sm text-gray-600">
                  {getStatusMessage()}
                </p>
              </div>
            </div>
          </div>

          {user?.license_card_url && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Current License</h3>
              <div className="border rounded-lg p-4 bg-gray-50">
                <Image
                  src={user.license_card_url}
                  alt="Current License"
                  width={400}
                  height={250}
                  className="object-contain w-full max-w-md mx-auto rounded"
                />
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {user?.license_status === "rejected" || !user?.license_card_url 
                ? "Upload New License" 
                : "Update License"}
            </h3>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
                <input
                  type="file"
                  id="license-upload"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <label
                  htmlFor="license-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload size={32} className="text-gray-400" />
                  <span className="text-gray-600">
                    {selectedFile ? selectedFile.name : "Click to select license image"}
                  </span>
                  <span className="text-sm text-gray-500">
                    PNG, JPG, JPEG up to 10MB
                  </span>
                </label>
              </div>

              {previewUrl && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
                  <Image
                    src={previewUrl}
                    alt="License Preview"
                    width={400}
                    height={250}
                    className="object-contain w-full max-w-md mx-auto rounded"
                  />
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                  !selectedFile || uploading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-indigo-500 to-pink-500 text-white hover:opacity-90 hover:shadow-lg"
                }`}
              >
                {uploading ? "Uploading..." : "Upload License"}
              </button>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Upload Guidelines:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Ensure the license is clearly visible and readable</li>
              <li>• Upload a high-quality image (PNG, JPG, JPEG)</li>
              <li>• Make sure all text and details are legible</li>
              <li>• The license must be valid and not expired</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
