const { ethers } = require("hardhat");

async function main() {
  // Retrieve the signers
  //const [deployer, tokenAgent , claimIssuer, aliceWallet, bobWallet, charlieWallet, tokenAdmin] = await ethers.getSigners();
  const [
    deployer,
    tokenIssuer,
    tokenAgent,
    tokenAdmin,
    claimIssuer,
    aliceWallet,
    bobWallet,
    charlieWallet,
    davidWallet,
    anotherWallet,
  ] = await ethers.getSigners();
  // Known addresses from Hardhat local node
  const deployerAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
  const tokenAgentAddress = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC";
  const aliceAddress = "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc";
  const bobAddress = "0x976EA74026E726554dB657fA54763abd0C3a0aa9";
  //const tokenAdminAddress:  "0x90F79bf6EB2c4f870365E785982E1f101E93b906";


  // Deployed contract addresses
  const identityRegistryAddress = "0xa85233C63b9Ee964Add6F2cffe00Fd84eb32338f";
  const tokenAddress = "0x09635F643e140090A9A8Dcd712eD6285858ceBef";

  // Attach contracts using the deployed addresses
  const IdentityRegistry = await ethers.getContractFactory("IdentityRegistry", tokenAdmin);
  const identityRegistry = IdentityRegistry.attach(identityRegistryAddress);

  const Token = await ethers.getContractFactory("Token", tokenAdmin);
  const token = Token.attach(tokenAddress);

  // Check token balance of Alice
  let aliceBalance = await token.balanceOf(aliceAddress);
  console.log(`Alice's token balance: ${ethers.utils.formatUnits(aliceBalance, 6)}`);

  // Check token balance of Bob
  let bobBalance = await token.balanceOf(bobAddress);
  console.log(`Bob's token balance: ${ethers.utils.formatUnits(bobBalance, 6)}`);

  // Transfer tokens from Alice to Bob
  const transferAmount = ethers.utils.parseUnits("100", 6);
  await token.connect(aliceWallet).transfer(bobAddress, transferAmount);

  // Check new balances
  aliceBalance = await token.balanceOf(aliceAdress);
  bobBalance = await token.balanceOf(bobAddress);
  console.log(`Alice's new token balance: ${ethers.utils.formatUnits(aliceBalance, 6)}`);
  console.log(`Bob's new token balance: ${ethers.utils.formatUnits(bobBalance, 6)}`);

  // Verify claim for Alice
  const claimTopic = ethers.utils.id("CLAIM_TOPIC");
  const claim = await identityRegistry.getClaim(aliceAddress, claimTopic);
  console.log(`Alice's claim: ${claim}`);
}

// Run the script
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });



  // // get the number of claims for Alice and Bob
  // const aliceClaimCount = await aliceIdentity.claimCount();
  // console.log(`Alice has ${aliceClaimCount.toString()} claims.`);
  // const bobClaimCount = await bobIdentity.claimCount();
  // console.log(`Bob has ${bobClaimCount.toString()} claims.`);
