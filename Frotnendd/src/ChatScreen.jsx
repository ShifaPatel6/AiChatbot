import { SlMicrophone } from "react-icons/sl";
import { LuSendHorizontal } from "react-icons/lu";
import { useState, useRef, useEffect } from "react";
import { Recognizer } from "./Speechrec";
import "./Screen.css";
import { themes } from "./themeconfig";
// import ThemeDropdown from "./Themedroppdown";

const ChatScreen = () => {
  const [input, setInput] = useState(" ");
  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentTheme, setcurrentTheme] = useState("light");

  const messagesEndRef = useRef(null);
  const theme = themes[currentTheme];

  useEffect(() => {}, [theme]); // ✅ Only logs when theme changes

  const sendMessage = async () => {
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsGenerating(true);

    // Add empty assistant message for Generating effect
    const tempAssistantMessage = {
      role: "assistant",
      content: "Generating...",
    };
    setMessages((prev) => [...prev, tempAssistantMessage]);

    try {
      const res = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Something went wrong");
      }
      const botReply = data.reply;

      // Replace the last "Generating..." message with real content
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: botReply };
        return updated;
      });
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Error Generating",
        };
        return updated;
      });
    }
  };
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleVoiceRec = () => {
    if (!Recognizer) {
      alert("Your browser doesnt support voice recognition");
      return;
    }
    Recognizer.start();
    alert("speech start");
    setIsListening(true);

    Recognizer.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => prev + transcript);
      setIsListening(false);
    };

    Recognizer.onerror = (event) => {
      console.error("Speech recognition error", event);

      if (event.error === "no-speech") {
        alert("No speech detected. Please try again and speak clearly.");
      }

      setIsListening(false); // Reset the mic state
    };
  };

  return (
    <>
      <div className="flex justify-center ">
        <div
          className={`${theme.background} ${theme.text} w-lg h-dvh rounded-[2vw] flex flex-col items-center  gap-6 `}
        >
          <div
            className={`flex items-center justify-between px-6 ${theme.Header} h-20 text-xl w-full text-white`}
          >
            {/* Title centered in available space */}
            <h5
              className={`absolute left-1/2 transform -translate-x-1/2 ${theme.Chatbotstyle}`}
            >
              AI Chat Bot
            </h5>

            {/* Theme selector aligned right */}
            <div>
              <select
                className={` text-black  rounded dropdwon focus:outline-none px-4`}
                value={currentTheme}
                onChange={(e) => setcurrentTheme(e.target.value)}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="Turtle">Turtle</option>
                <option value="Reddish">Reddish</option>
              </select>
            </div>
          </div>

          <div className="w-md flex-1 custom-scroll overflow-y-auto h-full  ">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                } w-full my-2`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl break-words shadow-md
       ${
         msg.role === "user"
           ? `${theme.bubbleUser}`
           : msg.content === "Error Generating"
           ? "bg-red-100 text-red-700 border border-red-400"
           : msg.content === "Generating..."
           ? `${theme.bubbleUser} animate-pulse`
           : `${theme.bubbleBot}`
       }

      `}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            <div ref={messagesEndRef} />
          </div>

          <div className="flex  space-x-4 mt-auto mb-7 items-center">
            <div>
              <div
                className={`cursor-pointer rounded-full w-10 h-10  flex justify-center items-center  ${
                  isListening ? "bg-black text-white" : "bg-gray-500 "
                }`}
              >
                <SlMicrophone
                  className="w-7 h-7 text-white"
                  onClick={handleVoiceRec}
                />
              </div>
            </div>

            <input
              type="text"
              placeholder="Ask anything"
              className={`bg-white rounded-2xl w-80 p-4 border-gray-300 border focus:outline-none text-black-400 ${theme.inputBorder} `}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <div
              className={`rounded-full p-2  ${
                input.trim()
                  ? `${theme.sendButton}`
                  : `${theme.sendButtonDisabled}`
              }`}
              disabled={!input.trim("")}
              onClick={() => sendMessage()}
            >
              <LuSendHorizontal className="w-7 h-7" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatScreen;
