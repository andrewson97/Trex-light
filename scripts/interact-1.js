const { ethers } = require("ethers");

// Replace these with the actual addresses from your deployment
const tokenAddress = "0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6";
const aliceIdentityAddress = "0x0B306BF915C4d645ff596e518fAf3F9669b97016";
const bobIdentityAddress = "0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1";

// Hardhat local network configuration
const LOCAL_NETWORK_URL = "http://127.0.0.1:8545";
const PRIVATE_KEY = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"; // Replace with the private key of the deployer or any account with sufficient funds

const provider = new ethers.providers.JsonRpcProvider(LOCAL_NETWORK_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);

const tokenABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function mint(address to, uint256 amount)",
  "function transfer(address to, uint256 amount)",
  "function grantRole(bytes32 role, address account)",
];

async function getBalance(address) {
  const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
  const balance = await tokenContract.balanceOf(address);
  console.log(`Balance of ${address}: ${ethers.utils.formatUnits(balance, 6)} tokens`);
}

async function mintTokens(to, amount) {
  const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
  const mintTx = await tokenContract.mint(to, ethers.utils.parseUnits(amount.toString(), 6));
  await mintTx.wait();
  console.log(`Minted ${amount} tokens to ${to}`);
}

async function transferTokens(to, amount) {
  const tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
  const transferTx = await tokenContract.transfer(to, ethers.utils.parseUnits(amount.toString(), 6));
  await transferTx.wait();
  console.log(`Transferred ${amount} tokens to ${to}`);
}

async function main() {
  // Example operations
  await getBalance(aliceIdentityAddress);
  await mintTokens(bobIdentityAddress, 1000);
  await transferTokens(bobIdentityAddress, 500);
  await getBalance(aliceIdentityAddress);
  await getBalance(bobIdentityAddress);
}

main().catch(console.error);
