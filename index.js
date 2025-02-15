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
    "Find a wikipedia entry about one or more of the provided topics, related to the region of the location provided. Return the following:\
1. A citation URL to the wikipedia entry.\
2. A series of 5 different trivia questions of varying difficulty based on 5 different topics and information found in the wikipedia entry.\
Each trivia question should be returned in the following format:\
1. Trivia question\
2. Four multiple-choice options, labeled A through D, with only one correct answer.\
3. The correct answer explicitly labeled.\
4. The topics that the question is relevant to.\
5. The difficulty level of the question (easy, medium, or hard).\
Provide the link and 5 questions in the following JSON format\
{'citationLink':'link', 'question': 'Question one text here', 'optionA':'Option A', 'optionB': 'Option B', 'optionC': 'Option C', 'optionD': 'Option D' ,'answer': 'Correct option (e.g., 'A')', 'topic':'Topic', 'difficulty':'Level (e.g., 'Hard)', 'questioni': 'Question i text here', 'optionAi':'Option A', 'optionBi': 'Option B', 'optionCi': 'Option C', 'optionDi': 'Option D' ,'answeri': 'Correct option (e.g., 'A')', 'topici':'Topic', 'difficultyi':'Level (e.g., 'Hard)', Where i ranges from 2 to 5, for example., question2, optionA2, answer2, topic2, difficulty2}\
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
    };

    const response = await openai.chat.completions.create(requestData);
    console.log("OpenAI API Call", response);

    if (response && response.choices && response.choices.length > 0) {
      let content = response.choices[0].message.content.trim();
      const jsonResponse = JSON.parse(content);

      let Question = jsonResponse.question;
      let OptionA = jsonResponse.optionA;
      let OptionB = jsonResponse.optionB;
      let OptionC = jsonResponse.optionC;
      let OptionD = jsonResponse.optionD;
      let Answer = jsonResponse.answer;
      let Topic = jsonResponse.topic;
      let Difficulty = jsonResponse.difficulty;
      let Link = jsonResponse.citationLink;
      let Question2 = jsonResponse.question2;
      let OptionA2 = jsonResponse.optionA2;
      let OptionB2 = jsonResponse.optionB2;
      let OptionC2 = jsonResponse.optionC2;
      let OptionD2 = jsonResponse.optionD2;
      let Answer2 = jsonResponse.answer2;
      let Topic2 = jsonResponse.topic2;
      let Difficulty2 = jsonResponse.difficulty2;
      let Question3 = jsonResponse.question3;
      let OptionA3 = jsonResponse.optionA3;
      let OptionB3 = jsonResponse.optionB3;
      let OptionC3 = jsonResponse.optionC3;
      let OptionD3 = jsonResponse.optionD3;
      let Answer3 = jsonResponse.answer3;
      let Topic3 = jsonResponse.topic3;
      let Difficulty3 = jsonResponse.difficulty3;
      let Question4 = jsonResponse.question4;
      let OptionA4 = jsonResponse.optionA4;
      let OptionB4 = jsonResponse.optionB4;
      let OptionC4 = jsonResponse.optionC4;
      let OptionD4 = jsonResponse.optionD4;
      let Answer4 = jsonResponse.answer4;
      let Topic4 = jsonResponse.topic4;
      let Difficulty4 = jsonResponse.difficulty4;
      let Question5 = jsonResponse.question5;
      let OptionA5 = jsonResponse.optionA5;
      let OptionB5 = jsonResponse.optionB5;
      let OptionC5 = jsonResponse.optionC5;
      let OptionD5 = jsonResponse.optionD5;
      let Answer5 = jsonResponse.answer5;
      let Topic5 = jsonResponse.topic5;
      let Difficulty5 = jsonResponse.difficulty5;

      console.log("[JSON] : ", jsonResponse);

      res
        .status(200)
        // .json({ factoid: Fact, storyline: Story, coordinates: Coord });
        .json({
          citationLink: Link,
          question: Question,
          optionA: OptionA,
          optionB: OptionB,
          optionC: OptionC,
          optionD: OptionD,
          answer: Answer,
          topic: Topic,
          difficulty: Difficulty,
          question2: Question2,
          optionA2: OptionA2,
          optionB2: OptionB2,
          optionC2: OptionC2,
          optionD2: OptionD2,
          answer2: Answer2,
          topic2: Topic2,
          difficulty2: Difficulty2,
          question3: Question3,
          optionA3: OptionA3,
          optionB3: OptionB3,
          optionC3: OptionC3,
          optionD3: OptionD3,
          answer3: Answer3,
          topic3: Topic3,
          difficulty3: Difficulty3,
          question4: Question4,
          optionA4: OptionA4,
          optionB4: OptionB4,
          optionC4: OptionC4,
          optionD4: OptionD4,
          answer4: Answer4,
          topic4: Topic4,
          difficulty4: Difficulty4,
          question5: Question5,
          optionA5: OptionA5,
          optionB5: OptionB5,
          optionC5: OptionC5,
          optionD5: OptionD5,
          answer5: Answer5,
          topic5: Topic5,
          difficulty5: Difficulty5,
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
