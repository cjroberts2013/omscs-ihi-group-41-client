'use client'

import React, { useState } from "react";
import { useForm } from "react-hook-form";

export default function Page() {
    const { register, handleSubmit } = useForm();
    const [response, setResponse] = useState<string | null>(null);  // Store response as a string
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const onSubmit = async (data: any) => {
        if (loading) return; // Prevent multiple submissions
        setLoading(true);
        setError(null);
        setResponse(null);

        const formData = new FormData();
        formData.append("file", data.file[0]);

        try {
            const res = await fetch("http://45.79.210.59:8000/medical-summary-audio", {
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
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="file" {...register("file", { required: true })} accept="audio/*" />
                <button type="submit" disabled={loading}>
                    {loading ? "Uploading..." : "Upload"}
                </button>
            </form>

            {loading && <p>Uploading file, please wait...</p>} {/* Show message while uploading */}
            {error && <p style={{ color: "red" }}>{error}</p>}
            
            {response && (
                <div>
                    <h3>Raw API Response:</h3>
                    <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", background: "#f4f4f4", padding: "10px", borderRadius: "5px" }}>
                        {response}
                    </pre>
                </div>
            )}
        </div>
    );
}
