import { Request, Response } from "express";
import { createReadStream, readFileSync, unlink } from "fs";
import { StatusCodes } from "http-status-codes";
import OpenAI from "openai";
import { VoiceResponse } from "../config/twillio";
export const PressVoice = async (req: Request, res: Response) => {
  try {
    const { transcript } = req.body;
    console.log(transcript);

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Transcription successfully",
      result: transcript,
    });
  } catch (error) {
    console.log(error, "error while PressVoice");
  }
};
export const twilioVoice = async (req: Request, res: Response) => {
  try {
    const twilm = new VoiceResponse();
    twilm.say(
      { voice: "Polly.Aditi", language: "hi-IN" },
      "नमस्ते, मैं आपकी एआई असिस्टेंट हूँ जिसने शुभम कनिया ने बनाया है। आप क्या जानना चाहते हैं?"
    );
    const gather = twilm.gather({
      input: ["speech"],
      timeout: 10,
      speechTimeout: "auto",
      language: "hi-IN",
      action: "/process-speech",
      method: "POST",
    });

    twilm.say(
      { voice: "Polly.Aditi", language: "hi-IN" },
      "कृपया, फिर से प्रयत्न करे."
    );
    res.type("text/xml");
    res.send(twilm.toString());
  } catch (error) {
    console.log(error, "error while twilioVoice");
  }
};
