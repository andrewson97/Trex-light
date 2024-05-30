import { Wallet } from "ethers";

// export const AGENT_ROLE: string =
//   "0xcab5a0bfe0b79d2c4b1c2e02599fa044d115b7511f9659307cb4276950967709";
// export const OWNER_ROLE: string =
//   "0xb19546dff01e856fb3f010c267a7b1c60363cf8a4664e21cc89c26224620214e";

// // keccak256(ADMIN_ROLE)
// export const ADMIN_ROLE =
//   "0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775";

// // keccak256(TOKEN_ROLE)
// export const TOKEN_ROLE =
//   "0xa7197c38d9c4c7450c7f2cd20d0a17cbe7c344190d6c82a6b49a146e62439ae4";


export const AGENT_ROLE: string =
  "0xdb0c35594dee64a5914a475a1b1ea3aeefc80d203cbb31ffcfb63ff449afd5fb";
  
export const OWNER_ROLE: string =
  "0xa879d023ed36dea2b35a47110edde9adf2234b9d0e11a117418f644a54c45cf2";

// keccak256(ADMIN_ROLE)
export const ADMIN_ROLE =
  "0x6a7edec2dab32a875148040670512c86718856390cdafc91f1fc0d24487ecf6f";

// keccak256(TOKEN_ROLE)
export const TOKEN_ROLE =
  "0x9c863312b7305c0dc9c0454ec6d78ef2b06c254662d8f56b3552f623e757f626";

export const accessControlRevert = (
  address: SignerWithAddress,
  role: string
) => {
  return `AccessControl: account ${address.address.toLowerCase()} is missing role ${role}`;
};
