<template>
    <div v-if="studyingStudentStatus">
      <b-row>
        <SelectedEmtyaz @refreshSelector="refreshSelector" @checkStudentStudyingStatus="checkStudentStudyingStatus" ref="selectedOfferingsRef"></SelectedEmtyaz>
        <!-- <b-overlay class="col-12" rounded="sm">
          <Calendar class="mt-1 mx-1" ref="offeringSchedulesRef" :handleEvents="false"></Calendar>
        </b-overlay> -->
        <EmtyazSelector  @refreshSelected="refreshSelected" :studentId="studentId" :termId="updatedTermId" ref="offeringSelectorsRef"></EmtyazSelector>
        <!-- <b-overlay v-if="takenCourses" rounded="sm" class="col-12">
           <b-card
                  class="ml-1 mr-1"
              >
              <h3>{{$t('Global.takenCourses')}}</h3>
              <div>
                  <template>
                <simple-table :fields="gradesFields" :items="takenCourses.CoursesAtall" :load="loading" :actions="false">
                </simple-table>
              </template>
              </div>
           </b-card>
        </b-overlay> -->
  
        <!-- <b-overlay v-if="passedSemester" rounded="sm" class="col-12 mt-1">
           <b-card
                  class="ml-1 mr-1"
              >
              <h3>{{$t('Global.passed_terms')}}</h3>
              <div>
                <GradesTabTable v-if="passedSemester.terms_grades" :loading="load"
                        :type="'terms_grades'"
                        :items="passedSemester.terms_grades"
                        :fields="[
                  { key: 'term_name', label: this.$t('Global.grade_term'), thStyle: { width: '10%' } },
                  { key: 'grade_level', label: this.$t('Global.level'), thStyle: { width: '10%' } },
                  { key: 'total', label: this.$t('Global.grade'), thStyle: { width: '25%' } },
                  { key: 'cumulative', label: this.$t('Global.cumulative'), thStyle: { width: '25%' } },
                ]" :inner="[
                  { key: 'code', label: this.$t('Global.code'),thStyle: { width: '10%' }, },
                  { key: 'course', label: this.$t('Global.course') },
                  { key: 'credit_hours', label: this.$t('Global.credit_hours'),thStyle: { width: '10%' }, },
                  { key: 'credit_points', label: this.$t('credit_points'),thStyle: { width: '10%' }, },
                  { key: 'total_max_total', label: this.$t('Global.total'),thStyle: { width: '10%' }, },
                  { key: 'grade_type', label: this.$t('Global.grade'),thStyle: { width: '10%' }, },
                  // { key: 'action', label: this.$t('Global.actions'),thStyle: { width: '10%' }, },
                ]"/>
              </div>
           </b-card>
        </b-overlay> -->
  
        <!-- <StudyPlan :studentId="studentId"></StudyPlan> -->
      </b-row>
    </div>
  </template>
  
  <script>
  import {
    BCol,
    BOverlay,
    BRow,
    VBModal,
    BCard,
  } from "bootstrap-vue";
  import { mapGetters, mapActions } from "vuex";
  import Ripple from "vue-ripple-directive";
  import TabTable from "@/views/students/student/components/TabTable";
  import SelectedEmtyaz from "@/views/emtyaz/training/students/components/SelectedEmtyaz.vue";
  import EmtyazSelector from "@/views/emtyaz/training/students/components/EmtyazSelector.vue";
  import StudyPlan from "@/views/for_student/offering/components/StudyPlan.vue";
  import Calendar from "@/views/for_student/offering/calendar/Calendar.vue";
  import SimpleTable from "@/views/components/table/SimpleTable";
  import GradesTabTable from "@/views/students/student/components/GradesTabTable";
  
  export default {
    name: 'Registration',
    components: {
      BRow,
      BCol,
      BOverlay,
      TabTable,
      SelectedEmtyaz,
      EmtyazSelector,
      Calendar,
      SimpleTable,
      BCard,
      StudyPlan,
      GradesTabTable
    },
    directives: {
      Ripple,
      'b-modal': VBModal,
    },
    data() {
      return {
        loading: true,
        selectorLoading: true,
        student: {},
        currentTermStage: {
          stage_code_id: null,
        },
        studyingStudentStatus: true,
        studentId: null,
  
        updatedTermId: null,
      }
    },
    computed: {
      id() {
        return this.$route.params.id ? this.$route.params.id : null
      },
      ...mapGetters({
        takenCourses: 'offeringsRegistrations/takenCourses',
        passedSemester: 'offeringsRegistrations/termsGrades'
      }),
  
      gradesFields() {
        if (this.student && this.student.program && this.student.program.bylaw && this.student.program.bylaw.type_id == 2) {
          return [
            this.$t('Global.code'),
            this.$t('course'),
            this.$t('Global.term'),
            this.$t('Global.total'),
            this.$t('Global.max_total'),
            this.$t('Global.grade'),
          ]
        } else {
          return [
            this.$t('Global.code'),
            this.$t('course'),
            this.$t('Global.term'),
            this.$t('Global.ch'),
            this.$t('Global.cp'),
            this.$t('Global.gpa'),
            this.$t('Global.grade'),
            this.$t('Global.total'),
          ]
        }
      },
    },
    mounted() {
      this.studentId = this.id
      this.init()
    },
    methods: {
      ...mapActions({
        getCurrenStudentTermStage: 'offeringsRegistrations/getCurrentTermStage',
        getPassedSemester: 'offeringsRegistrations/getTermsGrades',
        getTakenCourses: 'offeringsRegistrations/getTakenCourses',
      }),
      init() {
        this.loading = true
        this.getTakenCourses({student_id:this.studentId}).then(data => {
          this.loading =false
        })
  
        this.getPassedSemester({student_id:this.studentId}).then(data => {
          this.loading =false
        })
      },
      refreshSelected(){
        this.$refs.selectedOfferingsRef.updateTables(false,true,true);
        this.$refs.offeringSchedulesRef.refetchEvents();
      },
      refreshSelector(updatedTermId = null) {
        if (updatedTermId) this.updatedTermId = updatedTermId
  
        this.$refs.offeringSelectorsRef.updateTables(false, this.updatedTermId)
        this.$refs.offeringSchedulesRef.refetchEvents();
      },
      checkStudentStudyingStatus(status){
        this.studyingStudentStatus = status;
      }
    },
  }
  </script>
  
  <style>
  .alert .alert-body {
    padding: 5px;
  }
  .card .card-header{
    padding-top: 5px !important;
  }
  .customAction {
    text-align: center;
  }
  
  .button-loading{}
  /* targeting button label to make it invisible when spinner is called*/
  .button-loading .bl-button-label {
    visibility: hidden;
    opacity:0;
  }
  /* defining the animation*/
  @keyframes spinner {
    from {transform:rotate(0deg);}
    to {transform: rotate(360deg);}
  }
  
  /* add the following class to any button to make it spin, remove the class to stop the spinner and go back to normal*/
  .button-loading::after {
    content: '';
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    margin-top: -10px;
    margin-left: -10px;
    border-radius: 50%;
    border-top: 2px solid #ffffff;
    border-right: 2px solid transparent;
    animation: spinner .6s linear infinite;
    border-color: black;
  }
  
  </style>
  