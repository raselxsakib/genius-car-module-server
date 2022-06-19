const express=require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId=require('mongodb').ObjectId;
require('dotenv').config()
const cors=require('cors');
const port=5000;
const app=express();
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3m2j3.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
  try{
    await client.connect();
    const database=client.db('carMechanic');
    const servicesCollection=database.collection('services');

    //GET API

    app.get('/services',async(req,res)=>{
      const cursor=servicesCollection.find({});
      const services= await cursor.toArray();
      res.send(services);
    })
    //GET Single Service
    app.get('/services/:id',async(req,res)=>{
      const id=req.params.id;
      console.log('getting specific service ', id);
      const query={_id:ObjectId(id)};
      const service=await servicesCollection.findOne(query);
      res.json(service);

    })

    //POST API 
    app.post('/services',async(req,res)=>{
      const service=req.body;
      console.log('hit the post api', service);

      const result=await servicesCollection.insertOne(service);
      res.json(result);
    });

    //DELETE API

    app.delete('/services/:id',async(req,res)=>{
      const id=req.params.id;
      console.log('hitting delete ',id);
      const query={_id:ObjectId(id)}
      const result= await servicesCollection.deleteOne(query);
      res.json(result);
    });
  }
  finally{
    //await client.close();
  }

}

run().catch(console.dir);

app.get('/',(req,res)=>{
  res.send('Genius car backend server');
});

app.listen(port,()=>{
    console.log('Listening from ',port);
});