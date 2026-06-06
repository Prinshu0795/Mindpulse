import React, { useState, useCallback } from 'react';
import { Upload, Video, Sparkles, AlertCircle, X, Crop, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../utils/cropImage';

const RAW_KEY = import.meta.env.VITE_DID_API_KEY;
const AUTH_HEADER = `Basic ${btoa(RAW_KEY)}`;

const VideoGenSection = () => {
    const [imagePreview, setImagePreview] = useState(null);
    const [prompt, setPrompt] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [videoUrl, setVideoUrl] = useState(null);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState("");

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
            headers: { accept: 'application/json', authorization: AUTH_HEADER }
        };

        const checkStatus = async () => {
            try {
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
        setStatus("Connecting to service...");

        try {
            const responseBlob = await fetch(imagePreview);
            const blob = await responseBlob.blob();

            const formData = new FormData();
            formData.append('image', blob, 'image.jpg');

            const uploadStatus = await fetch('/did-api/images', {
                method: 'POST',
                headers: { 'Authorization': AUTH_HEADER },
                body: formData
            });

            if (!uploadStatus.ok) {
                const errBody = await uploadStatus.text();
                throw new Error(`Upload Failed`);
            }

            const uploadData = await uploadStatus.json();
            if (!uploadData.url) throw new Error("No URL returned from image upload.");

            setStatus("Initiating AI Animation...");

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
                throw new Error(`Talk Creation Failed`);
            }

            const data = await talkResponse.json();
            if (data.id) {
                setStatus("Processing your video...");
                pollVideoStatus(data.id);
            } else {
                throw new Error("No Talk ID returned.");
            }

        } catch (err) {
            setError(err.message);
            setIsGenerating(false);
        }
    };

    return (
        <section className="px-4 bg-bg min-h-[600px] flex items-center justify-center">
            <div className="max-w-xl w-full">
                <div className="bg-surface rounded-xl p-6 md:p-12 border border-border text-center relative overflow-hidden">
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold mb-2 text-text-primary flex items-center justify-center gap-3">
                            <Sparkles className="text-accent" />
                            AI Video Presence
                        </h2>
                        <p className="text-text-secondary">Animate your photos into talking digital beings.</p>
                    </div>

                    <div className="relative group mb-8">
                        {/* Coming Soon Overlay */}
                        <div className="absolute inset-0 z-20 bg-surface/95 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-xl">
                            <div className="bg-accent text-white px-6 py-2 rounded-lg font-bold text-sm mb-2 flex items-center gap-2">
                                <Sparkles size={16} /> Coming Soon
                            </div>
                            <p className="text-sm font-medium text-text-secondary max-w-[200px]">Service is under maintenance for higher quality output.</p>
                        </div>

                        <AnimatePresence mode="wait">
                            {showCropper ? (
                                <motion.div
                                    key="cropper"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="relative h-72 w-full rounded-xl overflow-hidden bg-black border border-border"
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
                                            className="px-4 py-2 bg-surface text-text-primary rounded-lg text-sm font-medium hover:bg-bg transition-colors border border-border"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={confirmCrop}
                                            className="px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors flex items-center gap-2"
                                        >
                                            <Check size={16} /> Confirm
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    {imagePreview ? (
                                        <div className="relative aspect-square max-w-[280px] mx-auto group">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-full object-cover rounded-xl border border-border"
                                            />
                                            <button
                                                onClick={removeImage}
                                                className="absolute -top-3 -right-3 bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors shadow-sm"
                                                title="Remove Image"
                                            >
                                                <X size={16} />
                                            </button>
                                            <button
                                                onClick={() => { setTempImage(imagePreview); setShowCropper(true); }}
                                                className="absolute -bottom-3 -right-3 bg-surface text-text-primary border border-border p-2 rounded-lg hover:bg-bg transition-colors shadow-sm"
                                                title="Recrop Image"
                                            >
                                                <Crop size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer block group">
                                            <div className="aspect-video rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center transition-colors group-hover:border-accent group-hover:bg-bg bg-surface">
                                                <div className="p-4 bg-bg rounded-lg mb-3">
                                                    <Upload size={32} className="text-text-secondary" />
                                                </div>
                                                <span className="text-sm font-medium text-text-secondary">Select Face Image</span>
                                            </div>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
                                        </label>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="mb-8 text-left opacity-30 pointer-events-none">
                        <label className="block text-sm font-medium text-text-secondary mb-2">
                            AI Voice Script
                        </label>
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Type what you want the AI to say..."
                            className="w-full p-4 rounded-xl bg-bg border border-border focus:outline-none focus:ring-2 focus:ring-accent/50 text-sm text-text-primary h-32 resize-none"
                        />
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-center gap-3 font-medium">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    {status && !videoUrl && (
                        <div className="mb-6 text-sm font-medium text-text-secondary flex items-center justify-center gap-2">
                            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                            {status}
                        </div>
                    )}

                    {!videoUrl ? (
                        <button
                            disabled={true}
                            className="w-full bg-bg border border-border text-text-secondary py-4 rounded-xl font-medium text-lg flex items-center justify-center gap-2 cursor-not-allowed"
                        >
                            <Video size={20} />
                            Animate - Coming Soon
                        </button>
                    ) : (
                        <div className="space-y-6">
                            <video src={videoUrl} controls autoPlay className="w-full rounded-xl border border-border" />
                            <button
                                onClick={() => { setVideoUrl(null); setStatus(""); }}
                                className="inline-flex items-center gap-2 text-sm text-accent font-medium hover:text-accent/80 transition-colors"
                            >
                                <Sparkles size={16} />
                                Create Another Animation
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default VideoGenSection;
