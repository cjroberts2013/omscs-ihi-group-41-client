

export default function page() {
    return (
      <main className="flex flex-col items-start min-h-screen bg-white text-black p-4">
        <h1 className="text-3xl text-left font-bold">Group 41 Team Project</h1>
        <p className="text-left text-med">Bryan Lopez, Jeffrey Pannell, Charles Roberts, Smita Tejo</p>
        <p className="mt-4 text-left text-lg">
          The goal of this project is to create efficiency in work-flow for medical providers when interacting with patients. To accomplish this task, our team developed a web-based application, allowing medical providers to direct their attention to interacting with the patient. While this interaction takes place, health related data is be captured in the background. Since the patient information is captured in the background the provider is no longer required to focus their attention on a screen and the patient at the same time. This increased focus on interacting with the patient helps in building rapport, leading to the patient gaining trust in the medical provider.
        </p>
        <p className="mt-4 text-left text-lg">
          To record the interaction the provider simply opens the web page, clicks record, the app then records the converstion in the background, submits it to chatGPT, creates structured data the provider can review, then with the simple click of a button the data is uploaded to a FHIR server.
        </p>  
      </main>
     
    );
  }