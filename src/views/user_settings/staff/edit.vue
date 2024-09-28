<template>
  <Edit v-if="data" @refresh="refreshData" :type="1" @hideEdit="cancel()" :tabNumber="tabNumber" :userData="data"></Edit>
</template>

<script>
import Edit from '@/views/user_settings/components/edit';
import { BCard, BCardText, BCol, BRow, BTab } from 'bootstrap-vue';

export default {
  name: 'edit',
  components: { Edit, BTab, BCardText, BCard, BCol, BRow },
  props: {
    inline: { default: false, Type: Boolean },
    params: {},
    data: { default: {}, type: [Array, Object] },
    tabNumber: Number,
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
