import moongose from "mongoose";

export const ConectionDb = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }
  try {
    await moongose.connect(process.env.MONGODB_URI);
    console.log(" ✅ Connected to db successfully");
  } catch (error) {
    console.log((error as Error).message);
    process.exit(1);
  }
};
