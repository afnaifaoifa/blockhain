import { createStore } from 'vuex'
import { ABI } from "@/contracts/Web3Linkedin.abi.js"
import { bytecode } from "@/contracts/Web3Linkedin.bin.js"
import { NFTABI } from '@/contracts/MERC721.abi';
import { NFTbytecode } from '@/contracts/MERC721.bin';
const FormData = require('form-data');

const axios = require("axios");
const formData = new FormData();

const PinataJWT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIxYzUxOTRhNS1mYjVjLTQ3NDktYTk3ZS1hZGI5MGQ5MGZmYzkiLCJlbWFpbCI6Im11YWZpa2RAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6IjlmOWRkZGFjNzAwYmRkMTIwZTNhIiwic2NvcGVkS2V5U2VjcmV0IjoiMTdjODYyYjY5YjIxZTFhYWY2N2FjYzcxNDE1Yzc4MzhhYWViOWJlODQyMDliMDkwNDRmNmQwMjU0ZWY3MDBlOCIsImlhdCI6MTcwODgxMTcyNH0.VXxgf2ScirkXWh79XGAAt1nyTsAuBvkqKnR6KwpHrYI";
const ethers = require('ethers')
let provider = new ethers.providers.JsonRpcProvider("https://eth-goerli.g.alchemy.com/v2/TS8hjejOOd_2UNj46exSTVtqS7-JxYrT")

