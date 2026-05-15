import hre from "hardhat";

async function main() {
  // Explicitly ensure the ethers plugin is loaded
  const ethers = hre.ethers; 
  
  if (!ethers) {
    throw new Error("Ethers plugin not found. Check your hardhat.config.js imports.");
  }

  const [owner] = await ethers.getSigners();
  
  console.log("Checking environment for Tunapac Humanledger...");
  console.log("Wallet Address:", owner.address);

  const dummyTokenAddr = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  
  const Grant = await ethers.getContractFactory("Grant");
  const grant = await Grant.deploy(dummyTokenAddr);
  await grant.waitForDeployment();

  const target = await grant.token();
  if (target === dummyTokenAddr) {
    console.log("✅ SUCCESS: Grant contract deployed and verified.");
    console.log("Contract Address:", grant.target);
  } else {
    console.log("❌ FAILURE: Token address mismatch.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
