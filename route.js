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

function main() {
  const route = new Route();

  const n = parseInt(promptUser('Enter the number of legs: '));

  for (let i = 1; i <= n; i++) {
    const source = promptUser(`Enter source city for leg ${i}: `);
    const destination = promptUser(`Enter destination city for leg ${i}: `);
    const cost = parseFloat(promptUser(`Enter cost for leg ${i}: `));
    route.addLeg(source, destination, cost);
  }

  console.log('Leg Details:');
  let totalCost = 0;

  for (let i = 0; i < route.legs.length; i++) {
    const leg = route.legs[i];
    console.log(`Leg ${i + 1}: ${leg.source} to ${leg.destination}, Cost: $${leg.cost.toFixed(2)}`);
    totalCost += leg.cost;
  }

  console.log(`Total Cost of the Trip: $${totalCost.toFixed(2)}`);
}

main();
