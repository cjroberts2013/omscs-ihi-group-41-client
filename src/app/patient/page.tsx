"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";

type Patient = {
    id: number;
    patient_name: string;
    dob: string;
    age: number;
    gender: string;
    marital_status: string;
    allergy: string;
    medication: string;
    med_dosage: string;
    conditions: string;
    alcohol_use: string;
    smoking_status: string;
    temperature: string;
    blood_pressure: string;
    oxygen_saturation: string;
    symptoms: string;
    recommended_followups: string;
    full_transcript: string;
  };
  
export default function PatientPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGender, setSelectedGender] = useState("");
    const [selectedCondition, setSelectedCondition] = useState("");
    const [confirmedPatients, setConfirmedPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);


    // const patient_list = [
    //     { id: 1, name: "John Doe", dob: "03/01/1980", age: 45, gender: "Male", maritalStatus: "Unknown", allergy: "None", medication: "Lipitor", medDosage: "20 mg", condition: "Hypertension", alcohol: "Frequently", smoker: "Occasionally", temperature: "97", bloodPressure: "130/20", oxygenSaturation: "97%", symptoms: "Sore throat", recommendedFollowups: "Rest, cough syrup" },
    //     { id: 2, name: "Jane Smith", dob: "02/17/1973", age: 52, gender: "Female", maritalStatus: "Married", allergy: "Seafood, Peanuts", medication: "Tylenol, Diabetes Medicine", medDosage: "Unknown", condition: "Diabetes", alcohol: "Occasionally", smoker: "Never", temperature: "101", bloodPressure: "120/80", oxygenSaturation: "98%", symptoms: "Fever, Runny nose", recommendedFollowups: "Rest, antibiotics, flu shot" }
    // ];

    // Get unique conditions and genders for dropdown filters
    // const conditions = Array.from(new Set(patient_list.map((p) => p.condition)));
    // const genders = Array.from(new Set(patient_list.map((p) => p.gender)));

    // // Filter logic
    // const filteredPatients = patient_list.filter((patient) =>
    //     patient.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    //     (selectedGender === "" || patient.gender === selectedGender) &&
    //     (selectedCondition === "" || patient.condition === selectedCondition)
    // );

    const conditions = Array.from(new Set(confirmedPatients.map((p) => p.conditions)));
    const genders = Array.from(new Set(confirmedPatients.map((p) => p.gender)));
    
    // const filteredPatients = confirmedPatients.filter((patient) =>
    //   patient.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    //   (selectedGender === "" || patient.gender === selectedGender) &&
    //   (selectedCondition === "" || patient.condition === selectedCondition)
    // );
    const filteredPatients = confirmedPatients.filter((patient) =>
        (patient.patient_name ?? "").toLowerCase().includes(searchTerm.toLowerCase()) &&  // default to empty string if null
        (selectedGender === "" || patient.gender === selectedGender) &&
        (selectedCondition === "" || patient.conditions === selectedCondition)
    );

    // Separator for Smita's code and mine ----->
    const router = useRouter();
    const [patient, setPatient] = useState<Patient[]>([]);
    const [response, setResponse] = useState<string | null>(null);
    const [showTranscript, setShowTranscript] = useState(false);
    const [editingCell, setEditingCell] = useState<{ id: number; field: keyof Patient } | null>(null);
    const [editValue, setEditValue] = useState<string>("");
    

    useEffect(() => {
        const stored = localStorage.getItem("medical_facts");
        if (stored) {
            setResponse(stored);
        }
    }, []);


    useEffect(() => {
        // Fetch data from your backend
        fetch("https://omscs-ihi-group-41-server.com/get-medical-records")
        //   fetch("http://localhost:8000/get-medical-records")
          .then(response => response.json())
          .then(data => {
            console.log('Backend response:', data);
            setConfirmedPatients(data.records); // Assuming your backend returns a `records` key
          })
          .catch((error) => {
            console.error('Error fetching records:', error);
          })
          .finally(() => {
            setLoading(false);
          });
      }, []);

    // We need to massage the 'response' object here to generate the table below:
    console.log("Patient response from backend:")
    console.log(response)

    useEffect(() => {
        const patientData = localStorage.getItem("medical_facts");
        if (!patientData) return; // nothing to parse
      
        try {
          const parsedData = JSON.parse(patientData);
          // Check if the required structure exists
          if (!parsedData?.medical_facts) return;
      
          const facts = parsedData.medical_facts;
          
          // Validate required fields exist
          if ( !facts.patient_name || !facts.dob || !facts.age || !facts.gender) {
            console.warn("Missing essential patient data");
            return;
          }
      
          const patientDataMapped: Patient = {
            id: 1, // you can generate a dynamic ID if needed
            patient_name: facts.patient_name,
            dob: facts.dob,
            age: facts.age,
            gender: facts.gender.charAt(0).toUpperCase() + facts.gender.slice(1),
            marital_status: facts.marital_status || "Unknown",
            allergy: facts.allergy || "None",
            medication: facts.medication || "None",
            med_dosage: facts.med_dosage || "Unknown",
            conditions: facts.condition || "None",
            alcohol_use: facts.alcohol_use || "Unknown",
            smoking_status: facts.smoking_status || "Unknown",
            temperature: facts.temperature || "N/A",
            blood_pressure: facts.blood_pressure || "N/A",
            oxygen_saturation: facts.oxygen_saturation || "N/A",
            symptoms: Array.isArray(facts.symptoms) ? facts.symptoms.join(", ") : "",
            recommended_followups: facts.recommended_followups || "None",
            full_transcript: facts.full_transcript || "",
          };
      
          setPatient([patientDataMapped]);
          setResponse(patientData); // optional: you can keep or remove this
        } catch (err) {
          console.error("Failed to parse medical_facts:", err);
        }
      }, []);

      const handleSave = (id: number, field: keyof Patient) => {
        setPatient((prev) =>
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
        console.log("This is being sent:")
        console.log(patient)
        fetch("https://omscs-ihi-group-41-server.com/store-medical-record", {
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
            localStorage.clear(); // This clears all local storage data.
            router.push("/");
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
            {/* {response && (
            <div className="my-4 p-4 bg-gray-100 border rounded">
              <h2 className="text-lg font-semibold mb-2">Raw Response</h2>
              <pre className="whitespace-pre-wrap break-words text-sm bg-white p-2 rounded border overflow-auto max-h-96">
                {response}
              </pre>
            </div>
            )} */}
            <table className="table-auto w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-500 text-white">
                  <th className="border p-2">Verify</th>
                  {patient.length > 0 &&
                    Object.keys(patient[0]).map((key) =>
                      key === "full_transcript" ? (
                        <th
                          key={key}
                          className="border p-2 capitalize cursor-pointer bg-gray-600 hover:bg-gray-700"
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
              {patient.map((p) => (
                <tr key={p.id} className="border-t">
                  <td className="border p-2 text-center">
                  <button onClick={() => handleConfirm(p)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">
                    Confirm</button>
                  </td>
                  {Object.entries(p).map(([key, value]) =>
                    key === "full_transcript" ? (
                      showTranscript && (
                        <td key={key} className="border p-2 whitespace-pre-wrap">
                          {renderCell(p, key as keyof Patient)}
                        </td>
                      )
                    ) : (
                      <td key={key} className="border p-2">
                        {renderCell(p, key as keyof Patient)}
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
            </table>
            <div className="mt-4 flex justify-center">
          <button
            onClick={() => {localStorage.removeItem("medical_facts"); setPatient([]);
              setResponse(null);
              alert("Patient data has been reset.");
              router.push("/recording");
            }}className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">Start over and Re-record </button>
         </div>
            </div>
            <br/>
            
            {/* THIS PART RIGHT HERE CAN BE FETCHED FROM A DB:  */}
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
    <option key={gender} value={gender}>  {/* Use gender as the unique key */}
      {gender}
    </option>
  ))}
</select>
<select
  value={selectedCondition}
  onChange={(e) => setSelectedCondition(e.target.value)}
  className="border p-2 rounded-lg w-1/4 shadow-md"
>
{conditions.map((condition, index) => (
  <option key={index} value={condition}>
    {condition}
  </option>
))}

</select>
            </div>
            {/* Patient Table */}
            <div className="overflow-x-auto">
            {loading ? (
            <p className="text-center text-gray-600">Loading confirmed patients...</p>
            ) : (
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
                                <td className="border p-2">{patient.patient_name}</td>
                                <td className="border p-2">{patient.dob}</td>
                                <td className="border p-2">{patient.age}</td>
                                <td className="border p-2">{patient.gender}</td>
                                <td className="border p-2">{patient.marital_status}</td>
                                <td className="border p-2">{patient.allergy}</td>
                                <td className="border p-2">{patient.medication}</td>
                                <td className="border p-2">{patient.med_dosage}</td>
                                <td className="border p-2">{patient.conditions}</td>
                                <td className="border p-2">{patient.alcohol_use}</td>
                                <td className="border p-2">{patient.smoking_status}</td>
                                <td className="border p-2">{patient.temperature}</td>
                                <td className="border p-2">{patient.blood_pressure}</td>
                                <td className="border p-2">{patient.oxygen_saturation}</td>
                                <td className="border p-2">{patient.symptoms}</td>
                                <td className="border p-2">{patient.recommended_followups}</td>
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
            )}
            </div>
        </div>
    );
}