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

const systemMessage = {
  role: "system",
  content:
    "Create a one-liner intriguing or obscure factoid output nearby the input location and also state the citation of the factoid\
    Make sure the citation is from free content online sources\
    State the factoid's location in decimal degrees format.\
    Secondly, propose a fictional and/or fantasy storyline that draws inspiration from the factoid\
    Make sure that the storyline proposal is a short setup that can later be expanded into a longer narrative\
    Make sure the output is in JSON format {'factoid' : '<FACTOID + CITATION + Storyline proposal>' , 'coordinates' : '<Co-ordinates>'}",
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
      let Coord = jsonResponse.coordinates;
      console.log(content);
      console.log("[FACTOID] : ", Fact);
      console.log("[COORDINATE] : ", Coord);
      res.status(200).json({ factoid: Fact, coordinates: Coord });
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
