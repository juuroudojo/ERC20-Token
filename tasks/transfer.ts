import {task} from 'hardhat/config';

task("transfer", "Transfers tokens")
.addParam('contract','Contract address')
.addParam('to', 'Address to receive tokens')
.addParam('amount','Amount to send')
  .setAction(async(taskArgs, hre)=> {
    const Token = await hre.ethers.getContractFactory("BBT");
    const token = Token.attach(taskArgs.contract);

    const tx = await token.transfer(taskArgs.to, taskArgs.amount);
    console.log(tx);
});