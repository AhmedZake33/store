<template>
  <app-collapse accordion :type="collapseType">
    <collapse-item
      v-for="rootProgram in rootPrograms"
      :key="rootProgram.id"
      :program="rootProgram"
      :programs="programs"
      :collapseType="collapseType"
    />
  </app-collapse>
</template>

<script>
import AppCollapse from '@core/components/app-collapse/AppCollapse.vue';
import CollapseItem from './CollapseItem.vue';
import { BCollapse, BButton, VBToggle, BCard } from 'bootstrap-vue';
import Ripple from 'vue-ripple-directive';
import { mapGetters } from 'vuex';

export default {
  components: {
    BButton,
    BCard,
    BCollapse,
    AppCollapse,
    CollapseItem,
  },
  directives: {
    'b-toggle': VBToggle,
    Ripple,
  },
  data() {
    return {
      programs: [],
      collapseType: 'default',
    };
  },
  mounted() {
    this.init();
  },
  computed: {
    ...mapGetters({
      items: 'programs/items',
    }),

    rootPrograms() {
      return this.programs.filter((program) => program.parent_id === null);
    },
  },

  methods: {
    init() {
      let bylaw_id = Number(this.$route.params.id);
      const query = {
        bylaw_id,
      };
      this.$store.dispatch('programs/programs', { query }).then((response) => {
        this.programs = this.items.filter((program) => program.removed === 0);
      });
    },
  },
};
</script>

<style scoped></style>
