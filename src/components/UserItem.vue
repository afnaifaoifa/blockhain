<template>
    <div class="user-container">
        <div class="user-details">
            <h1>User Address: {{ this.user.address }}</h1>
            <h1>Username: {{ this.user.name }}</h1>
            <h1>User BIO: {{ this.user.bio || 'No BIO yet' }}</h1>
        </div>
        <div class="user-image">
            <img :src="this.user.image" alt="Pinata Image" />
        </div>
        <div class="user-actions">
            <button @click="getUser" class="btn">Refresh</button>
            <div v-if="isFriend">
                <button @click="sendRequest" :disabled="buttonDisabled" class="btn">{{ buttonText }}</button>
            </div>
            <div v-else>
                <h1>Already friends</h1>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
    name: "user-item",
    data() {
        return {
            user: {},
            hasWatched: false,
            buttonText: "Send Friend Request",
            isFriend: false,
            buttonDisabled: false
        }
    },
    props: {
        userAddress: {
            type: String,
            require: true
        }
    },
    methods: {
        ...mapActions({
            getUserProfile: 'getUserProfile',
            connectWallet: "connectWallet",
            sendFriendRequest: "sendFriendRequest"
        }),
        async getUser() {
            console.log(this.userAddress)
            this.user = await this.getUserProfile([this.userAddress])
            console.log(this.user.friends.includes(this.$store.state.address))
            if(!this.user.friends.includes(this.$store.state.address)){
                this.isFriend = true
            }
            else{
                this.isFriend = false
            }
            console.log(this.user)
        },
        async sendRequest(){
            await this.sendFriendRequest(this.userAddress)
            this.buttonText = "Sent request"
            this.buttonDisabled = true
        }
    },
    watch: {
        '$route.params.searchAddress': 'getUser'
    },
    async mounted() {
        this.getUser()
    }
}
</script>

<style>
.user-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.user-details {
    text-align: center;
    margin-bottom: 20px;
}

.user-details h1 {
    margin: 10px 0;
}

.user-image img {
    max-width: 150px;
    border-radius: 5px;
    margin-top: 10px;
    display: block;
    margin-left: auto;
    margin-right: auto;
}

.user-actions {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.user-actions h1 {
    margin-top: 10px;
}
/* Add some basic styling to the page */
body {
    font-family: 'Arial', sans-serif;
    background-color: #f4f4f4;
    color: #333;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
}

/* Style for buttons */
.btn {
    background-color: #3498db;
    color: #fff;
    border: none;
    padding: 10px 20px;
    margin: 5px;
    cursor: pointer;
    border-radius: 5px;
}

/* Style for input fields */
input,
textarea {
    width: 100%;
    padding: 10px;
    margin: 5px 0;
    box-sizing: border-box;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
}

/* Style for the image */
img {
    max-width: 150px;
    /* Set your desired maximum width */
    height: auto;
    border-radius: 5px;
    margin-top: 10px;
    display: block;
    margin-left: auto;
    margin-right: auto;
}

/* Style for the input field with the file icon */
.input-field {
    position: relative;
    margin: 10px 0;
}

.input-field i {
    position: absolute;
    top: 50%;
    left: 10px;
    transform: translateY(-50%);
    color: #3498db;
}

/* Style for the file input */
.input-field input[type="file"] {
    padding-left: 30px;
}

/* Style for the container of the search input and button */
.search-container {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    /* Optional: Add margin for separation from other elements */
}

/* Adjust the styles for the address input to fit in the same line */
.address-input {
    flex: 1;
    /* Allow the input to take up available space */
    margin-right: 10px;
    /* Optional: Add margin between input and button */
}
</style>
