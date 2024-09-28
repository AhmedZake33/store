<template>
  <div>
    <Add v-if="(edit && $route.name == 'staff-add') || (edit && instructor  && $route.name == 'staff-show' )" @hide="cancel" :inline="true" @refresh="init" :tabNumber="0" :data="instructor && {...instructor,...instructor.user,...instructor.user.instructor_data}"></Add>

    <show v-if="!edit" @refresh="init" :type="1" :item="instructor && instructor.user ? instructor.user : null" :load="load">
      <template  #add_tab>
        <div>
          <b-tab>
            <template #title>
              <feather-icon icon="UserIcon" />
              <span>{{ $t('Global.personal_info') }}</span>
            </template>
            <Edit v-if="false" @hide="cancel" :inline="true" @refresh="init" :tabNumber="0" :data="id ? instructor.user : { code: '', name: '', name_local: '', id: '', gender: '', birth_date: '', nationality: '', access: '' }"></Edit>
            <ShowComponent v-else :data="instructor && instructor.user" :loading="load" :only="['code', 'name', 'name_local', 'id', 'gender', 'birth_date', 'nationality', 'access']">
              <template #edit>
                <div class="mb-2">
                  <feather-icon v-if="hasPermission('edit_instructor')" @click="openEdit()" style="cursor: pointer" icon="EditIcon" class="font-medium-3" v-b-tooltip.hover="$t('Global.edit')" />
                </div>
              </template>
              <template #code="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.code`) }}
                </th>
                <td>
                  {{ data.code || '-' }}
                </td>
              </template>
              <template #name="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.name_custom`) }}
                </th>
                <td>
                  {{ data.name }}
                </td>
              </template>

              <template #nationality="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.nationality`) }}
                </th>
                <td>
                  {{ data.nationality && data.nationality.name && $i18n.locale == 'en' ? data.nationality.name : data.nationality.name_local }}
                </td>
              </template>
              <template #access="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.national_id`) }}
                </th>
                <td>
                  {{ data.national_id ? data.national_id : '-' }}
                </td>
              </template>
              <template #birth_date="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.birth_date`) }}
                </th>
                <td>
                  {{ toLocalDatetime(data.birth_date, $i18n.locale) }}
                </td>
              </template>
              <template #gender="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.gender`) }}
                </th>
                <td>
                  {{ data.gender ? $t(`Global.${data.gender.name}`) : '-' }}
                </td>
              </template>

              <template #name_local="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.arabic_name`) }}
                </th>
                <td>
                  {{ data.name_local }}
                </td>
              </template>
              <template #id="{ data }">
                <th v-if="$i18n.locale == 'en'" scope="row" :width="'20%'">
                  {{ $t(`Global.name_local`) }}
                </th>
                <td v-if="$i18n.locale == 'en'">
                  {{ data.name_local }}
                </td>

                <th v-if="$i18n.locale == 'ar'" scope="row" :width="'20%'">الاسم بالانجليزية</th>
                <td v-if="$i18n.locale == 'ar'">
                  {{ data.name }}
                </td>
              </template>
            </ShowComponent>
          </b-tab>
          <b-tab>
            <template #title>
              <div id="academic_info">
                <feather-icon icon="InfoIcon" />
                <span>{{ $t('Global.academic_info') }}</span>
              </div>
            </template>
            <Edit
              v-if="false"
              @hide="edit = false"
              :inline="true"
              @refresh="init"
              :tabNumber="1"
              :data="
                id
                  ? instructor && instructor.user && instructor.user.instructor_data
                    ? { ...instructor.user.instructor_data, ...instructor }
                    : instructor
                  : { id: '', rank: '', department: '', employee_type: '', teacher_at: '', teaching_assistant_at: '', professor_at: '', seniority: '', msc_from: '', msc_from_local: '', phd_from: '', phd_from_local: '', phd_at: '', assistant_professor_at: '', emeritus_at: '' }
              "
            ></Edit>
            <ShowComponent
              v-else
              :data="instructor && instructor.user && instructor.user.instructor_data ? { ...instructor.user.instructor_data, ...instructor } : instructor"
              :loading="load"
              :only="['id', 'rank', 'department', 'employee_type', 'teacher_at', 'teaching_assistant_at', 'professor_at', 'seniority', 'msc_from', 'msc_from_local', 'phd_from', 'phd_from_local', 'phd_at', 'assistant_professor_at', 'emeritus_at', 'orcid']"
            >
              <template #edit>
                <div class="mb-2">
                  <feather-icon v-if="hasPermission('edit_instructor')" @click="openEdit()" style="cursor: pointer" icon="EditIcon" class="font-medium-3" v-b-tooltip.hover="$t('Global.edit')" />
                </div>
              </template>
              <template #teacher_at="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.teacher_at`) }}
                </th>
                <td>
                  <div v-if="data">
                    <span>
                      {{ data.teacher_at || '-' }}
                    </span>
                  </div>
                </td>
              </template>
              <template #teaching_assistant_at="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.teaching_assistant_at`) }}
                </th>
                <td>
                  <div v-if="data">
                    <span>
                      {{ data.teaching_assistant_at || '-' }}
                    </span>
                  </div>
                </td>
              </template>

              <template #professor_at="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.professor_at`) }}
                </th>
                <td>
                  <div v-if="data">
                    <span>
                      {{ data.professor_at || '-' }}
                    </span>
                  </div>
                </td>
              </template>

              <template #seniority="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.seniority`) }}
                </th>
                <td>
                  <div v-if="data">
                    <span>
                      {{ data.seniority || '-' }}
                    </span>
                  </div>
                </td>
              </template>
              <template #msc_from_local="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.msc_from_local`) }}
                </th>
                <td>
                  <div v-if="data">
                    <span v-if="$i18n.locale == 'ar'">
                      {{ data.msc_from_local || '-' }}
                    </span>
                  </div>
                </td>
              </template>
              <template #phd_from="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.phd_from`) }}
                </th>
                <td>
                  <div v-if="data">
                    <span>
                      {{ data.phd_from || '-' }}
                    </span>
                  </div>
                </td>
              </template>
              <template #phd_from_local="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.phd_from_local`) }}
                </th>
                <td>
                  <div v-if="data">
                    <span v-if="$i18n.locale == 'ar'">
                      {{ data.phd_from_local || '-' }}
                    </span>
                  </div>
                </td>
              </template>
              <template #phd_at="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.phd_at`) }}
                </th>
                <td>
                  <div v-if="data">
                    <span>
                      {{ data.phd_at || '-' }}
                    </span>
                  </div>
                </td>
              </template>
              <template #assistant_professor_at="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.assistant_professor_at`) }}
                </th>
                <td>
                  <div v-if="data">
                    <span>
                      {{ data.assistant_professor_at || '-' }}
                    </span>
                  </div>
                </td>
              </template>
              <template #emeritus_at="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.emeritus_at`) }}
                </th>
                <td>
                  <div v-if="data">
                    <span>
                      {{ data.emeritus_at || '-' }}
                    </span>
                  </div>
                </td>
              </template>

              <template #orcid="{ data }">
                <th scope="row" :width="'20%'">
                  ORCID
                </th>
                <td>
                  <div v-if="data">
                    <span>
                      {{ data.orcid || '-' }}
                    </span>
                  </div>
                </td>
              </template>

              <template #academic_name="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.academic_name`) }}
                </th>
                <td>
                  <div v-if="data">
                    <span>
                      {{ data.academic_name || data.academic_name_local }}
                    </span>
                  </div>
                </td>
              </template>
              <template #academic_name_local="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.academic_name`) }}
                </th>
                <td>
                  <div v-if="data">
                    <span>
                      {{ data.academic_name_local || data.academic_name }}
                    </span>
                  </div>
                </td>
              </template>

              <template #employee_type="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.Employment`) }}
                </th>
                <td>
                  <div v-if="data && data.employee_type">
                    <span v-if="$i18n.locale == 'en'">
                      {{ data.employee_type.name || data.employee_type.name_local }}
                    </span>
                    <span v-else>
                      {{ data.employee_type.name_local || data.employee_type.name }}
                    </span>
                  </div>
                </td>
              </template>
              <template #id="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.faculty`) }}
                </th>

                <td>
                  <div v-if="data.department && data.department.faculty">
                    <span v-if="$i18n.locale == 'en'">
                      {{ data.department.faculty.name || data.department.faculty.name_local }}
                    </span>
                    <span v-else>
                      {{ data.department.faculty.name_local || data.department.faculty.name }}
                    </span>
                  </div>
                </td>
              </template>
              <template #department="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.department`) }}
                </th>

                <td>
                  <div v-if="data">
                    <span v-if="$i18n.locale == 'en'">
                      {{ data.department && data.department.name || data.department.name_local }}
                    </span>
                    <span v-else>
                      {{  data.department && data.department.name_local || data.department.name }}
                    </span>
                  </div>
                </td>
              </template>
              <template #rank="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.rank`) }}
                </th>

                <td>
                  <div v-if="data">
                    <span v-if="$i18n.locale == 'en'">
                      {{ data.rank.name || data.rank.name_local }}
                    </span>
                    <span v-else>
                      {{ data.rank.name_local || data.rank.name }}
                    </span>
                  </div>
                </td>
              </template>
            </ShowComponent>
          </b-tab>
          <b-tab>
            <template #title>
              <div id="contact_info">
                <feather-icon icon="PhoneIcon" />
                <span>{{ $t('Global.contact_info') }}</span>
              </div>
            </template>
            <Edit v-if="false" @hide="edit = false" :inline="true" @refresh="init" :tabNumber="2" :data="id ? instructor.user : { email: '', personal_email: '', mobile: '', phone: '' }"></Edit>
            <ShowComponent v-else :data="instructor && instructor.user" :loading="load" :only="['email', 'personal_email', 'mobile', 'phone']">
              <template #email="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`academic_email`) }}
                </th>
                <td>
                  {{ data.email ? data.email : '-' }}
                </td>
              </template>
              <template #personal_email="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.personal_email`) }}
                </th>
                <td>
                  {{ data.personal_email ? data.personal_email : '-' }}
                </td>
              </template>
              <template #edit>
                <div class="mb-2">
                  <feather-icon v-if="hasPermission('edit_instructor')" @click="openEdit()" style="cursor: pointer" icon="EditIcon" class="font-medium-3" v-b-tooltip.hover="$t('Global.edit')" />
                </div>
              </template>
            </ShowComponent>
          </b-tab>
          <b-tab>
            <template #title>
              <feather-icon icon="MapPinIcon" />
              <span>{{ $t('Global.address_info') }}</span>
            </template>
            <Edit v-if="false" @hide="edit = false" :inline="true" @refresh="init" :tabNumber="3" :data="id ? instructor.user : { address: '', postal_code: '' }"></Edit>
            <ShowComponent v-else :data="instructor.user" :loading="load" :only="['address', 'postal_code']">
              <template #edit>
                <div class="mb-2">
                  <feather-icon v-if="hasPermission('edit_instructor')" @click="openEdit()" style="cursor: pointer" icon="EditIcon" class="font-medium-3" v-b-tooltip.hover="$t('Global.edit')" />
                </div>
              </template>
              <template #address="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.address`) }}
                </th>
                <td>
                  {{ data.address ? data.address : '-' }}
                </td>
              </template>
              <template #postal_code="{ data }">
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.postal_code`) }}
                </th>
                <td>
                  {{ data.postal_code ? data.postal_code : '-' }}
                </td>
              </template>
            </ShowComponent>
            <!-- <list :data="user" :loading="load" :only="['address', 'postal_code']"></list> -->
          </b-tab>
          <b-tab>
            <template #title>
              <feather-icon icon="CalendarIcon" />
              <span>{{ $t('study_schedule') }}</span>
            </template>
            <StudySchedule v-if="renderStudyScheduleComponent" />
          </b-tab>
          <b-tab>
            <template #title>
              <feather-icon icon="CalendarIcon" />
              <span>{{ $t('exams_schedules') }}</span>
            </template>
            <div>
              <ExamsSchedules />
            </div>
          </b-tab>
          <b-tab>
            <template #title>
              <div id="publications">
                <feather-icon icon="BookOpenIcon" />
                <span>{{ $t('Publications') }}</span>
              </div>
            </template>
            <Publications/>
          </b-tab>
        </div>
      </template>
    </show>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { BTab, BTabs, BCard } from 'bootstrap-vue';
import show from '@/views/user_settings/components/show';
import List from '@/views/components/info/list';
import ShowComponent from '@/views/components/info/show';
import Edit from '@/views/user_settings/staff/edit';
import Add from '@/views/user_settings/staff/add';
import StudySchedule from '@/views/study/schedule/instructors/scheduling/calendar/Calendar.vue';
import ExamsSchedules from '@/views/user_settings/staff/exams_schedules/components/exams_schedules.vue';
import Publications from '@/views/research/publications/components/publication';

export default {
  name: 'Show',
  components: {
    Add,
    List,
    BTabs,
    BTab,
    BCard,
    ShowComponent,
    StudySchedule,
    ExamsSchedules,
    Edit,
    show,
    Publications
  },
  data() {
    return {
      renderStudyScheduleComponent: true,
      edit: false,
    };
  },
  props: {
    user_id: null,
  },
  watch: {
    localLang: function () {
      // remove the my-component component from the DOM
      this.renderStudyScheduleComponent = false;
      this.$nextTick(() => {
        // add my-component component in DOM
        this.renderStudyScheduleComponent = true;
      });
    },
  },
  computed: {
    ...mapGetters({
      instructor: 'instructors/item',
      load: 'instructors/load',
    }),
    localLang() {
      return this.$i18n.locale;
    },
    id() {
      return this.$route.params.id ? this.$route.params.id : this.user_id;
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init(id) {
      if (this.id || id) {
        if (this.$route.query.inline && this.$route.query.inline != 'false') {
          this.edit = true;
        }
        this.$store.dispatch('instructors/get', this.id||id);
      } else {
        this.edit = true;
      }
    },
    cancel() {
      this.edit = false;
      this.updateFilterQueryParams({ tabNum: this.$route.query.tabNum || 0, inline: false });
    },
    openEdit() {
      this.edit = true;
      this.updateFilterQueryParams({ tabNum: this.$route.query.tabNum || 0, inline: true });
    },
  },
};
</script>

<style>
.no_bottom {
  box-shadow: none;
  border: 0;
  margin-bottom: 0;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
</style>
