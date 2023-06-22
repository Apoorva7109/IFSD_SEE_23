const mongoose = require('mongoose');
const prompt = require('prompt-sync')();

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

function promptUser(question) {
  return prompt(question);
}

async function connectToDatabase() {
  const uri = 'mongodb+srv://Apoorva:apoorva@cluster0.hdtmhbr.mongodb.net/'; // Replace with your MongoDB connection URI
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

async function readRouteLegs() {
  try {
    const routes = await Route.find({});
    routes.forEach((route) => {
      console.log('Leg Details:');
      route.legs.forEach((leg, index) => {
        console.log(`Leg ${index + 1}: ${leg.source} to ${leg.destination}, Cost: $${leg.cost.toFixed(2)}`);
      });

      const totalCost = route.legs.reduce((total, leg) => total + leg.cost, 0);
      console.log(`Total Cost of the Trip: $${totalCost.toFixed(2)}`);

      console.log('-------------------------');
    });
  } catch (error) {
    console.error('Failed to read routes:', error);
  }
}

async function updateRouteLegs(routeId, newLegs) {
  try {
    await Route.findByIdAndUpdate(routeId, { legs: newLegs });
    console.log(`Updated route with ID: ${routeId}`);
  } catch (error) {
    console.error('Failed to update route:', error);
  }
}

async function deleteRouteLegs(routeId) {
  try {
    await Route.findByIdAndDelete(routeId);
    console.log(`Deleted route with ID: ${routeId}`);
  } catch (error) {
    console.error('Failed to delete route:', error);
  }
}

async function main() {
  await connectToDatabase();

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
          route.legs.push(new Leg({ source, destination, cost }));
        }

        await createRouteLegs(route);
        break;

      case 2:
        await readRouteLegs();
        break;

      case 3:
        const routeIdToUpdate = promptUser('Enter route ID to update: ');

        const newLegs = [];
        const legCount = parseInt(promptUser('Enter the number of new legs: '));

        for (let i = 1; i <= legCount; i++) {
          const source = promptUser(`Enter source city for new leg ${i}: `);
          const destination = promptUser(`Enter destination city for new leg ${i}: `);
          const cost = parseFloat(promptUser(`Enter cost for new leg ${i}: `));
          newLegs.push(new Leg({ source, destination, cost }));
        }

        await updateRouteLegs(routeIdToUpdate, newLegs);
        break;

      case 4:
        const routeIdToDelete = promptUser('Enter route ID to delete: ');
        await deleteRouteLegs(routeIdToDelete);
        break;

      case 5:
        console.log('Exiting...');
        process.exit(0);

      default:
        console.log('Invalid operation number. Please try again.');
    }

    console.log('-------------------------');
  }
}

main().catch(console.error);
