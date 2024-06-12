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
    "You are a narrative designer and your task is to create intriguing anf obscure content.\
    Create a one-liner factoid and a description based on the input location and only one of the tags\
    Make sure that the factoid is intriguing or obscure it's within one eighth of a mile and do not restate the location.\
    Make sure the description is next part of the story\
    Make sure the output is in json format {'factoid' : '<FACTOID>' , 'description' : '<DESCRIPTION>'}",
};

app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    const apiMessages = [{ role: "user", content: userMessage }];

    const requestData = {
      model: "gpt-4o",
      response_format: { type: "json_object" },
      messages: [systemMessage, ...apiMessages],
    };

    const response = await openai.chat.completions.create(requestData);
    console.log("OpenAI API Call", response);

    if (response && response.choices && response.choices.length > 0) {
      let content = response.choices[0].message.content.trim();
      const jsonResponse = JSON.parse(content);
      let Fact = jsonResponse.factoid;
      let Desc = jsonResponse.description;
      console.log(content);
      console.log("[FACTOID] : ", Fact);
      console.log("[DESCRIPTION] : ", Desc);
      res.status(200).json({ factoid: Fact, description: Desc });
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
