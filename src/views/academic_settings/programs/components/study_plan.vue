<template>
  <div class="col-12">
    <b-overlay :show="loading">
      <b-card
        class="ml-1 mr-1"
      >
        <h3>{{$t('Study Plan')}}</h3>
        <div v-for="(semester, i) in item.courses" :key="i">
          <b-table
            outlined
            :empty-text="$t('Global.empty_text')"
            show-empty
            :items="semester"
            :fields="fields"
            striped
            responsive="sm"
        >
          <template #thead-top="">
            <b-tr>
              <b-th variant="primary" class="text-center" colspan="10"> {{ $t('Global.term') }} ({{ i }}) </b-th>
            </b-tr>
          </template>
          <template #cell(name)="data">
            <div v-if="data.item.id">
              <b-link v-if="$i18n.locale == 'en'" :to="{ name: 'course', params: { id: data.item.id } }" class="font-weight-bold">
                {{ data.item ? (data.item.name ? data.item.name : data.item.name_local) : '_' }}
              </b-link>
              <b-link dir="rtl" v-if="$i18n.locale == 'ar'" :to="{ name: 'course', params: { id: data.item.id } }">
                {{ data.item ? (data.item.name_local ? data.item.name_local : data.item.name) : '_' }}
              </b-link>
            </div>
            <div v-else>
              <b-link v-if="$i18n.locale == 'en'" class="font-weight-bold">
                {{ data.item ? (data.item.name ? data.item.name : data.item.name_local) : '_' }}
              </b-link>
              <b-link dir="rtl" v-if="$i18n.locale == 'ar'">
                {{ data.item ? (data.item.name_local ? data.item.name_local : data.item.name) : '_' }}
              </b-link>
            </div>
          </template>
          <template #cell(pre_requisites)="data">
                  <div v-for="(item, i) in data.item.pre_requisites" :key="i">
                    {{ item }}
                    <!-- <strong class="text-danger" v-if="i < data.item.pre_requisites.length-1">,</strong> -->
                  </div>
            </template>
          <!-- <template #cell(pre_requisites)="data">
            <div v-for="(item, i) in data.item.pre_requisites" :key="i">
              {{ item }}
            </div>
          </template> -->
          <!-- <template #cell(grade_gpa)="data">
            <b-badge variant="success" v-if="data.item.grade_gpa > 0 || data.item.grade_letter == 'P'">
              {{$t('Pass')}}
            </b-badge>
            <b-badge variant="danger" v-else-if="failedGrades.includes(data.item.grade_letter)">
              {{$t('Fail')}}
            </b-badge>
            <b-badge variant="primary" v-else>
              {{$t('Fresh')}}
            </b-badge>
          </template> -->
        </b-table>
        </div>
      </b-card>
    </b-overlay>
  </div>
</template>

<script>
import {
  BLink,
  BOverlay,
  BTable,
  VBModal,
  BCard,
  BTh,
  BTr,
  BTd,
  BBadge
} from "bootstrap-vue";
import { mapGetters, mapActions } from "vuex";
import vSelect from "vue-select";
import Ripple from "vue-ripple-directive";
import DataTable from "@/views/components/table/DataTable";

export default {
  name: 'StudyPlan',
  components: {
    BOverlay,
    BTable,
    BLink,
    BCard,
    BTh,
    BTr,
    BTd,
    BBadge,
  },
  directives: {
    Ripple,
    'b-modal': VBModal,
  },
  props: {
    studentId: {
      type: Number,
      default: null,
    },
  },
  data() {
    return {
      item: {},
      loading: true,
      failedGrades: [
        'F', 'FA', 'FB', 'FF', 'FP'
      ]
    }
  },
  computed: {
    id() {
      return this.$route.params.id ? this.$route.params.id : null
    },
    ...mapGetters({
    }),
    fields() {
      return [
        {
          key: 'code',
          label: this.$t('Global.code'),
        },
        {
          key: 'name',
          label: this.$t('Global.name'),
          thStyle: { width: '30%' },
        },
        {
          key: 'credit_hours',
          label: 'CH',
        },
        {
          key: 'equivalent_ects',
          label: 'ECTS',
        },
        {
          key: 'required_swl',
          label: 'SWL',
        },
        {
          key: 'lecture_hours',
          label: 'lec',
        },
        {
          key: 'tutorial_hours',
          label: 'tut',
        },
        {
          key: 'laboratory_hours',
          label: 'lab',
        },
        {
          key: 'clinical_hours',
          label: 'cli',
        },
        {
          key: 'pre_requisites',
          label: this.$t('Global.pre_requisites'),
        },
      ];
    },
  },
  mounted() {
    this.program_id = this.program_id ? this.program_id : this.id
    this.init()
  },
  methods: {
    ...mapActions({
      getStudyPlan: 'programs/getStudyPlan',
    }),
    init() {
      this.loading = true
      this.getStudyPlan({ id: this.program_id }).then(data => {
        this.item = data
      }).catch( error => {
        this.errorToast(error.title);
      }).finally(() => {
        this.loading = false;
      });
    },
  },
}
</script>

<style>
</style>
