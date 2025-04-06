"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";

type Patient = {
    id: number;
    name: string;
    dob: string;
    age: number;
    gender: string;
    maritalStatus: string;
    allergy: string;
    medication: string;
    medDosage: string;
    condition: string;
    alcohol: string;
    smoker: string;
    temperature: string;
    bloodPressure: string;
    oxygenSaturation: string;
    symptoms: string;
    recommendedFollowups: string;
    transcript: string;
  };

export default function PatientPage() {



            const more_patients = [
            { id: 1, name: "John Doe", dob: "03/01/1980", age: 45, gender: "Male", maritalStatus: "Unknown", allergy: "None", medication: "Lipitor", medDosage: "20 mg", condition: "Hypertension", alcohol: "Frequently", smoker: "Occasionally", temperature: "97", bloodPressure: "130/20", oxygenSaturation: "97%", symptoms: "Sore throat", recommendedFollowups: "Rest, cough syrup" },
            { id: 2, name: "Jane Smith", dob: "02/17/1973", age: 52, gender: "Female", maritalStatus: "Married", allergy: "Seafood, Peanuts", medication: "Tylenol, Diabetes Medicine", medDosage: "Unknown", condition: "Diabetes", alcohol: "Occasionally", smoker: "Never", temperature: "101", bloodPressure: "120/80", oxygenSaturation: "98%", symptoms: "Fever, Runny nose", recommendedFollowups: "Rest, antibiotics, flu shot" }
        ];
    
        // Get unique conditions and genders for dropdown filters
        const conditions = Array.from(new Set(more_patients.map((p) => p.condition)));
        const genders = Array.from(new Set(more_patients.map((p) => p.gender)));
    


    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGender, setSelectedGender] = useState("");
    const [selectedCondition, setSelectedCondition] = useState("");
    const [response, setResponse] = useState<string | null>(null);
    const [showTranscript, setShowTranscript] = useState(false);
    const [editingCell, setEditingCell] = useState<{ id: number; field: keyof Patient } | null>(null);
    const [editValue, setEditValue] = useState<string>("");
    const [patients, setPatients] = useState<Patient[]>([]);

            // Filter logic
        const filteredPatients = patients.filter((patient) =>
            patient.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            (selectedGender === "" || patient.gender === selectedGender) &&
            (selectedCondition === "" || patient.condition === selectedCondition)
        );      
    useEffect(() => {
        const stored = localStorage.getItem("medicalSummary");
        if (stored) {
            setResponse(stored);
        }
    }, []);

    // We need to massage the 'response' object here to generate the table below:
    console.log("THIS IS THE RESPONSE FROM THE BACKEND:")
    console.log(response)

    useEffect(() => {
        const patientData = localStorage.getItem("medicalSummary");
        if (!patientData) return; // nothing to parse
      
        try {
          const parsedData = JSON.parse(patientData);
          // Check if the required structure exists
          if (!parsedData?.medical_facts) return;
      
          const facts = parsedData.medical_facts;
          // Validate required fields exist
          if ( !facts.patientName || !facts.dob || !facts.age || !facts.gender) {
            console.warn("Missing essential patient data");
            return;
          }
      
          const patientDataMapped: Patient = {
            id: 1, // you can generate a dynamic ID if needed
            name: facts.patientName,
            dob: facts.dob,
            age: facts.age,
            gender: facts.gender.charAt(0).toUpperCase() + facts.gender.slice(1),
            maritalStatus: facts.maritalStatus || "Unknown",
            allergy: facts.allergy || "None",
            medication: facts.medication || "None",
            medDosage: facts.medDosage || "Unknown",
            condition: facts.condition || "None",
            alcohol: facts.alcoholUse || "Unknown",
            smoker: facts.smokingStatus || "Unknown",
            temperature: facts.temperature || "N/A",
            bloodPressure: facts.bloodPressure || "N/A",
            oxygenSaturation: facts.oxygenSaturation || "N/A",
            symptoms: Array.isArray(facts.symptoms) ? facts.symptoms.join(", ") : "",
            recommendedFollowups: facts.recommendedFollowUps || "None",
            transcript: facts.full_transcript || "",
          };
      
          setPatients([patientDataMapped]);
          setResponse(patientData); // optional: you can keep or remove this
        } catch (err) {
          console.error("Failed to parse medicalSummary:", err);
        }
      }, []);

    const handleSave = (id: number, field: keyof Patient) => {
        setPatients((prev) =>
          prev.map((patient) =>
            patient.id === id ? { ...patient, [field]: editValue } : patient
          )
        );
        setEditingCell(null); // Close the editor
        setEditValue(""); // Reset input field
      };

      const handleConfirm = (patient: Patient) => {
        // Send patient data to backend to be stored in db
        console.log("Preparing to send data to db")
        fetch("https://45.79.210.59:8000/store-medical-record", {
        // fetch("http://localhost:8000/store-medical-record", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(patient),
        })
          .then((response) => response.json())
          .then((data) => {
            alert("Patient confirmed!");
            // backend response: 
            console.log(data)
          })
          .catch((error) => {
            console.error("Error confirming patient:", error);
          });
      };      

      const renderCell = (patient: Patient, field: keyof Patient) => {
        if (editingCell?.id === patient.id && editingCell.field === field) {
          return (
            <input className="w-full p-1 border rounded" autoFocus type="text" value={editValue} // Controlled input
              onChange={(e) => setEditValue(e.target.value)} // Update input field
              onBlur={() => handleSave(patient.id, field)} // Save on blur
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSave(patient.id, field); // Save on Enter key
                }
              }}
            />
          );
        } else {
          return (
            <span
              className="cursor-pointer"
              onClick={() => {
                setEditingCell({ id: patient.id, field });
                setEditValue(String(patient[field])); // Populate input with current value
              }}
            >
              {String(patient[field])}
            </span>
          );
        }  
        
      };

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-center">Patient Data</h1>
        <h2 className="text-2xl font-bold mb-6 text-center">Most Recent Interaction:</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 shadow-lg bg-white">
          <thead>
            <tr className="bg-gray-500 text-white">
              <th className="border p-2">Verify</th>
              {patients.length > 0 &&
                Object.keys(patients[0] || {}).map((key) =>
                  key === "transcript" ? (
                    <th key={key} className="border p-2 capitalize cursor-pointer bg-gray-600 hover:bg-gray-700"
                      onClick={() => setShowTranscript(!showTranscript)}
                    >
                      {showTranscript ? "Hide Transcript" : "Show Full Transcript"}
                    </th>
                  ) : (
                    <th key={key} className="border p-2 capitalize">
                      {key}
                    </th>
                  )
                )}
            </tr>
          </thead>              
          <tbody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <tr key={patient.id} className="text-center odd:bg-gray-100 hover:bg-gray-200">
                  <td className="border p-2">
                    <button onClick={() => handleConfirm(patient)} className="bg-green-500 text-white p-2 rounded">
                      Confirm
                    </button>
                  </td>
                  {Object.entries(patient).map(([key, _]) => {
                    if (key === "transcript" && !showTranscript) return null;
                  
                    return (
                      <td key={key} className="border p-2">
                        {renderCell(patient, key as keyof Patient)}
                      </td>
                    );
                  })}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={Object.keys(patients[0] || {}).length + 1}
                  className="border p-4 text-center text-gray-500"
                >
                  No patients found.
                </td>
              </tr>
            )}
          </tbody>
          </table>
          <div className="mt-4 flex justify-center">
          <div className="mt-4 flex justify-center">
          <button
            onClick={() => {localStorage.removeItem("medicalSummary"); setPatients([]);
              setResponse(null);
              alert("Patient data has been reset.");
              router.push("/recording");
            }}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Start over and Re-record
          </button>
         </div>
        </div>
        <div className="mt-4 flex justify-center">
        </div>
        </div>
        <br/>
        {/* IN HERE WE CAN ADD THE TABLE WITH THE DATA FROM THE DB AND FILTER IT */}
        
        
        <h2 className="text-2xl font-bold mb-6 text-center">Saved and Confirmed Interaction(s):</h2>
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