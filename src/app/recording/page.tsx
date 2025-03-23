'use client'

import React from "react";
import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";

export default function page() {
    const { register, handleSubmit } = useForm();

    const onSubmit = () => {
        // const formData = new FormData();
        // formData.append("file", data.file[0]);
        //
        // const res =  fetch("http://45.79.210.59:8000/medical-summary-audio", {
        //     method: "POST",
        //     body: formData,
        // }).then((res) => res.json());
        // alert(JSON.stringify(`${res.message}, status: ${res.status}`));

        var data = new FormData();
        var audioFile = {AudioFile};
        data.append("file", audioFile);

        fetch("http://45.79.210.59:8000/medical-summary-audio", {
            mode: 'no-cors',
            method: "POST",
            headers: {
                "Content-Type": "multipart/form-data",
                "Accept": "application/json",
                "type": "formData"
            },
            body: data
        })




    };

    return (
        <div className="App">
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="file" {...register("file")} />

                <input type="submit"/>
            </form>
        </div>
    )
}