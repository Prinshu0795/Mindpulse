import React, { useState, useCallback } from 'react';
import { Upload, Video, Loader2, Sparkles, AlertCircle, X, Crop, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';

// Use the environment variable consistently
const RAW_KEY = import.meta.env.VITE_DID_API_KEY;
// Basic Auth expects base64(username:password)
const AUTH_HEADER = `Basic ${btoa(RAW_KEY)}`;

const VideoGenSection = () => {
    const [imagePreview, setImagePreview] = useState(null);
    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [videoUrl, setVideoUrl] = useState(null);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState("");

    // Cropper State
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [showCropper, setShowCropper] = useState(false);
    const [tempImage, setTempImage] = useState(null);

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setTempImage(url);
            setShowCropper(true);
        }
    };

    const confirmCrop = async () => {
        try {
            const croppedImage = await getCroppedImg(tempImage, croppedAreaPixels);
            setImagePreview(croppedImage);
            setShowCropper(false);
            setVideoUrl(null);
            setError(null);
        } catch (e) {
            console.error(e);
            setError("Failed to crop image.");
        }
    };

    const removeImage = () => {
        setImagePreview(null);
        setTempImage(null);
        setVideoUrl(null);
        setError(null);
        setStatus("");
    };

    const pollVideoStatus = async (talkId) => {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                authorization: AUTH_HEADER
            }
        };

        const checkStatus = async () => {
            try {
                // Using proxy /did-api to avoid CORS
                const response = await fetch(`/did-api/talks/${talkId}`, options);
                if (!response.ok) throw new Error(`Status Check Failed: ${response.status}`);

                const data = await response.json();

                if (data.status === 'done') {
                    setVideoUrl(data.result_url);
                    setIsGenerating(false);
                    setStatus("Video generated successfully!");
                    return true;
                } else if (data.status === 'error') {
                    throw new Error("D-ID generation failed. Check your API credits or image quality.");
                } else {
                    setStatus(`Processing... (${data.status})`);
                    return false;
                }
            } catch (err) {
                setError(err.message);
                setIsGenerating(false);
                return true;
            }
        };

        const interval = setInterval(async () => {
            const finished = await checkStatus();
            if (finished) clearInterval(interval);
        }, 3000);
    };

    const generateVideo = async () => {
        if (!imagePreview || !prompt.trim()) {
            setError("Please upload an image and provide a script/prompt.");
            return;
        }

        setIsGenerating(true);
        setError(null);
        setStatus("Connecting to D-ID via Proxy...");

        try {
            // 1. Convert cropped image blob URL back to binary data
            const responseBlob = await fetch(imagePreview);
            const blob = await responseBlob.blob();

            // 2. Upload to D-ID's temporary storage
            const formData = new FormData();
            formData.append('image', blob, 'image.jpg');

            console.log("Starting Upload step with key:", RAW_KEY.substring(0, 5) + "...");

            // USING PROXY /did-api to solve CORS
            const uploadStatus = await fetch('/did-api/images', {
                method: 'POST',
                headers: {
                    'Authorization': AUTH_HEADER
                },
                body: formData
            });

            if (!uploadStatus.ok) {
                const errBody = await uploadStatus.text();
                console.error("D-ID Upload Error Body via Proxy:", errBody);
                try {
                    const parsedErr = JSON.parse(errBody);
                    throw new Error(`Upload Failed (${uploadStatus.status}): ${parsedErr.message || parsedErr.description || "Forbidden"}`);
                } catch (e) {
                    throw new Error(`Upload Failed (${uploadStatus.status}): ${errBody || "Check your credits or API key profile"}`);
                }
            }

            const uploadData = await uploadStatus.json();
            if (!uploadData.url) throw new Error("No URL returned from D-ID image upload.");

            setStatus("Initiating AI Animation...");

            // 3. Start talk generation
            const options = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': AUTH_HEADER
                },
                body: JSON.stringify({
                    source_url: uploadData.url,
                    script: {
                        type: 'text',
                        subtitles: 'false',
                        provider: { type: 'microsoft', voice_id: 'en-US-JennyNeural' },
                        input: prompt
                    },
                    config: { fluent: 'false', pad_audio: '0.0' }
                })
            };

            const talkResponse = await fetch('/did-api/talks', options);
            if (!talkResponse.ok) {
                const talkErrBody = await talkResponse.text();
                console.error("D-ID Talk Error Body via Proxy:", talkErrBody);
                throw new Error(`Talk Creation Failed: ${talkErrBody}`);
            }

            const data = await talkResponse.json();
            if (data.id) {
                setStatus("D-ID is processing your video...");
                pollVideoStatus(data.id);
            } else {
                throw new Error("No Talk ID returned from D-ID.");
            }

        } catch (err) {
            console.error("MindPulse D-ID Integration Error:", err);
            setError(err.message);
            setIsGenerating(false);
        }
    };

    return (
        <section className="py-20 px-4 bg-slate-50 dark:bg-slate-900/50 min-h-[600px] flex items-center justify-center">
            <div className="max-w-xl w-full">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="bg-white dark:bg-slate-800 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 shadow-xl border border-slate-200 dark:border-slate-700 text-center relative overflow-hidden"
                >
                    <div className="mb-8">
                        <h2 className="text-3xl md:text-4xl font-black mb-3 text-slate-900 dark:text-white flex items-center justify-center gap-3">
                            <Sparkles className="text-sky-500" />
                            AI Video Presence
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 font-medium tracking-tight">Animate your photos into talking digital beings.</p>
                    </div>

                    <div className="relative group mb-8">
                        {/* Coming Soon Overlay */}
                        <div className="absolute inset-0 z-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-[2.5rem] flex flex-col items-center justify-center border-2 border-dashed border-sky-500/30">
                            <div className="bg-sky-500 text-white px-6 py-2 rounded-full font-black text-sm shadow-xl flex items-center gap-2 mb-2">
                                <Sparkles size={16} /> Coming Soon
                            </div>
                            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 max-w-[200px]">Service is under maintenance for higher quality output.</p>
                        </div>

                        <AnimatePresence mode="wait">
                            {showCropper ? (
                                <motion.div
                                    key="cropper"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="relative h-72 w-full rounded-3xl overflow-hidden bg-black shadow-inner border-2 border-sky/30"
                                >
                                    <Cropper
                                        image={tempImage}
                                        crop={crop}
                                        zoom={zoom}
                                        aspect={1}
                                        onCropChange={setCrop}
                                        onCropComplete={onCropComplete}
                                        onZoomChange={setZoom}
                                    />
                                    <div className="absolute bottom-4 left-0 right-0 px-4 flex justify-between gap-2 z-10">
                                        <button
                                            onClick={() => setShowCropper(false)}
                                            className="px-4 py-2 bg-white/20 backdrop-blur-md text-white rounded-xl text-xs font-bold hover:bg-white/30 transition-all border border-white/20"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={confirmCrop}
                                            className="px-4 py-2 bg-sky text-slate-800 rounded-xl text-xs font-bold hover:bg-sky/80 transition-all flex items-center gap-2 shadow-lg"
                                        >
                                            <Check size={14} /> Confirm Crop
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="preview"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="relative"
                                >
                                    {imagePreview ? (
                                        <div className="relative aspect-square max-w-[280px] mx-auto group">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-full object-cover rounded-[2.5rem] shadow-2xl border-4 border-white dark:border-slate"
                                            />
                                            <button
                                                onClick={removeImage}
                                                className="absolute -top-3 -right-3 bg-red-500 text-white p-2 rounded-2xl shadow-lg hover:bg-red-600 transition-all border-2 border-white"
                                                title="Remove Image"
                                            >
                                                <X size={18} />
                                            </button>
                                            <button
                                                onClick={() => { setTempImage(imagePreview); setShowCropper(true); }}
                                                className="absolute -bottom-3 -right-3 bg-sky text-slate-800 p-2 rounded-2xl shadow-lg hover:bg-sky/80 transition-all border-2 border-white"
                                                title="Recrop Image"
                                            >
                                                <Crop size={18} />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer block group">
                                            <div className="aspect-video rounded-[2.5rem] border-2 border-dashed border-sage/40 dark:border-slate/40 flex flex-col items-center justify-center transition-all group-hover:border-sky group-hover:bg-sky/5 bg-sage/5">
                                                <div className="p-5 bg-white dark:bg-navy/30 rounded-3xl shadow-lg mb-4 group-hover:scale-110 transition-transform">
                                                    <Upload size={40} className="text-sky-500" />
                                                </div>
                                                <span className="text-sm font-bold text-slate-500 dark:text-sage/40">Select Face Image</span>
                                                <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest font-black">PNG, JPG up to 10MB</p>
                                            </div>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
                                        </label>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="mb-8 text-left opacity-30 pointer-events-none">
                        <label className="block text-xs font-black uppercase text-slate-400 mb-3 px-1 tracking-widest">
                            AI Voice Script
                        </label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Type what you want the AI to say... (e.g. 'I am always by your side.')"
                            className="w-full p-5 rounded-[2rem] bg-sage/10 dark:bg-navy/30 border border-sage/20 focus:outline-none focus:ring-4 focus:ring-sky/10 text-sm text-slate-700 dark:text-sage h-32 resize-none shadow-inner"
                        />
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl text-sm flex items-center gap-3 font-medium border border-red-100 dark:border-red-900/30"
                        >
                            <AlertCircle size={18} />
                            {error}
                        </motion.div>
                    )}

                    {status && !videoUrl && (
                        <div className="mb-6 text-sm font-bold text-sky-600 dark:text-sky-400 flex items-center justify-center gap-3">
                            <span className="w-2 h-2 bg-sky-500 rounded-full animate-ping" />
                            {status}
                        </div>
                    )}

                    {!videoUrl ? (
                        <button
                            onClick={generateVideo}
                            disabled={true}
                            className="w-full bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 py-5 rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 cursor-not-allowed"
                        >
                            <Video size={24} />
                            Animate - Coming Soon
                        </button>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <div className="relative">
                                <video
                                    src={videoUrl}
                                    controls
                                    autoPlay
                                    className="w-full rounded-[3rem] shadow-2xl border-8 border-white dark:border-slate"
                                />
                            </div>
                            <button
                                onClick={() => { setVideoUrl(null); setStatus(""); }}
                                className="inline-flex items-center gap-2 text-sm text-sky-600 font-black hover:underline group"
                            >
                                <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
                                Create Another Animation
                            </button>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </section>
    );
};

export default VideoGenSection;
