<template>
    <!-- <staff v-if="user && user.type && user.type.type == 1" :user_id="user.id"></staff>
    <employee v-else-if="user &&  user.type && user.type.type == 2" :user_id="user.id"></employee>
    <user v-else :user_id="user.id"></user> -->
    <div></div>
</template>

<script>
    import {mapGetters} from "vuex";
    import staff from "@/views/user_settings/staff/show";
    import user from "@/views/user_settings/users/show";
    import employee from "@/views/user_settings/employees/show";
    import {BTab, BCardText, BCard, BCol, BRow} from 'bootstrap-vue'
    import List from "@/views/components/info/list";

    export default {
        name: "user",
        components: {staff, user, employee, BTab, BCardText, BCard, BCol, BRow, List},
        computed: {
            ...mapGetters({
                user: 'users/item',
                load: 'users/load',
            }),
            id() {
                return this.$route.params.id ? this.$route.params.id : null;
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.$store.dispatch('users/get', 'profile').then(_=>{
                    if(this.user.type.type == 1){
                        this.$router.push({name: 'staff-show', params: {id: this.user.id} })
                    }else if(this.user.type.type == 2){
                        this.$router.push({name: 'employee-show', params: {id: this.user.id} })
                    }else{
                        this.$router.push({name: 'user-show', params: {id: this.user.id} })
                    }
                });
            }
        }
    }
</script>

<style scoped>

</style>
