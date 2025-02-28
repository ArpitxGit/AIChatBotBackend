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
    "Find 3 wikipedia entries about one or more of the provided topics.\
    Then randomly choose one of the entries to make trivia from. Return the following:\
    1. A citation URL to the wikipedia entry.\
    2. A series of 5 different trivia questions of varying difficulty based on 5 different topics and information found in the wikipedia entry.\
    Each trivia question should be returned in the following format:\
    1. Trivia question(worded without referencing the entry itself)\
    2. Four multiple-choice options, labeled A through D, with only one correct answer.\
    3. The correct answer explicitly labeled.\
    4. The topics that the question is relevant to.\
    5. The difficulty level of the question (easy, medium, or hard).\
    Make sure that the declared topic the question is relevant to does not give away the answer.\
    Provide the link and 5 questions in the following JSON format {'citationLink':'link', 'questioni': 'Question i text here', 'optionAi':'Option A', 'optionBi': 'Option B', 'optionCi': 'Option C', 'optionDi': 'Option D' ,'answeri': 'Correct option (e.g., 'A')', 'topici':'Topic', 'difficultyi':'Level (e.g., 'Hard)', Where i ranges from 1 to 5, for example., question2, optionA2, answer2, topic2, difficulty2}\
    Make sure for a total of 5 questions answers topic and difficulty",
};

app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
    const apiMessages = [{ role: "user", content: userMessage }];

    const requestData = {
      model: "o3-mini",
      response_format: { type: "json_object" },
      messages: [systemMessage, ...apiMessages],
      reasoning_effort: "low",
    };

    const response = await openai.chat.completions.create(requestData);
    console.log("OpenAI API Call", response);

    if (response && response.choices && response.choices.length > 0) {
      let content = response.choices[0].message.content.trim();
      const jsonResponse = JSON.parse(content);

      console.log("[JSON] : ", jsonResponse);

      res
        .status(200)
        // .json({ factoid: Fact, storyline: Story, coordinates: Coord });
        .json({
          citationLink: jsonResponse.citationLink,
          question1: jsonResponse.question1,
          optionA1: jsonResponse.optionA1,
          optionB1: jsonResponse.optionB1,
          optionC1: jsonResponse.optionC1,
          optionD1: jsonResponse.optionD1,
          answer1: jsonResponse.answer1,
          topic1: jsonResponse.topic1,
          difficulty1: jsonResponse.difficulty,
          question2: jsonResponse.question2,
          optionA2: jsonResponse.optionA2,
          optionB2: jsonResponse.optionB2,
          optionC2: jsonResponse.optionC2,
          optionD2: jsonResponse.optionD2,
          answer2: jsonResponse.answer2,
          topic2: jsonResponse.topic2,
          difficulty2: jsonResponse.difficulty2,
          question3: jsonResponse.question3,
          optionA3: jsonResponse.optionA3,
          optionB3: jsonResponse.optionB3,
          optionC3: jsonResponse.optionC3,
          optionD3: jsonResponse.optionD3,
          answer3: jsonResponse.answer3,
          topic3: jsonResponse.topic3,
          difficulty3: jsonResponse.difficulty3,
          question4: jsonResponse.question4,
          optionA4: jsonResponse.optionA4,
          optionB4: jsonResponse.optionB4,
          optionC4: jsonResponse.optionC4,
          optionD4: jsonResponse.optionD4,
          answer4: jsonResponse.answer4,
          topic4: jsonResponse.yopic4,
          difficulty4: jsonResponse.difficulty4,
          question5: jsonResponse.question5,
          optionA5: jsonResponse.optionA5,
          optionB5: jsonResponse.optionB5,
          optionC5: jsonResponse.optionC5,
          optionD5: jsonResponse.optionD5,
          answer5: jsonResponse.answer5,
          topic5: jsonResponse.topic5,
          difficulty5: jsonResponse.difficulty5,
        });
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
