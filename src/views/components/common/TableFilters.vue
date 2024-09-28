<template>
  <b-row class="w-100 p-1" v-if="lookups[apiLink]">
    <!--faculty-->
    <b-col v-if="showFaculty" cols="6" md="4">
      <v-select :filter="fuseSearch" v-model="filter.faculty_id" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" :options="lookups[apiLink] && lookups[apiLink].faculties" label="name" class="w-100 mb-1" :reduce="val => val.id" :placeholder="$t('Global.faculty')">
        <template slot="selected-option" slot-scope="option">
          <span v-if="$i18n.locale == 'ar'">
            {{ option.name_local || option.name }}
          </span>
          <span v-else>
            {{ option.name || option.name_local }}
          </span>
        </template>
        <template v-slot:option="option">
          {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
        </template>
        <template #no-options>
          {{ $t('noMatching') }}
        </template>
      </v-select>
    </b-col>
    <!--bylaws-->
    <b-col v-if="showBylaw" cols="6" md="4">
      <v-select
        :filter="fuseSearch"
        v-model="filter.bylaw_id"
        :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
        :options="lookups.bylaws.length ? lookups.bylaws : options.bylaws"
        :disabled="!faculty_id && !filter.faculty_id && dependFields"
        label="name"
        class="w-100 mb-1"
        :reduce="val => val.id"
        :placeholder="$t('Global.bylaw')"
      >
        <template slot="selected-option" slot-scope="option">
          <span v-if="$i18n.locale == 'ar'">
            {{ option.name_local || option.name }}
          </span>
          <span v-else>
            {{ option.name || option.name_local }}
          </span>
        </template>
        <template v-slot:option="option">
          {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
        </template>
        <template #no-options>
          {{ $t('noMatching') }}
        </template>
      </v-select>
    </b-col>
    <!--programs-->
    <b-col v-if="showProgram" cols="6" md="4">
      <v-select :filter="fuseSearch" v-model="filter.program_id" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" :options="lookups.programs" :disabled="!filter.bylaw_id && dependFields" label="name" class="w-100" :reduce="val => val.id" :placeholder="$t('Global.program')">
        <template slot="selected-option" slot-scope="option">
          <span v-if="$i18n.locale == 'ar'">
            {{ option.name_local || option.name }}
          </span>
          <span v-else>
            {{ option.name || option.name_local }}
          </span>
        </template>
        <template v-slot:option="option">
          {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
        </template>
        <template #no-options>
          {{ $t('noMatching') }}
        </template>
      </v-select>
    </b-col>
    <!-- {{options.faculty_departments}} -->
    <!--departments-->
    <b-col v-if="showDepartment" cols="6" md="4">
      <v-select :filter="fuseSearch" v-model="filter.department_id" :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" :options="options ? options.faculty_departments : []" label="name" class="w-100" :reduce="val => val.id" :placeholder="$t('Global.department')">
        <template slot="selected-option" slot-scope="option">
          <span v-if="$i18n.locale == 'ar'">
            {{ option.name_local || option.name }}
          </span>
          <span v-else>
            {{ option.name || option.name_local }}
          </span>
        </template>
        <template v-slot:option="option">
          {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
        </template>
        <template #no-options>
          {{ $t('noMatching') }}
        </template>
      </v-select>
    </b-col>
    <!--advanced Filters-->
    <slot name="advancedFilters"></slot>
  </b-row>
</template>

<script>
import { BRow, BCol } from 'bootstrap-vue';
import vSelect from 'vue-select';
import { mapGetters, mapActions } from 'vuex';
export default {
  name: 'TableFilters',
  components: {
    vSelect,
    BCol,
    BRow,
  },
  props: {
    filter: { type: Object, default: { bylaw_id: null, program_id: null, department_id: null } },
    lookups: null,
    faculty_id: null,
    faculty_dep_id: Number,
    showFaculty: true,
    showBylaw: true,
    showProgram: true,
    faculty_id_course: Number,
    showDepartment: false,
    apiLink:String,
    dependFields: true,
  },
  computed: {
    ...mapGetters({
      options: 'students/lookups',
      lookups: 'app/stateLookup',
    }),
  },
  methods: {
    ...mapActions({
      lookupsApi: 'students/lookup',
    }),
  },
  mounted() {
    let lookupQuery = {};
    if (this.faculty_id_course) {
      lookupQuery = { levels: true, bylaw_stages: true, bylaws: true, programs: true, faculty_id: this.faculty_id_course, faculty_departments: true };
    } else {
      lookupQuery = { levels: true, bylaw_stages: true, bylaws: true, programs: true, faculty_id: this.faculty_dep_id, faculty_departments: true };
    }
    this.lookupsApi(lookupQuery);
  },
  watch: {
    'filter.faculty_id'(val, old) {
      if (old) {
        this.filter.department_id = null;
      }
      this.filter.bylaw_id = null;
      let lookupQuery = {};
      if (this.faculty_id_course) {
        lookupQuery = { levels: true, bylaw_stages: true, bylaws: true, faculty_id: this.faculty_id_course, programs: true, faculty_id: val, faculty_departments: true };
      } else {
        lookupQuery = { levels: true, bylaw_stages: true, bylaws: true, faculty_id: this.faculty_dep_id, programs: true, faculty_id: val, faculty_departments: true };
      }
      this.lookupsApi(lookupQuery);
    },
    'filter.bylaw_id'() {
      this.filter.program_id = null;
    },
  },
};
</script>

<style scoped></style>
