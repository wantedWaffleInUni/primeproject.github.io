import express from "express";
import cors from "cors";
import multer from "multer";
import { MongoClient, ServerApiVersion, ObjectId } from "mongodb";

const app = express();
app.use(cors());
app.use(express.json());
const uri =
  "mongodb+srv://yche0660:BXciq6582Uw0TimK@cluster0.64oyl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const database = client.db("FIT2101"); // Change to your database name
    const collection = database.collection("primeproject");

    // 1. Create (Insert) Data
    app.post("/createTask", async (req, res) => {
      try {
        // const data = req.body;
        const name = req.body.taskName;
        const priority = req.body.taskPriority;
        const tags = req.body.tags;
        const assignedto = req.body.taskAssignedto;
        const description = req.body.description;
        const status = req.body.taskStatus;
        const stage = req.body.taskStage;
        const size = req.body.taskSize;
        const type = req.body.taskType;

        const doc = {
          id: (await collection.countDocuments()) + 1,
          taskNumber: (await collection.countDocuments()) + 1,
          taskName: name,
          taskPriority: priority,
          tags: tags,
          taskAssignedto: assignedto,
          description: description,
          taskStatus: status,
          taskStage: stage,
          taskSize: size,
          createdAt: new Date(),
          taskType: type,
        };
        const result = await collection.insertOne(doc);
        res.status(201).send({ message: "Document inserted", result });
      } catch (error) {
        res.status(500).json({ message: "Error inserting document", error });
      }
    });

    // 2. Read (Get) Data
    app.get("/readTask", async (req, res) => {
      try {
        const documents = await collection.find().toArray();
        res.status(200).json(documents);
      } catch (error) {
        res.status(500).json({ message: "Error retrieving documents", error });
      }
    });

    // 3. Update Data
    app.put("/update/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const updatedData = req.body;
        const result = await collection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedData }
        );
        
        if (result.matchedCount === 0) {
          return res.status(404).json({ message: "Document not found" });
        }

        res.status(200).json({ message: "Document updated", result });
      } catch (error) {
        res.status(500).json({ message: "Error updating document", error });
      }
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}

run().catch(console.dir);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
