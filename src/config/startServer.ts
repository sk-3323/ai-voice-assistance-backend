import { Application } from "express";
import { createServer } from "http";
import { dbConnect } from "./dbConnect";

export const startServer = async (app: Application, port: any) => {
  try {
    const server = createServer(app);
    await dbConnect();
    server.listen(port, () => {
      console.log("Server is running on port : ", port);
    });
  } catch (error) {
    console.log(error);
  }
};
