<template>
  <b-row>
    <b-col cols="12">
      <b-card class="mb-0">
        <b-tabs lazy vertical nav-wrapper-class="nav-hidden" align="left">
          <!-- <b-tab>
            <template #title>
              <feather-icon icon="BookOpenIcon" />
              <span>{{ $t('Global.previous_university_info') }}</span>
            </template>
            <list v-if="student" :data="student" :loading="load" :only="['prestudy_type', 'prestudy_name', 'prestudy_marks', 'prestudy_max_marks', 'prestudy_info']"></list>
          </b-tab> -->
          <!-- <b-tab>
            <template #title>
              <feather-icon icon="BookIcon" />
              <span>{{ $t('Global.registered_courses') }}</span>
            </template>
            <list v-if="student" :data="student" :loading="load" :only="['prestudy_type', 'prestudy_name', 'prestudy_marks', 'prestudy_max_marks', 'prestudy_info']"></list>
          </b-tab> -->
          <b-tab>
            <template #title>
              <feather-icon icon="TrendingUpIcon" />
              <span>{{ $t('Global.passed_terms') }}</span>
            </template>
            <TabTable :loading="load" :type="student.terms_grades ? null : 'terms_grades'" 
                      v-if="student" :items="student.terms_grades"
                      :fields="['start_date', 'grade_term', 'total', 'credit_hours']"
                      :inner="['code', 'course', 'term', 'total', 'credit_hours', 'grade_type']"
                      :studentAccount="true"
            />
          </b-tab>
          <b-tab>
            <template #title>
              <feather-icon icon="TrendingUpIcon" />
              <span>{{ $t('Global.grades_years') }}</span>
            </template>
            <TabTable
              :type="student.programs_levels_grades ? null : 'programs_levels_grades'"
              v-if="student"
              :items="student.programs_levels_grades"
              :fields="['grade_term', 'year']"
              :inner="['code', 'course', 'term', 'total', 'max_total', 'credit_hours', 'status', 'grade_type']"
              :studentAccount="true"
            ></TabTable>
          </b-tab>
          <!-- <b-tab>
            <template #title>
              <feather-icon icon="Minimize2Icon" />
              <span>{{ $t('Global.complains_requests') }}</span>
            </template>
            <list v-if="student" :data="student" :loading="load" :only="['prestudy_type', 'prestudy_name', 'prestudy_marks', 'prestudy_max_marks', 'prestudy_info']"></list>
          </b-tab> -->
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
import { BTab, BTabs, BCard, BCol, BRow, BAvatar } from 'bootstrap-vue';
import ShowTable from '@/views/students/student/components/ShowTable';
import TabTable from '@/views/students/student/components/TabTable';
import Payments from '@/views/students/payments/components/payments';
import Credits from '@/views/students/credits/components/credits';
import Certificates from '@/views/students/certificates/components/certificate';
import Archive from '@/views/administration/archive/components/archive';
import {getAuth} from "@/auth/utils";

export default {
  name: 'show',
  components: { BAvatar, Archive, Credits, Certificates, Payments, ShowTable, TabTable, List, BTabs, BTab, BCard, BCol, BRow },
  computed: {
    ...mapGetters({
      student: 'students/item',
      load: 'students/load',
      role: 'roles/userRoles',
    }),
    id() {
      return getAuth().id;
    },
    mainData() {
      if (this.student) {
        return this.student.student;
      }
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.$store.dispatch('students/get', 'academic');
    },
  },
};
</script>

<style scoped></style>
