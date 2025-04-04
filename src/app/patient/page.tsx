"use client";
import { useState } from "react";

export default function PatientPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGender, setSelectedGender] = useState("");
    const [selectedCondition, setSelectedCondition] = useState("");

    const patients = [
        { id: 1, name: "John Doe", dob: "03/01/1980", age: 45, gender: "Male", maritalStatus: "Unknown", allergy: "None", medication: "Lipitor", medDosage: "20 mg", condition: "Hypertension", alcohol: "Frequently", smoker: "Occasionally", temperature: "97", bloodPressure: "130/20", oxygenSaturation: "97%", symptoms: "Sore throat", recommendedFollowups: "Rest, cough syrup" },
        { id: 2, name: "Jane Smith", dob: "02/17/1973", age: 52, gender: "Female", maritalStatus: "Married", allergy: "Seafood, Peanuts", medication: "Tylenol, Diabetes Medicine", medDosage: "Unknown", condition: "Diabetes", alcohol: "Occasionally", smoker: "Never", temperature: "101", bloodPressure: "120/80", oxygenSaturation: "98%", symptoms: "Fever, Runny nose", recommendedFollowups: "Rest, antibiotics, flu shot" }
    ];

    // Get unique conditions and genders for dropdown filters
    const conditions = Array.from(new Set(patients.map((p) => p.condition)));
    const genders = Array.from(new Set(patients.map((p) => p.gender)));

    // Filter logic
    const filteredPatients = patients.filter((patient) =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedGender === "" || patient.gender === selectedGender) &&
        (selectedCondition === "" || patient.condition === selectedCondition)
    );

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center">Patient Data</h1>

            {/* Filters Section */}
            <div className="mb-6 flex flex-wrap gap-4 justify-center">
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border p-2 rounded-lg w-1/4 shadow-md"
                />
                <select
                    value={selectedGender}
                    onChange={(e) => setSelectedGender(e.target.value)}
                    className="border p-2 rounded-lg w-1/4 shadow-md"
                >
                    <option value="">All Genders</option>
                    {genders.map((gender) => (
                        <option key={gender} value={gender}>
                            {gender}
                        </option>
                    ))}
                </select>
                <select
                    value={selectedCondition}
                    onChange={(e) => setSelectedCondition(e.target.value)}
                    className="border p-2 rounded-lg w-1/4 shadow-md"
                >
                    <option value="">All Conditions</option>
                    {conditions.map((condition) => (
                        <option key={condition} value={condition}>
                            {condition}
                        </option>
                    ))}
                </select>
            </div>

            {/* Patient Table */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 shadow-lg bg-white">
                    <thead>
                    <tr className="bg-blue-500 text-white">
                        <th className="border p-2">ID</th>
                        <th className="border p-2">Name</th>
                        <th className="border p-2">DOB</th>
                        <th className="border p-2">Age</th>
                        <th className="border p-2">Gender</th>
                        <th className="border p-2">Marital Status</th>
                        <th className="border p-2">Allergies</th>
                        <th className="border p-2">Medications</th>
                        <th className="border p-2">Medication Dosage</th>
                        <th className="border p-2">Condition</th>
                        <th className="border p-2">Alcohol</th>
                        <th className="border p-2">Smoking</th>
                        <th className="border p-2">Temperature</th>
                        <th className="border p-2">Blood Pressure</th>
                        <th className="border p-2">Oxygen Saturation</th>
                        <th className="border p-2">Symptoms</th>
                        <th className="border p-2">Recommended Follow-ups</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredPatients.length > 0 ? (
                        filteredPatients.map((patient) => (
                            <tr key={patient.id} className="text-center odd:bg-gray-100 hover:bg-gray-200">
                                <td className="border p-2">{patient.id}</td>
                                <td className="border p-2">{patient.name}</td>
                                <td className="border p-2">{patient.dob}</td>
                                <td className="border p-2">{patient.age}</td>
                                <td className="border p-2">{patient.gender}</td>
                                <td className="border p-2">{patient.maritalStatus}</td>
                                <td className="border p-2">{patient.allergy}</td>
                                <td className="border p-2">{patient.medication}</td>
                                <td className="border p-2">{patient.medDosage}</td>
                                <td className="border p-2">{patient.condition}</td>
                                <td className="border p-2">{patient.alcohol}</td>
                                <td className="border p-2">{patient.smoker}</td>
                                <td className="border p-2">{patient.temperature}</td>
                                <td className="border p-2">{patient.bloodPressure}</td>
                                <td className="border p-2">{patient.oxygenSaturation}</td>
                                <td className="border p-2">{patient.symptoms}</td>
                                <td className="border p-2">{patient.recommendedFollowups}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={17} className="border p-4 text-center text-gray-500">
                                No patients found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
