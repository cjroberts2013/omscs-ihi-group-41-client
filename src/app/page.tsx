export default function page() {
    return (
      <main className="flex flex-col items-start min-h-screen bg-white text-black p-4">
        <h1 className="text-lg text-left font-bold">Group 41 Team Project</h1>
        <p className="text-left text-small">Bryan Lopez, Charles Roberts, Smita Tejo, Jeffrey S. Pannell</p>
        <p className="mt-4 text-left text-med">
          The goal of this project is to create efficiency in work-flow for medical providers when interacting with patients. To accomplish this task, our team developed a web-based application, allowing medical providers to record the interaction in the background. Since the patient information is captured in the background the provider is no longer required to focus on a screen as they are interact with the patient. This increased focus on interacting with the patient helps in building a rapport leading to increased trust in the medical provider for the patient.
        </p>
        <p className="mt-4 text-left text-med">
          To record the interaction the provider simply opens the web page, clicks record, the app then records the converstion in the background, submits it to chatGPT, creates structured data the provider can review, then with the simple click of a button the data is uploaded to a FHIR server.

        </p>  
      </main>
     
    );
  }