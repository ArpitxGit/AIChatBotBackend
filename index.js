const express = require("express");
const { promisify } = require("util");
const { default: OpenAI } = require("openai");
const env = require("dotenv");

env.config();

const app = express();
const port = process.env.PORT || 3000;

// Define routes
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/assist", async (req, res) => {
  let modifiedResponse = { userMessage: req.body.message };
  try {
    const { message, assistant, threadId } = req.body;
    let thread;
    let createdNewThread = false;

    // If threadId is not provided, create a new thread
    if (!threadId) {
      thread = await openai.beta.threads.create();
      console.log("New thread created with ID:", thread.id);
      createdNewThread = true;
    } else {
      thread = { id: threadId };
      console.log(`ThreadID : ${threadId}`);
    }

    modifiedResponse = { ...modifiedResponse, thread: thread.id };

    // Add user message to the thread
    const userMessage = await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: message,
    });

    // Run the selected assistant on the thread
    const assistantId =
      assistant === "roles"
        ? process.env.ROLES_ASSISTANT
        : process.env.POSTS_ASSISTANT;
    console.log(`AssistantID : ${assistantId}`);

    let run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId,
    });

    const sleep = promisify(setTimeout);
    while (run.status === "queued" || run.status === "in_progress") {
      await sleep(500); // Wait for 0.5 seconds
      run = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }
    console.log(`Run ID : ${run.id}`);
    modifiedResponse = {
      ...modifiedResponse,
      runStatus: run.status,
      runID: run.id,
    };

    // Retrieve assistant's response messages
    const assistantMessages = await openai.beta.threads.messages.list(
      thread.id
    );

    // Filter out messages where the role is "assistant"
    const assistantMessagesFiltered = assistantMessages.body.data.filter(
      (message) => message.role === "assistant"
    );

    if (assistantMessagesFiltered.length > 0) {
      const assistantMessageContent = assistantMessagesFiltered[0].content;

      let latestAssistantValue;
      if (typeof assistantMessageContent === "string") {
        latestAssistantValue = JSON.parse(
          assistantMessageContent.replace(/```json|```/g, "")
        );
      } else {
        latestAssistantValue = assistantMessageContent;
      }

      // Since latestAssistantValue is a list, we need to access the first element
      if (
        Array.isArray(latestAssistantValue) &&
        latestAssistantValue.length > 0
      ) {
        const parsedValue = JSON.parse(latestAssistantValue[0].text.value);

        modifiedResponse = {
          ...modifiedResponse,
          op1: parsedValue.op1,
          op2: parsedValue.op2 + parsedValue.op3,
          op0: parsedValue.op0,
        };
        console.log(`UserInput : ${req.body.message}`);
        console.log(`Name : ${parsedValue.op1}`);
        console.log(`Description : ${parsedValue.op2 + parsedValue.op3}`);
        console.log(`ImageDescription : ${parsedValue.op0}`);
      } else {
        modifiedResponse.assistantResponse = "No assistant response available";
      }
    } else {
      modifiedResponse.assistantResponse = "No assistant response available";
    }
    // Log the modified response
    console.log("Modified Response:", modifiedResponse);

    // Send the modified response
    res.json(modifiedResponse);
    console.log("All Jobs Done!");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      error: error?.message || "Internal server error",
      currentResponse: modifiedResponse,
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
