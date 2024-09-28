<template>
  <Edit @refresh="refreshData" @hideEdit="cancel()" :publicationData="data" :languages="languages" :types="types" :tabIndex="tabIndex"></Edit>
</template>

<script>
import Edit from '@/views/research/publications/components/edit';
import { BCard, BCardText, BCol, BRow, BTab } from 'bootstrap-vue';
import { mapGetters } from 'vuex';

export default {
  name: 'edit',
  components: { Edit, BTab, BCardText, BCard, BCol, BRow },
  props: {
    inline: { default: false, Type: Boolean },
    params: {},
    tabIndex: { default: 0, type: Number },
    data: { default: {}, type: [Array, Object] },
    languages: {default: {}, type: [Array, Object]},
    types: {default: {}, type: [Array, Object]},
  },
  computed: {
    ...mapGetters({
      publication: 'publications/item',
      load: 'publications/load',
    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : null;
    },
  },
  methods: {
    cancel() {
      return this.$emit('hide');
    },
    refreshData(id) {
      return this.$emit('refresh', id);
    },
  },
};
</script>

<style scoped></style>
