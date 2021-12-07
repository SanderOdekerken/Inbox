const assert = require("assert");
const ganache = require("ganache-cli");
const { describe, beforeEach } = require("mocha");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const { abi, bytecode } = require("../compile");

const initialValue = "Hi there";
let accounts;
let inbox;

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts();

  // Use one of those accounts to deploy the contract
  inbox = await new web3.eth.Contract(JSON.parse(JSON.stringify(abi))).deploy({
    data: bytecode,
    arguments: [initialValue],
  }).send({from : accounts[0], gas: "1000000"});
});

describe("Inbox", () => {
  it("deploys a contract", () => {
   assert.ok(inbox.options.address);
  });
  it("has a default message", async ()=>{
    const message = await inbox.methods.message().call();
    assert.equal(message, initialValue)
  });
  it("can set a message", async ()=>{
     await inbox.methods.setMessage("Bye").send({ from: accounts[0]})
     const message = await inbox.methods.message().call();
     assert.equal(message, "Bye")
  })
});

// practice mocha
// class Car {
//   park() {
//     return "stopped";
//   }
//   drive() {
//     return "vroom";
//   }
// }

// let car;
// beforeEach(() => {
//   car = new Car();
// });

// describe("Car", () => {
//   it("can park", () => {
//     assert.equal(car.park(), "stopped");
//   });
//   it("can drive", () => {
//     assert.equal(car.drive(), "vroom");
//   });
// });
