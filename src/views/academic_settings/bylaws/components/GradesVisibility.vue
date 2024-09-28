<template>
  <div>
    <b-col cols="12" class="new_edit p-0">
      <h4 class="mb-1">Current Semester Settings</h4>
      <table 
        class="table table-striped custom_table text_nobreak"
      >
        <tbody style="text-align: initial">
          <tr>
            <th scope="row" :width="'30%'">
              {{ $t(`Global.student_activities`) }}
            </th>

            <td class="d-flex flex-wrap">
              <div v-if="!allowEdit">
                {{ form.current_semester.student_activities }}
              </div>
              <div v-else>
                <b-form-group label-for="code-input">
                  <b-form-checkbox v-model="form.current_semester.student_activities" id="current_semester_student_activities" switch />
                </b-form-group>
              </div>
            </td>
          </tr>
          <tr>
            <th scope="row" :width="'30%'">
              {{ $t(`Global.practical_exam`) }}
            </th>

            <td class="d-flex flex-wrap">
              <div v-if="!allowEdit">
                {{ form.current_semester.practical_exam }}
              </div>
              <div v-else>
                <b-form-group label-for="code-input">
                  <b-form-checkbox v-model="form.current_semester.practical_exam" id="current_semester_practical_exam" switch />
                </b-form-group>
              </div>
            </td>
          </tr>
          <tr>
            <th scope="row" :width="'30%'">
              {{ $t(`Midterm Exam`) }}
            </th>

            <td class="d-flex flex-wrap">
              <div v-if="!allowEdit">
                {{ form.current_semester.midterm_exam }}
              </div>
              <div v-else>
                <b-form-group label-for="code-input">
                  <b-form-checkbox v-model="form.current_semester.midterm_exam" id="current_semester_midterm_exam" switch />
                </b-form-group>
              </div>
            </td>
          </tr>
          <tr>
            <th scope="row" :width="'30%'">
              {{ $t(`Final Exam`) }}
            </th>

            <td class="d-flex flex-wrap">
              <div v-if="!allowEdit">
                {{ form.current_semester.final_exam }}
              </div>
              <div v-else>
                <b-form-group label-for="code-input">
                  <b-form-checkbox v-model="form.current_semester.final_exam" id="current_semester_final_exam" switch />
                </b-form-group>
              </div>
            </td>
          </tr>
          <tr>
            <th scope="row" :width="'30%'">
              {{ $t(`Oral Exam`) }}
            </th>

            <td class="d-flex flex-wrap">
              <div v-if="!allowEdit">
                {{ form.current_semester.oral_exam }}
              </div>
              <div v-else>
                <b-form-group label-for="code-input">
                  <b-form-checkbox v-model="form.current_semester.oral_exam" id="current_semester_oral_exam" switch />
                </b-form-group>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </b-col>
    <b-col cols="12" class="new_edit p-0 mt-5">
      <h4 class="mb-1">Previous Semesters Settings</h4>
      <table 
        class="table table-striped custom_table text_nobreak"
      >
        <tbody style="text-align: initial">
          <tr>
            <th scope="row" :width="'30%'">
              {{ $t(`Global.student_activities`) }}
            </th>

            <td class="d-flex flex-wrap">
              <div v-if="!allowEdit">
                {{ form.previous_semesters.student_activities }}
              </div>
              <div v-else>
                <b-form-group label-for="code-input">
                  <b-form-checkbox v-model="form.previous_semesters.student_activities" id="previous_semesters_student_activities" switch />
                </b-form-group>
              </div>
            </td>
          </tr>
          <tr>
            <th scope="row" :width="'30%'">
              {{ $t(`Global.practical_exam`) }}
            </th>

            <td class="d-flex flex-wrap">
              <div v-if="!allowEdit">
                {{ form.previous_semesters.practical_exam }}
              </div>
              <div v-else>
                <b-form-group label-for="code-input">
                  <b-form-checkbox v-model="form.previous_semesters.practical_exam" id="previous_semesters_practical_exam" switch />
                </b-form-group>
              </div>
            </td>
          </tr>
          <tr>
            <th scope="row" :width="'30%'">
              {{ $t(`Midterm Exam`) }}
            </th>

            <td class="d-flex flex-wrap">
              <div v-if="!allowEdit">
                {{ form.previous_semesters.midterm_exam }}
              </div>
              <div v-else>
                <b-form-group label-for="code-input">
                  <b-form-checkbox v-model="form.previous_semesters.midterm_exam" id="previous_semesters_midterm_exam" switch />
                </b-form-group>
              </div>
            </td>
          </tr>
          <tr>
            <th scope="row" :width="'30%'">
              {{ $t(`Final Exam`) }}
            </th>

            <td class="d-flex flex-wrap">
              <div v-if="!allowEdit">
                {{ form.previous_semesters.final_exam }}
              </div>
              <div v-else>
                <b-form-group label-for="code-input">
                  <b-form-checkbox v-model="form.previous_semesters.final_exam" id="previous_semesters_final_exam" switch />
                </b-form-group>
              </div>
            </td>
          </tr>
          <tr>
            <th scope="row" :width="'30%'">
              {{ $t(`Oral Exam`) }}
            </th>

            <td class="d-flex flex-wrap">
              <div v-if="!allowEdit">
                {{ form.previous_semesters.oral_exam }}
              </div>
              <div v-else>
                <b-form-group label-for="code-input">
                  <b-form-checkbox v-model="form.previous_semesters.oral_exam" id="previous_semesters_oral_exam" switch />
                </b-form-group>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </b-col>
    <b-row class="mt-2">
      <b-col style="display: flex; justify-content: flex-end" v-if="allowEdit">
        <div style="margin: 3px">
          <b-button
            class="btn w-100"
            variant="primary"
            style="float: right; font-size: 12px"
            @click="save()"
          >
            {{ $t(`Global.save`) }}
          </b-button>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import {
  BCol,
  BLink,
  BRow,
  BBadge,
  BFormGroup,
  BButton,
  BCard,
  BCardHeader,
  BCardBody,
  BFormCheckbox,
  BForm,
  BFormInput,
  BModal,
} from "bootstrap-vue";
import { mapActions, mapGetters } from "vuex";
import { VueNestable, VueNestableHandle } from "vue-nestable";
import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import ValidationErrors from "@/views/components/common/ValidationErrors";
import vSelect from "vue-select";

