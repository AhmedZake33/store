<template>
    <Equivalent :type="type"></Equivalent>
</template>

<script>
    import Equivalent from "@/views/admission/reports/equivalent/components/equivalent.vue";

    export default {
        name: "index",
        components: {Equivalent},
        computed:{
            type() {
                return this.$route.name == 'equivalent-report' ? 1 : 0;
            },
        }
    }
</script>

<style scoped>

</style>