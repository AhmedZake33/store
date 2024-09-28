<template>
  <b-row>
    <b-col cols="12" xl="12" lg="8" md="7">
      <b-card>
        <b-row v-if="mainData">
          <b-col cols="21" xl="6" class="d-flex justify-content-between flex-column">
            <div class="d-flex justify-content-start">
              <b-avatar style="width: 150px; height: 150px" :src="mainData.photo ? mainData.photo : require('@/assets/images/avatar.jpg')" size="104px" rounded />
              <!-- <b-avatar style="width: 150px; height: 150px" :src="mainData.photo"  size="104px" rounded /> -->
              <!-- <b-avatar v-else style="width: 150px; height: 150px" rounded size="104px" :text="avatarText(mainData.name)" /> -->
              <div style="margin-top: 30px" class="d-flex flex-column ml-1">
                <div class="mb-1" v-if="mainData.name">
                  <h4 class="mb-0" v-b-popover.hover.top="mainData.name" v-if="mainData.name.length > 25" style="font-weight: bold">{{ mainData.name.substring(0, 20) + '....' }}</h4>
                  <h4 class="mb-0" v-else style="font-weight: bold">{{ mainData.name }}</h4>

                  <span v-if="mainData.email &&  mainData.email.length > 30" v-b-popover.hover.top="mainData.email" class="card-text">{{ mainData.email.substring(0, 25) + '...' }}</span>
                  <span v-else class="card-text">{{ mainData.email }}</span>
                </div>
              </div>
            </div>
          </b-col>
          <b-col cols="12" xl="6">
            <table class="mt-2 mt-xl-0" style="width: 100%">
              <tr>
                <th class="pb-50 d-flex flex-wrap">
                  <feather-icon icon="UserIcon" class="mr-75" />
                  <span class="label">Username</span>
                </th>
                <td class="pb-50">
                  <span v-b-popover.hover.top="mainData.name" v-if="mainData.name.length > 15">{{ mainData.name.substring(0, 14) + '....' }}</span>
                  <span v-else>{{ mainData.name }}</span>
                </td>
              </tr>
              <tr>
                <th class="pb-50">
                  <feather-icon icon="CheckIcon" class="mr-75" />
                  <span class="lable">Status</span>
                </th>
                <td class="pb-50">
                  <span v-if="mainData.removed == 0">Active</span>
                  <span v-if="mainData.removed == 1">Not Active</span>
                  <span v-if="mainData.removed == 2">Pending</span>
                </td>
              </tr>
              <tr style="height: 25px; padding: 10px" v-if="role.length">
                <th class="pb-50">
                  <feather-icon icon="LockIcon" class="mr-75" />
                  <span class="label">Roles</span>
                </th  >
                <td class="pb-50">
                  <div v-if="role">
                    <div v-if="role.length > 0">
                      <div>
                        <span v-for="(mainData, index) in role" :key="(mainData, index)">
                          <span v-if="role.length == 1">{{ mainData }}</span>
                          <span v-else>
                            <span v-if="index + 1 == role.length">{{ mainData }}</span>
                            <span v-else> {{ mainData }} ,</span>
                          </span>
                        </span>
                      </div>
                    </div>
                    <div v-else>
                      <span>User</span>
                    </div>
                  </div>
                </td>
              </tr >
              <tr v-if="mainData.address">
                <th class="pb-50">
                  <feather-icon icon="FlagIcon" class="mr-75" />
                  <span class="label">Country</span>
                </th>
                <td class="pb-50">
                  {{ mainData.address || '-' }}
                </td>
              </tr>
              <tr v-if="mainData.mobile || mainData.phone">
                <th class="pb-50">
                  <feather-icon icon="PhoneIcon" class="mr-75" />
                  <span class="label">Phone</span>
                </th>
                <td class="pb-50">
                  {{ mainData.phone?mainData.phone:mainData.mobile }}
                </td>
              </tr>
            </table>
          </b-col>
        </b-row>
      </b-card>
    </b-col>
    <b-col cols="12">
      <b-card class="mb-0">
        <b-tabs lazy vertical nav-wrapper-class="nav-hidden" align="left">
          <b-tab>
            <template #title>
              <feather-icon icon="UserIcon" />
              <span>{{ $t('Global.personal_info') }}</span>
            </template>
            <ShowComponent v-if="student" :data="student" :loading="load" :only="[ 'user', 'term', 'program', 'level', 'last_grade_term', 'transferred_from', 'transferred_from_local', 'notes', 'applicant', 'birth_country']">
              <template #program="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.program`) }}
                </th>
                <td class="d-flex flex-wrap">
                  {{ getFullProgramName(data) }}
                </td>
              </template>
            </ShowComponent>
            <list v-if="student && student.student" :customShow="['gender']" :expectKey="['type']" :data="student.student" :loading="load" :only="['birth_date', 'gender', 'national_id', 'personal_email','address']"></list>
          </b-tab>
          <b-tab>
            <template #title>
              <feather-icon icon="UsersIcon" />
              <span>{{ $t('Global.parent_info') }}</span>
            </template>
            <list v-if="student" :data="student" :loading="load" :only="['parent_name', 'parent_phone', 'parent_email', 'parent_relation', 'parent_national_id']"></list>
          </b-tab>
          <b-tab>
            <template #title>
              <feather-icon icon="GitPullRequestIcon" />
              <span>{{ $t('Global.nationality') }}</span>
            </template>
            <list v-if="student && student.student && student.student.nationality" :data="student.student.nationality" :loading="load" :only="['nationality', 'nationality_local']"></list>
          </b-tab>
          <b-tab v-if="student && student.student && student.student.gender == 1">
            <template #title>
              <feather-icon icon="FrownIcon" />
              <span>{{ $t('Global.military_info') }}</span>
            </template>
            <list v-if="student" :data="student" :loading="load" :only="['military_no', 'military_order', 'military_info']"></list>
          </b-tab>

          <b-tab>
            <template #title>
              <feather-icon icon="BookOpenIcon" />
              <span>{{ $t('Global.pre_study_info') }}</span>
            </template>
            <list v-if="student" :data="student" :loading="load" :only="['prestudy_type', 'prestudy_name', 'prestudy_marks', 'prestudy_max_marks', 'prestudy_info']"></list>
          </b-tab>
          <b-tab>
            <template #title>
              <feather-icon icon="Link2Icon" />
              <span>{{ $t('Global.documents') }}</span>
            </template>
            <Archive :list="true"  :parent="student.student.archive_id != null ?student.student.archive_id:null " :breadcrumb="false" :more="false" :student-show="true" :allow-search="false"></Archive>
          </b-tab>
        </b-tabs>
      </b-card>
    </b-col>
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
import ShowComponent from '@/views/components/info/show';

export default {
  name: 'show',
  components: { BAvatar, Archive, Credits, Certificates, Payments, ShowTable, TabTable, List, BTabs, BTab, BCard, BCol, BRow, ShowComponent },
  computed: {
    ...mapGetters({
      student: 'students/item',
      load: 'students/load',
      role: 'roles/userRoles',
    }),
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
      this.$store.dispatch('students/get', 'profile');
    },
    getFullProgramName(data){
      return `(${data.program.name_local}, ${data.program.bylaw.name_local}, ${data.program.faculty.name_local}) - ( ${data.program.name}  , ${data.program.bylaw.name}  , ${data.program.faculty.name})`;
    }
  },
};
</script>

<style scoped></style>
