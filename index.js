const express = require("express");
const env = require("dotenv");
const { default: OpenAI } = require("openai");

const app = express();
env.config();
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemMessage = {
  role: "system",
  content:
    'You are a narrative designer who designs post and a fortune cookie message using user input\
  Make sure the caption is short, tweet-sized one-sentence plot points to flesh out an existing storyline\
  Make sure that fortune cookie message in the format of social post like instagram with a limit of 60 words\
  Assign a catchy name to this post\
  Provide the output in JSON structure like this {"1": "<name>", "2": "<caption>", "3": "<social-post>"}',
};

app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    const apiMessages = [{ role: "user", content: userMessage }];

    const requestData = {
      model: "gpt-4-1106-preview",
      response_format: { type: "json_object" },
      messages: [systemMessage, ...apiMessages],
    };

    const response = await openai.chat.completions.create(requestData);
    console.log("OpenAI API Call", response);

    if (response && response.choices && response.choices.length > 0) {
      const content = JSON.parse(response.choices[0].message.content) || {};
      // Remove newline characters and format the output
      const formattedContent = {};
      Object.keys(content).forEach((key) => {
        formattedContent[key] = content[key].replace(/\n/g, " ");
      });
      res.status(200).json(formattedContent);
    } else {
      throw new Error("No valid response from OpenAI.");
    }
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({
      status: "Failed",
      error: error.message,
    });
  }
});

const port = process.env.PORT || 3000;
const startServer = () => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

startServer();
