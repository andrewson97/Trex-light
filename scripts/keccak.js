const ethers = require('ethers');
const utils = ethers.utils;

const address19 = "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199";
const hashedAddress19 = utils.keccak256(utils.toUtf8Bytes(address19));

console.log("address19:",address19, "\nkeccak hash19:",hashedAddress19);

const address18 = "0xdD2FD4581271e230360230F9337D5c0430Bf44C0";
const hashedAddress18 = utils.keccak256(utils.toUtf8Bytes(address18));

console.log("address18:",address18, "\nkeccak hash18:",hashedAddress18);

const address17 = "0xbDA5747bFD65F08deb54cb465eB87D40e51B197E";
const hashedAddress17 = utils.keccak256(utils.toUtf8Bytes(address17));

console.log("address17:",address17, "\nkeccak hash19:",hashedAddress17);

const address16 = "0x2546BcD3c84621e976D8185a91A922aE77ECEc30";
const hashedAddress16 = utils.keccak256(utils.toUtf8Bytes(address16));

console.log("address16:",address16, "\nkeccak hash16:",hashedAddress16);