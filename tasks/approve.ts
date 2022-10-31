import {task} from 'hardhat/config';

task("approve", "Transfers tokens")
.addParam('contract','Contract address')
.addParam('spender', 'Address to get approved')
.addParam('amount','Amount to approve')
  .setAction(async(taskArgs, hre)=> {
    const Token = await hre.ethers.getContractFactory("BBT");
    const token = Token.attach(taskArgs.contract);

    const tx = await token.approve(taskArgs.spender, taskArgs.amount);
    console.log(tx);
});