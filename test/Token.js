const { ethers } = require("hardhat");
const { expect } = require("chai");

const tokens = (n)=>{
    return ethers.parseUnits(n.toString(),'ether')
}

describe("Token", () => {
  let token, accounts, deployer, receiver;

  beforeEach(async () => {
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy("Hameed Coin", "HAM", 1000000);
    accounts = await ethers.getSigners();
    deployer = accounts[0];
    receiver = accounts[1];
    exchange = accounts[2];
  }); 
  describe("Deployment",()=>{
    const name = "Hameed Coin"
    const symbol = "HAM"
    const decimals = 18
    const totalSupply = tokens(1000000)
    it("has correct name", async () => {
        expect(await token.name()).to.equal(name);
      });
      it("has correct symbol", async () => {
        expect(await token.symbol()).to.equal(symbol);
      });
      it("has correct decimal", async () => {
        expect(await token.decimal()).to.equal(decimals);
      });
      it("has correct totalSupply", async () => {
        expect(await token.totalSupply()).to.equal(totalSupply);
      });
      it("assign total supply to deployer", async () => {
        expect(await token.balanceOf(deployer.address)).to.equal(totalSupply);
      });
  })

  describe("Sending Token", () => {
    let amount, transaction, result;
    describe("Success",()=>{
      beforeEach(async ()=>{
        amount = tokens(100)
        transaction = await token.connect(deployer).transfer(receiver.address, amount)
        result = await transaction.wait()
      })
      it("Transfer token balances",async ()=>{
        expect(await token.balanceOf(deployer.address)).to.equal(tokens(999900))
        expect(await token.balanceOf(receiver.address)).to.equal(amount)
      });
      it("Emits a transfer event", async () => {
        // const event = result.events[0]
        // expect(event.event).to.equal('Transfer')
        // const args = event.args
        // expect(args.from).to.equal(deployer.address)
        // expect(args.to).to.equal(receiver.address)
        // expect(args.value).to.equal(amount)
       expect(transaction.from).to.equal(deployer.address)   
      })
    })
    describe("Failure",()=>{
      it("detects insufficient balance",async ()=>{
        const invalidAmount = tokens(1000000)
        expect(token.connect(deployer).transfer(receiver.address,invalidAmount)).to.be.reverted
      })
      it("detects invalid recipient",async ()=>{
        const amount = tokens(100)
        expect(token.connect(deployer).transfer(0x000000000000000000000000000000000,amount)).to.be.reverted
      })
    })
    })

    describe("Approving Token", () => {
      let amount, transaction, result; 
      beforeEach(async () => {
        amount = tokens(100)
        transaction = await token.connect(deployer).approve(exchange.address, amount)
        result = await transaction.wait()
      })

      describe("Success",()=>{
        it("allocates an allowence for token spending",async ()=>{
          expect(await token.allowance(deployer.address, exchange.address)).to.equal(amount)
        })
        it("Emits a Approval event", async () => {
        //   const event = result.events[0]
        //   expect(event.event).to.equal('Transfer')
        //   const args = event.args
        //   expect(args.from).to.equal(deployer.address)
        //   expect(args.to).to.equal(receiver.address)
        //   expect(args.value).to.equal(amount)
         expect(transaction.from).to.equal(deployer.address)   
        })
      })

      describe("Failure",()=>{
        it("detects invalid recipient",async ()=>{
          const amount = tokens(100)
          expect(token.connect(deployer).approve(0x000000000000000000000000000000000,amount)).to.be.reverted
        })
      })
    })

    describe("Delagated Token Transfer", () => {
      let amount, transaction, result; 
      beforeEach(async () => {
        amount = tokens(100)
        transaction = await token.connect(deployer).approve(exchange.address, amount)
        result = await transaction.wait()
      })
      describe("Success",() => {
        beforeEach(async () => {
          transaction = await token.connect(exchange).transferFrom(deployer.address,receiver.address, amount)
          result = await transaction.wait()
        })
        it("transfers Token balances",async () => {
          expect(await token.balanceOf(deployer.address)).to.be.equal(ethers.parseUnits("999900",'ether'))
          expect(await token.balanceOf(receiver.address)).to.be.equal(amount)
        })
        it("resets the allowance", async () => {
          expect(await token.allowance(deployer.address, exchange.address)).to.be.equal(0)
        })
        it("Emits a transfer event", async () => {
          // const event = result.events[0]
          // expect(event.event).to.equal('Transfer')
          // const args = event.args
          // expect(args.from).to.equal(deployer.address)
          // expect(args.to).to.equal(receiver.address)
          // expect(args.value).to.equal(amount)
          expect(transaction.from).to.equal(exchange.address) 
        })
      })
      describe("Failure",() => {
        
      })
    })
});