export default createStore({
    state: {
        address: "",
        chainId: "",
        chain: "",
        deployHash: "",
        contractAddress: "0x01a1A45FA351919951Beb1F2a24e577AAA936282",
        isConnected: false,
        username: "",
        userBio: "",
        userProfilePicture: "",
        contest: {},
        ipfsHash: "",
        pinataImageUrl: ""
    },
    getters: {
    },
    mutations: {
    },
    actions: {
        async connectWallet({ state }) {
            // проверяем, что есть метамаск и подключаем его
            if (typeof window.ethereum !== 'undefined') {
                console.log("Ethereum client installed!")
                if (ethereum.isMetaMask === true) {
                    console.log("Metamask installed!")
                    if (ethereum.isConnected() !== true) {
                        console.log("Metamask is not connected!")
                        await ethereum.enable()
                        state.isConnected = true;
                        state.buttonText = 'Connected';
                    }
                    console.log("Metamask connected!")
                    state.isConnected = true;
                    state.buttonText = 'Connected';
                }
                else {
                    alert("Metamask is not installed!")
                }
            }
            else {
                alert("Ethereum client is not installed!")
            }

            ethereum.on('disconnect', () => {
                state.isConnected = false;
                state.buttonText = 'Connect MetaMask';
            });
            // создаём провайдера
            provider = new ethers.providers.Web3Provider(ethereum)

            // подключаем аккаунт
            await ethereum.request({ method: "eth_requestAccounts" })
                .then(accounts => {
                    state.address = ethers.utils.getAddress(accounts[0])
                    state.signer = provider.getSigner()
                    console.log(`Account ${state.address} connected`)
                    alert("Connected!")
                })
            // получаем параметры сети 
            state.chainId = await window.ethereum.request({ method: 'eth_chainId' });
            console.log("chainId: ", state.chainId)
            if (state.chainId == "0x1") {
                state.chain = "mainnet"
            }
            else if (state.chainId == "0x5") {
                state.chain = "goerli"
                provider = new ethers.providers.JsonRpcProvider("https://eth-goerli.g.alchemy.com/v2/TS8hjejOOd_2UNj46exSTVtqS7-JxYrT")
                state.contest = new ethers.Contract(state.contractAddress, ABI, provider)
            }
            else if (state.chainId == "0x539") {
                state.chain = "ganache"
                provider = new ethers.providers.JsonRpcProvider("HTTP://127.0.0.1:7545")
                state.contest = new ethers.Contract(state.contractAddress, ABI, provider)
            }
            else if (state.chainId == "0x13881") {
                state.chain = "mumbai"
                provider = new ethers.providers.JsonRpcProvider("https://polygon-mumbai.g.alchemy.com/v2/wusrTgSFSsScFKTK6Nqa5rFoisfYXjPW")
                state.contest = new ethers.Contract(state.contractAddress, ABI, provider)
            }
            else if (state.chainId == "0xaa36a7") {
                state.chain = "sepolia"
                provider = new ethers.providers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/UqJsOz1IQnRrGqV9bh7Q7ziNR2rN7Pi7")
                state.contest = new ethers.Contract(state.contractAddress, ABI, provider)
            }

            ethereum.on('accountsChanged', (accounts) => {
                state.address = ethers.utils.getAddress(accounts[0])
                state.signer = provider.getSigner()
                console.log(`accounts changed to ${state.address}`)
            })

            ethereum.on('chainChanged', async (chainId) => {
                // создаём провайдера
                provider = new ethers.providers.Web3Provider(ethereum)
                // получаем параметры сети 
                state.chainId = await window.ethereum.request({ method: 'eth_chainId' });
                console.log(`chainId changed to ${state.chainId}`)

                if (state.chainId == "0x1") {
                    state.chain = "mainnet"
                    alert(`chain changed to ${state.chain}`)
                }
                else if (state.chainId == "0x5") {
                    state.chain = "goerli"
                    provider = new ethers.providers.JsonRpcProvider("https://eth-goerli.g.alchemy.com/v2/TS8hjejOOd_2UNj46exSTVtqS7-JxYrT")
                    alert(`chain changed to ${state.chain}`)

                }
                else if (state.chainId == "0x539") {
                    state.chain = "ganache"
                    provider = new ethers.providers.JsonRpcProvider("HTTP://127.0.0.1:7545")
                    alert(`chain changed to ${state.chain}`)

                }
                else if (state.chainId == "0x13881") {
                    state.chain = "mumbai"
                    provider = new ethers.providers.JsonRpcProvider("https://polygon-mumbai.g.alchemy.com/v2/wusrTgSFSsScFKTK6Nqa5rFoisfYXjPW")
                    alert(`chain changed to ${state.chain}`)
                }
                else if (state.chainId == "0xaa36a7") {
                    state.chain = "sepolia"
                    provider = new ethers.providers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/UqJsOz1IQnRrGqV9bh7Q7ziNR2rN7Pi7")
                    alert(`chain changed to ${state.chain}`)
                }
            })
        },
        // async changeNetwork({state}, chainId) {
        //     console.log(chainId)
        //     if (typeof window.ethereum !== 'undefined') {
        //         try {
        //             await window.ethereum.request({
        //                 method: 'wallet_switchEthereumChain',
        //                 params: [{ chainId: `0x${chainId[0].toString(16)}` }],
        //             });
        //         } catch (error) {
        //             console.error('Error switching network:', error);
        //         }
        //     } else {
        //         console.error('MetaMask not detected. Please install MetaMask extension.');
        //     }
        // },
        async uploadFileToPinata({ state }, args) {
            try {
                const [file] = args
                console.log(file)

                formData.append('file', file);
                console.log(formData)

                const pinataMetadata = {
                    name: "File name",
                };
                formData.append("pinataMetadata", JSON.stringify(pinataMetadata));
                console.log(formData)


                const pinataOptions = {
                    cidVersion: 1,
                };

                formData.append("pinataOptions", JSON.stringify(pinataOptions));
                console.log(formData)


                const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
                    headers: {
                        'Content-Type': `multipart/form-data`,
                        'pinata_api_key': "9f9dddac700bdd120e3a",
                        'pinata_secret_api_key': "17c862b69b21e1aaf67acc71415c7838aaeb9be84209b09044f6d0254ef700e8",
                    },
                });

                console.log(res)
                state.ipfsHash = res.data.IpfsHash
                return res.data.IpfsHash
            } catch (error) {
                console.error("Error uploading file to Pinata:", error);
                throw error;
            }
        },
        async getImageFromPinata({ state }, hash) {
            try {
                const url = `https://rose-decisive-louse-962.mypinata.cloud/ipfs/${hash}`
                return url
            } catch (error) {
                console.error('Error fetching image from Pinata:', error);
            }
        },
        async registerProfile({ state }, args) {
            const [name] = args

            const iContract = new ethers.utils.Interface(ABI)
            const data = iContract.encodeFunctionData("registerProfile", [name])

            const txHash = await window.ethereum.request({
                method: "eth_sendTransaction",
                params: [{
                    from: state.address,
                    to: state.contractAddress,
                    data: data
                }]
            })
            console.log(`Tx hash: ${txHash}`)

            console.log("Registered succesfully!")
        },
        async updateProfileName({ state }, args) {
            const [newName] = args
            const iContract = new ethers.utils.Interface(ABI)
            const data = iContract.encodeFunctionData("updateProfileName", [newName])

            const txHash = await window.ethereum.request({
                method: "eth_sendTransaction",
                params: [{
                    from: state.address,
                    to: state.contractAddress,
                    data: data
                }]
            })
            console.log(`Tx hash: ${txHash}`)

            console.log("Name changed succesfully!")

        },
        async updateProfileBio({ state }, args) {
            const [newBio] = args
            const iContract = new ethers.utils.Interface(ABI)
            const data = iContract.encodeFunctionData("updateProfileBio", [newBio])

            const txHash = await window.ethereum.request({
                method: "eth_sendTransaction",
                params: [{
                    from: state.address,
                    to: state.contractAddress,
                    data: data
                }]
            })
            console.log(`Tx hash: ${txHash}`)

            console.log("BIO changed succesfully!")

        },
        async updateProfilePicture({ dispatch, state }, args) {
            const [ipfsHash] = args

            try {

                const iContract = new ethers.utils.Interface(ABI);
                const data = iContract.encodeFunctionData('updateProfilePicture', [ipfsHash]);

                const txHash = await window.ethereum.request({
                    method: 'eth_sendTransaction',
                    params: [{
                        from: state.address,
                        to: state.contractAddress,
                        data: data,
                    }],
                });

                console.log(`Tx hash: ${txHash}`);
                console.log('Picture changed successfully!');
            } catch (error) {
                console.error('Error updating profile picture:', error);
            }
        },
        async getUserProfile({ state, dispatch }, address) {
            console.log(address)
            console.log("Store")
            const [username, userBio, userProfilePicture, userFriends] = await state.contest.getUserProfile(address[0])
            console.log(userProfilePicture)
            let url = await dispatch("getImageFromPinata", userProfilePicture)
            if (url === "https://rose-decisive-louse-962.mypinata.cloud/ipfs/") {
                url = "'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png'"
            }
            else {
                url = await dispatch("getImageFromPinata", userProfilePicture)
            }
            const user = {
                address: address[0],
                name: username,
                bio: userBio,
                image: url,
                friends: userFriends
            }
            return (user)
        },
        async sendFriendRequest({ state, dispatch }, address) {
            const iContract = new ethers.utils.Interface(ABI)
            const data = iContract.encodeFunctionData("sendFriendRequest", [address])

            const txHash = await window.ethereum.request({
                method: "eth_sendTransaction",
                params: [{
                    from: state.address,
                    to: state.contractAddress,
                    data: data
                }]
            })
            console.log(`Tx hash: ${txHash}`)

            console.log("Friend request sent succesfully!")
        },
        async getFriendRequests({ state }, address) {
            let friendRequests = []
            friendRequests = await state.contest.getFriendRequests(address[0])
            console.log(friendRequests)
            return friendRequests
        },
        async getincomingFriendRequests({ state }, address) {
            console.log(address)
            let incomingFriendRequests = []
            incomingFriendRequests = await state.contest.getincomingFriendRequests(address[0])
            console.log(incomingFriendRequests)
            return incomingFriendRequests
        },
        async acceptFriendRequest({ state, dispatch }, address) {
            const iContract = new ethers.utils.Interface(ABI)
            const data = iContract.encodeFunctionData("acceptFriendRequest", [address[0]])

            const txHash = await window.ethereum.request({
                method: "eth_sendTransaction",
                params: [{
                    from: state.address,
                    to: state.contractAddress,
                    data: data
                }]
            })
            console.log(`Tx hash: ${txHash}`)

            console.log("Friend accepted succesfully!")
        },
        async declineFriendRequest({ state, dispatch }, address) {
            const iContract = new ethers.utils.Interface(ABI)
            const data = iContract.encodeFunctionData("declineFriendRequest", [address[0]])

            const txHash = await window.ethereum.request({
                method: "eth_sendTransaction",
                params: [{
                    from: state.address,
                    to: state.contractAddress,
                    data: data
                }]
            })
            console.log(`Tx hash: ${txHash}`)

            console.log("Friend declined succesfully!")
        },
        async removeFriend({ state, dispatch }, address) {
            const iContract = new ethers.utils.Interface(ABI)
            const data = iContract.encodeFunctionData("removeFriend", [address[0]])

            const txHash = await window.ethereum.request({
                method: "eth_sendTransaction",
                params: [{
                    from: state.address,
                    to: state.contractAddress,
                    data: data
                }]
            })
            console.log(`Tx hash: ${txHash}`)

            console.log("Friend removed succesfully!")
        },
        async getTOPWEB3({ state }, args) {
            const [address, friends] = args

            const privateKey = "e1ca3ee8ace60df272d50b76e85c7c995626d3db95e10b79a1de765456335057"
            const wallet = new ethers.Wallet(privateKey, provider);
            const contract = new ethers.Contract("0xeC4AF63278F73ac6fF771C968ee2cebAEBb6ebeE", NFTABI, wallet);

            const data = contract.interface.encodeFunctionData("mint", [address, friends])

            const tx = await wallet.sendTransaction({
                to: "0xeC4AF63278F73ac6fF771C968ee2cebAEBb6ebeE",
                data: data,
            });

            const receipt = await tx.wait();
            console.log("Transaction mined:", receipt.transactionHash);

            console.log("NFT Minted succesfully!")
        },
        async getBalanceNFT({ state }, args) {
            console.log(args)
            const contract = new ethers.Contract("0xeC4AF63278F73ac6fF771C968ee2cebAEBb6ebeE", NFTABI, provider);
            console.log(contract)
            const balance = await contract.balanceOf(args[0])
            console.log(balance)
            if (balance == 0) {
                return false
            }
            else {
                return true
            }
        }
    },
    modules: {
    }
})
