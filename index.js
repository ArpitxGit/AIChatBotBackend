// const express = require("express");
// const env = require("dotenv");
// const { default: OpenAI } = require("openai");

// const app = express();
// env.config();
// app.use(express.json());

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// const systemMessage = {
//   role: "system",
//   content:
//     "Create a one-liner intriguing or obscure factoid output nearby the input location",
// };

// app.post("/api/chat", async (req, res) => {
//   try {
//     const userMessage = req.body.message;
//     const apiMessages = [{ role: "user", content: userMessage }];

//     const requestData = {
//       model: "gpt-4o",
//       messages: [systemMessage, ...apiMessages],
//     };

//     const response = await openai.chat.completions.create(requestData);
//     console.log("OpenAI API Call", response);

//     if (response && response.choices && response.choices.length > 0) {
//       let content = response.choices[0].message.content.trim();

//       // Remove any surrounding quotes
//       if (content.startsWith('"') && content.endsWith('"')) {
//         content = content.slice(1, -1);
//       }

//       // Remove any unnecessary escape characters
//       content = content.replace(/\\"/g, '"');
//       console.log("[FACTOID] : ", content);

//       res.status(200).json({ factoid: content });
//     } else {
//       throw new Error("No valid response from OpenAI.");
//     }
//   } catch (error) {
//     console.error("Error:", error.message);
//     res.status(500).json({
//       status: "Failed",
//       error: error.message,
//     });
//   }
// });

// const port = process.env.PORT || 3000;
// const startServer = () => {
//   app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
//   });
// };

// startServer();

const express = require("express");
const env = require("dotenv");
const { default: OpenAI } = require("openai");

const app = express();
env.config();
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// const systemMessage = {
//   role: "system",
//   content:
//     "Create a one-liner intriguing or obscure factoid output nearby the input location also state the citation of the factoid\
//     Make sure the citation is from free content online sources\
//     Give a second related factoid\
//    State the factoid's location in decimal degrees format.\
//    Make sure the output is in JSON format {'factoid' : '<FACTOID + CITATION + SECOND-FACTOID>' , 'coordinates' : '<Co-ordinates>'}",
// };

// const systemMessage = {
//   role: "system",
//   content:
//     "Create a one-liner intriguing or obscure factoid output nearby the input location and also state the citation of the factoid\
//     Make sure the citation is from free content online sources\
//     State the factoid's location in decimal degrees format.\
//     Secondly, propose a fictional and/or fantasy storyline that draws inspiration from the factoid in 40 words.\
//     Make sure that the storyline proposal is a short setup that can later be expanded into a longer narrative\
//     Make sure the output is in JSON format {'factoid' : '<FACTOID + CITATION>' , 'storyline' : '<Storyline proposal>' , 'coordinates' : '<Co-ordinates>'}",
// };

const systemMessage = {
  role: "system",
  content:
    "Create a trivia question according to the following structure:\
  1. Question relevant to one of the provided topics and related to the region of the location provided. Double-check that the question is factually accurate and verifiable.\
  2. Four multiple-choice options, labeled A through D, with only one correct answer.\
  3. The correct answer explicitly labeled.\
  4. Which provided topic the question is relevant to.\
  5. A citation URL for where the information for the question was retrieved from and where it can be verified.\
  Provide the questions and answers in the following JSON format:\
  {'question': 'Question text here', 'optionA':'Option A', 'optionB': 'Option B', 'optionC': 'Option C', 'optionD': 'Option D' ,'answer': 'Correct option (e.g., 'A'), 'topic':'Topic', 'citationLink':'link'}",
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
      // let Fact = jsonResponse.factoid;
      // let Story = jsonResponse.storyline;
      // let Coord = jsonResponse.coordinates;
      let Quest = jsonResponse.question;
      let OptionA = jsonResponse.optionA;
      let OptionB = jsonResponse.optionB;
      let OptionC = jsonResponse.optionC;
      let OptionD = jsonResponse.optionD;
      let Answer = jsonResponse.answer;
      let Topic = jsonResponse.topic;
      let Link = jsonResponse.citationLink;
      console.log(content);
      // console.log("[FACTOID] : ", Fact);
      // console.log("[STORYLINE] : ", Story);
      // console.log("[COORDINATE] : ", Coord);
      console.log("[QUESTION] : ", Quest);
      console.log("[OPTION A] : ", OptionA);
      console.log("[OPTION B] : ", OptionB);
      console.log("[OPTION C] : ", OptionC);
      console.log("[OPTION D] : ", OptionD);
      console.log("[ANSWER] : ", Answer);
      console.log("[TOPIC] : ", Topic);
      console.log("[Link] : ", Link);

      res
        .status(200)
        // .json({ factoid: Fact, storyline: Story, coordinates: Coord });
        .json({
          question: Quest,
          optionA: OptionA,
          optionB: OptionB,
          optionC: OptionC,
          optionD: OptionD,
          answer: Answer,
          topic: Topic,
          citationLink: Link,
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
