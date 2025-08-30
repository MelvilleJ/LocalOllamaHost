import { useState } from "react";
import gsap from "gsap";
import { motion, useMotionValue, useSpring } from "framer-motion";

const Chatbox = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = { sender: "You", text: input };
    setMessages((prev) => [...prev, userMessage]);

    // Clear input
    setInput("");

    try {
      // Show temporary "thinking..." message
      setMessages((prev) => [
        ...prev,
        { sender: "Leslie", text: "Thinking..." },
      ]);

      const res = await fetch("http://192.168.100.128:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });

      if (!res.ok) {
        throw new Error("Error: " + res.statusText);
      }

      const data = await res.json();

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { sender: "Leslie", text: data.answer };
        return updated;
      });
    } catch (err) {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          sender: "Leslie",
          text: "Error: " + err.message,
        };
        return updated;
      });
    }
  };

  return (
    <section className="bg-black flex">
      <div className="mt-20 ml-20 w-200">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 1 }}
          viewport={{ once: false, amount: 0.3 }}
        >
          <h1 className="raleway-sub text-5xl md:text-6xl lg:text-7xl text-green">
            Meet Leslie
          </h1>
          <h1 className="text-start text:xl md:text-2xl md:mx-0 lg:mx-0 mt-5 md:w-100 lg:w-200 text-white ">
            My Personal AI assitant.
          </h1>
          <h1 className="text-start text:xl md:text-2xl md:mx-0 lg:mx-0 mt-5 md:w-100 lg:w-200 text-white ">
            A personal project to have my own local and secure AI to assist in
            any way I see fit (Personal Jarvis). This is version 0.04 of Leslie
            using a R.A.G system to solve problems and answer questions.
          </h1>
          <h1 className="text-start text:sm md:text-sm md:mx-0 lg:mx-0 mt-5 md:w-100 lg:w-200 text-white ">
            You could ask questions but this system is running locally and I
            dont have the hardware as yet to have instant replies like other
            assistants but she'll get there some day.
          </h1>
          <h1 className="text-start text:sm md:text-sm md:mx-0 lg:mx-0 mt-5 md:w-100 lg:w-200 text-white ">
            Note: Data May not be accurate at times.
          </h1>
        </motion.div>
      </div>
      <motion.div className="p-4 shadow-md ml-20 w-100 h-150 flex flex-col">
        <div className="flex-1 overflow-y-auto p-2 bg-white rounded-lg shadow-inner">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              className={`p-2 my-2 rounded-lg max-w-[75%] ${
                msg.sender === "You"
                  ? "bg-blue-500 text-white ml-auto"
                  : "bg-gray-200 text-black mr-auto"
              }`}
            >
              <strong>{msg.sender}: </strong> {msg.text}
            </motion.div>
          ))}
        </div>

        <form onSubmit={handleSend} className="mt-4 flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-white p-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
        </form>
      </motion.div>
    </section>
  );
};

export default Chatbox;
