// src/App.jsx

import React, { useRef, useState } from "react";
import "./App.css";

const App = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [convertedFileUrl, setConvertedFileUrl] = useState(null);
  // Initializing the selected file state & image preview state
  const handleFileChange = (e) => {
    const imageFile = e.target.files[0];
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImagePreviewUrl(url);
      setSelectedFile(e.target.files[0]);
    }
  };

  // Converting any format to Webp format
  const handleConvertingImage = () => {
    if (!selectedFile) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          setConvertedFileUrl(url);
        }, "image/webp");
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(selectedFile);
  };

  // For generating Download
  const handleImageDownload = () => {
    if (!convertedFileUrl) return;
    const link = document.createElement("a");
    link.href = convertedFileUrl;
    link.download = `${selectedFile.name.split(".")[0]}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div className="flex flex-col bg-slate-900 roboto_cregular text-white h-screen w-screen items-center justify-center space-y-20 pl-10 pr-10">
      {/* All Popups */}
      <div className="space-y-4">
        <h1 className="text-4xl roboto_csbold">
          Image Converter - Any Format to{" "}
          <span className="text-green-300"> Webp</span>
        </h1>
        <p className="text-sm">
          Convert any image to WebP effortlessly. Simple and fast conversion
        </p>
      </div>

      {selectedFile ? (
        <div className="h-52 p-10 text-xs bg-white flex flex-col items-start w-full space-y-4 rounded-3xl">
          <div className="flex space-x-2">
            <img
              src="/icons/addmore.svg"
              alt="addmore"
              height="20"
              width="20"
            />
            <h1 className="text-black">Add More File</h1>
          </div>
          <div className="flex items-center space-x-4 border-t-2 pt-4">
            <div className="flex space-x-1">
              <img
                src={imagePreviewUrl}
                alt="test"
                height="50"
                width="50"
                className="h-10 w-10"
              />
              <div className="flex flex-col text-xs text-gray-400">
                <h1>{selectedFile.name}</h1>
                <span>{(selectedFile.size / 1024).toFixed(2)}kb</span>
              </div>
            </div>
            <div className="flex">
              {/* <img src="icons/close.svg" alt="close" height="25" width="25" /> */}
              {convertedFileUrl ? (
                <button
                  onClick={handleImageDownload}
                  className="bg-[#2BCF6D] text-white text-opacity-80 hover:text-opacity-100 duration-300 p-4 rounded-3xl"
                >
                  Download
                </button>
              ) : (
                <button
                  onClick={handleConvertingImage}
                  className="bg-[#2BCF6D] text-white text-opacity-80 hover:text-opacity-100 duration-300 p-4 rounded-3xl"
                >
                  Convert to Webp
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="h-52 flex flex-col items-center justify-center w-full text-xs space-y-4 border-2 border-dashed rounded-3xl">
          <input
            className="file:p-3 file:rounded-3xl w-40"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <h1>or drop your files here</h1>
        </div>
      )}
    </div>
  );
};

export default App;
