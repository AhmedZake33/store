<template>
    <Certificates :user_id="this.authUser().id">
    </Certificates>
</template>

<script>
    import Certificates from "@/views/students/certificates/components/certificate";

    export default {
        name: "index",
        components: {Certificates}
    }
</script>

<style scoped>

</style>
