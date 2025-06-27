import { Request, Response } from "express";
import { config } from "dotenv";
import { AiAgent } from "../utils/aiAgent";
import { StatusCodes } from "http-status-codes";
import twilio, { Twilio } from "twilio";
config();

export const promptController = async (req: Request, res: Response) => {
  try {
    const { transcript: prompt } = req.body;
    console.log(prompt);

    if (!prompt) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ success: false, message: "No Recieve Prompt" });
      return;
    }
    const { agentBuilder } = await AiAgent();
    const messages = [
      {
        role: "user",
        content: prompt,
      },
    ];
    const result = await agentBuilder.invoke({ messages });
    console.log("Ai response 🤖: ", result);

    res.status(StatusCodes.OK).json({
      message: "Success",
      success: true,
      result: JSON.stringify(result),
    });
  } catch (error) {
    console.log(error, "error while promptController");
  }
};

export const createCall = async (req: Request, res: Response) => {
  try {
    console.log("Call initiate");
    const { mobile } = req.body;
    if (!mobile) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Phone number is requied", success: false });
      return;
    }
    if (!mobile.startsWith("+")) {
      res.status(400).json({
        error: "Phone number must include country code (e.g., +1234567890)",
      });
      return;
    }
    const client = new Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    const call = await client.calls.create({
      url: `${process.env.WEBHOOK_BASE_URL}/voice`,
      from: process.env.TWILIO_PHONE_NUMBER as string,
      to: mobile,
      statusCallbackEvent: ["initiated", "ringing", "answered", "completed"],
      statusCallbackMethod: "POST",
      timeout: 30,
    });
    console.log(`Call created: ${call.sid} to ${mobile}`);

    res.json({
      success: true,
      callSid: call.sid,
      status: call.status,
      to: call.to,
      from: call.from,
    });
  } catch (error) {
    console.log(error, "error while createCall");
  }
};
