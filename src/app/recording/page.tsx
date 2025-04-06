'use client'

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { MicrophoneIcon } from '@heroicons/react/24/outline'
import { useRouter } from "next/navigation"; // for App Router (e.g. /app structure)
import { StopIcon } from '@heroicons/react/24/outline';

export default function Page() {
    const router = useRouter(); 
    const [selectedFileName, setSelectedFileName] = useState<string | null>(null); //Add this line for file 
    const { register, handleSubmit } = useForm();
    const [response, setResponse] = useState<string | null>(null);  // Store response as a string
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [playbackSource, setPlaybackSource] = useState<string | undefined>(undefined);
    const [canRecord, setCanRecord] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const recorderRef = React.useRef<MediaRecorder | null>(null);
    const chunksRef = React.useRef<Blob[]>([]);
    const [recordingStoppedAt, setRecordingStoppedAt] = useState<Date | null>(null);

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
    const recorder = new MediaRecorder(stream);
    recorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/mp4; codecs=opus' });
        chunksRef.current = [];
        const audioURL = URL.createObjectURL(blob);
        setPlaybackSource(audioURL);
    };
    setCanRecord(true);
    }

    function ToggleMic() {
        console.log("ToggleMic");
        if (!canRecord || !recorderRef.current) return;

        if (!isRecording) {
            recorderRef.current.start();
            setIsRecording(true);
        } else {
            recorderRef.current.stop();
            setIsRecording(false);
        }
        setRecordingStoppedAt(new Date());
    }

    const onSubmit = async (data: any) => {
        console.log("Preparing to submit recording...")
        if (loading) return; // Prevent multiple submissions
        if (!data.file?.[0] && !playbackSource) {
            alert("Please upload a file or record audio before submitting.");
            return;
        }
        setLoading(true);
        setError(null);
        setResponse(null);
        const formData = new FormData();
        if (data.file?.[0]) {
            formData.append("file", data.file[0]);
          } else if (playbackSource) {
            try {
              const response = await fetch(playbackSource);
              const blob = await response.blob();
              const file = new File([blob], "recording.m4a", { type: blob.type || "audio/m4a" });
              formData.append("file", file);
            } catch (error) {
              setError("Failed to process recording.");
              setLoading(false);
              return;
            }
          }

        try {
            // const res = await fetch("https://45.79.210.59:8000/medical-summary-audio", {
            const res = await fetch("http://localhost:8000/medical-summary-audio", {                
                method: "POST",
                body: formData,
            });
            const result = await res.json();
            if (res.ok) {
                const resultString = JSON.stringify(result, null, 2);
                localStorage.setItem("medicalSummary", resultString);
                router.push("/patient"); 
            } else {
                setError(result.error || "Something went wrong.");
            }
        } catch (err) {
            setError("Error connecting to server.");
        } finally {
            setLoading(false);
            setSelectedFileName(null);
        }
    };

    return (
        <div className="App">
        <div className="mt-6 mb-8 text-base text-gray-700 bg-gray-100 p-5 rounded-md shadow-sm ring-1 ring-gray-300 leading-relaxed">
          <p className="mb-3 font-semibold">To submit your recorded interaction, you have two options:</p>
          <ol className="list-decimal list-inside space-y-2">
            <li>
              Click the <span className="text-red-600 font-semibold inline-flex items-center">
                red icon <MicrophoneIcon className="ml-1 inline-block h-5 w-5 text-red-600" />
              </span> to record your interaction from the app.
            </li>
            <li>
              Click the <span className="font-semibold text-gray-800">"Click here to upload a file"</span> button and select a file to upload from your device.
            </li>
          </ol>
          <p className="mt-4">
            Once done, look for the <span className="text-green-600 font-semibold">green confirmation</span> indicating your audio is ready.
            Then, click <span className="font-semibold text-gray-800">"Process Recording"</span> to submit.
            Lastly, when the system processes the request, you will be redirected to the
            <a href="/patient" className="text-blue-600 underline font-medium ml-1">Patient</a> view with the details.
          </p>
        </div>  
            <div
                className="mt-2 flex justify-center rounded-lg px-6 py-10">
                <div className="text-center">
                    <button type={"button"}
                            onClick={ToggleMic}
                            className="rounded-lg bg-red-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">
                        {isRecording ? (
                        <StopIcon aria-hidden="true" className="mx-auto size-12 text-white" />
                         ) : (
                        <MicrophoneIcon aria-hidden="true" className="mx-auto size-12 text-white" />
                        )}
                    </button>

                    <audio className="playback mt-4 mb-12" controls src={playbackSource}></audio>
                    {playbackSource && !isRecording && recordingStoppedAt && (
                      <p className="text-sm text-green-600 mb-8">
                        🎤 Recorded audio at{" "}
                        <strong>{recordingStoppedAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</strong>{" "}
                        is ready for submission.
                      </p>
                    )}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <label
                            htmlFor="audio-file"
                            className="mt-12 mb-12 rounded-md px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-2 ring-inset ring-gray-400 bg-gray-100 hover:bg-gray-200"
                        >
                            <span className="">Click here to upload a file</span>
                            <input id="audio-file" type="file" {...register("file")} accept="audio/*" className="sr-only"
                                onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setSelectedFileName(file.name);
                                } else {
                                    setSelectedFileName(null);
                                }
                              }}/>
                        </label>
                        <p className="mt-4 text-xs/5 text-gray-600">M4A, MP3, WAV, etc...</p>
                        {selectedFileName && (
                        <p className="mt-4 text-sm text-green-600">
                            Selected file: <strong>{selectedFileName}</strong>
                        </p>
                        )}
                        <button type="submit"
                                className="mt-8 rounded-md bg-gray-900 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-grey-600"
                                disabled={loading || isRecording || (!selectedFileName && !playbackSource)}>
                            {loading ? "Processing..." : "Process Recording"}
                        </button>

                    </form>
                </div>
            </div>

            {loading && <p>Uploading file, please wait...</p>} {/* Show message while uploading */}
            {error && <p style={{color: "red"}}>{error}</p>}
        </div>
    );
}
