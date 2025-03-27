'use client'

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { MicrophoneIcon } from '@heroicons/react/24/outline'

export default function Page() {
    const { register, handleSubmit } = useForm();
    const [response, setResponse] = useState<string | null>(null);  // Store response as a string
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [playbackSource, setPlaybackSource] = useState<string | undefined>(undefined);

    let can_record = false;
    let is_recording = false;
    let recorder: MediaRecorder;
    let chunks = [];

    useEffect(() => {
        const getMedia = async () => {
            // try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            })
            .then(SetupStream)
            .catch (err => {
                console.error("Error accessing media devices.", err);
            })
        }

        getMedia();
    }, []);

    function SetupStream(stream) {
        console.log("SetupStream");
        recorder = new MediaRecorder(stream);

        recorder.ondataavailable = e => {
            // @ts-ignore
            chunks.push(e.data);
        }

        recorder.onstop = e => {
            const blob = new Blob(chunks, { type: 'audio/mp4; codecs=opus' });
            chunks = [];
            const audioURL = URL.createObjectURL(blob);
            setPlaybackSource(audioURL);
        }

        can_record = true;
    }

    function ToggleMic() {
        console.log("ToggleMic");
        if (!can_record) return;

        is_recording = !is_recording;

        if (is_recording) {
            recorder.start();
        } else {
            recorder.stop();
        }
    }

    const onSubmit = async (data: any) => {
        if (loading) return; // Prevent multiple submissions
        setLoading(true);
        setError(null);
        setResponse(null);

        const formData = new FormData();
        formData.append("file", data.file[0]);

        try {
            const res = await fetch("https://45.79.210.59:8000/medical-summary-audio", {
                method: "POST",
                body: formData,
            });

            const result = await res.json();

            if (res.ok) {
                // Convert response to a readable string and store it
                setResponse(JSON.stringify(result, null, 2));
            } else {
                setError(result.error || "Something went wrong.");
            }
        } catch (err) {
            setError("Error connecting to server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="App">
            <div
                className="mt-2 flex justify-center rounded-lg px-6 py-10">
                <div className="text-center">
                    <button type={"button"}
                            onClick={ToggleMic}
                            className="rounded-lg bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
                        <MicrophoneIcon aria-hidden="true" className="mx-auto size-12 text-white" />
                    </button>

                    <audio className="playback mt-4 mb-12" controls src={playbackSource}></audio>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <label
                            htmlFor="audio-file"
                            className="mt-12 mb-12 rounded-md px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-2 ring-inset ring-gray-400 bg-gray-100 hover:bg-gray-200"
                        >
                            <span className="">Click here to upload a file</span>
                            <input id="audio-file" type="file" {...register("file", {required: true})}
                                   accept="audio/*" className="sr-only"/>
                        </label>

                        <p className="mt-4 text-xs/5 text-gray-600">M4A, MP3, WAV, etc...</p>

                        <button type="submit"
                                className="mt-8 rounded-md bg-gray-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-600"
                                disabled={loading || is_recording || (playbackSource === undefined)}>
                            {loading ? "Processing..." : "Process Recording"}
                        </button>

                    </form>
                </div>
            </div>

            {loading && <p>Uploading file, please wait...</p>} {/* Show message while uploading */}
            {error && <p style={{color: "red"}}>{error}</p>}

            {response && (
                <div>
                    <h3>Raw API Response:</h3>
                    <pre style={{
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        background: "#f4f4f4",
                        padding: "10px",
                        borderRadius: "5px"
                    }}>
                {response}
            </pre>
                </div>
            )}
        </div>
    );
}
