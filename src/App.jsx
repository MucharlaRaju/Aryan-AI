import React, { useContext } from "react";
import va from "./assets/ai.png";
import { CiMicrophoneOn } from "react-icons/ci";
import { datacontext } from "./context/UserContext";
import speakimg from "./assets/speak.gif";
import aigif from "./assets/aiVoice.gif";

const App = () => {
  const { speaking, setSpeaking, recognition, prompt, response } = useContext(datacontext);

  return (
    <main className="flex items-center justify-center min-h-screen bg-black text-white overflow-hidden">
      <div className="container w-full max-w-3xl p-6 text-center space-y-8">
        
        {/* AI Avatar */}
        <div className="flex justify-center">
          <img
            className="h-72 object-cover rounded-full shadow-2xl"
            src={va}
            alt="Tara AI"
            id="Tara"
          />
        </div>

        {/* Greeting */}
        <h2 className="text-4xl font-extrabold bg-gradient-to-r from-cyan-500 to-fuchsia-500 bg-clip-text text-transparent">
          Hi <span className="font-extrabold">Raj</span>, I'm Tara, Your Advanced Virtual Assistant
        </h2>

        {/* Button / GIF Section with Fixed Height */}
        <div className="relative h-28 flex items-center justify-center">
          {!speaking && !response ? (
            <button
              onClick={() => {
                setSpeaking(true);
                try {
                  recognition.start();
                } catch (error) {
                  console.error("Error starting recognition:", error.message);
                  setSpeaking(false);
                }
              }}
              className="relative z-10 flex items-center justify-center gap-3 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <CiMicrophoneOn className="text-2xl" />
              Start Talking
            </button>
          ) : (
            <>
              {speaking && !response && (
                <img
                  src={speakimg}
                  className="absolute w-24 h-24 animate-pulse rounded-full shadow-lg"
                  alt="Listening"
                />
              )}
              {response && (
                <img
                  src={aigif}
                  className="absolute w-24 h-24 animate-bounce rounded-full shadow-lg"
                  alt="Responding"
                />
              )}
            </>
          )}
        </div>

        {/* Prompt Text */}
        {speaking && (
          <p className="text-xl font-medium text-cyan-400">{prompt}</p>
        )}
      </div>
    </main>
  );
};

export default App;
