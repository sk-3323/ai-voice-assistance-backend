import mongoose from "mongoose";

export const dbConnect = async () => {
  console.log(process.env.DB_URI);
  await mongoose
    .connect(process.env.DB_URI as string)
    .then((res) => {
      console.log("Database Connection Successfully");
    })
    .catch((err) => console.log("DB Connection Failed : ", err));
};
