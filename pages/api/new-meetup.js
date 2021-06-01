import { MongoClient } from "mongodb";
// const MongoClient = require("mongodb").MongoClient;

async function handler(req, res) {
  console.log("api");

  if (req.method === "POST") {
    console.log("starting");

    const data = req.body;
    // this is adaptecfrom recommended snippet. Max's version is simpler
    // doesn't include useNewUrlParser or useUnifiedTopology
    const uri =
      "mongodb+srv://sam:R4tB5HnYENaIkEX7@cluster0.o4hmx.mongodb.net/meetups?retryWrites=true&w=majority";
    const client = MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    client.connect(async (err) => {
      const meetupsCollection = client.db("meetups").collection("meetups");
      // perform actions on the collection object
      const result = await meetupsCollection.insertOne(data);
      console.log(result);
      client.close();
      res.status(201).json({ message: "Meetup inserted!" });
    });

    // const db = client.db();
    // const meetupsCollection = db.collection("meetups");
    // const result = await meetupsCollection.insertOne(data);
    // console.log(result);
    // client.close();
  }
}

export default handler;
