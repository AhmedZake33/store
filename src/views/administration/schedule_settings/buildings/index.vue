<template>
    <Buildings :user_id="authUser().id">
    </Buildings>
</template>

<script>
    import Buildings from "@/views/administration/schedule_settings/buildings/components/buildings.vue";

    export default {
        name: "index",
        components: {Buildings}
    }
</script>

<style scoped>

</style>
