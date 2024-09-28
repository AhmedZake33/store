<template>
  <b-row>
    <b-col cols="12">
      <b-card class="mb-0">
        <b-tabs lazy vertical nav-wrapper-class="nav-hidden" align="left">
          <b-tab>
            <template #title>
              <feather-icon icon="UserIcon" />
              <span>{{ $t('Global.personal_info') }}</span>
            </template>
            <list v-if="student.student" :customShow="['gender']" :expectKey="['type']" :data="student.student" :loading="load" :only="['birth_date', 'email', 'gender', 'mobile', 'national_id', 'personal_email', 'type']"></list>
            <list :data="student" :loading="load" :only="['birth_country', 'user', 'term', 'program', 'level', 'last_grade_term', 'transferred_from', 'transferred_from_local', 'notes', 'applicant']"></list>
          </b-tab>
          <b-tab>
            <template #title>
              <feather-icon icon="UsersIcon" />
              <span>{{ $t('Global.parent_info') }}</span>
            </template>
            <list :data="student" :loading="load" :only="['parent_name', 'parent_phone', 'parent_email', 'parent_relation', 'parent_national_id']"></list>
          </b-tab>

          <b-tab>
            <template #title>
              <feather-icon icon="GitPullRequestIcon" />
              <span>{{ $t('Global.nationality') }}</span>
            </template>
            <list v-if="student.student && student.student.nationality" :data="student.student.nationality" :loading="load" :only="['nationality', 'nationality_local']"></list>
          </b-tab>
          <b-tab>
            <template #title>
              <feather-icon icon="MapPinIcon" />
              <span>{{ $t('Global.address') }}</span>
            </template>
            <list :data="student" :loading="load" :only="['military_no', 'military_order', 'military_info']"></list>
          </b-tab>
          <b-tab v-if="student && student.student && student.student.gender == 1">
            <template #title>
              <feather-icon icon="FrownIcon" />
              <span>{{ $t('Global.military_info') }}</span>
            </template>
            <list :data="student" :loading="load" :only="['military_no', 'military_order', 'military_info']"></list>
          </b-tab>

          <b-tab>
            <template #title>
              <feather-icon icon="BookOpenIcon" />
              <span>{{ $t('Global.pre_study_info') }}</span>
            </template>
            <list :data="student" :loading="load" :only="['prestudy_type', 'prestudy_name', 'prestudy_marks', 'prestudy_max_marks', 'prestudy_info']"></list>
          </b-tab>
          <b-tab>
            <template #title>
              <feather-icon icon="BookOpenIcon" />
              <span>{{ $t('Global.previous_university_info') }}</span>
            </template>
            <list :data="student" :loading="load" :only="['prestudy_type', 'prestudy_name', 'prestudy_marks', 'prestudy_max_marks', 'prestudy_info']"></list>
          </b-tab>
          <b-tab>
            <template #title>
              <feather-icon icon="BookIcon" />
              <span>{{ $t('Global.registered_courses') }}</span>
            </template>
            <list :data="student" :loading="load" :only="['prestudy_type', 'prestudy_name', 'prestudy_marks', 'prestudy_max_marks', 'prestudy_info']"></list>
          </b-tab>
          <b-tab>
            <template #title>
              <feather-icon icon="TrendingUpIcon" />
              <span>{{ $t('Global.passed_terms') }}</span>
            </template>
            <TabTable :loading="load" :type="student.terms_grades ? null : 'terms_grades'" title="passed_terms" v-if="student" :items="student.terms_grades" :fields="['start_date', 'grade_term', 'total', 'credit_hours']" :inner="['code', 'course', 'term', 'total', 'credit_hours', 'grade_type']" />
          </b-tab>
          <b-tab>
            <template #title>
              <feather-icon icon="TrendingUpIcon" />
              <span>{{ $t('Global.grades_years') }}</span>
            </template>
            <TabTable
              :type="student.programs_levels_grades ? null : 'programs_levels_grades'"
              title="Grades Years"
              v-if="student"
              :items="student.programs_levels_grades"
              :fields="['grade_term', 'year']"
              :inner="['code', 'course', 'term', 'total', 'max_total', 'credit_hours', 'status', 'grade_type']"
            ></TabTable>
          </b-tab>
          <b-tab>
            <template #title>
              <feather-icon icon="CalendarIcon" />
              <span>{{ $t('Global.study_schedule') }}</span>
            </template>
            <list :data="student" :loading="load" :only="['prestudy_type', 'prestudy_name', 'prestudy_marks', 'prestudy_max_marks', 'prestudy_info']"></list>
          </b-tab>
          <b-tab>
            <template #title>
              <feather-icon icon="CalendarIcon" />
              <span>{{ $t('Global.exam_schedule') }}</span>
            </template>
            <list :data="student" :loading="load" :only="['prestudy_type', 'prestudy_name', 'prestudy_marks', 'prestudy_max_marks', 'prestudy_info']"></list>
          </b-tab>
          <b-tab>
            <template #title>
              <feather-icon icon="DollarSignIcon" />
              <span>{{ $t('Global.financial') }}</span>
            </template>
            <Payments title="Payments" noStatus :user_id="id"></Payments>
            <Credits title="Credits" no-status :user_id="id"></Credits>
          </b-tab>
          <b-tab>
            <template #title>
              <feather-icon icon="Link2Icon" />
              <span>{{ $t('Global.documents') }}</span>
            </template>
            <Archive :list="true"></Archive>
          </b-tab>
          <b-tab>
            <template #title>
              <feather-icon icon="AwardIcon" />
              <span>{{ $t('Global.certificates') }}</span>
            </template>
            <list :data="student" :loading="load" :only="['prestudy_type', 'prestudy_name', 'prestudy_marks', 'prestudy_max_marks', 'prestudy_info']"></list>
          </b-tab>
          <b-tab>
            <template #title>
              <feather-icon icon="Minimize2Icon" />
              <span>{{ $t('Global.complains_requests') }}</span>
            </template>
            <list :data="student" :loading="load" :only="['prestudy_type', 'prestudy_name', 'prestudy_marks', 'prestudy_max_marks', 'prestudy_info']"></list>
          </b-tab>
        </b-tabs>
      </b-card>
    </b-col>

    <!--    <b-col cols="12" class="mt-3">-->
    <!--      <Payments noStatus :user_id="id" :title="$t('payments')"></Payments>-->
    <!--    </b-col>-->
  </b-row>
</template>

<script>
import { mapGetters } from 'vuex';
import List from '@/views/components/info/list';
import { BTab, BTabs, BCard, BCol, BRow } from 'bootstrap-vue';
import ShowTable from '@/views/students/student/components/ShowTable';
import TabTable from '@/views/students/student/components/TabTable';
import Payments from '@/views/students/payments/components/payments';
import Credits from '@/views/students/credits/components/credits';
import Archive from '@/views/administration/archive/components/archive';

export default {
  name: 'show',
  components: { Archive, Credits, Payments, ShowTable, TabTable, List, BTabs, BTab, BCard, BCol, BRow },
  computed: {
    ...mapGetters({
      student: 'students/item',
      load: 'students/load',
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
      this.$store.dispatch('students/get', this.id);
    },
  },
};
</script>

<style scoped></style>
