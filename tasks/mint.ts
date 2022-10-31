import * as dotenv from "dotenv";
import { task } from "hardhat/config";
dotenv.config();

task("mint", "Mints tokens")
.addParam('contract','Contract address')
.addParam('recipient', 'Recipient address')
.addParam('amount','Amount to mint')
  .setAction(async(taskArgs, hre)=> {
    const Token = await hre.ethers.getContractFactory("BBT");
    const token = Token.attach(taskArgs.contract);

    const tx = await token.mint(taskArgs.recipient, taskArgs.amount);
    console.log(tx);
});