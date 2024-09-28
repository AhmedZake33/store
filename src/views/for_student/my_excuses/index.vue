<template>
    <Excuses :user_id="this.authUser().id">
    </Excuses>
</template>

<script>
    import Excuses from "@/views/study/excuses/components/excuses.vue";

    export default {
        name: "index",
        components: {Excuses},
    }
</script>

<style scoped>

</style>