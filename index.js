import {ethers} from "./ethers-5.6.esm.min.js" 
import { abi,ContractAddress } from "./constants.js"

/**ethers-5.6.esm.min.js has the frontendified version of ethers.js
 * frameworks like react and next.js converts this automatically to frontendified version
 */
const connectButton=document.getElementById("connectButton")
const fundButton=document.getElementById("fundButton")

fundButton.onclick=fundFunction

connectButton.onclick= connectionMeta


console.log(ethers)
async function connectionMeta(){
    // metamask or any other wallet injects an windows.ethrium objects inside the browser so we will be basically be checking for this object to check if the browser is connected to metamask or not
    if(typeof window.ethereum !== "undefined"){
        
        // making metamask automatically pop up incase it is there
        // on connection our website can make api calls to the metamask
       try{await window.ethereum.request({method:"eth_requestAccounts"})
       document.getElementById("connectButton").innerText="Connected"
       console.log("connected")}catch(error){
        console.log(error)
       }
    }else{
        console.log("not connected to metamask")
        document.getElementById("connectButton").innerText="Please install metamask"
    }}

    /**
     * in nodejs we have been using require statement to import dependencies but here in es6 we cant instead use import */


    //builing the fund functiona


    /**to send transaction on blockchain we require the fallowing things
         * provider =>connection to the blockchain 
         * signer =wallet to pay certain amount of gas 
         * contract to interact with and for that we need abi and address
         * 
         */
    const ethAmount='77'
    async function fundFunction(ethAmount){

        console.log(`funding with ${ethAmount}...`)

        if(typeof window.ethereum !== "undefined"){
           /**Web3Provider allows to wrap around stuff like metamask helping us to connect to the block chain
            * as we connect it to metamask it takes whatever end point the wallet is connected to and sticks it to our ethers
            */

            const provider = new ethers.providers.Web3Provider(window.ethereum)
            // since wallet is connected to the network provider getsigner returns whatever wallet is connected to metamask
            const signer = provider.getSigner()//=>returns whichever wallet account is connected to the network provider
            console.log(signer)
            const contract = new ethers.Contract(ContractAddress,abi,signer)
            // to interact with the smart contract we need its abi and address


            // once we have connected to our smart contract we can send transaction and interact with our smart contract

            const transactionResponse = await contract.fund({value:ethers.utils.parseEther(ethAmount)})
        }

        
    }