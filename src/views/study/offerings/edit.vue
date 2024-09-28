<template>
  <div>
    <b-overlay :show="overlay" rounded="sm" no-fade>
      <edit-component :name="name" :status="2">
        <template v-if="item" #inputs>
          <validation-observer ref="simpleRules">
            <!-- {{item}} && data.item.status.name == 'Draft' && hasPermission('edit_offering') -->
            <b-form>
              <b-row>
                <b-col md="4">
                  <b-form-group :label="$t('Global.term')" label-for="mc-term">
                    <validation-provider
                        #default="{ errors }"
                        name="term"
                        rules="required"
                    >
                      <v-select
                          id="mc-term"
                          v-model="form.term_id"
                          :filter="fuseSearch"
                          :options="[item.term]"
                          :class="errors.length > 0 ? 'custom_invalid' : ''"
                          :label="getSelectLabel()"
                          class="w-100"
                          :reduce="(val) => val.id"
                          disabled
                          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                      />
                      <small v-if="errors.length" class="text-danger">{{
                          validation(null, 0).message
                        }}</small>
                    </validation-provider>
                  </b-form-group>
                </b-col>
                <b-col md="4">
                  <b-form-group
                      :label="$t('Global.faculty')"
                      label-for="mc-faculty"
                  >
                    <validation-provider
                        #default="{ errors }"
                        name="faculty"
                        rules="required"
                    >
                      <v-select
                          id="mc-faculty"
                          v-model="form.faculty_id"
                          :filter="fuseSearch"
                          :options="[item.course.faculty]"
                          :class="errors.length > 0 ? 'custom_invalid' : ''"
                          :label="getSelectLabel()"
                          class="w-100"
                          :reduce="(val) => val.id"
                          disabled
                          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                      />
                      <small v-if="errors.length" class="text-danger">{{
                          validation(null, 0).message
                        }}</small>
                    </validation-provider>
                  </b-form-group>
                </b-col>
                <b-col md="4">
                  <b-form-group :label="$t('Global.bylaw')" label-for="mc-course">
                    <validation-provider
                        #default="{ errors }"
                        name="bylaw"
                        rules="required"
                    >
                      <v-select
                          id="mc-course"
                          v-model="form.bylaw_id"
                          :filter="fuseSearch"
                          :options="[item.course.bylaw]"
                          :class="errors.length > 0 ? 'custom_invalid' : ''"
                          :label="getSelectLabel()"
                          class="w-100"
                          :reduce="(val) => val.id"
                          disabled
                          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                      />
                      <small v-if="errors.length" class="text-danger">{{
                          validation(null, 0).message
                        }}</small>
                    </validation-provider>
                  </b-form-group>
                </b-col>
                <b-col md="4">
                  <b-form-group
                      :label="$t('Global.course')"
                      label-for="mc-course"
                  >
                    <validation-provider
                        #default="{ errors }"
                        name="term"
                        rules="required"
                    >
                      <v-select
                          id="mc-course"
                          v-model="form.course_id"
                          :filter="fuseSearch"
                          :options="[item.course]"
                          :class="errors.length > 0 ? 'custom_invalid' : ''"
                          :label="getSelectLabel()"
                          class="w-100"
                          :reduce="(val) => val.id"
                          disabled
                          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                      >
                        <template slot="no-options">
                          <div v-if="loadOfferings">
                            {{ $t('Global.loading') }}
                          </div>
                          <div v-else>
                            {{ $t('Global.search') }}
                          </div>
                        </template>
                        <template slot="selected-option" slot-scope="option">
                        <span v-if="$i18n.locale == 'ar'">
                          {{
                            option.name_local + '(' + option.code + ')' ||
                            option.name + '(' + option.code + ')'
                          }}
                          <!-- {{ option.bylaw.name_local }} -
                        {{ option.bylaw.faculty.name_local }} -->
                        </span>
                          <span v-else>
                          {{
                              option.name + '(' + option.code + ')' ||
                              option.name_local + '(' + option.code + ')'
                            }}
                            <!-- {{ option.bylaw ? option.bylaw.name : '' }} -
                          {{ option.bylaw ? option.bylaw.faculty.name : '' }} -->
                        </span>
                        </template>
                        <template v-slot:option="option">
                          {{
                            $i18n.locale == 'ar'
                                ? option.name_local + '(' + option.code + ')' ||
                                option.name + '(' + option.code + ')'
                                : option.name + '(' + option.code + ')' ||
                                option.name_local + '(' + option.code + ')'
                          }}
                        </template>
                        <template #no-options>
                          {{ $t('noMatching') }}
                        </template>
                      </v-select>
                      <small v-if="errors.length" class="text-danger">{{
                          validation(null, 0).message
                        }}</small>
                    </validation-provider>
                  </b-form-group>
                </b-col>

                <b-col md="4">
                  <b-form-group
                      :label="$t('Global.programs')"
                      label-for="mc-programs"
                  >
                    <validation-provider
                        #default="{ errors }"
                        name="term"
                        rules="required"
                    >
                      <v-select
                          id="mc-course"
                          v-model="form.programs"
                          :filter="fuseSearch"
                          :options="options.programs"
                          multiple
                          :class="errors.length > 0 ? 'custom_invalid' : ''"
                          :label="getSelectLabel()"
                          class="w-100"
                          :reduce="(val) => val.id"
                          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                      >
                        <template slot="no-options">
                          <div v-if="loadOfferings">
                            {{ $t('Global.loading') }}
                          </div>
                          <div v-else>
                            {{ $t('Global.search') }}
                          </div>
                        </template>
                        <template slot="selected-option" slot-scope="option">
                        <span v-if="$i18n.locale == 'ar'">
                          {{ option.name_local || option.name }}
                        </span>
                          <span v-else>
                          {{ option.name || option.name_local }}
                        </span>
                        </template>
                        <template v-slot:option="option">
                          {{
                            $i18n.locale == 'ar'
                                ? option.name_local + '(' + option.code + ')' ||
                                option.name + '(' + option.code + ')'
                                : option.name + '(' + option.code + ')' ||
                                option.name_local + '(' + option.code + ')'
                          }}
                        </template>
                        <template #no-options>
                          {{ $t('noMatching') }}
                        </template>
                      </v-select>
                      <small v-if="errors.length" class="text-danger">{{
                          validation(null, 0).message
                        }}</small>
                    </validation-provider>
                  </b-form-group>
                </b-col>

                <b-col md="4">
                  <b-form-group
                      :label="$t('Global.linked_offering')"
                      label-for="mc-course"
                  >
                    <validation-provider
                        #default="{ errors }"
                        name="linked_offering"
                        rules=""
                    >
                      <v-select
                          id="mc-course"
                          v-model="form.linked_offering"
                          :options="FilteredLinkedOffering"
                          :class="errors.length > 0 ? 'custom_invalid' : ''"
                          :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
                          class="w-100"
                          :placeholder="$t('Global.search')"
                          :reduce="(val) => val.id"
                          clearable
                          :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
                      >
                        <template slot="no-options">
                          <div v-if="loadOfferings">
                            {{ $t('Global.loading') }}
                          </div>
                          <div v-else>
                            {{ $t('Global.search') }}
                          </div>
                        </template>
                        <template slot="selected-option" slot-scope="option">
                        <span v-if="$i18n.locale == 'ar'">
                          {{ option.name_local || option.name }}
                          <!-- {{ option.bylaw.name_local }} -
                        {{ option.bylaw.faculty.name_local }} -->
                        </span>
                          <span v-else>
                          {{ option.name || option.name_local }}
                            <!-- {{ option.bylaw ? option.bylaw.name : '' }} -
                          {{ option.bylaw ? option.bylaw.faculty.name : '' }} -->
                        </span>
                        </template>
                        <template v-slot:option="option">
                          {{
                            $i18n.locale == 'ar'
                                ? option.name_local || option.name
                                : option.name || option.name_local
                          }}
                        </template>
                        <template #no-options>
                          {{ $t('noMatching') }}
                        </template>
                      </v-select>
                      <small v-if="errors.length" class="text-danger">{{
                          validation(null, 0).message
                        }}</small>
                    </validation-provider>
                  </b-form-group>
                </b-col>
              </b-row>
            </b-form>
          </validation-observer>
        </template>

        <template #footer>
          <template>
            <b-button
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                type="submit"
                variant="primary"
                class="mr-1"
                @click="submit"
            >
              {{ $t('Global.save') }}
            </b-button>
            <b-button
                v-ripple.400="'rgba(186, 191, 199, 0.15)'"
                type="reset"
                variant="outline-secondary"
                @click="cancel"
            >
              {{ $t('Global.cancel') }}
            </b-button>
          </template>
        </template>
      </edit-component>
    </b-overlay>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import {
  BCard,
  BRow,
  BCol,
  BFormGroup,
  BFormInput,
  BFormCheckbox,
  BForm,
  BButton,
  BBadge,
  BOverlay,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import Ripple from 'vue-ripple-directive'
import { ValidationProvider, ValidationObserver, localize } from 'vee-validate'
import { required, email } from '@validations'
import EditComponent from '@/views/components/table/Edit'
import ValidationErrors from '@/views/components/common/ValidationErrors'

export default {
  name: 'Edit',
  components: {
    BCard,
    BCol,
    BRow,
    BFormGroup,
    BFormInput,
    BFormCheckbox,
    BForm,
    BButton,
    EditComponent,
    vSelect,
    ValidationObserver,
    ValidationProvider,
    localize,
    BBadge,
    ValidationErrors,
    BOverlay,
  },
  directives: {
    Ripple,
  },
  computed: {
    ...mapGetters({
      item: 'offerings/item',
      loadOfferings: 'offerings/load',
      options: 'app/lookups',
      offerings: 'offerings/items',
    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : null
    },
    name() {
      if (this.$i18n.locale === 'en') {
        return this.id
            ? `${this.$t('Global.edit_course_offering')}  ${this.course_code}  ${
                this.course_name
            } `
            : this.$t('Global.add_course_offering')
      }

      return this.id
          ? `${this.$t('Global.edit_course_offering')}  ${this.course_code}  ${
              this.course_name_local
          } `
          : this.$t('Global.add_course_offering')
    },
  },
  watch: {
    form: {
      handler(val) {
        val.offeringMarks.forEach((item, index) => {
          let count = 0
          if (item.marks.length > 0) {
            item.marks.forEach((mark) => {
              if (mark.value) {
                count += Number(mark.value)
              }
            })
          }
          item.sum = Number(count)
        })
      },
      deep: true,
    },
  },
  data() {
    return {
      editable: 'true',
      students_count: 0,
      marks: [],
      form: {
        total_marks: 0,
        linked_offering: null, // main offering
        linked_exam_offering: null,
        marks: [],
        course_id: null,
        faculty_id: null,
        bylaw_id: null,
        term_id: null,
        max_total: null,
        offeringMarks: [
          {
            pivot_id: null,
            category_id: null,
            max_category: null,
            name: null,
            sum: 0,
            marks: [
              {
                name: null,
                value: null,
                short_name: null,
              },
            ],
          },
        ],
      },
      filter: { bylaw_id: 0 },
      lookups: [],
      lookupModules: {
        bylaws: true,
        terms: true,
        faculties: true,
        linked_offerings: true,
        programs: true,
      },
      form_submit: {},
      get_programs: [],
      init_programs: [],
      init_bylaws: null,
      init_terms: null,
      init_faculties: null,
      custom_label: null,
      disable_inputs: false,
      category_item_marks: null,
      term_id: null,
      load: false,
      form2: {}, // to concat data from offering details api and data from mark gatefories api
      count: 0,
      course_name: null,
      course_code: null,
      course_name_local: null,
      offeringGradesHeader: null,
      offeringStudentsGrades: null,
      errorsdata: {},
      FilteredLinkedOffering: [],
      overlay: true,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    ...mapActions({
      getLookups: 'app/GET_LOOKUPS',
      getItem: 'offerings/get',
      submitItem: 'offerings/put',
      getOfferings: 'offerings/offerings',
      offering_mark: 'offerings/offering_mark',
    }),
    linkedOffering(offering_id, linked_offering) {
      let data = []
      linked_offering.map((item) => {
        if (item.id != offering_id) {
          let name = item.course.code + ' ' + item.course.name
          let name_local = item.course.code + ' ' + item.course.name_local
          let instance = {
            name: name,
            name_local: name_local,
            id: item.id,
          }
          data.push(instance)
        }
      })
      this.FilteredLinkedOffering = data

    },
    init() {
      this.load = true
      this.getOfferings({ query: '' })
      if (this.id) {
        this.getItem(this.id)
            .then((value) => {
              this.lookupModules = {
                ...this.lookupModules,
                ...{ bylaw_id: this.item.course.bylaw_id },
              }
              this.overlay = false
              this.getLookups(this.lookupModules)
                  .then((data) => {
                    this.lookups = data.success
                    this.linkedOffering(this.id, this.lookups.linked_offerings)
                  })

              this.form.course_id = this.item.course.id
              this.form.faculty_id = this.item.course.faculty.id
              this.form.term_id = this.item.term.id
              this.form.bylaw_id = this.item.course.bylaw.id
              this.form.programs = this.item.programs_ids
              this.form.linked_offering = this.item.linked_offering
                  ? this.item.linked_offering
                  : null
              this.form.linked_exam_offering = this.item.linked_offering
                  ? this.item.linked_offering
                  : null

              this.course_name = this.item.course.name
              this.course_name_local = this.item.course.name_local
              this.faculty_name = this.item.course.faculty.name
              this.faculty_name_local = this.item.course.faculty.name_local
              this.course_code = this.item.course.code

              this.students_count = this.item.students_count

              this.from.max_total = this.item.max_total

              this.term_id = this.item.term.id
              this.load = false

              if (this.item.markCategories != null) {
                let total_marks = 0
                this.form.offeringMarks = []
                this.item.markCategories.forEach((category) => {
                  let db = {}
                  db.pivot_id = category.pivot.id
                  db.category_id = category.id
                  db.name = this.$i18n.locale == 'en' ? category.name : category.name_local
                  //db.max_category = category.pivot.max_category;
                  db.marks = []
                  db.sum = 0

                  //total_marks += category.pivot.max_category;

                  this.form.offeringMarks.push(db)
                })
                this.form.total_marks = total_marks
              }
            })
      }
      //to check if this offering's mark setup can be edited or not /////////////////////////////
      if (this.offeringStudentsGrades != null) {
        this.offeringStudentsGrades.forEach((element) => {

          if (element.registration_marks.length > 0) {

            element.registration_marks.forEach((el) => {
              if (el.pivot.value != null) {
                //so there is grade you can't edit marks
                this.editable = 'false'
              }
            })
          }
        })
      }
    },
    submit() {
      this.$refs.simpleRules.validate()
          .then((success) => {
            if (success) {
              let query = {}
              let offeringMarkInputs = []
              query = {
                course_id: this.form.course_id,
                term_id: this.term_id,
                linked_offering_id: this.form.linked_offering
                    ? this.form.linked_offering
                    : null,
                linked_exam_offering_id: this.form.linked_offering
                    ? this.form.linked_offering
                    : null,
                offeringMarkInputs: JSON.stringify(offeringMarkInputs),
                programs: this.form.programs,
              }

              const payload = {
                id: this.id,
                query
              }
              this.submitItem(payload)
                  .then((response) => {
                    if (response.status === 'success') {
                      this.$swal({
                        icon: 'success',
                        title:
                            this.$i18n.locale === 'en'
                                ? 'Offering Edited!'
                                : 'تم تعديل المفرر ',
                        text:
                            this.$i18n.locale === 'en'
                                ? 'Offering Edited Successfully.'
                                : 'تم تعديل المقرر بنجاح',
                        showConfirmButton: false,
                        timer: 3000,
                      })
                      this.$router.push({
                        name: 'offering',
                        params: { id: this.id },
                      })
                    } else {
                    }
                  })
            } else {
            }
          })
    },
    getSelectLabel() {
      return this.$i18n.locale === 'en' ? 'name' : 'name_local'
    },

    cancel() {
      if (this.inline) {
        return this.$emit('hide')
      }
      this.$router.push({ name: 'offerings' })
    },
  },
}
</script>

<style scoped></style>
