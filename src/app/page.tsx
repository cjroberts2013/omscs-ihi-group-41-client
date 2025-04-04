

export default function page() {
    return (
      <main className="flex flex-col items-start min-h-screen bg-white text-black p-4">
        <h1 className="text-3xl text-left font-bold">Group 41 Team Project</h1>
        <p className="text-left text-med">Bryan Lopez, Jeffrey Pannell, Charles Roberts, Smita Tejo</p>
        <p className="mt-4 text-left text-lg">
          The goal of this project is to create efficiency in work-flow for medical providers when interacting with patients. To accomplish this task, our team developed a web-based application, allowing medical providers to direct their attention to interacting with the patient. While this interaction takes place, health related data is be captured in the background. Since the patient information is captured in the background the provider is no longer required to focus their attention on a screen and the patient at the same time. This increased focus on interacting with the patient helps in building rapport, leading to the patient gaining trust in the medical provider.
        </p>
        <p className="mt-4 text-left text-lg">
        To record the interaction the provider:

        </p>  
        <ul className="mt-4 text-left text-lg list-disc pl-6">
          <li>Open the web application</li>
          <li>Click the "Record" button</li>
          <li>The application works in the background recording the conversation</li>
          <li>The recording is submitted to ChatGPT</li>
          <li>Structured data is created and displayed for the provider to review</li>
          <li>With the simple click of a button the reviewed data is submitted to the FHIR server</li>
          <li>To review patient data click on the patient data tab and select the patient you want to review</li>
        </ul>  
      </main>
     
    );
  }