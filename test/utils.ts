import { Wallet } from "ethers";

export const AGENT_ROLE: string =
  "";
export const OWNER_ROLE: string =
  "";

// keccak256(ADMIN_ROLE)
export const ADMIN_ROLE =
  "";

// keccak256(TOKEN_ROLE)
export const TOKEN_ROLE =
  "";

export const accessControlRevert = (
  address: SignerWithAddress,
  role: string
) => {
  return `AccessControl: account ${address.address.toLowerCase()} is missing role ${role}`;
};
