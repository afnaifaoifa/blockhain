<template>
    <div class="container">
        <nav class="navbar">
            <div class="nav-buttons">
                <input v-model="searchAddress" type="text" placeholder="Search Address" name="searchAddress"
                    class="address-input" />
                <button @click="searchUser" class="btn">Search</button>
                <button @click="connectWallet" class="btn">Connect wallet</button>
                <!-- <button @click="change" class="btn">Change chain to mainnet</button> -->
                <button @click="$router.push('/')" class="btn">My Profile</button>
                <button @click="$router.push('/requests')" class="btn">Pending Request</button>
            </div>
        </nav>
        <!-- Rest of your content here -->
    </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
    name: 'navbar',
    data() {
        return {
            name: "",
            bio: "",
            selectedFile: null,
            searchAddress: "",
            user: {}
        };
    },
    methods: {
        ...mapActions({
            connectWallet: "connectWallet",
            getUserProfile: "getUserProfile",
            // changeNetwork : "changeNetwork"
        }),
        handleFileChange(event) {
            this.selectedFile = event.target.files[0];
        },
        async getUser() {
            console.log(this.$store.state.address)
            this.user = await this.getUserProfile([this.$store.state.address])
        },
        async searchUser() {
            this.$router.push(`/user/${this.searchAddress}`)
            this.searchAddress = ""
        },
        // async change(){
        //     await this.changeNetwork([1])
        // }
    },
};
</script>

<style scoped>
/* Add some basic styling to the page */
/* Style for buttons */
.container {
    flex: 1;
    width: 100%;
}

.btn {
    color: #fff;
    border: 2px solid #fff;
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

/* Style for the navbar */
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background-color: #ff5555;
    /* Reddish color */
}

/* Style for the address input in the navbar */
.address-input {
    flex: 1;
    margin-right: 10px;
}

/* Style for the navigation buttons in the navbar */
.nav-buttons {
    display: flex;
    gap: 10px;
}
</style>