export default function page() {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Group 41's Project
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            The goal of this project is to improve workflow efficiency for medical providers when they are interacting with patients.
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow-md hover:bg-blue-700 transition">
            Get Started
          </button>
        </div>
  
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-md text-center">
            <h3 className="text-xl font-semibold text-gray-800">Features</h3>
            <p className="text-gray-600 mt-2">
                To accomplish this, our project enables hands-free documentation, allowing medical providers to focus on the patient rather than a computer screen.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md text-center">
            <h3 className="text-xl font-semibold text-gray-800">Time-saving</h3>
            <p className="text-gray-600 mt-2">
                Our system ensures that medical professionals can easily edit and upload data with the click of a button.
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-md text-center">
            <h3 className="text-xl font-semibold text-gray-800">User-Friendly Interface</h3>
            <p className="text-gray-600 mt-2">
                Designed with usability in mind, our interface is intuitive and easy to navigate for medical professionals of all tech levels.
            </p>
          </div>
        </div>
      </div>
    );
  }