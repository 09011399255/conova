import {  useState } from "react";

export default function ImageUploader({
    file,
    handleFileChange,
    setFile,
    error,
}: {
    file: File | null;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setFile: (file: File | null) => void;
    error?: string;
}) {
    const [isDragging, setIsDragging] = useState(false);

    const handleRemove = () => {
        setFile(null);
        const input = document.getElementById("file-upload") as HTMLInputElement;
        if (input) {
            input.value = "";
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            if (droppedFile.type.startsWith("image/")) {
                setFile(droppedFile);
            }
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            <div className="border border-[#DCDFE3] rounded-md">
                <div className="bg-[#FAFAFA] px-4 py-3">
                    <p className="text-sm text-gray-400">
                        <span className="font-[500] mr-[2px] text-[16px] text-[#000000]">
                            Upload Space Image
                        </span>{" "}
                        <span className="text-[13px] font-[400] text-[#A5A8B5]">
                            (Only .jpg, and .png of 15mb are allowed)
                        </span>
                    </p>
                </div>
                <div className="p-4">
                    {!file ? (
                        <div
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragEnter={handleDragOver}
                            onDragLeave={handleDragLeave}
                            className={`flex flex-col h-[200px] items-center justify-center border-2 border-dashed hover:border-[#134562] bg-[#FAFAFA] ${isDragging ? "border-[#134562] bg-[#FAFAFA]" : "border-[#DCDFE3]"
                                } rounded-md p-6 cursor-pointer text-center transition`}
                        >
                            <label htmlFor="file-upload" className="flex flex-col items-center">
                                <img src="/images/upload.png" className="w-6 h-6 mb-2" />
                                <span className="text-[14px] font-[500] text-[#0E6BA8] underline cursor-pointer ">
                                    Click to upload
                                </span>
                                <span className="text-[14px] font-[500] text-[#A5A8B5]">
                                    or drag and drop
                                </span>
                                <input
                                    id="file-upload"
                                    type="file"
                                    accept=".png,.jpg,.jpeg"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    ) : (
                        <div className="relative">
                            <img
                                src={URL.createObjectURL(file)}
                                alt="Uploaded preview"
                                className="rounded-md w-full object-cover h-[200px]"
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-md bg-black/30">
                                <label
                                    htmlFor="file-upload"
                                    className="bg-white text-black text-sm px-4 py-2 rounded-md cursor-pointer hover:bg-gray-100 transition"
                                >
                                    Replace
                                    <input
                                        id="file-upload"
                                        type="file"
                                        accept=".png,.jpg,.jpeg"
                                        onChange={handleFileChange}
                                        className="hidden"
                                    />
                                </label>
                                <button
                                    type="button"
                                    onClick={handleRemove}
                                    className="px-4 py-2 text-sm bg-red-100 text-red-500 rounded-md hover:bg-red-200 transition"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    )}
                    {error && (
                        <p className="text-[#EF4444] text-xs mt-2">{error}</p>
                    )}
                </div>
            </div>

            {/* Calendar ID Input */}
            <div className="flex flex-col">
                <label htmlFor="calendar-id" className="text-[16px] mb-1">
                    External Calendar ID
                </label>
                <input
                    id="calendar-id"
                    type="text"
                    placeholder="Enter your meeting ID"
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm placeholder:text-gray-400"
                />
            </div>
        </div>
    );
}
