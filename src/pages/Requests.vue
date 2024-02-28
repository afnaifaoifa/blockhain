<template>
    <div>
        <h2>Pending Friend Requests</h2>
        <button @click="getRequests" class="btn">Refresh</button>
        <div v-for="address in requests" :key="address">
            <request-item :userAddress="address"/>
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
            requests: []
        };
    },
    methods: {
        ...mapActions({
            getincomingFriendRequests: "getincomingFriendRequests"
        }),
        async getRequests(){
            console.log(this.$store.state.address)
            this.requests = await this.getincomingFriendRequests([this.$store.state.address])
            console.log(this.requests)
        }
    },
    async mounted() {
        this.getRequests()
    },
    watch: {
        'this.requests': 'getRequests'
    }
};
//алия лучшая
</script>

<style>
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