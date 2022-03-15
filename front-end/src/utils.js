import detectEthereumProvider from "@metamask/detect-provider";
import { ethers } from "ethers";
import { NETWORKS} from "./constants";
import Swal from 'sweetalert2'


export const isEmpty = (data) => {
    return (
      !data || data.length === 0 || typeof data == "undefined" || data == null || Object.keys(data) === 0
    );
  };

//This function connects to the blockchain and read data
export const getReadOnlyProvider = async () => {
    const provider = await detectEthereumProvider();
    if(provider && provider === window.ethereum){
      return new ethers.providers.Web3Provider(provider,"any");
    }else{
      return false;
    }
}


export const getRigelPoolContract = async (provider , contractData ) => {
    const network = NETWORKS[NETWORKS["ACTIVE"]];
    const networkInfo = isEmpty(contractData.networks[network.chainId]) ? contractData.networks[5777] : contractData.networks[network.chainId];
    const address = networkInfo.address;
    const contractABI = contractData.abi;
    return new ethers.Contract(address,contractABI,provider);
}


export function message(type , message){
  Swal.fire({
      position: 'top-end',
      icon:`${type}`,
      title: `${message}`,
      showConfirmButton: false,
      timer: 4000
  }) 
}

export const connectWallet = async (web3) => {
  const provider = await detectEthereumProvider();
  try {
    if (provider && provider === window.ethereum && !isEmpty(web3)) {
      await web3.send('eth_requestAccounts', []);
      const signNer = web3.getSigner();
      const address = await signNer.getAddress();
      const network = await web3.getNetwork();
      if(network.chainId !== NETWORKS[NETWORKS["ACTIVE"]].chainId){
        // requestNetworkhange(network);
      }
      return [signNer, address];
    } else {
      throw new Error('Please Install Metamask Wallet');
    }
  } catch (error) {
    console.log(error);
  }
};


export const requestNetworkhange = async (network) => {
  if(network.chainId !== NETWORKS[NETWORKS["ACTIVE"]].chainId){
    try{
      await window.ethereum.request({
        method : 'wallet_switchEthereumChain',
        params : [{chainId : NETWORKS[NETWORKS["ACTIVE"]].chainIdHex}]
      })
    }catch(error){
      console.log(error.message,NETWORKS[NETWORKS["ACTIVE"]].chainIdHex)
      if (error.code === 4902) {
        if("BINANCE_TEST_NET" === NETWORKS["ACTIVE"]){
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x61',
                  chainName: 'Smart Chain - Testnet',
                  nativeCurrency: {
                    name: 'Binance',
                    symbol: 'BNB', // 2-6 characters long
                    decimals: 18
                  },
                  blockExplorerUrls: ['https://testnet.bscscan.com'],
                  rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
                },
              ],
            });
          } catch (addError) {
            console.error(addError);
          }
        }else if("BINANCE_MAIN_NET" === NETWORKS["ACTIVE"]){
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x38',
                  chainName: 'Smart Chain - Mainnet',
                  nativeCurrency: {
                    name: 'Binance',
                    symbol: 'BNB', // 2-6 characters long
                    decimals: 18
                  },
                  blockExplorerUrls: ['https://bscscan.com'],
                  rpcUrls: ['https://bsc-dataseed.binance.org/'],
                },
              ],
            });
          } catch (addError) {
            console.error(addError);
          }
        }else{
          Swal.fire({
            position: 'top-end',
            icon: 'info',
            title: `Add ${NETWORKS[NETWORKS["ACTIVE"]].network_name} To Your Metamask Wallet `,
            showConfirmButton: false,
            timer: 4000
          }) 
        }
      }
    }
  }
}


export const getContract = async (provider , contractData ) => {
  const network = NETWORKS[NETWORKS["ACTIVE"]];
  const networkInfo = isEmpty(contractData.networks[network.chainId]) ? contractData.networks[5777] : contractData.networks[network.chainId];
  const address = networkInfo.address;
  const contractABI = contractData.abi;
  return new ethers.Contract(address,contractABI,provider);
}

export const weiToToken = (bigNumber , decimal) => {
  return ethers.utils.formatUnits(bigNumber.toString(),decimal);
}

export const tokenToWei = (number , decimal) => {
return ethers.utils.parseUnits(number.toString(),decimal);
}