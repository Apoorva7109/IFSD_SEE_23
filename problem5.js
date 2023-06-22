const express = require('express');
const mongoose = require('mongoose');
const prompt = require('prompt-sync')();

const app = express();
app.use(express.json());

const { Schema } = mongoose;

const legSchema = new Schema({
  source: String,
  destination: String,
  cost: Number,
});

const routeSchema = new Schema({
  legs: [legSchema],
});

const Leg = mongoose.model('Leg', legSchema);
const Route = mongoose.model('Route', routeSchema);

async function connectToDatabase() {
  const uri = 'mongodb+srv://Apoorva:apoorva@cluster0.hdtmhbr.mongodb.net/trip_database';
  try {
    await mongoose.connect(uri);
    console.log('Connected to the database');
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
}

async function createRouteLegs(route) {
  try {
    const createdRoute = await Route.create(route);
    console.log(`Created route with ID: ${createdRoute._id}`);
  } catch (error) {
    console.error('Failed to create route:', error);
  }
}

// POST /routes - Create a new route
app.post('/routes', async (req, res) => {
  try {
    const routeData = req.body;

    const route = new Route(routeData);
    await createRouteLegs(route);

    res.status(201).json({ message: 'Route created successfully' });
  } catch (error) {
    console.error('An error occurred while creating the route:', error);
    res.status(500).json({ error: 'An error occurred while creating the route' });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
