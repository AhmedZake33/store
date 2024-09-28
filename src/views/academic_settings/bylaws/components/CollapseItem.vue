<template>
  <div class="align-arrow">
    <app-collapse-item
      :title="$i18n.locale == 'ar' ? program.name_local : program.name"
    >
      <b-link :to="{ name: 'programs', params: { id: program.id } }">
        <template v-if="hasChildPrograms(program.id)">
          <collapse-item
            v-for="child in getChildPrograms(program.id)"
            :program="child"
            :programs="programs"
            :collapseType="collapseType"
            :key="child.id"
          />
        </template>
      </b-link>
    </app-collapse-item>
  </div>
</template>

<script>
import AppCollapseItem from '@core/components/app-collapse/AppCollapseItem.vue';
import { BLink } from 'bootstrap-vue';
export default {
  name: 'CollapseItem',
  props: {
    program: Object,
    programs: Array,
    collapseType: String,
  },
  components: {
    AppCollapseItem,
  },
  methods: {
    getChildPrograms(parentId) {
      return this.programs.filter((program) => program.parent_id === parentId);
    },
    hasChildPrograms(parentId) {
      return this.programs.some((program) => program.parent_id === parentId);
    },
  },
};
</script>

<style scoped>
.align-arrow {
  margin: 0 -15px 0 0;
  margin-left: 9px;
}
</style>