export default {
  props: {
    allowEdit: false,
  },
  components: {
    BCol,
    BLink,
    BRow,
    BBadge,
    BFormCheckbox,
    BFormGroup,
    BButton,
    BCard,
    BCardHeader,
    BCardBody,
    VueNestable,
    VueNestableHandle,
    BForm,
    BFormInput,
    BModal,
    ValidationProvider,
    ValidationObserver,
    ValidationErrors,
    vSelect,
  },
  data() {
    return {
      form: {
        current_semester:{
          student_activities: false,
          practical_exam: false,
          midterm_exam: false,
          final_exam: false,
          oral_exam : false
        },
        previous_semesters:{
          student_activities: false,
          practical_exam: false,
          midterm_exam: false,
          final_exam: false,
          oral_exam : false
        },
      },
    };
  },
  computed: {
    ...mapGetters({
      gradesVisibility: "bylaws/gradesVisibility",
      load: "bylaws/load",
    }),
  },
  mounted(){
    let bylaw_id = this.$route.params.id
    this.$store.dispatch("bylaws/programsTree", bylaw_id).then((response) => {
        this.form.current_semester={
          student_activities: this.gradesVisibility.current_student_activities,
          practical_exam: this.gradesVisibility.current_practical_exam,
          midterm_exam: this.gradesVisibility.current_midterm_exam,
          final_exam: this.gradesVisibility.current_final_exam,
          oral_exam: this.gradesVisibility.current_oral_exam
        }
        this.form.previous_semesters={
          student_activities: this.gradesVisibility.previous_student_activities,
          practical_exam: this.gradesVisibility.previous_practical_exam,
          midterm_exam: this.gradesVisibility.previous_midterm_exam,
          final_exam: this.gradesVisibility.previous_final_exam,
          oral_exam: this.gradesVisibility.previous_oral_exam,
        }
    });
  },
  methods: {
    ...mapActions({
      lookups: "app/GET_LOOKUPS",
    }),
    save() {
      if (!this.allowEdit) return false;
      let payload = {};
      payload= { id: this.$route.params.id , query: this.form } ;

      this.$store
        .dispatch("bylaws/gradesVisibility", payload)
        .then((response) => {
          this.$swal({
            icon: "success",
            title: `${this.$t("Global.saved")}`,
            showConfirmButton: false,
            timer: 1500,
          });
          this.$emit("closeEdit");
        })
        .catch((response) => {
          this.$swal({
            icon: "warning",
            title: `${this.$t("Global.failed")}`,
            showConfirmButton: false,
            timer: 1500,
          });
        });
    },
  },
};
</script>

<style scoped>
@import "~vue-nestable/example/assets/vue-nestable.css";
</style>
