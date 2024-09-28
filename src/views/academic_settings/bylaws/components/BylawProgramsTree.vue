<template>
    <div>
      <b-col cols="12" class="new_edit p-0">
        <table class="table table-striped custom_table text_nobreak">
          <tbody style="text-align: initial">
          <tr>
            <th scope="row" :width="'30%'">
              {{ $t(`Global.first_min_ch`) }}
            </th>
  
            <td class="d-flex flex-wrap">
              <div v-if="!allowEdit">
                {{ first_min_ch }}
              </div>
              <div v-else>
                <b-form-group label-for="code-input">
                  <validation-provider #default="{ errors }" name="first_min_ch">
                    <b-form-input ref="code" :placeholder="first_min_ch" id="first_min_ch-input"
                                  @keypress="sanitizeEnglish($event); sanitizeArabic($event);" v-model="form.first_min_ch"
                                  :state="errors.length > 0 ? false : null"/>
                    <ValidationErrors :frontend-errors="errors"
                                      :backend-errors="getBackendFieldError(errors, 'first_min_ch')"/>
                  </validation-provider>
                </b-form-group>
              </div>
            </td>
          </tr>
          <tr>
            <th scope="row" :width="'30%'">
              {{ $t(`Global.second_min_ch`) }}
            </th>
  
            <td class="d-flex flex-wrap">
              <div v-if="!allowEdit">
                {{ second_min_ch }}
              </div>
              <div v-else>
                <b-form-group label-for="code-input">
                  <validation-provider #default="{ errors }" name="second_min_ch">
                    <b-form-input ref="code" :placeholder="second_min_ch" id="second_min_ch-input"
                                  @keypress="sanitizeEnglish($event); sanitizeArabic($event);"
                                  v-model="form.second_min_ch" :state="errors.length > 0 ? false : null"/>
                    <ValidationErrors :frontend-errors="errors"
                                      :backend-errors="getBackendFieldError(errors, 'second_min_ch')"/>
                  </validation-provider>
                </b-form-group>
              </div>
            </td>
          </tr>
          </tbody>
        </table>
      </b-col>
      <b-row>
        <b-col cols="6" class="d-flex">
          <b-card style="background-color: #f6f6f6 !important; width: 100%">
            <b-card-header>
              <h3>{{ $t('Global.sorted_programs') }}</h3>
            </b-card-header>
            <b-card-body>
              <VueNestable
                  :hooks="{ 'beforeMove': beforeMove }"
                  v-model="sortedPrograms"
                  :maxDepth="3"
                  cross-list
                  group="cross"
                  @change="afterMove"
              >
                <VueNestableHandle
                    slot-scope="{ item, index }"
                    :item="item"
                >
                  <b-row>
                    <b-col cols="11">
                      <b-row>
  
                        <b class="text-primary">{{
                            (index + 1) + '- ' + ($i18n.locale == "en" ? item.name : item.name_local)
                          }}</b>
                        &nbsp;(
                        <template v-if="item.prerequisite_courses && item.prerequisite_courses.length"
                                  v-for="(course, index) in item.prerequisite_courses">
                          <span><b-link :to="{ name: 'course', params: {id: course.id } }">{{ course.code }}</b-link>{{ index + 1 < item.prerequisite_courses.length ? ' - ' : '' }}</span>
                        </template>
                        )
                      </b-row>
                    </b-col>
                    <b-col cols="1" class="text-right">
                      <b-link>
                        <feather-icon v-if="item.prerequisite_courses_ids && !item.prerequisite_courses_ids.length"
                                      icon="PlusIcon"
                                      @click="togglePrerequisiteCoursesModal(item)"
                        />
                        <feather-icon v-else
                                      icon="EditIcon"
                                      @click="togglePrerequisiteCoursesModal(item)"
                        />
                      </b-link>
                    </b-col>
                  </b-row>
                </VueNestableHandle>
              </VueNestable>
            </b-card-body>
          </b-card>
        </b-col>
        <b-col cols="6" class="d-flex">
          <b-card style="background-color: #f6f6f6 !important; width: 100%">
            <b-card-header>
              <h3>{{ $t('Global.unsorted_programs') }}</h3>
            </b-card-header>
            <b-card-body>
              <VueNestable
                  v-model="unsortedPrograms"
                  cross-list
                  group="cross"
              >
                <VueNestableHandle
                    slot-scope="{ item, index }"
                    :item="item"
                >
                  <b class="text-primary">{{
                      (index + 1) + '- ' + ($i18n.locale == "en" ? item.name : item.name_local)
                    }}</b>
                </VueNestableHandle>
              </VueNestable>
            </b-card-body>
          </b-card>
        </b-col>
        <b-col style="display: flex; justify-content: flex-end" v-if="allowEdit">
          <div style="margin: 3px">
            <b-button
                class="btn w-100"
                variant="primary"
                style="float: right; font-size: 12px"
                @click="updateProgramsOrder"
            >
              {{ $t(`Global.save`) }}
            </b-button>
          </div>
        </b-col>
      </b-row>
  
      <b-modal
          id="my-modal"
          ref="my-modal"
          v-model="show_modal"
          size="lg"
          :title="$t('Global.program_prerequisite_courses')"
          hide-footer
          cancel-variant="outline-secondary"
          no-close-on-backdrop
      >
        <div class="col-md-12 col-12">
          <validation-observer ref="fromRules">
            <b-form
                ref="formUpdateStatus"
                @submit.stop.prevent="addPrerequisiteCourses"
            >
              <b-form-group label-for="code-input" invalid-feedback="Name is required">
                <validation-provider #default="{ errors }" name="program_prerequisite_courses">
                  <v-select
                      v-if="options"
                      multiple
                      :placeholder="$t('Global.program_prerequisite_courses')"
                      v-model="form.prerequisite_courses_ids"
                      :filter="fuseSearch"
                      :class="errors.length > 0 ? 'custom_invalid' : ''"
                      :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                      :options="options.program_available_courses"
                      :clearable="true"
                      input-id="code-input"
                      :close-on-select="false"
                      :reduce="val => val.id"
                  >
                    <template v-slot:option="option">
                      {{ $i18n.locale == 'ar' ? option.name_local : option.name }}
                    </template>
                    <template #selected-option="{ name, name_local }">
                      <div style="display: flex; align-items: baseline">
                        <span v-if="$i18n.locale == 'ar'">{{ name_local }}</span>
                        <span v-else>{{ name }}</span>
                      </div>
                    </template>
                    <template #no-options>
                      {{ $t('noMatching') }}
                    </template>
                  </v-select>
                  <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                </validation-provider>
              </b-form-group>
            </b-form>
          </validation-observer>
        </div>
        <div class="mt-0">
          <b-col cols="12" md="12">
            <div class="d-flex justify-content-end">
              <b-button type="submit" variant="primary" class="mr-1" @click="addPrerequisiteCourses">
                {{ $t('Global.save') }}
              </b-button>
              <b-button type="reset" variant="outline-primary" @click="show_modal = false">
                {{ $t('Global.cancel') }}
              </b-button>
            </div>
          </b-col>
        </div>
      </b-modal>
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
    BForm,
    BFormInput,
    BModal,
  } from "bootstrap-vue";
  import {mapActions, mapGetters} from "vuex";
  import {VueNestable, VueNestableHandle} from 'vue-nestable'
  import {ValidationProvider, ValidationObserver, localize} from 'vee-validate';
  import ValidationErrors from '@/views/components/common/ValidationErrors';
  import vSelect from "vue-select";
  
  export default {
    props: {
      allowEdit: false
    },
    components: {
      BCol,
      BLink,
      BRow,
      BBadge,
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
          first_min_ch: '',
          second_min_ch: '',
        },
        sortedPrograms: [],
        unsortedPrograms: [],
        first_min_ch: '',
        second_min_ch: '',
        show_modal: false,
        selected_program: '',
        availableCourses: {},
      };
    },
    computed: {
      ...mapGetters({
        items: "bylaws/items",
        total: "bylaws/total",
        load: "bylaws/load",
        options: 'app/lookups',
      }),
    },
    mounted() {
      this.refresh();
    },
    methods: {
      ...mapActions({
        lookups: 'app/GET_LOOKUPS',
      }),
      beforeMove({dragItem, pathFrom, pathTo}) {
        if (!this.allowEdit)
          return false;
        return true;
      },
      refresh() {
        let bylaw_id = this.$route.params.id
        this.$store.dispatch("bylaws/programsTree", bylaw_id).then((response) => {
          this.sortedPrograms = response.data.sortedPrograms;
          this.unsortedPrograms = response.data.unsortedPrograms;
          this.first_min_ch = response.data.first_min_ch;
          this.second_min_ch = response.data.second_min_ch;
        });
      },
      afterMove({items, pathTo}) {
        if (!this.allowEdit)
          return false;
      },
      updateProgramsOrder() {
        if (!this.allowEdit)
          return false;
        let query = {};
        query.bylaw_id = this.$route.params.id;
        query.sortedPrograms = this.sortedPrograms;
        query.first_min_ch = this.form.first_min_ch;
        query.second_min_ch = this.form.second_min_ch;
  
        this.$store.dispatch('bylaws/saveProgramsTree', query).then((response) => {
          this.refresh();
          this.$swal({
            icon: "success",
            title: `${this.$t("Global.saved")}`,
            showConfirmButton: false,
            timer: 1500,
          });
          this.$emit('closeEdit');
        }).catch((response) => {
          this.$swal({
            icon: "warning",
            title: `${this.$t("Global.failed")}`,
            showConfirmButton: false,
            timer: 1500,
          });
        })
      },
      togglePrerequisiteCoursesModal(program) {
        this.form.prerequisite_courses_ids = program.prerequisite_courses_ids;
        this.show_modal = !this.show_modal;
        this.selected_program = program.id;
        this.lookups({
          get_program_available_courses: program.id
        })
      },
      addPrerequisiteCourses() {
        let payload = {};
        payload.prerequisite_courses_ids = this.form.prerequisite_courses_ids;
        payload.program_id = this.selected_program;
  
        this.$store.dispatch('programs/saveProgramPrerequisiteCourses', payload).then((_) => {
          this.refresh()
          this.show_modal = !this.show_modal;
        })
      }
    },
  };
  </script>
  
  <style scoped>
  @import "~vue-nestable/example/assets/vue-nestable.css";
  </style>
  
