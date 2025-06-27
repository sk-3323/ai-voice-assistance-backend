import express, { Request, Response } from "express";
import { startServer } from "./config/startServer";
import dotenv from "dotenv";
import RootRouter from "./routes/index.route";
import cors from "cors";
import { StatusCodes } from "http-status-codes";
import { APIError } from "./errors/apiError";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { VoiceResponse } from "./config/twillio";
import { getConversationChain } from "./utils/twilio";
import { twilioVoice } from "./controller/voice.controller";
dotenv.config();
const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:8080",
      "http://localhost:5000",
    ],
    methods: ["POST", "GET", "PATCH", "DELETE", "PUT"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/api", RootRouter);
app.use((req, _, next) => {
  const info =
    req.method +
    " " +
    req.url +
    "   " +
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
  console.log("API HIT -------------->", info, "\n|\nv\n|\nv\n");
  next();
});
// app.use("/:id", (req, _) => {
//   throw new APIError(
//     StatusCodes.NOT_FOUND,
//     `Requested URL ${req.path} not found`
//   );
// });

//webhook call

app.post("/voice", twilioVoice);
app.post("/process-speech", async (req: Request, res: Response) => {
  try {
    const twilm = new VoiceResponse();

    const speechResult = req.body.SpeechResult;
    const callSid = req.body.CallSid;
    console.log(speechResult, "speech result");
    if (speechResult) {
      try {
        const chain = getConversationChain(callSid);
        const finalSpeech =
          speechResult + ", give me in short and simple and answer in hindi";
        const aiResponse = await chain.call({ input: finalSpeech });
        console.log("Ai Response  : ", aiResponse);
        // Clean and truncate the response for TTS
        let responseText = aiResponse.response;
        // || "I apologize, but I could not generate a response.";

        // Remove any potentially problematic characters
        // responseText = responseText.replace(/[^\w\s.,!?;:'"()-]/g, " ");

        // Truncate if too long (Twilio TTS has limits)
        // if (responseText.length > 1000) {
        //   responseText = responseText.substring(0, 997) + "...";
        // }

        // Speak the AI response
        twilm.say(
          {
            voice: "Polly.Aditi",
            language: "hi-IN",
          },
          responseText
        );

        const gather = twilm.gather({
          input: ["speech"],
          action: "/process-speech",
          method: "POST",
          timeout: 10,
          language: "hi-IN",
          speechTimeout: "auto",
        });
        gather.say(
          { voice: "Polly.Aditi", language: "hi-IN" },
          "आपको कोई और प्रश्न है?"
        );
        twilm.say(
          {
            voice: "Polly.Aditi",
            language: "hi-IN",
          },
          "इस ए.आई. असिस्टेंस को उपयोग करने के लिए धन्यवाद्. निकल!"
        );
      } catch (error) {
        twilm.say(
          {
            voice: "Polly.Aditi",
            language: "hi-IN",
          },
          "I apologize, but I encountered an error processing your request. Please try again."
        );
        // Redirect back to main menu
        twilm.redirect("/voice");
      }
    } else {
      twilm.say(
        {
          voice: "Polly.Aditi",
          language: "hi-IN",
        },
        "I did not understand your speech. Please try speaking more clearly."
      );

      // Redirectback to gather more input
      twilm.redirect("/voice");
    }
    res.setHeader("Content-Type", "text/xml; charset=utf-8");
    res.status(200).send(twilm.toString());
  } catch (error) {
    console.log(error);
  }
});
// CENTRAL ERROR MIDDLEWARE
app.use(errorMiddleware);
startServer(app, process.env.PORT);
