const { ethers } = require("hardhat");
const { expect } = require("chai");

const tokens = (n)=>{
    return ethers.parseUnits(n.toString(),'ether')
}

describe("Token", () => {
    let token;

  beforeEach(async () => {
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy("Hameed Coin", "HAM", 1000000);
  });
  describe("Deployment",()=>{
    const name = "Hameed Coin";
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
  })
});
