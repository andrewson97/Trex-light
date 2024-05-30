const ethers = require('ethers');

async function main() {
  // Replace these with your actual contract addresses
  const aliceIdentityAddress = "0x9E545E3C0baAB3E08CdfD552C960A1050f373042";
  const bobIdentityAddress = "0xa82fF9aFd8f496c3d6ac40E2a0F282E47488CFc9";
  const charlieIdentityAddress = "0x1613beB3B2C4f22Ee086B2b38C1476A3cE7f78E8";
  const tokenAddress = "0x09635F643e140090A9A8Dcd712eD6285858ceBef";
  const identityRegistryAddress = "0xa85233C63b9Ee964Add6F2cffe00Fd84eb32338f";

  // Get the contract instances
  const aliceIdentity = await ethers.getContractAt("Identity", aliceIdentityAddress);
  const bobIdentity = await ethers.getContractAt("Identity", bobIdentityAddress);
  const token = await ethers.getContractAt("Token", tokenAddress);
  const identityRegistry = await ethers.getContractAt("IdentityRegistry", identityRegistryAddress);


  // get the number of claims for Alice and Bob
  const aliceClaimCount = await aliceIdentity.claimCount();
  console.log(`Alice has ${aliceClaimCount.toString()} claims.`);
  const bobClaimCount = await bobIdentity.claimCount();
  console.log(`Bob has ${bobClaimCount.toString()} claims.`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
