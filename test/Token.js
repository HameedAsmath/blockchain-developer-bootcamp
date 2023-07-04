const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Token", () => {
    let token;
    const tokens = (n)=>{
        return ethers.parseUnits(n.toString(),'ether')
    }
  beforeEach(async () => {
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy("Hameed Coin", "HAM", 1000000);
  });

  it("has correct name", async () => {
    expect(await token.name()).to.equal("Hameed Coin");
  });
  it("has correct symbol", async () => {
    expect(await token.symbol()).to.equal("HAM");
  });
  it("has correct decimal", async () => {
    expect(await token.decimal()).to.equal(18);
  });
  it("has correct totalSupply", async () => {
    const value = tokens(1000000);
    expect(await token.totalSupply()).to.equal(value);
  });
});
