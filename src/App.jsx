// src/App.jsx

import { useState } from "react";
import "./App.css";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useEffect } from "react";
const App = () => {
  const [images, setImages] = useState([]);
  const [isAllImagesCanBeDownloaded, setIsAllImagesCanBeDownloaded] =
    useState(false);
  // Initializing the selected file state & image preview state
  const handleImageFileChange = (e) => {
    const imageFile = e.target.files[0];
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImages((prev) => [
        ...prev,
        {
          file: imageFile,
          previewImageUrl: url,
          convertedImageUrl: null,
        },
      ]);
    }
    console.log(images);
  };

  // Converting any format to Webp format
  const handleConvertingImage = (index) => {
    console.log("converting all ");
    console.log(images[index].file);
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
          console.log(url);
          setImages((prev) =>
            prev.map((image, i) =>
              i === index ? { ...image, convertedImageUrl: url } : image
            )
          );
        }, "image/webp");
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(images[index].file);
  };

  // For generating Download
  const handleImageDownload = (index) => {
    const link = document.createElement("a");
    link.href = images[index].convertedImageUrl;
    link.download = `${images[index].file.name.split(".")[0]}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // For generating Download All as Zip
  const handleDownloadAll = async () => {
    const zip = new JSZip();
    const folder = zip.folder("converted_images");
    for (let i = 0; i < images.length; i++) {
      if (images[i].convertedImageUrl) {
        const response = await fetch(images[i].convertedImageUrl);
        const blog = await response.blob();
        const imageFileName = `${images[i].file.name.split(".")[0]}`;
        const allImageFilesTillNow = Object.keys(folder.files);
        console.log(folder.files);
        if (
          allImageFilesTillNow.includes(
            `converted_images/${imageFileName}.webp`
          )
        ) {
          folder.file(`${imageFileName}1.webp`, blog);
        } else {
          folder.file(`${imageFileName}.webp`, blog);
        }
      }
    }
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, "converted_images.zip");
  };
  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((image, i) => i !== index && image));
  };

  // Converting all images at once
  const handleConvertingAllImages = () => {
    images.forEach((_, index) => {
      handleConvertingImage(index);
    });
  };

  // useeffect
  useEffect(() => {
    const totalImagesDownloadable = images.filter(
      (image) => image.convertedImageUrl
    ).length;
    if (totalImagesDownloadable === images.length) {
      console.log("all images can be download");
      setIsAllImagesCanBeDownloaded(true);
    } else {
      console.log("there is some image/images to be converted");
      setIsAllImagesCanBeDownloaded(false);
    }
  }, [images]);
  return (
    <div className="flex flex-col bg-slate-900 roboto_cregular text-white h-screen w-screen items-center justify-center space-y-20">
      {/* All Popups */}
      <div className="space-y-4 w-[80%]">
        <h1 className="text-4xl roboto_csbold">
          Image Converter - Any Format to{" "}
          <span className="text-green-300"> Webp</span>
        </h1>
        <p className="text-sm">
          Convert any image to WebP effortlessly. Simple and fast conversion
        </p>
      </div>
      {images.length > 0 ? (
        <div className="flex flex-col space-y-6 text-xs bg-white w-[85%] rounded-3xl p-8">
          <div className="nav flex items-center space-x-1">
            <label
              htmlFor="fileupload"
              className="flex space-x-1 items-center text-[#212427] cursor-pointer"
            >
              <img
                src="icons/addmore.svg"
                className="h-5 w-5"
                alt="addmore"
                height="45"
                width="45"
              />
              <span className="flex-shrink-0"> Add More Posts</span>
            </label>
            <input
              id="fileupload"
              type="file"
              className="file:hidden w-0 relative right-10"
              onChange={handleImageFileChange}
            />
            {isAllImagesCanBeDownloaded ? (
              <button
                onClick={handleDownloadAll}
                className="bg-[#2BCF6D] p-4 flex-shrink-0 ml-12 rounded-2xl"
              >
                Download All
              </button>
            ) : (
              <button
                onClick={handleConvertingAllImages}
                className="bg-[#2BCF6D] p-4 flex-shrink-0 ml-12 rounded-2xl"
              >
                Convert All
              </button>
            )}
          </div>

          <div className="main flex flex-col items-start justify-between space-y-2 overflow-x-scroll border-t-2 pt-6">
            {images.map((image, index) => (
              <div
                key={index}
                className="flex space-x-2 items-center justify-evenly"
              >
                <img
                  src={image.previewImageUrl}
                  className="object-cover h-8 w-8 bg-slate-200"
                  alt="previewimage"
                  height="25"
                  width="25"
                />
                <div className="flex flex-col flex-shrink-0 text-gray-400">
                  <h1>{image.file?.name}</h1>
                  <h1>{(image.file?.size / 1024).toFixed(2)} kb</h1>
                </div>
                <img
                  onClick={() => handleRemoveImage(index)}
                  src="/icons/close.svg"
                  className="h-5 w-5"
                  alt="remove"
                  height="25"
                  width="25"
                />
                {image.convertedImageUrl ? (
                  <button
                    onClick={() => handleImageDownload(index)}
                    className="bg-[#2BCF6D] p-4 ml-auto rounded-2xl"
                  >
                    Download
                  </button>
                ) : (
                  <button
                    onClick={() => handleConvertingImage(index)}
                    className="bg-[#2BCF6D] p-4 ml-auto rounded-2xl flex-shrink-0"
                  >
                    Convert to Webp
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="h-48 flex flex-col items-center justify-center w-[80%] text-xs space-y-4 border-2 border-dashed rounded-3xl">
          <input
            className="file:p-3 file:rounded-3xl w-40"
            type="file"
            accept="image/*"
            onChange={handleImageFileChange}
          />
          <h1>or drop your files here</h1>
        </div>
      )}
    </div>
  );
};

export default App;
