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
    "Find 3 wikipedia entries about one of the provided topics. Then make trivia from the information found in the entries. Return the following:\
  1. A citation URL to a wikipedia entry.\
  2. A series of 5 different trivia questions of varying difficulty\
  Do not use the words `Wikipedia`, `article`, or `entry` in the questions\
  Each trivia question should be returned in the following format:\
  1. Trivia question\
  2. Four multiple-choice options, labeled A through D, with only one correct answer.\
  3. The correct answer explicitly labeled.\
  4. The topic that the question is relevant to.\
  Provide the link and 5 questions in the following JSON format\
  {'citationLink':'link', 'question1': 'Question one text here', 'optionA1':'Option A', 'optionB1': 'Option B', 'optionC1': 'Option C', 'optionD1': 'Option D' ,'answer1': 'Correct option (e.g., 'A')', 'topic1':'Topic', 'question2': 'Question 2 text here', 'optionA2':'Option A', 'optionB2': 'Option B', 'optionC2': 'Option C', 'optionD2': 'Option D' ,'answer2': 'Correct option (e.g., 'A')', 'topic2':'Topic', 'question3': 'Question 3 text here', 'optionA3':'Option A', 'optionB3': 'Option B', 'optionC3': 'Option C', 'optionD3': 'Option D' ,'answer3': 'Correct option (e.g., 'A')', 'topic3':'Topic', 'question4': 'Question 4 text here', 'optionA4':'Option A', 'optionB4': 'Option B', 'optionC4': 'Option C', 'optionD4': 'Option D' ,'answer4': 'Correct option (e.g., 'A')', 'topic4':'Topic', 'question5': 'Question 5 text here', 'optionA5':'Option A', 'optionB5': 'Option B', 'optionC5': 'Option C', 'optionD5': 'Option D' ,'answer5': 'Correct option (e.g., 'A')', 'topic5':'Topic'}\
  Make sure of a total of 5 questions with answers and topic",
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
