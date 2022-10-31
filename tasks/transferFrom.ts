import {task} from 'hardhat/config';

task("transferFrom", "Transfers tokens")
.addParam('contract','Contract address')
.addParam('from', 'Spender address')
.addParam('to', 'Address to receive tokens')
.addParam('amount','Amount to receive')
  .setAction(async(taskArgs, hre)=> {
    const Token = await hre.ethers.getContractFactory("BBT", taskArgs.contract);
    const token = Token.attach(taskArgs.contract);

    const tx = await token.transferFrom(taskArgs.from, taskArgs.to, taskArgs.amount);
    console.log(tx);
});