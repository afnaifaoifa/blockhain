<template>
    <div class="container">
        <div class="main-body">
            <div class="card">
                <div class="card-body">
                    <div class="d-flex flex-column align-items-center text-center">
                        <img :src="userImageSrc" alt="Pinata Image" class="rounded-circle" width="150" />
                        <div class="mt-3">
                            <h4>Address: {{ $store.state.address }}</h4>
                            <h4>Username: {{ this.user.name }}</h4>

                            <div v-if="hasNFT">
                                <a href="https://sepolia.etherscan.io/address/0xec4af63278f73ac6ff771c968ee2cebaebb6ebee">
                                    <img class="rounded-circle" src="../image/nft.jpg" alt="">
                                </a>
                                <p>TOPWEB3 NFT</p>
                            </div>
                            <div v-else>
                                <div v-if="friends.length >= 5">
                                    <button @click="getNFT" class="btn">Get NFT</button>
                                </div>
                            </div>
                            <button @click="refresh" class="btn">Refresh</button>

                        </div>
                        <div class="mt-3">
                            <h4>User BIO: {{ this.user.bio || 'No BIO yet' }}</h4>

                        </div>

                        <div class="mt-3">
                            <button @click="toggleNameForm" class="btn">Change Name</button>

                            <div v-if="showNameForm" class="form-container">
                                <input v-model="name" type="text" placeholder="Name" name="first_name" required />
                                <button @click="updateName" class="btn">Update Name</button>
                            </div>
                            <button @click="toggleBioForm" class="btn">Change Bio</button>
                            <button @click="toggleImageForm" class="btn">Change Image</button>

                            <div v-if="showBioForm" class="form-container">
                                <textarea v-model="bio" placeholder="Bio" name="bio" rows="4"></textarea>
                                <button @click="updateBio" class="btn">Update BIO</button>
                            </div>

                            <div v-if="showImageForm" class="form-container">
                                <div class="input-field">
                                    <i class="fas fa-file"></i>
                                    <input type="file" @change="handleFileChange" accept=".jpg, .jpeg, .png" required />
                                </div>
                                <button @click="updatePicture" class="btn">Add Picture</button>
                            </div>
                        </div>

                        <div class="mt-3">
                            <h1>Friends</h1>
                            <div v-for="address in friends" :key="address">
                                <friend-item :userAddress="address" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
    name: 'MainView',
    data() {
        return {
            name: "",
            bio: "",
            selectedFile: null,
            user: {},
            friends: [],
            showNameForm: false,
            showBioForm: false,
            showImageForm: false,
            hasNFT: false
        };
    },
    computed: {
        userImageSrc() {
            return this.user.image ? this.user.image : 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png';
        },
    },
    methods: {
        ...mapActions({
            connectWallet: "connectWallet",
            getUserProfile: "getUserProfile",
            updateProfileName: "updateProfileName",
            updateProfileBio: "updateProfileBio",
            updateProfilePicture: "updateProfilePicture",
            uploadFileToPinata: "uploadFileToPinata",
            getImageFromPinata: "getImageFromPinata",
            getTOPWEB3: "getTOPWEB3",
            getBalanceNFT: "getBalanceNFT"
        }),
        handleFileChange(event) {
            this.selectedFile = event.target.files[0];
        },
        async updateName() {
            await this.updateProfileName([this.name])
        },
        async updateBio() {
            await this.updateProfileBio([this.bio])
        },
        async updatePicture() {
            console.log(this.selectedFile)
            const ipfsHash = await this.uploadFileToPinata([this.selectedFile])
            await this.updateProfilePicture([ipfsHash])
        },
        async getUser() {
            console.log(this.$store.state.address)
            this.user = await this.getUserProfile([this.$store.state.address])
            this.friends = this.user.friends
            console.log(this.friends)
        },
        toggleNameForm() {
            this.showNameForm = !this.showNameForm;
        },
        toggleBioForm() {
            this.showBioForm = !this.showBioForm;
        },
        toggleImageForm() {
            this.showImageForm = !this.showImageForm;
        },
        async getNFT() {
            await this.getTOPWEB3([this.$store.state.address, this.friends.length])
            this.hasNFT = true
        },
        async getBalance() {
            this.hasNFT = await this.getBalanceNFT([this.$store.state.address])
            console.log(this.hasNFT)
        },
        async refresh() {
            await this.getBalance()
            await this.getUser()
        }
    },
    // async mounted() {
    //     this.getBalance()
    // },
    // watch: {
    //     'this.hasNFT': 'getBalance'
    // }
};
//алия лучшая 
</script>
<style scoped>
body {
    font-family: 'Arial', sans-serif;
    background-color: #4caf50;
    /* Green color */
    color: #fff;
    /* White text color for better contrast */
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.main-body {
    padding: 15px;
}

.card {
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .1), 0 1px 2px 0 rgba(0, 0, 0, .06);
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 0;
    word-wrap: break-word;
    background-color: #fff;
    background-clip: border-box;
    border: 0 solid rgba(0, 0, 0, .125);
    border-radius: .25rem;
}

.card-body {
    flex: 1 1 auto;
    min-height: 1px;
    padding: 1rem;
}

.gutters-sm {
    margin-right: -8px;
    margin-left: -8px;
}

.gutters-sm>.col,
.gutters-sm>[class*="col-"] {
    padding-right: 8px;
    padding-left: 8px;
}

.mb-3,
.my-3 {
    margin-bottom: 1rem !important;
}

.bg-gray-300 {
    background-color: #e2e8f0;
}

.h-100 {
    height: 100% !important;
}

.shadow-none {
    box-shadow: none !important;
}

/* Add some basic styling to the page */
.container {
    font-family: 'Arial', sans-serif;
    background-color: #f4f4f4;
    color: #333;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    width: 100%;
}

/* Style for buttons */
.btn {
    background-color: #ff5555;
    /* Reddish color */
    color: #fff;
    border: none;
    padding: 15px 30px;
    /* Larger padding */
    margin: 10px;
    /* Larger margin */
    cursor: pointer;
    border-radius: 8px;
    /* Rounded corners */
}

/* Style for input fields */
input,
textarea {
    width: 100%;
    padding: 15px;
    /* Larger padding */
    margin: 10px 0;
    /* Larger margin */
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 8px;
    /* Rounded corners */
    font-size: 18px;
    /* Larger font size */
}

/* Style for the image */
img {
    max-width: 150px;
    height: auto;
    border-radius: 8px;
    /* Rounded corners */
    margin-top: 15px;
    /* Larger margin */
    display: block;
    margin-left: auto;
    margin-right: auto;
}

/* Style for the input field with the file icon */
.input-field {
    position: relative;
    margin: 15px 0;
    /* Larger margin */
}

.input-field i {
    position: absolute;
    top: 50%;
    left: 15px;
    /* Larger left position */
    transform: translateY(-50%);
    color: #ff5555;
    /* Reddish color */
}

/* Style for the file input */
.input-field input[type="file"] {
    padding-left: 45px;
    /* Larger padding */
}

/* Style for the container of the search input and button */
.search-container {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    /* Larger margin */
}

/* Adjust the styles for the address input to fit in the same line */
.address-input {
    flex: 1;
    margin-right: 15px;
    /* Larger margin */
}
</style>