import mongoose from "mongoose";
import { app } from "./app";

async function main() {
  console.log('Connecting to database...');
  await mongoose.connect('mongodb://localhost:27017/mongoose');


  console.log('Connected!');

  app.listen(3333, () => console.log('Server running'));
}

main();