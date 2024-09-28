<template>
    <b-row class="d-flex justify-content-center">
        <b-col col="12" md="8">
            <b-card>
                <b-row class="d-flex">
                    <b-col col="12" md="8">
                        <div class="landing-window mb-4">
                            <div class="landing-main">
                                <div class="_1N3oL">
                                    <div class="_2WuPw">
                                        <h2 class="mb-2 mt-3"> To use OctopiApp on your phone: </h2>
                                        <ol class="_2A31C" style="line-height: 4">
                                            <li class="QtrYx">Open OctopiApp on your phone</li>
                                            <li class="QtrYx">Point your phone to this screen to capture the code</li>
                                        </ol>
                                    </div>
                                </div>
                                <!-- <h4 class="ml-2 mb-2 d-flex">You can download the Octopi mobile app from</h4> -->
                                <h2 class="mb-2 mt-3">You can download the Octopi mobile app from: </h2>
                                <div class="ml-2 d-flex">
                                    <a href="#" target="_blank" class="d-block">
                                        <img
                                            src="./google_play.png"
                                            style="
                                            width: 220px;
                                            display: block;
                                            "
                                        />
                                    </a>    
                                    <a href="#" target="_blank">
                                        <img
                                            src="./app_store.png"
                                            style="
                                            width: 220px;
                                            display: block;
                                            "
                                        />
                                    </a> 
                                </div>
                            </div>
                        </div>
                    </b-col>
                    <b-col  col="12" md="4" class="mt-3">
                        <img v-if="authUser()" :src="authUser().qr_code">
                    </b-col>
                </b-row>
            </b-card>
        </b-col>
    </b-row>
</template>

<script>
    import {BCard, BCol, BRow} from "bootstrap-vue";

    export default {
        name: "QRcode",
        components: {
            BCard,
            BCol,
            BRow,
        }
    }
</script>

<style scoped>

</style>