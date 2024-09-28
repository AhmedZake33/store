<template>
  <div>
    <edit-component :name="name" :loading="false" :status="2">
      <template #inputs>
        <validation-observer ref="simpleRules">
          <b-form ref="form" @submit.prevent>
            <b-row>
              <!-- <b-col md="6" lg="12" class="mb-1">
             <div class="demo-inline-spacing">
                <b-form-radio
                  v-model="type"
                  name="some-radio9"
                  value="0"
                  class="custom-control-primary"
                >
                 {{ $t("Global.add_course_offerings_to_current_semester") }} ({{ $t("Global.default") }})
                </b-form-radio>
                 <b-form-radio
                  v-model="type"
                  name="some-radio9"
                  value="1"
                  class="custom-control-primary"
                  :disabled="noGroups"
                >
                   {{ $t("Global.add_course_offerings_from_previous_semesters") }}
                </b-form-radio>
             </div>
             </b-col> -->
              <b-col md="4">
                <b-row>
                  <b-col md="12">
                    <b-form-group :label="$t('Global.semester')">
                      <validation-provider
                        #default="{ errors }"
                        name="semester"
                        rules="required"
                      >
                        <v-select
                          v-model="form.term_id"
                          :class="errors.length > 0 ? 'custom_invalid' : ''"
                          :options="lookups.offering_terms"
                          class="w-100"
                          :reduce="(val) => val.id"
                          :label="getSelectLabel()"
                          dir=" $i18n.locale == 'en'? ltr : rtl"
                          :placeholder="$t('Global.searchInTerms')"
                        />
                        <small v-if="errors.length" class="text-danger">{{
                          validation(null, 0).message
                        }}</small>
                      </validation-provider>
                    </b-form-group>
                  </b-col>
                  <b-col md="12">
                    <b-form-group :label="$t('Global.faculty')">
                      <validation-provider
                        #default="{ errors }"
                        name="faculty_id"
                        rules="required"
                      >
                        <v-select
                          v-model="form.faculty_id"
                          :filter="fuseSearch"
                          :disabled="form.term_id == null"
                          :class="errors.length > 0 ? 'custom_invalid' : ''"
                          :options="lookups.faculties"
                          :label="getSelectLabel()"
                          class="w-100"
                          dir=" $i18n.locale == 'en'? ltr : rtl"
                          :placeholder="$t('Global.searchInFaculties')"
                        />
                        <small v-if="errors.length" class="text-danger">{{
                          validation(null, 0).message
                        }}</small>
                      </validation-provider>
                    </b-form-group>
                  </b-col>
                  <b-col md="12">
                    <b-form-group
                      :label="$t('Global.bylaw')"
                      label-for="mc-bylaws"
                    >
                      <validation-provider
                        #default="{ errors }"
                        name="faculty_id"
                        rules="required"
                      >
                        <v-select
                          id="mc-bylaws"
                          v-model="form.bylaw_id"
                          :filter="fuseSearch"
                          :options="lookups.bylaws"
                          :disabled="form.faculty_id == null"
                          :label="getSelectLabel()"
                          class="w-100 mb-2"
                          dir=" $i18n.locale == 'en'? ltr : rtl"
                          :placeholder="$t('Global.searchInBylaws')"
                        />
                        <small v-if="errors.length" class="text-danger">{{
                          validation(null, 0).message
                        }}</small>
                      </validation-provider>
                    </b-form-group>
                  </b-col>
                  <b-col md="12">
                    <b-form-group
                      :label="$t('Global.program')"
                      label-for="mc-program"
                    >
                      <v-select
                        id="mc-program"
                        v-model="form.program_id"
                        :filter="fuseSearch"
                        :disabled="form.bylaw_id == null"
                        :options="lookups.programs"
                        :label="getSelectLabel()"
                        class="w-100 mb-2"
                        dir=" $i18n.locale == 'en'? ltr : rtl"
                        :placeholder="$t('Global.searchInPrograms')"
                        multiple
                        clearable
                      >
                        <!-- @search="fetchOptions" -->
                        <template slot="no-options">
                          <div v-if="loadPrograms">
                            {{ $t("Global.loading") }}
                          </div>
                          <div v-else>
                            {{ $t("Global.searchInPrograms") }}
                          </div>
                        </template>
                        <template slot="selected-option" slot-scope="option">
                          <div class="selected d-center">
                            {{
                              $i18n.locale == "ar"
                                ? option.name_local || option.name
                                : option.name || option.name_local
                            }}
                          </div>
                        </template>
                        <template v-slot:option="option">
                          {{
                            $i18n.locale == "ar"
                              ? option.name_local || option.name
                              : option.name || option.name_local
                          }}
                        </template>
                        <template #no-options>
                          {{ $t("noMatching") }}
                        </template>
                      </v-select>
                    </b-form-group>
                  </b-col>
                </b-row>
              </b-col>
              <b-col md="8">
                <b-form-group :label="$t('Global.courses')">
                  <validation-provider
                    #default="{ errors }"
                    name="courses"
                    rules="required"
                  >
                    <v-select
                      v-model="form.courses_ids"
                      :class="errors.length > 0 ? 'custom_invalid' : ''"
                      :options="filtered"
                      :disabled="form.bylaw_id == null"
                      class="w-100"
                      :reduce="(val) => val.id"
                      :label="getSelectLabelCourses()"
                      dir=" $i18n.locale == 'en'? ltr : rtl"
                      :placeholder="$t('Global.searchInCourses')"
                      multiple
                      :selectable="(item) => !(item.in_offerings.length > 0)"
                      :filter="fuseSearch"
                    >
                      <template v-slot:option="option">
                        {{
                          $i18n.locale == "ar"
                            ? option.code + " " + option.name_local
                            : option.code + " " + option.name
                        }}
                      </template>
                      <template #selected-option="{ name, name_local, code }">
                        <div style="display: flex; align-items: baseline">
                          <strong v-if="$i18n.locale == 'ar'"
                            >{{
                              name_local
                                ? code + " " + name_local
                                : code + " " + name
                            }}
                          </strong>
                          <strong v-else>{{
                            name ? code + " " + name : code + " " + name_local
                          }}</strong>
                        </div>
                      </template>
                      <template #no-options>
                        {{ $t("noMatching") }}
                      </template>
                    </v-select>
                    <small v-if="errors.length" class="text-danger">{{
                      validation(null, 0).message
                    }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>

              <!----------------------------------------->
              <!----------------------type == 1 (copy course offering from term)------------------>

              <!--    <b-col md="8">
                <b-row no-gutters>
                  <b-col>
                    <b-card
                      class="shadow-none bg-transparent "
                      style="height: 300px; overflow: auto"
                    >
                      <b-row no-gutters>
                        <b-row class="w-100 mx-0">
                          <b-col md="12">
                            <b-form-group>
                              <b-form-input
                                v-model="search"
                                class="d-inline-block"
                                :placeholder="$t('Global.searchInCourses')"
                                @input="customAutocomplete()"
                              />
                            </b-form-group>
                          </b-col>
                        </b-row>
                        <b-overlay
                          :show="loadCourses"
                          rounded="sm"
                          class="w-100"
                        >
                          <b-row class="w-100">
                            <b-col md="6">
                              <h6
                                class="px-2 text-primary font-weight-bold mb-1 mt-1"
                              >
                                {{ $t('Global.courses') }}
                              </h6>
                              <draggable
                                v-if="courses"
                                :list="filtered"
                                tag="ul"
                                group="people"
                                class="list-group list-group-flush cursor-move"
                              >
                                <b-list-group-item
                                  v-for="(listItem, index) in filtered"
                                  :key="index"
                                  tag="li"
                                  :disabled="listItem.in_offerings.length > 0 ? true : false"
                                >
                                  <div class="d-flex">
                                    <div
                                      class="ml-25 d-flex justify-content-between w-100"
                                    >
                                      <div style="max-width:90%;">
                                        <b-card-text
                                          class="mb-0 font-weight-bold"
                                        >
                                           {{ listItem.code }}  &nbsp;
                                          {{
                                            getTranslatedName(
                                              listItem.name,
                                              listItem.name_local,
                                            )
                                          }}
                                        </b-card-text>

                                        <div>
                                          <b-badge
                                            v-if="
                                              listItem.in_offerings.length > 0
                                            "
                                            v-ripple.400="
                                              'rgba(113, 102, 240, 0.15)'
                                            "
                                           
                                            variant="success"
                                            style="cursor: default"
                                          >
                                            <small>
                                              {{
                                                $t('Global.offered')
                                              }}
                                            </small>
                                          </b-badge>
                                        </div>
                                      </div>

                                      <feather-icon
                                       v-if="
                                              listItem.in_offerings.length > 0
                                            "
                                       
                                        v-ripple.400="
                                          'rgba(40, 199, 111, 0.15)'
                                        "
                                        variant="flat-primary"
                                        class="btn-icon"
                                        style="cursor: default; max-width:14px; max-height:14px; "
                                      />
                                      <feather-icon
                                       v-else
                                       
                                        v-ripple.400="
                                          'rgba(40, 199, 111, 0.15)'
                                        "
                                        icon="PlusCircleIcon"
                                        variant="flat-primary"
                                        class="btn-icon"
                                        style="cursor: pointer; max-width:14px; max-height:14px; "
                                        @click="addCourse(listItem, index)"
                                      />
                                    </div>
                                  </div>
                                </b-list-group-item>
                              </draggable>
                              <div
                                v-else
                                class="px-2"
                              >
                                <span class="muted">{{
                                  $t('Global.noData')
                                }}</span>
                              </div>
                            </b-col>

                            <b-col md="6">
                              <h6
                                class="px-2 text-primary font-weight-bold mb-1 mt-1"
                              >
                                {{ $t('Global.selected_courses') }}
                              </h6>
                              <draggable
                                v-if="list2"
                                :list="list2"
                                tag="ul"
                                group="people"
                                class="list-group list-group-flush cursor-move"
                              >

                                <b-list-group-item

                                  v-for="(listItem, index) in list2"
                                  :key="index"
                                  tag="li"
                                >
                                  <div class="d-flex">
                                    <div
                                      class="ml-25 d-flex justify-content-between w-100"
                                    >
                                      <div style="max-width:90%;">
                                        <b-card-text
                                          class="mb-0 font-weight-bold"
                                        >
                                           {{ listItem.code }}  &nbsp;
                                          {{
                                            getTranslatedName(
                                              listItem.name,
                                              listItem.name_local,
                                            )
                                          }}
                                        </b-card-text>
                                        <div>
                                          <b-badge
                                            v-if="
                                              listItem.in_offerings.length > 0
                                            "
                                            v-ripple.400="
                                              'rgba(113, 102, 240, 0.15)'
                                            "
                                           
                                            variant="success"
                                            style="cursor: default"
                                          >
                                            <small>
                                              {{
                                                $t('Global.offered')
                                              }}
                                            </small>
                                          </b-badge>
                                        </div>
                                      </div>

                                      <feather-icon
                                        v-ripple.400="
                                          'rgba(40, 199, 111, 0.15)'
                                        "
                                        icon="MinusCircleIcon"
                                        variant="flat-primary"
                                        class="btn-icon"
                                        style="cursor: pointer; max-width:14px; max-height:14px; "
                                        @click="removeCourse(listItem, index)"
                                      />
                                    </div>
                                  </div>
                                </b-list-group-item>

                              </draggable>

                              <div
                                v-else
                                class="px-2"
                              >
                                <span class="muted">{{
                                  $t('Global.noSelectedCourse')
                                }}</span>
                              </div>

                            </b-col>
                          </b-row>
                        </b-overlay>
                      </b-row>
                    </b-card>
                  </b-col>
                </b-row>
              </b-col> -->
            </b-row>

            <b-row>
              <b-col md-12>
                <b-button
                  v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                  variant="primary"
                  class="mr-1"
                  @click="submit"
                >
                  {{ $t("Global.save") }}
                </b-button>
                <b-button
                  v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                  type="reset"
                  variant="outline-secondary"
                  @click="cancel"
                >
                  {{ $t("Global.cancel") }}
                </b-button>
              </b-col>
            </b-row>
          </b-form>
        </validation-observer>
      </template>
    </edit-component>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import {
  BCard,
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BFormCheckbox,
  BForm,
  BButton,
  BListGroupItem,
  BAvatar,
  BBadge,
  BOverlay,
  BCardText,
  BFormRadio,
} from "bootstrap-vue";
import vSelect from "vue-select";
import Ripple from "vue-ripple-directive";

import draggable from "vuedraggable";
import Prism from "vue-prism-component";
import "prismjs";
import "prismjs/themes/prism-tomorrow.css";

import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import { required, email } from "@validations";

import EditComponent from "@/views/components/table/Edit";
import Marks from "@/views/study/offerings/components/marks";

export default {
  name: "Edit",
  components: {
    EditComponent,
    BCard,
    BCol,
    BRow,
    BFormGroup,
    BFormInput,
    BFormCheckbox,
    BForm,
    BButton,
    BCardText,
    vSelect,
    BAvatar,
    BListGroupItem,
    Prism,
    draggable,
    BBadge,
    BOverlay,
    ValidationProvider,
    ValidationObserver,
    localize,
    Marks,
    BFormRadio,
  },
  directives: {
    Ripple,
  },
  computed: {
    ...mapGetters({
      item: "offerings/item",
      load: "offerings/load",
      courses: "offerings/courses",
      programs: "programs/items",
      loadPrograms: "programs/load",
      loadCourses: "offerings/loadCourses",
    }),
    programId() {
      if (this.form.program_id) {
        return this.form.program_id.map((prog) => prog.id);
      }
    },
    id() {
      return this.$route.params.id ? this.$route.params.id : null;
    },
    name() {
      // return this.id ? `${this.$t('Global.edit_offering')}` : this.$t('Global.add_offering')
      return this.$t("Global.add_course_offerings_to_current_semester");
    },
  },
  watch: {
    "form.faculty_id": function (newValue, oldValue) {
      this.filtered = [];
      this.course_id = [];
      this.form.bylaw_id = null;
      this.form.program_id = null;
      this.changedBylawId("faculty", newValue.id);
    },
    "form.bylaw_id": function (newValue) {
      this.changedBylawId("program", newValue.id);
      if (newValue != null && this.form.term_id) {
        if(this.form.courses_ids)
        {
          this.form.courses_ids = []
        }
        this.getProgramCourses({
          bylaw_id: newValue.id,
          term_id: this.form.term_id,
          course_keywords: this.search,
        }).then((data) => {
          this.program_courses = data.success.offering_courses;
          this.list1 = this.program_courses;
          this.filteredCourses();
        });
      }
    },
    form: {
      /*  handler(val) {
        const ob = this
        val.markInputs.forEach((item, index) => {
          const mc = this.lookups.mark_categories.find(element => element.id == item.markCategoryId)
          if (mc) {
            this.marks[item.markCategoryId] = mc.marks
          } else {
            this.marks[item.markCategoryId] = []
          }
        })
      },
      deep: true, */
    },

    programId(newValue) {
      if (newValue != null && this.form.term_id) {
        this.getProgramCourses({
          program_id: newValue,
          bylaw_id: this.form.bylaw_id.id,
          term_id: this.form.term_id,
          course_keywords: this.search,
        }).then((data) => {
          this.program_courses = data.success.offering_courses;
          this.list1 = this.program_courses;
          this.filteredCourses();
        });
      }
    },
    // search(newValue) {
    //   if (this.form.program_id != null && this.form.term_id) {
    //     this.getProgramCourses({
    //       program_id: this.programId,
    //       term_id: this.form.term_id,
    //       course_keywords: newValue,
    //     }).then(data => {
    //       this.program_courses = data.success.offering_courses
    //     })
    //     this.list1 = this.program_courses
    //   }
    // },
    list2(newValue) {
      const ids = [];
      this.list2.forEach((value, index) => {
        ids.push(value.id);
      });
      this.course_id = ids;
    },
  },
  data() {
    return {
      marks: [],
      form: {
        bylaw_id: null,
        faculty_id: null,
        term_id: null,
        program_id: null,
        courses_ids: null,
      },
      filter: {},
      lookups: [],
      first_name: null,
      lookupModules: {
        //terms: true,
        offering_terms: true,
        faculties: true,
        bylaws: true,
        programs: true,
        //mark_categories: true,
        //marks: true,
      },
      list1: [],
      list2: [],
      filtered: [],
      in_programs: [],
      search: "",
      course_id: [],
      submit_form: {},
      program_courses: null,
      type: 0,
      // markCategory: [],
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapActions({
      getItem: "offerings/get",
      getLookups: "app/GET_LOOKUPS",
      submitItem: "offerings/add",
      getOfferings: "offerings/offerings",
      getProgramCourses: "offerings/program_courses",
      getPrograms: "programs/programs",
    }),
    checkIsItemDisabled(item) {
      if (item.in_offerings.length > 0) {
        return true;
      } else {
        return false;
      }
    },
    customAutocomplete() {
      this.filteredCourses();
    },
    filteredCourses() {

      this.filtered = this.courses;
      /*  if (newData) {
        this.filtered = newData.filter((item) =>
          item.name && item.code && item.name_local
            ? item.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1
              ? item.name.toLowerCase().indexOf(this.search.toLowerCase()) > -1
              : item.code.toLowerCase().indexOf(this.search.toLowerCase()) > -1
              ? item.code.toLowerCase().indexOf(this.search.toLowerCase()) > -1
              : item.name_local
                  .toLowerCase()
                  .indexOf(this.search.toLowerCase()) > -1
            : ""
        );

      } */
    },
    getSelectLabelCourses() {
      return this.$i18n.locale == "en" ? "name" : "name_local";
    },
    fetchOptions(search) {
      let query;
      if (search) {
        query = { keywords: search || "" };
      }
      this.getPrograms({ query });
    },
    init() {
      this.getLookups(this.lookupModules).then((data) => {
        this.lookups = data.success;
      });
      // if (this.id) {
      //   this.getItem(this.id).then(_ => {
      //     this.form = this.item
      //   })
      // }
    },
    submit() {
      this.$refs.simpleRules
        .validate()
        .then((success) => {
          if (success && this.form.courses_ids.length > 0) {
            const query = {
              term_id: this.form.term_id,
              //courses: this.course_id,
              courses: this.form.courses_ids,
              //gradeItemInputs: JSON.stringify(this.form.markInputs),
              // program_id:this.programId,
            };
            this.submitItem({ query })
              .then((response) => {
                if (response.status && response.status === "success") {
                  this.$swal({
                    icon: "success",
                    title: `${this.$t("Global.saved")}`,
                    showConfirmButton: false,
                    timer: 2000,
                  });
                  this.$router.push({ name: "offerings" });
                } else {
                }
              })
              .catch((error) => {
                let message =
                  error.response.data.errors.length > 0
                    ? error.response.data.errors[0].title
                    : this.$t("Global.errorMessage");
                this.$swal({
                  icon: "error",
                  text: message,
                  showConfirmButton: true,
                  timer: 3000,
                });
              });
          } else if (success && this.form.courses_ids.length === 0) {
            this.$swal({
              icon: "error",
              text:
                this.$i18n.locale === "en"
                  ? " Choose Courses First"
                  : "اختر مواد اولا",
              showConfirmButton: true,
              //showCancelButton: true,
              timer: 3000,
            });
          }
        })
        .catch((_) => {
        });
    },
    changedBylawId(type, id) {
      // this.item.program_id = program_id
      if (type == "program") {
        this.lookupModules = { ...this.lookupModules, ...{ bylaw_id: id } };
      } else {
        this.lookupModules = { ...this.lookupModules, ...{ faculty_id: id } };
      }
      this.getLookups(this.lookupModules).then((data) => {
        this.lookups = data.success;
      });
    },
    changeMarkCategoryId(id) {
      this.lookupModules = {
        ...this.lookupModules,
        ...{ mark_category_id: id },
      };
    },
    getProgramsName(programs) {
      let programsName = "";
      programs.forEach((value, key) => {
        programsName += `${value.name},`;
      });
      return programsName;
    },
    addCourse(course, index) {
      this.list2.push(course);
      this.program_courses.splice(index, 1);
      this.filtered.splice(index, 1);
    },
    removeCourse(course, index) {
      this.list2.splice(index, 1);
      this.program_courses.push(course);
      this.filtered.push(course);
    },
    cancel() {
      if (this.inline) {
        return this.$emit("hide");
      }
      this.$router.push({ name: "offerings" });
    },
    getTranslatedName(name, nameLocal) {
      if (this.$i18n.locale === "en") {
        if (!name) {
          return nameLocal;
        }
        return name;
      }
      return nameLocal;
    },
  },
};
</script>

<style scoped></style>
