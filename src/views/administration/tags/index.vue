<template>
    <Tags :user_id="this.authUser().id">
    </Tags>
</template>

<script>
    import Tags from "@/views/administration/tags/components/tags.vue";

    export default {
        name: "index",
        components: {Tags}
    }
</script>

<style scoped>

</style>
