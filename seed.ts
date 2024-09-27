import { MongoClient } from "mongodb";
import * as bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import { exit } from "process";

dotenv.config({ path: ".env.local" });

console.log(process.env);

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = { appName: "devrel.template.nextjs" };

let client: MongoClient = new MongoClient(uri, options);

let username = process.env.ADMIN_NAME;
let password = process.env.ADMIN_PASSWORD;
let override = process.env.OVERRIDE;

if (!password) throw Error("Missing environment variables");

let encryptedPassword = bcrypt.hashSync(password, 2);

let usersCollection = client.db().collection("users");
usersCollection
  .find({ username })
  .hasNext()
  .then((hasNext) => {
    if (hasNext && override === "TRUE") {
      usersCollection
        .updateOne({ username }, { password: encryptedPassword })
        .then(() => {
          console.log("Update done");
          exit(0);
        });
    } else if (hasNext && override === "") {
      throw new Error("Override not allowrd");
    } else {
      usersCollection
        .insertOne({ username, password: encryptedPassword })
        .then(() => {
          console.log("Seed done");
          exit(0);
        });
    }
  })
  .catch((error) => {
    console.error("Failed to seed db");
  });
