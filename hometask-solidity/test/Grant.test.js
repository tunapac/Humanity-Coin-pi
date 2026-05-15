import { expect } from "chai";

describe("Grant Contract", function () {
  it("Should deploy and set the correct token address", async function () {
    // Import ethers directly from the live hardhat instance
    const { ethers } = await import("hardhat");
    const [owner] = await ethers.getSigners();
    
    const dummyTokenAddr = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    
    const Grant = await ethers.getContractFactory("Grant");
    const grant = await Grant.deploy(dummyTokenAddr);
    
    expect(grant.target).to.equal(dummyTokenAddr);
    console.log("Success: Grant deployed to:", grant.target);
  });
});
