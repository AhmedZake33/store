<template>
  <div>
    <b-row>
      <b-overlay
        :show="loading"
        rounded="sm"
        class="col-12"
      >
        <div>
          <b-col cols="12">
            <b-card
              class="mb-0"
              :title="($i18n.locale == 'en' ? course.name : course.name_local)"
            >
              <b-row
                  style="justify-content: space-between;"
              >
                <b-col
                  cols="2"
                  v-for="grade in grades"
                >
                  <b-badge
                    variant="light-secondary"
                    class="p-1 full-width"
                  >
                    <h6 class="text-bold">{{getTranslated(grade.mark) }}</h6>
                    <span style="color:black;font-size: 1.2em">{{ grade.value?grade.value:"-" }}</span> /{{grade.mark?grade.mark.max:''}}
                  </b-badge>
                </b-col>
                <b-col
                  cols="2"
                  style="float: right"
                >
                  <b-badge
                    variant="light-dark"
                    class="p-1 full-width"
                    style="border: 1px solid black"
                  >
                    <h6 class="text-bold">{{ $t('Total Grade') }}</h6>
                    <span v-if="this.finalGrade && this.finalGrade.gpa_letter && this.finalGrade.gpa" style="color:black;font-size: 1.2em">
                      {{finalGrade.gpa_letter}}
                      ({{finalGrade.gpa}})
                    </span>
                    <span v-else>
                      -
                    </span>
                  </b-badge>
                </b-col>
              </b-row>
            </b-card>
          </b-col>
          <b-col cols="12" class="mt-1">
            <ShowComponent
                :title="$t('Course Information')"
                :data="course"
                :loading="loading"
                :only="['code','name','id','name_local','bylaw','term','credit_hours','lecture_hours','tutorial_hours','laboratory_hours','midterm_hours','finalexam_hours','description','description_local']"
            >
              <template #id="{ data }">
                <th
                    scope="row"
                    :width="'20%'"
                >
                  {{ $t(`Arabic Name`) }}
                </th>
                <td class="d-flex flex-wrap">
                  {{data.name_local }}
                </td>
              </template>
              <template #term="{ data }">
                <th
                    scope="row"
                    :width="'20%'"
                >
                  {{ $t(`Term`) }}
                </th>
                <td class="d-flex flex-wrap">
                  {{getTranslated(data.term)}}
                </td>
              </template>
            </ShowComponent>
          </b-col>
        </div>
      </b-overlay>
    </b-row>
  </div>
</template>

<script>
import {
  BAvatar,
  BBadge,
  BButton,
  BButtonGroup,
  BCard,
  BCardBody,
  BCardHeader,
  BCol,
  BDropdown,
  BDropdownItem,
  BFormInput,
  BLink,
  BMedia, BModal,
  BOverlay,
  BPagination, BPopover,
  BRow,
  BTable,
  VBModal,
  BFormGroup,
  BAlert,
} from 'bootstrap-vue'
import { mapGetters, mapActions } from 'vuex'
import vSelect from 'vue-select'
import Ripple from 'vue-ripple-directive'
import DataTable from '@/views/components/table/DataTable'
import TabTable from '@/views/students/student/components/TabTable'
import ShowComponent from '@/views/components/info/show'

export default {
  name: 'Registration',
  components: {
    BCard,
    BRow,
    BCol,
    BOverlay,
    BCardHeader,
    BCardBody,
    BFormInput,
    BButton,
    BTable,
    BMedia,
    BAvatar,
    BLink,
    BBadge,
    BDropdown,
    BDropdownItem,
    BPagination,
    BModal,
    BPopover,
    BBadge,
    BFormGroup,
    BAlert,
    BButtonGroup,
    ShowComponent,
  },
  data() {
    return {
      loading: true,
      course: {},
      finalGrade: null,
      grades: null,
    }
  },
  computed: {
    offeringId() {
      return this.$route.params.offering_id ? this.$route.params.offering_id : null
    },
  },
  mounted() {
    this.studentId = this.id == null ? this.authUser().id : this.id
    this.init()
  },
  methods: {
    ...mapActions({
      getCourseDetails: 'students/getCourseDetails',
    }),
    init() {
      this.getCourseDetails({ offering_id: this.offeringId }).then(data => {
        this.course = {...data.offering.course,term: data.offering.term};
        this.grades = data.registration_offering_marks;
        this.finalGrade = {gpa_letter:data.grade_type?data.grade_type.name:'-', gpa:data.gpa, total:data.total};

        // to load breadcrump student code
        this.$store.commit('app/UPDATE_PAGE_DETAILS', {...this.course}, {root: true});

        this.loading = false
      }).catch( error => {
        this.loading = true;
        this.errorToast(error);
      });
    },
    getTranslated(object){
      if(!object) return '-';
      if(this.$i18n.locale=='en'){
        return object.name;
      }else{
        return object.name_local;
      }
    },
  },
}
</script>

<style>
.card .card-header{
  padding-top: 5px !important;
}
</style>
