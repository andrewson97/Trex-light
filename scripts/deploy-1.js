const { ethers } = require("hardhat");
const OnchainID = require("@onchain-id/solidity");
const { BigNumber } = require("ethers");
const { AGENT_ROLE, TOKEN_ROLE } = require("../test/utils");

async function deployIdentityProxy(implementationAuthority, managementKey, signer) {
  const identity = await new ethers.ContractFactory(
    OnchainID.contracts.IdentityProxy.abi,
    OnchainID.contracts.IdentityProxy.bytecode,
    signer
  ).deploy(implementationAuthority, managementKey);

  await identity.deployed();
  return ethers.getContractAt("Identity", identity.address, signer);
}

async function main() {
  const [deployer, tokenIssuer, tokenAgent, claimIssuer, aliceWallet, bobWallet, charlieWallet] = await ethers.getSigners();
  const claimIssuerSigningKey = ethers.Wallet.createRandom();
  const aliceActionKey = ethers.Wallet.createRandom();

  const IdentityFactory = await ethers.getContractFactory(OnchainID.contracts.Identity.abi, OnchainID.contracts.Identity.bytecode);
  const identityImplementation = await IdentityFactory.deploy(deployer.address, true);
  await identityImplementation.deployed();

  const ImplementationAuthorityFactory = await ethers.getContractFactory(OnchainID.contracts.ImplementationAuthority.abi, OnchainID.contracts.ImplementationAuthority.bytecode);
  const identityImplementationAuthority = await ImplementationAuthorityFactory.deploy(identityImplementation.address);
  await identityImplementationAuthority.deployed();

  const ClaimTopicsRegistry = await ethers.getContractFactory("ClaimTopicsRegistry");
  const claimTopicsRegistry = await ClaimTopicsRegistry.deploy();
  await claimTopicsRegistry.deployed();

  const ClaimIssuersRegistry = await ethers.getContractFactory("ClaimIssuersRegistry");
  const claimIssuersRegistry = await ClaimIssuersRegistry.deploy();
  await claimIssuersRegistry.deployed();

  const IdentityRegistryStorage = await ethers.getContractFactory("IdentityRegistryStorage");
  const identityRegistryStorage = await IdentityRegistryStorage.deploy();
  await identityRegistryStorage.deployed();

  const IdentityRegistry = await ethers.getContractFactory("IdentityRegistry");
  const identityRegistry = await IdentityRegistry.deploy(claimIssuersRegistry.address, claimTopicsRegistry.address, identityRegistryStorage.address);
  await identityRegistry.deployed();

  const BasicCompliance = await ethers.getContractFactory("BasicCompliance");
  const basicCompliance = await BasicCompliance.deploy();
  await basicCompliance.deployed();

  const tokenOID = await deployIdentityProxy(identityImplementationAuthority.address, tokenIssuer.address, deployer);

  const tokenName = "ERC-3643";
  const tokenSymbol = "TREX";
  const tokenDecimals = BigNumber.from("6");

  const Token = await ethers.getContractFactory("Token");
  const token = await Token.deploy(identityRegistry.address, basicCompliance.address, tokenName, tokenSymbol, tokenDecimals, tokenOID.address);
  await token.deployed();

  await basicCompliance.grantRole(TOKEN_ROLE, token.address);
  await token.grantRole(AGENT_ROLE, tokenAgent.address);
  await identityRegistryStorage.bindIdentityRegistry(identityRegistry.address);

  const claimTopics = [ethers.utils.id("CLAIM_TOPIC")];
  await claimTopicsRegistry.connect(deployer).addClaimTopic(claimTopics[0]);

  const ClaimIssuer = await ethers.getContractFactory("ClaimIssuer");
  const claimIssuerContract = await ClaimIssuer.deploy(claimIssuer.address);
  await claimIssuerContract.deployed();

  await claimIssuerContract.connect(claimIssuer).addKey(
    ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["address"], [claimIssuerSigningKey.address])),
    3,
    1
  );

  await claimIssuersRegistry.connect(deployer).addClaimIssuer(claimIssuerContract.address, claimTopics);

  const aliceIdentity = await deployIdentityProxy(identityImplementationAuthority.address, aliceWallet.address, deployer);
  await aliceIdentity.connect(aliceWallet).addKey(
    ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(["address"], [aliceActionKey.address])),
    2,
    1
  );

  const bobIdentity = await deployIdentityProxy(identityImplementationAuthority.address, bobWallet.address, deployer);
  const charlieIdentity = await deployIdentityProxy(identityImplementationAuthority.address, charlieWallet.address, deployer);

  await identityRegistry.grantRole(AGENT_ROLE, tokenAgent.address);
  await identityRegistry.grantRole(AGENT_ROLE, token.address);

  await identityRegistry.connect(tokenAgent).batchRegisterIdentity(
    [aliceWallet.address, bobWallet.address],
    [aliceIdentity.address, bobIdentity.address],
    [42, 666]
  );

  const claimForAlice = {
    data: ethers.utils.hexlify(ethers.utils.toUtf8Bytes("Some claim public data.")),
    issuer: claimIssuerContract.address,
    topic: claimTopics[0],
    scheme: 1,
    identity: aliceIdentity.address,
    signature: "",
  };

  claimForAlice.signature = await claimIssuerSigningKey.signMessage(
    ethers.utils.arrayify(ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(
      ["address", "uint256", "bytes"],
      [claimForAlice.identity, claimForAlice.topic, claimForAlice.data]
    )))
  );

  await aliceIdentity.connect(aliceWallet).addClaim(
    claimForAlice.topic,
    claimForAlice.scheme,
    claimForAlice.issuer,
    claimForAlice.signature,
    claimForAlice.data,
    ""
  );

  const claimForBob = {
    data: ethers.utils.hexlify(ethers.utils.toUtf8Bytes("Some claim public data.")),
    issuer: claimIssuerContract.address,
    topic: claimTopics[0],
    scheme: 1,
    identity: bobIdentity.address,
    signature: "",
  };

  claimForBob.signature = await claimIssuerSigningKey.signMessage(
    ethers.utils.arrayify(ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(
      ["address", "uint256", "bytes"],
      [claimForBob.identity, claimForBob.topic, claimForBob.data]
    )))
  );

  await bobIdentity.connect(bobWallet).addClaim(
    claimForBob.topic,
    claimForBob.scheme,
    claimForBob.issuer,
    claimForBob.signature,
    claimForBob.data,
    ""
  );

  await token.grantRole(AGENT_ROLE, tokenAgent.address);
  await token.connect(tokenAgent).mint(aliceWallet.address, 1000);
  await token.connect(tokenAgent).mint(bobWallet.address, 500);

  await identityRegistry.grantRole(AGENT_ROLE, tokenAgent.address);

  console.log("Contracts deployed:");
  console.log("Identity Implementation:", identityImplementation.address);
  console.log("Implementation Authority:", identityImplementationAuthority.address);
  console.log("Claim Topics Registry:", claimTopicsRegistry.address);
  console.log("Claim Issuers Registry:", claimIssuersRegistry.address);
  console.log("Identity Registry Storage:", identityRegistryStorage.address);
  console.log("Identity Registry:", identityRegistry.address);
  console.log("Basic Compliance:", basicCompliance.address);
  console.log("Token OID:", tokenOID.address);
  console.log("Token:", token.address);
  console.log("Alice Identity:", aliceIdentity.address);
  console.log("Bob Identity:", bobIdentity.address);
  console.log("Charlie Identity:", charlieIdentity.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
