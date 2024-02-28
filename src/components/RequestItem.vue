<template>
    <div class="request-item-container">
        <div class="profile-picture">
            <img v-if="this.user.image" :src="this.user.image" alt="Pinata Image" />
            <div v-else>
                <p>No profile picture yet</p>
            </div>
        </div>
        <div class="user-details">
            <h1>Address: {{ this.userAddress }}</h1>
            <h1>Username: {{ this.user.name }}</h1>
            <div class="buttons-container">
                <button @click="accept" class="btn accept-btn">Accept Request</button>
                <button @click="decline" class="btn decline-btn">Decline Request</button>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
    name: 'request-item',
    data() {
        return {
            user: {}
        };
    },
    props: {
        userAddress: {
            type: String,
            required: true,
        },
    },
    methods: {
        ...mapActions({
            getUserProfile: "getUserProfile",
            acceptFriendRequest: "acceptFriendRequest",
            declineFriendRequest: "declineFriendRequest"
        }),
        async getUser() {
            console.log(this.userAddress)
            this.user = await this.getUserProfile([this.userAddress])
            console.log(this.user)
        },
        async accept(){
            await this.acceptFriendRequest([this.userAddress])
        },
        async decline(){
            await this.declineFriendRequest([this.userAddress])
        }
    },
    async mounted() {
        this.getUser()
    },
    watch: {
        'this.userAddress': 'getUser'
    }
}
</script>

<style>
.request-item-container {
    display: flex;
    align-items: center;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    margin: 10px;
    background-color: #fff;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.profile-picture {
    margin-right: 20px;
}

.profile-picture img {
    max-width: 100px;
    border-radius: 50%;
}

.user-details h1 {
    margin: 10px 0;
}

.buttons-container {
    display: flex;
    gap: 10px;
}

.accept-btn {
    background-color: #4CAF50;
}

.decline-btn {
    background-color: #F44336;
}

.btn {
    color: #fff;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
    border-radius: 5px;
}
</style>