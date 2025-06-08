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
  const [measurement, setMeasurement] = useState();
  const [measurementResult, setMeasurementResult] = useState([]);

  const tableHeaders = [
    "Object Number",
    "Shape",
    "Length (cm)",
    "Breadth (cm)",
    "Area",
    "Perimeter",
    "Accuracy",
  ];

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

        "post",
        formData,
        true
      );
      // console.log(response);
      setMeasurement(response.data.data.data.output.measurement);
      setMeasurementResult(response.data.data.data.output.measurement.results);
      alert("Image is being measured it may take a few seconds");
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to add the image.");
    }
  };

  console.log(measurement);

  return (
    <div className="flex flex-col items-center justify-center p-6">
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
                className="h-96 rounded-lg mt-2"
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
      </div>
      <div>
        <div className=" overflow-y-scroll no-scrollbar p-10 flex flex-col gap-5 text-white bg-[#373737] rounded-xl shadow ">
          <h1 className="text-3xl font-semibold">
            🎯 Measurement Accuracy Analysis & Statistical Summary
          </h1>
          {measurement && (
            <div className="flex flex-col gap-5">
              <h1 className="text-lg">
                Average Accuracy: {measurement?.average_accuracy} %
              </h1>
              <h1 className="text-lg">
                Total Objects Detected: {measurement?.total_objects}
              </h1>
              <h1 className="text-lg">Calibration Factor: 10.00 pixels/cm</h1>
            </div>
          )}
          <div>
            <h1 className="text-3xl font-semibold">
              Factors affecting Accuracy:
            </h1>
            <ul className="list-disc pl-10 flex flex-col gap-2 py-5">
              <li>
                📸Image Quality: Higher resolution images provide better
                accuracy{" "}
              </li>
              <li>
                🔍Object Size: Larger objects are measured more accurately
              </li>
              <li>💡Lighting: Good lighting improves edge detection</li>
              <li>
                📐Scale Estimation: Measurements are based on estimated
                pixel-to-cm ratio
              </li>
              <li>
                🖼️Object Clarity: Clear, well-defined edges improve measurements
              </li>
            </ul>
          </div>
        </div>
        <div className="h-96 overflow-y-scroll no-scrollbar p-10 flex flex-col gap-5 text-white">
          <h1 className="text-3xl font-semibold">
            Detailed Measurement Report
          </h1>
          <table className="min-w-full border-collapse border border-gray-300 rounded-xl text-white ">
            <thead>
              <tr>
                {tableHeaders.map((header, index) => (
                  <th
                    key={index}
                    className="border border-gray-500 px-4 py-2 bg-[#1A1C24]"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {measurementResult?.length > 0 ? (
                measurementResult?.map((result) => (
                  <tr key={result.id}>
                    <td className="border border-gray-500 px-4 py-2 bg-[#0F1116]">
                      {result.Object_number}
                    </td>
                    <td className="border border-gray-500 px-4 py-2 bg-[#0F1116]">
                      {result?.Shape}
                    </td>
                    <td className="border border-gray-500 px-4 py-2 bg-[#0F1116]">
                      {result.Length}
                    </td>
                    <td className="border border-gray-500 px-4 py-2 bg-[#0F1116]">
                      {result.Breadth}
                    </td>
                    <td className="border border-gray-500 px-4 py-2 bg-[#0F1116]">
                      {result.Area}
                    </td>
                    <td className="border border-gray-500 px-4 py-2 bg-[#0F1116]">
                      {result.Perimeter}
                    </td>
                    <td className="border border-gray-500 px-4 py-2 bg-[#0F1116]">
                      {result.Accuracy}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={tableHeaders.length}
                    className="text-center py-4"
                  >
                    No results found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
