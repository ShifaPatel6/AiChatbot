import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch"; // install with: npm install node-fetch

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ POST route to interact with OpenRouter API
app.post("/chat", async (req, res) => {
       const { message } = req.body;
       console.log("User message:", message);

       try {
              const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                     method: "POST",
                     headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                     },
                     body: JSON.stringify({
                            model: "mistralai/mistral-7b-instruct", // You can use other models like gpt-3.5-turbo or mixtral
                            messages: [
                                   {
                                          role: "user",
                                          content: message,
                                   },
                            ],
                     }),
              });

              const data = await response.json();

              if (data.error) {
                     console.error("OpenRouter error:", data.error);
                     return res.status(500).json({ error: "Something went wrong on the server." });

              }

              const reply = data.choices[0].message.content;

              res.json({ reply });

       } catch (error) {
              console.error("Server error:", error);
              res.status(500).json({ error: "Failed to fetch from OpenRouter" });
       }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
