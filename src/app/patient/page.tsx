'use client'

import React, { useEffect, useState } from 'react';

export default function page() {
    const [response, setResponse] = useState<string | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem("medicalSummary");
        if (stored) {
            setResponse(stored);
        }
    }, []);

    return (
        <div className="p-8">
        <h1 className="text-xl font-bold mb-4">Medical Summary Result</h1>
        {response ? (
            <pre style={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                background: "#f4f4f4",
                padding: "10px",
                borderRadius: "5px"
            }}>
                {response}
            </pre>
        ) : (
            <p>No result found.</p>
        )}
    </div>
    )
}