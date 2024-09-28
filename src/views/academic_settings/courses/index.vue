<template>
    <Courses :fromCoursesPage="true"></Courses>
</template>

<script>
    import Courses from "@/views/academic_settings/courses/components/courses";
    export default {
        name: "index",
        components: {Courses}
    }
</script>

<style scoped>

</style>
