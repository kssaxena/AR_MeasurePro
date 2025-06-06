import { Scale, Ruler } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ImageCapture } from "./ImageCapture";
import { FetchData } from "@/services/FetchFromAPI";
import { useSelector } from "react-redux";

export function MeasureDisplay() {
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const formRef = useRef();
  const user = useSelector((store) => store.UserInfo.user);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file.");
        setSelectedImage(null);
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setError("Image size must be less than 2MB.");
        setSelectedImage(null);
        return;
      }
      setError("");
      setSelectedImage(file);
    }
  };

  const UploadRawImage = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(formRef.current);
    try {
      const response = await FetchData(
        `users/raw-image-upload`,
        // `users/image-analysis`,
        "post",
        formData,
        true
      );
      console.log(response);
      alert("Image is being measured it may take a few seconds");
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to add the image.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-lg">
      <div className="flex items-center gap-4 mb-6">
        <Scale className="w-8 h-8 text-purple-400" />
        <h1 className="text-2xl font-medium text-gray-100">AR Measure Pro</h1>
      </div>
      {user.length === 1 ? (
        <form
          ref={formRef}
          onSubmit={UploadRawImage}
          className="flex flex-col items-center gap-4 w-full mb-4"
        >
          <input
            name="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
          />
          {error && <span className="text-red-400 text-sm">{error}</span>}
          {selectedImage && (
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Preview"
              className="max-h-40 rounded-lg mt-2"
            />
          )}
          <button
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg transition-all",
              "bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
            )}
            type="submit"
          >
            <Ruler className="w-5 h-5" />
            Measure
          </button>
        </form>
      ) : (
        <div>Login first </div>
      )}
      {/* <form
        ref={formRef}
        onSubmit={UploadRawImage}
        className="flex flex-col items-center gap-4 w-full mb-4"
      >
        <input
          name="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
        />
        {error && <span className="text-red-400 text-sm">{error}</span>}
        {selectedImage && (
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Preview"
            className="max-h-40 rounded-lg mt-2"
          />
        )}
        <button
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg transition-all",
            "bg-purple-500/20 text-purple-300 hover:bg-purple-500/30"
          )}
          type="submit"
        >
          <Ruler className="w-5 h-5" />
          Measure
        </button>
      </form> */}
    </div>
  );
}
