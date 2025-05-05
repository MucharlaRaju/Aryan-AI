import React, { createContext, useState } from "react";
import { run } from "../assets/gemini"; // Import the run function

export const datacontext = createContext();

const UserContext = ({ children }) => {
  const [speaking, setSpeaking] = useState(false); // Indicates if the app is listening
  const [response, setResponse] = useState(false); // Indicates if the AI is responding
  const [prompt, setPrompt] = useState("Listening...");

  // Speech synthesis function
  function speak(text) {
    const synth = window.speechSynthesis;
    const voices = synth.getVoices(); // Get the list of available voices

    // Select an Indian English voice
    const selectedVoice = voices.find((voice) => voice.lang === "en-IN") || voices[0]; // Fallback to the first available voice

    const text_speak = new SpeechSynthesisUtterance(text);
    text_speak.voice = selectedVoice; // Set the selected voice
    text_speak.lang = "en-IN"; // Set language to English (India)
    text_speak.rate = 1;
    text_speak.pitch = 1;
    text_speak.volume = 1;

    text_speak.onstart = () => {
      setResponse(true); // Show AI response animation
    };

    text_speak.onend = () => {
      setResponse(false); // Hide AI response animation
      setSpeaking(false); // Reset speaking state after speech ends
    };

    synth.cancel(); // Cancel any ongoing speech
    synth.speak(text_speak); // Speak the text
  }

  // Custom question handler
  function handleCustomQuestions(prompt) {
    const lowerCasePrompt = prompt.toLowerCase();

    // Question 1: "What is your name?"
    if (lowerCasePrompt.includes("your name")) {
      return "My name is Tara.";
    }

    // Question 2: "Who developed you?" or "Tell me about yourself" or "Who is your developer?"
    if (
      lowerCasePrompt.includes("who developed you") ||
      lowerCasePrompt.includes("tell me about yourself") ||
      lowerCasePrompt.includes("who is your developer")
    ) {
      return "I am Tara, your advanced virtual assistant. I was developed by Raju, a passionate BTech student.";
    }

    return null; // Return null if no custom question matches
  }

  // AI response function
  async function aiResponse(prompt) {
    try {
      // Check for custom questions
      const customResponse = handleCustomQuestions(prompt);
      if (customResponse) {
        setPrompt(customResponse); // Update the prompt with the custom response
        speak(customResponse); // Speak the custom response
        return; // Exit the function as the custom question is handled
      }

      // If no custom question matches, call the AI API
      const aiResult = await run(prompt); // Call the run function
      console.log("AI Result:", aiResult);

      // Limit the response to 200 characters
      const limitedResponse = aiResult.length > 200 ? aiResult.substring(0, 200) + "..." : aiResult;

      setPrompt(limitedResponse); // Update the prompt with the truncated AI's response
      speak(limitedResponse); // Use the truncated AI response in the speak function
    } catch (error) {
      console.error("Error in AI Response:", error.message);
      setPrompt("Error generating response. Please try again.");
      setSpeaking(false); // Reset speaking state on error
      setResponse(false); // Reset response state on error
    }
  }

  // Speech recognition setup
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = "en-IN"; // Set language to English (India)
  recognition.interimResults = false;

  // Speech recognition event handlers
  recognition.onresult = async (event) => {
    const transcript = event.results[0][0].transcript;
    console.log("Recognized Speech:", transcript);
    setPrompt("Listening..."); // Show "Listening..." while processing
    await aiResponse(transcript); // Pass the recognized speech to AI
  };

  recognition.onstart = () => {
    console.log("Speech recognition started");
    setPrompt("Listening...");
    setSpeaking(true); // Show listening animation
  };

  recognition.onspeechend = () => {
    console.log("Speech recognition ended");
    recognition.stop(); // Stop recognition after speech ends
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    if (event.error === "network") {
      setPrompt("Network error. Please check your connection.");
    } else if (event.error === "not-allowed") {
      setPrompt("Microphone access denied. Please allow permissions.");
    } else if (event.error === "no-speech") {
      setPrompt("No speech detected. Please try again.");
    } else {
      setPrompt("An error occurred. Please try again.");
    }
    setSpeaking(false); // Reset speaking state on error
    setResponse(false); // Reset response state on error
  };

  // Context value
  const value = { speaking, setSpeaking, recognition, prompt, response };

  return <datacontext.Provider value={value}>{children}</datacontext.Provider>;
};

export default UserContext;
