const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000

// Middleware
app.use(express.json())
app.use(cors({
  origin:["http://:localhost:3000","https://login.onrender.com"]
}))


// mongodb config

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://e-com-user:user123@cluster0.9pc96ay.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     // await client.close();
//   }
// }
// run().catch(console.dir);

let userCollection;

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log("Connected to MongoDB!");
    
    // Access the database and collection
    const db = client.db('E-com');
    userCollection = db.collection('users');
    
    // Ping the server to confirm a successful connection
    await db.command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
  }
}
run().catch(console.dir);

// Login Api

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const user = await userCollection.findOne({ username, password });
      if (user) {
        res.status(200).json({ message: 'Login successful' });
      } else {
        res.status(400).json({ message: 'Invalid credentials' });
      }
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err });
    }
  });
  
  // Register Api

  app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const existingUser = await userCollection.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
  
      const newUser = { username, password };
      await userCollection.insertOne(newUser);
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err });
    }
  });

app.listen(port,() => {
    console.log(`Server is running on port ${port}`);
})