import mongoose from "mongoose";

export const db = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("✅ DB is connected");
  } catch (err) {
    console.error("❌ DB is not connected", err);
    process.exit(1);
  }
};
