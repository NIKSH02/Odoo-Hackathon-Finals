import React, { useState, useEffect, useRef } from 'react';

// Main Chatbox component
const ChatBox = () => {
    // State variables to manage the chat application's UI and data
    const [selectedLanguage, setSelectedLanguage] = useState(''); // Stores the language chosen by the user
    const [chatHistory, setChatHistory] = useState([]); // Stores the conversation history (user and AI messages)
    const [userInput, setUserInput] = useState(''); // Stores the current text in the user input field
    const [isTyping, setIsTyping] = useState(false); // Controls the visibility of the "AI is typing..." indicator
    const [showLanguageOverlay, setShowLanguageOverlay] = useState(false); // Controls the visibility of the language selection overlay

    // Ref to scroll the chat messages to the bottom automatically
    const chatMessagesRef = useRef(null);

    // Effect to scroll to the bottom of the chat whenever messages are updated
    useEffect(() => {
        if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
    }, [chatHistory]); // Dependency array: runs when chatHistory changes

    // Function to append messages to the chat interface
    const appendMessage = (sender, text) => {
        // Update chat history state, ensuring immutability
        setChatHistory(prevHistory => [...prevHistory, { sender, text }]);
    };

    // Function to handle sending messages to the AI
    const sendMessage = async () => {
        const message = userInput.trim();
        if (!message) return; // Don't send empty messages

        if (!selectedLanguage) {
            // If language is not selected, prompt the user
            appendMessage('ai', "Please select a language first to start chatting.");
            return;
        }

        appendMessage('user', message); // Add user's message to chat history
        setUserInput(''); // Clear the input field
        setIsTyping(true); // Show typing indicator

        try {
            // Exponential backoff for API calls to handle rate limits
            let retryCount = 0;
            const maxRetries = 5;
            const baseDelay = 1000; // 1 second

            while (retryCount < maxRetries) {
                try {
                    // Prepare the payload for the Gemini API, sending the full chat history for context
                    const geminiHistory = [...chatHistory, { sender: 'user', text: message }].map(msg => ({
                        role: msg.sender === 'user' ? 'user' : 'model',
                        parts: [{ text: msg.text }]
                    }));
                    const payload = { contents: geminiHistory };
                    const apiKey = ""; // Canvas will provide this at runtime
                    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    if (!response.ok) {
                        if (response.status === 429) { // Too many requests
                            const delay = baseDelay * Math.pow(2, retryCount);
                            console.warn(`Rate limit hit. Retrying in ${delay / 1000}ms...`);
                            await new Promise(resolve => setTimeout(resolve, delay));
                            retryCount++;
                            continue; // Continue to the next retry attempt
                        } else {
                            throw new Error(`API error: ${response.status} ${response.statusText}`);
                        }
                    }

                    const result = await response.json();
                    if (result.candidates && result.candidates.length > 0 &&
                        result.candidates[0].content && result.candidates[0].content.parts &&
                        result.candidates[0].content.parts.length > 0) {
                        const aiResponseText = result.candidates[0].content.parts[0].text;
                        appendMessage('ai', aiResponseText); // Add AI's response to chat history
                    } else {
                        appendMessage('ai', "Sorry, I couldn't generate a response. Please try again.");
                        console.error("Unexpected API response structure:", result);
                    }
                    break; // Exit retry loop on successful response

                } catch (error) {
                    console.error("Error fetching AI response:", error);
                    if (retryCount === maxRetries - 1) { // If all retries failed
                        appendMessage('ai', "Sorry, I'm having trouble connecting right now. Please try again later.");
                    }
                    retryCount++;
                }
            }

        } finally {
            setIsTyping(false); // Hide typing indicator regardless of success or failure
        }
    };

    // Function to handle language selection from the overlay
    const handleLanguageSelect = (lang) => {
        setSelectedLanguage(lang);
        setShowLanguageOverlay(false); // Hide the overlay
        let welcomeMessage = "Hello! How can I help you today?";
        if (lang === 'hindi') {
            welcomeMessage = "नमस्ते! मैं आज आपकी कैसे मदद कर सकता हूँ?";
        } else if (lang === 'hinglish') {
            welcomeMessage = "Hello! Main aaj apki kaise help kar sakta hu?";
        } else if (lang === 'other') {
            welcomeMessage = "Hello! Please specify which language you'd like to chat in.";
        }
        appendMessage('ai', welcomeMessage); // Display initial welcome message
    };


    return (
        <div className="bg-gray-100 flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md flex flex-col h-[80vh] md:h-[700px] overflow-hidden border border-gray-200 relative">
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-xl shadow-md flex items-center justify-between">
                    <h1 className="text-xl font-semibold">AI Assistant</h1>
                    <div className="flex items-center gap-2">
                        <div className="text-sm px-3 py-1 bg-black bg-opacity-20 rounded-full">
                            Language: {selectedLanguage ? selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1) : 'Not Selected'}
                        </div>
                        <button
                            className="ml-2 px-2 py-1 bg-black bg-opacity-30 hover:bg-opacity-50 rounded text-xs text-white border border-white border-opacity-30 transition"
                            onClick={() => setShowLanguageOverlay(true)}
                        >
                            Change
                        </button>
                    </div>
                </div>

                {/* Language Selection Overlay */}
                {showLanguageOverlay && (
                    <div className="absolute inset-0 bg-gray-900 bg-opacity-80 flex items-center justify-center z-50 rounded-xl">
                        <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-xs w-full mx-4 border-2 border-blue-200 relative">
                            <button
                                className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl font-bold focus:outline-none"
                                onClick={() => setShowLanguageOverlay(false)}
                                aria-label="Close language selection"
                            >
                                &times;
                            </button>
                            <h2 className="text-2xl font-extrabold mb-4 text-blue-700 flex items-center justify-center gap-2">
                                <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>
                                Choose Language
                            </h2>
                            <p className="text-gray-500 mb-6 text-sm">Select your preferred language for chatting with the AI.</p>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <button
                                    className="flex flex-col items-center justify-center bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-3 px-2 rounded-xl shadow transition duration-200 border-2 border-transparent hover:border-blue-400 focus:outline-none"
                                    onClick={() => handleLanguageSelect('english')}
                                >
                                    <svg className="w-7 h-7 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5h18M9 3v2m6-2v2m-7 4h8m-8 4h8m-8 4h8" /></svg>
                                    English
                                </button>
                                <button
                                    className="flex flex-col items-center justify-center bg-green-100 hover:bg-green-200 text-green-700 font-semibold py-3 px-2 rounded-xl shadow transition duration-200 border-2 border-transparent hover:border-green-400 focus:outline-none"
                                    onClick={() => handleLanguageSelect('hindi')}
                                >
                                    <svg className="w-7 h-7 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                                    हिंदी (Hindi)
                                </button>
                                <button
                                    className="flex flex-col items-center justify-center bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold py-3 px-2 rounded-xl shadow transition duration-200 border-2 border-transparent hover:border-purple-400 focus:outline-none"
                                    onClick={() => handleLanguageSelect('hinglish')}
                                >
                                    <svg className="w-7 h-7 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2h5" /></svg>
                                    Hinglish
                                </button>
                                <button
                                    className="flex flex-col items-center justify-center bg-orange-100 hover:bg-orange-200 text-orange-700 font-semibold py-3 px-2 rounded-xl shadow transition duration-200 border-2 border-transparent hover:border-orange-400 focus:outline-none"
                                    onClick={() => handleLanguageSelect('other')}
                                >
                                    <svg className="w-7 h-7 mb-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8m-4-4v8" /></svg>
                                    Other
                                </button>
                            </div>
                            <p className="text-xs text-gray-400">You can change this later by clicking 'Change' above.</p>
                        </div>
                    </div>
                )}

                {/* Chat Messages Area */}
                <div ref={chatMessagesRef} className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
                    {chatHistory.filter(msg => msg.sender).map((msg, index) => ( // Filter out messages without 'sender' (which are for AI context)
                        <div key={index} className={`flex items-start mb-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.sender === 'ai' && (
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-200 text-purple-800 flex items-center justify-center text-sm font-bold mr-2">
                                    AI
                                </div>
                            )}
                            <div className={`max-w-[70%] p-3 rounded-xl shadow-sm ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                                {msg.text}
                            </div>
                            {msg.sender === 'user' && (
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center text-sm font-bold ml-2">
                                    You
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Typing Indicator */}
                {isTyping && (
                    <div className="p-2 text-gray-500 text-sm italic">
                        AI is typing...
                    </div>
                )}

                {/* Chat Input Area */}
                <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center rounded-b-xl">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                        placeholder="Type your message..."
                        className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 mr-3"
                    />
                    <button
                        onClick={sendMessage}
                        className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.542 60.542 0 0 0 18.443-8.852.75.75 0 0 0 0-1.284A60.542 60.542 0 0 0 3.478 2.405Z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;
