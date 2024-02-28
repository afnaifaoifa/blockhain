<template>
    <div class="forms-container">
        <div class="signin-signup">
            <form @submit.prevent="submitForm">
                <h2 class="title">Sign up</h2>
                <div class="input-field">
                    <i class="fas fa-user"></i>
                    <input v-model="name" type="text" placeholder="Name" name="first_name" required />
                </div>
                <!-- <div class="input-field">
                    <i class="fas fa-file"></i> 
                    <input type="file" @change="handleFileChange" accept=".jpg, .jpeg, .png" required />
                </div> -->
                <button @click="connectWallet" class="btn">Connect Metamask</button>
                <h3>Your address</h3>
                <p>{{ $store.state.address }}</p>
                <input type="submit" class="btn" value="Sign up" />
            </form>
        </div>
    </div>
</template>
	
<script>
import { mapActions } from 'vuex'
export default {
    name: 'RegFormView',
    data() {
        return {
            // selectedFile: null, 
            name : ""
        };
    },
    methods: {
        ...mapActions({
            connectWallet: "connectWallet",
            registerProfile: "registerProfile"
        }),
        async submitForm() {
            try {
                await this.registerProfile([this.name]);
                this.$router.push('/')
            } catch (error) {
                console.error('Error submitting form:', error);
            }
        },
    },
};
</script>
	
<style scoped>

</style>
	