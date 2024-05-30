Navigate to the root project directory

Ensure Hardhat is installed in the local project directory >> `npm install --save-dev hardhat`

Run a local Hardhat node >> `npx hardhat node

Deploy T-Rex to your local node >> `npx hardhat run --network localhost scripts/deploy.js`

The deployment script will run and the Trex-Light contracts will be deployed



# Note:
The above instruction only guide to deploy the contract in hardhat local environment.

While trying to deploy in another networks the following should be taken care of

- The wallet should contain 12 addresses as the set up require 12 different accounts

- There are 4 roles directly involved and embedded in the contracts
    1. Token role
    2. Admin role
    3. Owner role
    4. Agent role

- The keccak hash of the above roles have been hardcoded in some contracts

- Use scripts/keccak.js file to create keccak hash of the roles and replace them in the contracts.
    hint - search keywords and find out where the roles has been hard coded.