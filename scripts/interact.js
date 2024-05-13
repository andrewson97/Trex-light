const hre = require("hardhat");

async function main() {
  try {

    // Get all signers
    const signers = await hre.ethers.getSigners();

    // Select a specific signer. For example, the first one.
    const selectedSigner = signers[2];
    
    //get the contract factory of my contract
    const TokenFactory = await hre.ethers.getContractFactory("Token");

    // Connect to the deployed contract
    const tokenContractAddress = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853"; 
    const TokenContract = TokenFactory.connect(selectedSigner).attach(tokenContractAddress);


    const TotalSupply = await TokenContract.version();
    console.log("Version:", TotalSupply.toString());

    //get the code at the contract
    const code = await selectedSigner.provider.getCode(tokenContractAddress);
    console.log("Code at contract address:", code);


  
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();