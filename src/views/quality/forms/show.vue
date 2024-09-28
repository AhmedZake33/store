<template>
  <b-row>
    <b-col cols="12" class="mt-3">
      <Questions noStatus title="Questions" :type_id="id"></Questions>
    </b-col>
  </b-row>
</template>

<script>
import { mapGetters } from 'vuex';
import List from '@/views/components/info/list';
import { BTab, BTabs, BCard, BCol, BRow } from 'bootstrap-vue';
import Questions from "@/views/quality/questions/components/questions";


export default {
  name: 'show',
  components: {Questions, List, BTabs, BTab, BCard, BCol, BRow },
  computed: {
    ...mapGetters({
      form: 'forms/item',
      load: 'forms/load',
    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : null;
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.$store.dispatch('forms/get', this.id);
    },
  },
};
</script>

<style scoped></style>
