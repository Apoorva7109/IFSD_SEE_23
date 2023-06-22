const { MongoClient } = require('mongodb');
const prompt = require('prompt-sync')();

class Leg {
  constructor(source, destination, cost) {
    this.source = source;
    this.destination = destination;
    this.cost = cost;
  }
}

class Route {
  constructor() {
    this.legs = [];
  }

  addLeg(source, destination, cost) {
    this.legs.push(new Leg(source, destination, cost));
  }

  calculateTotalCost() {
    return this.legs.reduce((total, leg) => total + leg.cost, 0);
  }
}

function promptUser(question) {
  return prompt(question);
}

async function connectToDatabase() {
  const uri = 'mongodb+srv://Apoorva:apoorva@cluster0.hdtmhbr.mongodb.net/';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    return client.db('mydatabase');
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    process.exit(1);
  }
}

async function createRouteLegs(db, route) {
  try {
    const result = await db.collection('route').insertOne(route);
    console.log(`Created route with ID: ${result.insertedId}`);
  } catch (error) {
    console.error('Failed to create route:', error);
  }
}

async function readRouteLegs(db) {
    try {
      const routes = await db.collection('route').find({}).toArray();
      routes.forEach((route) => {
        console.log('Leg Details:');
        route.legs.forEach((leg, index) => {
          console.log(`Leg ${index + 1}: ${leg.source} to ${leg.destination}, Cost: $${leg.cost.toFixed(2)}`);
        });
  
        // Calculate total cost manually
        const totalCost = route.legs.reduce((total, leg) => total + leg.cost, 0);
        console.log(`Total Cost of the Trip: $${totalCost.toFixed(2)}`);
  
        console.log('-------------------------');
      });
    } catch (error) {
      console.error('Failed to read routes:', error);
    }
  }
  

async function updateRouteLegs(db, routeId, newLegs) {
  try {
    await db.collection('route').updateOne({ _id: routeId }, { $set: { legs: newLegs } });
    console.log(`Updated route with ID: ${routeId}`);
  } catch (error) {
    console.error('Failed to update route:', error);
  }
}

async function deleteRouteLegs(db, routeId) {
  try {
    await db.collection('route').deleteOne({ _id: routeId });
    console.log(`Deleted route with ID: ${routeId}`);
  } catch (error) {
    console.error('Failed to delete route:', error);
  }
}

async function main() {
    const db = await connectToDatabase();
  
    while (true) {
      console.log('Select an operation:');
      console.log('1. Create route');
      console.log('2. Read routes');
      console.log('3. Update route');
      console.log('4. Delete route');
      console.log('5. Exit');
      const operation = parseInt(promptUser('Enter operation number: '));
  
      switch (operation) {
        case 1:
          const route = new Route();
  
          const n = parseInt(promptUser('Enter the number of legs: '));
  
          for (let i = 1; i <= n; i++) {
            const source = promptUser(`Enter source city for leg ${i}: `);
            const destination = promptUser(`Enter destination city for leg ${i}: `);
            const cost = parseFloat(promptUser(`Enter cost for leg ${i}: `));
            route.addLeg(source, destination, cost);
          }
  
          await createRouteLegs(db, route);
          break;
  
        case 2:
          await readRouteLegs(db);
          break;
  
        case 3:
          const routeIdToUpdate = promptUser('Enter route ID to update: ');
  
          const newLegs = [];
          const legCount = parseInt(promptUser('Enter the number of new legs: '));
  
          for (let i = 1; i <= legCount; i++) {
            const source = promptUser(`Enter source city for new leg ${i}: `);
            const destination = promptUser(`Enter destination city for new leg ${i}: `);
            const cost = parseFloat(promptUser(`Enter cost for new leg ${i}: `));
            newLegs.push(new Leg(source, destination, cost));
          }
  
          await updateRouteLegs(db, routeIdToUpdate, newLegs);
          break;
  
        case 4:
          const routeIdToDelete = promptUser('Enter route ID to delete: ');
          await deleteRouteLegs(db, routeIdToDelete);
          break;
  
        case 5:
          console.log('Exiting...');
          await db.client.close();
          process.exit(0);
  
        default:
          console.log('Invalid operation number. Please try again.');
      }
  
      console.log('-------------------------');
    }
  }
  
  main().catch(console.error);
  
