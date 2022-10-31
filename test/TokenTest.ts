import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, ContractFactory, } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import "@nomiclabs/hardhat-etherscan";


describe("DonationTest", function () {
  let token: Contract;
  let Token: ContractFactory;
  let deployer: SignerWithAddress;
  let Jared: SignerWithAddress;
  let Jack: SignerWithAddress;
  const zeroAddress = "0x0000000000000000000000000000000000000000";


  before(async function () {
    [deployer, Jack, Jared] = await ethers.getSigners();
  });

  beforeEach(async function () {
    Token = await ethers.getContractFactory("BepaBenTen");
    token = await Token.deploy();
    await token.deployed();
  });

  it("Should deploy correctly", async function () {
    expect(await token.name()).to.equal("BepaBenTen");
    expect(await token.symbol()).to.equal("BBT");
    expect(await token.decimals()).to.equal(18);
  });

  describe("Mint", function () {
    it("Should execute mint correctly", async function () {
      await token.mint(deployer.address, ethers.utils.parseEther("150"));
      expect(await token.balanceOf(deployer.address)).to.equal(ethers.utils.parseEther("150"));
      expect(await token.totalSupply()).to.equal(ethers.utils.parseEther("150"));
    });

    it("Should fail to mint(AccessControl)", async function () {
      expect(token.connect(Jared).mint(deployer.address, ethers.utils.parseEther("145"))).to.be.revertedWith('revertMessage');
    })
  });

  describe("Burn", function () {
    it("Should burn correctly", async function () {
      await token.mint(deployer.address, ethers.utils.parseEther("150"));
      await token.burn(deployer.address, ethers.utils.parseEther("120"));
      expect(await token.balanceOf(deployer.address)).to.equal(ethers.utils.parseEther("30"));
    });

    it("Should fail to burn(AccessControl)", async function () {
      expect(token.connect(Jared).burn(deployer.address, ethers.utils.parseEther("5"))).to.be.revertedWith('revertMessage');
    });
  })

  // Deployer sends costs to Jared
  describe("Transfer", function () {
    it("Should execute transfer correctly", async function () {
      await token.mint(deployer.address, ethers.utils.parseEther("150"));
      await token.transfer(Jared.address, ethers.utils.parseEther("100"));
      expect(await token.balanceOf(Jared.address)).to.equal(ethers.utils.parseEther("100"));
    });

    it("Should fail to transfer(Insufficient balance!)", async function () {
      await token.mint(deployer.address, ethers.utils.parseEther("150"));
      expect(token.transfer(Jared.address, ethers.utils.parseEther("200"))).to.be.revertedWith("Insufficient balance!");
    });
  });

  // Jack transfers costs from deployers account to Jared
  it("Should execute transferFrom correctly", async function () {
    await token.mint(deployer.address, ethers.utils.parseEther("100"));
    await token.approve(Jack.address, ethers.utils.parseEther("25"));
    expect(await token.allowance(deployer.address, Jack.address)).to.equal(ethers.utils.parseEther("25"));
    expect(token.connect(Jack).transferFrom(deployer.address, Jared.address, ethers.utils.parseEther("30"))).to.be.revertedWith("Allowance declined!");
    expect(token.connect(Jack).transferFrom(deployer.address, Jared.address, ethers.utils.parseEther("300"))).to.be.revertedWith("Insufficient balance!");
    await token.connect(Jack).transferFrom(deployer.address, Jared.address, ethers.utils.parseEther("20"));
    expect(await token.balanceOf(Jared.address)).to.equal(ethers.utils.parseEther("20"));
  })

  it("Should emit events correctly", async function () {
    await expect(token.mint(Jared.address, ethers.utils.parseEther("110"))).to.emit(token, 'Transfer')
      .withArgs(zeroAddress, Jared.address, ethers.utils.parseEther("110"));

    await expect(token.burn(Jared.address, ethers.utils.parseEther("100"))).to.emit(token, 'Transfer')
      .withArgs(Jared.address, zeroAddress, ethers.utils.parseEther("100"));
  });
});
