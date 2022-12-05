import {ethers} from "./ethers-5.6.esm.min.js" 
import { abi,ContractAddress } from "./constants.js"

/**ethers-5.6.esm.min.js has the frontendified version of ethers.js
 * frameworks like react and next.js converts this automatically to frontendified version getbalance
 */
const connectButton=document.getElementById("connecButton")
const fundButton=document.getElementById("fundButton")
const withdrawButton = document.getElementById("withdrawButton")

const getbalanceButton=document.getElementById("getbalance")
getbalanceButton.onclick=getBalance

withdrawButton.onclick= withdraw
fundButton.onclick=fundFunction

connectButton.onclick=connectionMeta


console.log(ethers)

async function connectionMeta(){
    // metamask or any other wallet injects an windows.ethrium objects inside the browser so we will be basically be checking for this object to check if the browser is connected to metamask or not
    if(typeof window.ethereum !== "undefined"){
        
        // making metamask automatically pop up incase it is there
        // on connection our website can make api calls to the metamask
       try{await window.ethereum.request({method:"eth_requestAccounts"})
       document.getElementById("connecButton").innerText="Connected"
       console.log("connected")}catch(error){
        console.log(error)
       }
    }else{
        console.log("not connected to metamask")
        document.getElementById("connecButton").innerText="Please install metamask"
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
    // const ethAmount='77'
    async function fundFunction(){
        const ethAmount = document.getElementById("etheriumValue").value

        console.log(`funding with ${ethAmount}...`)

        if(typeof window.ethereum !== "undefined"){
           /**Web3Provider allows to wrap around stuff like metamask helping us to connect to the block chain
            * as we connect it to metamask it takes whatever end point the wallet is connected to and sticks it to our ethers
            */
         try{
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            // since wallet is connected to the network provider getsigner returns whatever wallet is connected to metamask
            const signer = provider.getSigner()//=>returns whichever wallet account is connected to the network provider
            console.log(signer)
            const contract = new ethers.Contract(ContractAddress,abi,signer)
            // to interact with the smart contract we need its abi and address


            // once we have connected to our smart contract we can send transaction and interact with our smart contract

            const transactionResponse = await contract.fund({value:ethers.utils.parseEther(ethAmount)})
         //we need to listen for the event of transaction getting mined and we stop till the function is completly mined
        await listenForTransaction(transactionResponse,provider)
        
        
        }catch(error){
                console.log(error)
            }

        }
        


        
    }


    function listenForTransaction(transactionResponse,provider){


        console.log(`getting the transaction ${transactionResponse.hash}`)
        //we will define how we are actually listening to this transaction using the event listeners provided by ethers ==>.once =>once a event fires we call the other function we have defined(it only triggers one time)
        //the event we will wait for is the transaction receipt because it means that the transaction has completed

        /**PROBLEM here our listener function will actually finish off before our provider.once function listsens for the confirmation and hence will go to the next line of execution and then due to the event loop in js it will come back again to execte the code
         * hence we are adding the provider.once to the que called the event loop and periodically check back to it if its finished and hence we need to modify this function to resolve a promise
         * promises by default take a functio as parameter 
         * we pass in resolve and reject so that when we have successfully listened to a transaction we can actually resolve the promise
         * once transaction hash is found we are calling the function and then
         * so promise is only returned  and the function only finishes when resolve or reject is called
         * then
        */
       return new Promise((resolve,reject)=>{
        try{
        provider.once(transactionResponse.hash,(transactionReceipt)=>{

            console.log(`completed with ${transactionReceipt.confirmations}`)
        })
        resolve()
    
    }catch(error){
            reject(error)
           }

       })
       
    }


     async function getBalance(){
        if(typeof window.ethereum !== "undefined"){
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const balance = await provider.getBalance(ContractAddress)//GETTING THE BALANCE
            console.log(ethers.utils.formatEther(balance))//makes the contract readable

        }


    }



    async function withdraw(){
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        
            const signer = provider.getSigner()
            console.log(signer)
            const contract = new ethers.Contract(abi,signer)
            try{
                const transactionResponse= await contract.withdraw
            }catch(error){
                console.log(error)
            }


        
    }