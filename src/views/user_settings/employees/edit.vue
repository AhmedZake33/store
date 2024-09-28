<template>
    <Edit v-if="data" @refresh="refreshData" :type="2" @hideEdit="cancel()" :tabNumber="tabNumber" :userData="data"></Edit>
  </template>
  
  <script>
  import Edit from '@/views/user_settings/components/edit';
  import { BCard, BCardText, BCol, BRow, BTab } from 'bootstrap-vue';
  import { mapGetters } from 'vuex';
  
  export default {
    name: 'edit',
    components: { Edit, BTab, BCardText, BCard, BCol, BRow },
    props: {
      inline: { default: false, Type: Boolean },
      params: {},
      data: { default: {}, type: [Array, Object] },
      tabNumber: Number,
    },
    computed: {
      ...mapGetters({
        user: 'users/item',
        load: 'users/load',
      }),
      id() {
        return this.$route.params.id ? this.$route.params.id : null;
      },
      type() {
        if (this.user && this.user.type) {
          return this.user.type.type;
        }
        return null;
      },
    },
    mounted() {
      this.init();
    },
    methods: {
      cancel() {
        return this.$emit('hide');
      },
      refreshData(id) {
        return this.$emit('refresh', id);
      },
      init() {
        if (this.id) {
          this.$store.dispatch('users/get', this.id).then(_ => {
            this.user.type = this.user?.type.type;
          });
        }
      },
    },
  };
  </script>
  
  <style scoped></style>
  