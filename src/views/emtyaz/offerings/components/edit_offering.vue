<template>
  <div class="new_edit">
   <b-overlay :show="overlay" rounded="sm" no-fade> 
    <validation-observer ref="simpleRules">
      <b-form>
        <ShowComponent :data="item" :only="['term','offeringMarks','status']" >
        <template #edit>
            <div class="mb-2">
              <feather-icon v-b-tooltip.hover="$t('Global.close')" style="cursor: pointer" icon="XCircleIcon" class="font-medium-3" @click="cancel()" v-if="hasPermission('edit_offering')" />
            </div>
          </template>
        
          <template #term={data}>
          <th scope="row" :width="'20%'">
                  {{ $t(`Global.term`) }}
                </th>
                <td>
                <span v-if="$i18n.locale == 'ar'">
                  {{data.term.name_local?data.term.name_local:data.term.name}}
                  </span>
                  <span v-if="$i18n.locale == 'en'">
                  {{data.term.name?data.term.name:data.term.name_local}}
                  </span>
                </td>
          </template>
       
          <template #offeringMarks={data}>
              <th scope="row" :width="'20%'">
                  {{ $t(`Global.marks`) }}
                </th>
                <td>
                  <b-row>
                    <b-col md="10" class="mt-2">
                      <h5>
                        {{ $t("Global.mark_setup") }}
                        <b-badge variant="light-secondary"> 
                          ( {{ total_marks}} / {{form.max_total }} )
                        </b-badge>
                      </h5>
                      <hr />
                    </b-col>
                    <b-col md="2" lg="2">
                          <b-button
                                  v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                                  class="float-right mt-0 mt-md-2 m-1"
                                  variant="primary"
                                  @click="addNewMarkCategory"
                                  v-b-tooltip.hover="$t('Global.add')"
                                  size="sm"
                                >
                                  <feather-icon
                                    icon="PlusIcon"
                                    class="text-md-right"
                                  />
                          </b-button>
                      </b-col>
                  </b-row>
                          <b-col
                            md="12"
                            lg="12"
                            v-for="(input, k) in form.offeringMarksCategories"
                            :key="k" >
                          
                            <b-row  v-for="(mark, i) in input.marks"   :key="i">
                              
                                <b-col md="6" lg="6" >
                                  <b-form-group
                                    :label="$t('Global.mark_category')"
                                    label-for="mc-mark_category"
                                  >
                                    <validation-provider
                                      #default="{ errors }"
                                      name="mark_category"
                                      rules="required"
                                    >
                                      <v-select
                                        v-model="input.mark_category_id"
                                        class="w-100"
                                        :reduce="(val) => val.id"
                                        :label="getSelectLabel()"
                                        :options="mark_categories"
                                      />

                                      <small
                                        v-if="errors.length"
                                        class="text-danger"
                                        >{{ validation(null, 0).message }}</small
                                      >
                                    </validation-provider>
                                  </b-form-group>
                                </b-col>

                                <b-col lg="3" md="6">
                                      <b-form-group
                                        :label="$t('Global.mark_name')"
                                        label-for="mc-mark_name"
                                      >
                                        <validation-provider
                                          #default="{ errors }"
                                          name="mark_name"
                                          rules="english|required"
                                        >
                                          <b-form-input
                                            id="mc-markId"
                                            v-model="mark.name"
                                            :state="errors.length > 0 ? false : null"
                                            type="text"
                                          />
                                          <ValidationErrors
                                            :frontend-errors="errors"
                                            :backend-errors="
                                              getBackendFieldError(
                                                errorsdata,
                                                'mark_name'
                                              )
                                            "
                                          />
                                        </validation-provider>
                                      </b-form-group>
                                </b-col>

                                <b-col lg="2" md="6">
                                      <b-form-group
                                        :label="$t('Global.max')"
                                        label-for="mc-value"
                                      >
                                        <validation-provider
                                          #default="{ errors }"
                                          name="value"
                                          rules="integer|required|positive"
                                        >
                                          <b-form-input
                                            id="mc-value"
                                            v-model="mark.value"
                                            :state="errors.length > 0 ? false : null"
                                            type="text"
                                            @change="checkValue"
                                          />
                                          <ValidationErrors
                                            :frontend-errors="errors"
                                            :backend-errors="
                                              getBackendFieldError(
                                                errorsdata,
                                                'value'
                                              )
                                            "
                                          />
                                        </validation-provider>
                                      </b-form-group>
                                </b-col>

                                <b-col md="6" lg="1">
                                      <b-button
                                        v-ripple.400="'rgba(234, 84, 85, 0.15)'"
                                        variant="outline-danger"
                                        class="mt-0 mt-md-1"
                                        v-b-tooltip.hover="$t('Global.remove')"
                                        @click="removeCategory(k)"
                                        size="sm"
                                      >
                                        <feather-icon
                                          icon="XIcon"
                                          class="text-md-right"
                                        />
                                      </b-button>
                                </b-col>
                              </b-row>
                         

                          </b-col>   
                </td>
          </template>
          <template #status={data}>
                <th scope="row" :width="'20%'">
                  {{ $t(`Global.status`) }}
                </th>
                <td>
                  <span v-if="$i18n.locale == 'ar'">
                  {{data.status.name_local}}
                  </span>
                  <span v-if="$i18n.locale == 'en'">
                  {{data.status.name}}
                  </span>
                </td>
          </template>
        </ShowComponent>
        <b-row>
        <b-col>
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
   </b-overlay>
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
  BBadge,
  BOverlay,
  BFormTextarea,
} from "bootstrap-vue";
import vSelect from "vue-select";
import Ripple from "vue-ripple-directive";
import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import { required, email } from "@validations";
import EditComponent from "@/views/components/table/Edit";
import ValidationErrors from "@/views/components/common/ValidationErrors";
import { EventBus } from '@/main';
import ShowComponent from '@/views/components/info/show';

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
    EditComponent,
    vSelect,
    ValidationObserver,
    ValidationProvider,
    localize,
    BBadge,
    ValidationErrors,
    BOverlay,
    ShowComponent,
    BFormTextarea,
  },
  props: {
    inline: { default: false, Type: Boolean },
    params: {},
/*     offering_id: null,
 */  },
  directives: {
    Ripple,
  },
  computed: {
    ...mapGetters({
      item: "offerings/item",
      loadOfferings: "offerings/load",
      options: "app/lookups",
      offerings: "offerings/items",
    }),
  mark_categories(){
      if(this.lookups &&this.lookups.mark_categories){
        return this.lookups.mark_categories.filter(el=>el.name!='Extra')
      }
    },
    id() {
      return this.$route.params.id ? this.$route.params.id : null;
    },
    name() {
      return this.$t("Global.edit_course_offering");
    },
  },
  watch: {
  
    form: {
      handler(val) {
        const ob = this;
        let counter = 0;
        let count = 0; 
        val.offeringMarksCategories.forEach((item, index) => {
         // counter+=item.max_category
          if (item.marks.length > 0) {
            item.marks.forEach((mark) => {
              if (mark.value) {
                count += Number(mark.value);
              }
            });
          }
          item.sum = Number(count);
         
         // this.total_max_marks=Number(counter)
        });
         this.total_marks=Number(count)
      },
      deep: true,
    },
  },
  data() {
    return {
      editable: "true",
      students_count: 0,
      marks: [],
      total_marks: 0,// sum of entered marks
      //total_max_marks:0,
      form: {
        //linked_offering: [], // main offering
        //linked_exam_offering: [],
        marks: [],
        course_id: null,
        faculty_id: null,
        bylaw_id: null,
        term_id: null,
        max_total: null, // max total from offerings table
        offeringMarksCategories: [
          {
            pivot_id: null,
            mark_category_id: null,
            max_category: null,
            name: null,
            sum: 0,
            marks: [
              {
                name: null,
                value: null,
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
        //linked_offerings: true,
        mark_categories: true,
      },
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
      count: 0,
      course_name: null,
      course_code: null,
      course_name_local: null,
      offeringGradesHeaders: null,
      offeringStudentsGrades: null,
      errorsdata: {},
      //FilteredLinkedOffering: [],
      overlay: true,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapActions({
      getLookups: "app/GET_LOOKUPS",
      getItem: "offerings/get",
      submitItem: "offerings/put",
      getOfferings: "offerings/offerings",
      offering_mark: "offerings/offering_mark",
    }),
   /*  linkedOffering(offering_id, linked_offering) {
      let data = [];
      linked_offering.map((item) => {
        if ((item.id != offering_id) && (item.course)) {
            let name =  item.course.code + ' ' + item.course.name;
            let name_local = item.course.code + ' ' + item.course.name_local;
             let instance = {
               id: item.id,
               name: name,
               name_local: name_local,
           
            };
            data.push(instance);
         
        }
      });
      this.FilteredLinkedOffering = data;
    }, */
    
    checkValue() {
       if(this.form.offeringMarksCategories.length > 0)
          {
            let sum = 0
            let data = []
            var n =  this.form.offeringMarksCategories.length
            for(let i = 0; i <n;i++ )
            {
              let element= this.form.offeringMarksCategories[i]
              if(element.marks.length > 0)
              {
                element.marks.forEach((mark)=>{
                    sum+=Number(mark.value)
                })
              }
              
             
            }
            this.total_marks=Number(sum)
          }

      if (this.editable == "false") {
        this.$swal({
          icon: "error",
          title:
            this.$i18n.locale === "en"
              ? "You Can't Edit Mark"
              : "لا يمكنك تعديل الدرجة ",
          text:
            this.$i18n.locale === "en"
              ? "This Offering Has Students, Please Remove thier marks first"
              : "هذا المقرر به طلاب ، يرجى إزالة درجاتهم أولاً",
          showConfirmButton: false,
          timer: 3000,
        });
      }
    },
    addNewMarkCategory() {
      this.form.offeringMarksCategories.push({ 
            pivot_id: null,
            mark_category_id: this.lookups.mark_categories[0].id,
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
      })
    },
    removeCategory(k){
      this.form.offeringMarksCategories.splice(k,1)
     let count = 0
      this.form.offeringMarksCategories.forEach((item, index) => {
         // counter+=item.max_category
          if (item.marks.length > 0) {
            item.marks.forEach((mark) => {
              if (mark.value) {
                count += Number(mark.value);
              }
            });
          }
          item.sum = Number(count);
          
         // this.total_max_marks=Number(counter)
        });
        this.total_marks=Number(count)
    },
   
    fetchOfferings(search) {
      let query;
      if (search) {
        query = { keywords: search || "" };
      }
      this.$store.dispatch("offerings/offerings", { query });
    },
   
    init() {
      this.load = true;
      this.getOfferings({ query: "" });
      if (this.id) {
        this.offering_mark(this.id).then((data) => {
          this.offeringGradesHeaders = data.offeringGradesHeaders;
          this.offeringStudentsGrades = data.offeringStudentsGrades;
        
           if (data.offeringStudentsGrades != null) {
            this.offeringStudentsGrades.forEach((element) => {

              if (element.registration_marks.length > 0) {

                element.registration_marks.forEach((el) => {
                  if (el.pivot.value != null) {
                    //so there is grade you can't edit marks
                    this.editable = "false";
                  }
                });
              }
            });
          } 
        });

        this.getItem(this.id).then((value) => {
          this.lookupModules = {
            ...this.lookupModules,
            ...{ bylaw_id: this.item.course.bylaw_id },
          };
          this.overlay = false;
          this.getLookups(this.lookupModules).then((data) => {
            this.lookups = data.success;
            //this.linkedOffering(this.id, this.lookups.linked_offerings);
            if(value.data)
            {
              if(value.data.offeringMarks.length >0)
               {
                let sum = 0
                let data = []
                var n =  value.data.offeringMarks.length
                for(let i = 0; i <n;i++ )
                {
                  let element= value.data.offeringMarks[i]
                  let db = {}
                  sum+=element.max_mark
                  db.mark_category_id=element.pivot.mark_category_id
                  db.max_category=element.pivot.max_mark
                  db.name=element.name
                  db.name_local=element.name_local
                  db.marks=[{name:element.pivot.name,value:element.pivot.max_mark}]

                  data.push(db)

                }
                this.form.offeringMarksCategories = data
                //this.total_max_marks=sum
              }

            }
         
          });
          this.form.course_id = this.item.course.id;
          this.form.faculty_id = this.item.course.faculty.id;
          this.form.term_id = this.item.term.id;
          this.form.bylaw_id = this.item.course.bylaw.id;
          this.course_name = this.item.course.name;
          this.course_name_local = this.item.course.name_local;
          this.faculty_name = this.item.course.faculty.name;
          this.faculty_name_local = this.item.course.faculty.name_local;
          this.course_code = this.item.course.code;
          this.students_count = this.item.students_count;
          this.term_id = this.item.term.id;
          this.form.max_total = this.item.max_total;

       
          this.load = false;
         

        });
      }
      //to check if this offering's mark setup can be edited or not /////////////////////////////
      if (this.offeringStudentsGrades != null) {
        this.offeringStudentsGrades.forEach((element) => {

          if (element.registration_marks.length > 0) {

            element.registration_marks.forEach((el) => {
              if (el.pivot.value != null) {
                //so there is grade you can't edit marks
                this.editable = "false";
              }
            });
          }
        });
      }
      ////////////////////////////////////////////////////////

    },
    submit() {
      let offeringMarkInputs = [];
      let submit = false;
      if (this.total_marks > this.form.max_total) {
              submit = false;
              this.$swal({
                icon: "error",
                title:
                  this.$i18n.locale === "en"
                    ? "Wrong In Marks"
                    : "خطا في الدرجات",
                text:
                  this.$i18n.locale === "en"
                    ? "Total Marks Exceed Maximum Total"
                    : "مجموع الدرجات تخطي القيمة العظمي",
                showConfirmButton: false,
                timer: 3000,
              });
            } 
      else if (this.total_marks < this.form.max_total) {
              submit = false;
              this.$swal({
                icon: "error",
                title:
                  this.$i18n.locale === "en"
                    ? "Wrong In Marks"
                    : "خطا في الدرجات",
                text:
                  this.$i18n.locale === "en"
                    ? "Total Marks less than Maximum Total"
                    : "مجموع الدرجات اقل من القيمة العظمي",
                showConfirmButton: false,
                timer: 3000,
              });
            } 
      else {
              submit = true;
            }
      //////////////////////////
      if (this.editable == "true") {
        if (this.form.offeringMarksCategories) {
          this.form.offeringMarksCategories.forEach((mark) => {
            mark.marks.forEach((element) => {       
              const db = {};
              //db.offering_mark_category_id = mark.pivot_id;
              if(element.name == 'Extra') return;
              db.name = element.name;
              db.mark_category_id=mark.mark_category_id
              //db.short_name = element.short_name;
              db.max_mark = element.value;
              offeringMarkInputs.push(db);
         
            });
            
          });
        }

        if (submit == true) {
          this.$refs.simpleRules.validate().then((success) => {
            if (success) {
              let query = {};
              query = {
                course_id: this.form.course_id,
                term_id: this.term_id,
               /*  linkedOfferingsIds: this.form.linked_offering
                  ? this.form.linked_offering
                  : null, */
               /*  linked_exam_offering_id: this.form.linked_offering
                  ? this.form.linked_offering
                  : null, */
                offeringMarkInputs: JSON.stringify(offeringMarkInputs),
              };
              const payload = { id: this.id, query };
              this.submitItem(payload).then((response) => {
                if (response.status && (response.status === "success")) {
                  this.$swal({
                    icon: "success",
                    title:
                      this.$i18n.locale === "en"
                        ? "Offering Edited!"
                        : "تم تعديل المفرر ",
                    text:
                      this.$i18n.locale === "en"
                        ? "Offering Edited Successfully."
                        : "تم تعديل المقرر بنجاح",
                    showConfirmButton: true,
                    timer: 4000,
                  });
                  this.init();
                  this.cancel();
                  
                } else {
                }
              })
              .catch((error) => {
                let message = error.response.data.errors.length >0 ? error.response.data.errors[0].title : this.$t("Global.errorMessage")
                this.$swal({
                  icon: "error",
                  text: message,
                  showConfirmButton: true,
                  timer: 3000,
                });
              });
            } else {
            }
          });
        }
      } else if (submit == false && this.editable == "false") {
        this.$refs.simpleRules.validate().then((success) => {
          if (success) {
            let query = {};
            let offeringMarkInputs = [];
            query = {
              course_id: this.form.course_id,
              term_id: this.term_id,
             /*  linkedOfferingsIds: this.form.linked_offering
                ? this.form.linked_offering
                : null, */
              /* linked_exam_offering_id: this.form.linked_offering
                ? this.form.linked_offering
                : null, */
              offeringMarkInputs: JSON.stringify(offeringMarkInputs),
            };

            const payload = { id: this.id, query };
            this.submitItem(payload).then((response) => {
              if (response.status && (response.status === "success")) {
                this.$swal({
                  icon: "success",
                  title:
                    this.$i18n.locale === "en"
                      ? "Offering Edited!"
                      : "تم تعديل المفرر ",
                  text:
                    this.$i18n.locale === "en"
                      ? "Offering Edited Successfully."
                      : "تم تعديل المقرر بنجاح",
                  showConfirmButton: true,
                  timer: 4000,
                });
                this.init();
                this.cancel();
                /* this.$router.push({
                  name: "offering",
                  params: { id: this.id },
                }); */
              } else {
              }
            })
            .catch((error) => {
                let message = error.response.data.errors.length >0 ? error.response.data.errors[0].title : this.$t("Global.errorMessage")
                this.$swal({
                  icon: "error",
                  text: message,
                  showConfirmButton: true,
                  timer: 3000,
                });
              });
          } 
        })
      }
      /////////////////////////

    },
    changedBylawId(program_id) {
      // this.item.program_id = program_id
      this.lookupModules = { ...this.lookupModules, ...this.filter };
      this.getLookups(this.lookupModules).then((data) => {
        this.lookups = data.success;
        this.get_programs = data.success.programs;
        const ids = new Set(this.item.programs.map((d) => d.id));
        this.init_programs = [
          ...this.item.programs,
          ...this.lookups.programs.filter((d) => !ids.has(d.id)),
        ];
        // this.form.programs = this.get_programs
        this.get_programs.forEach((value) => {
          if (this.checkinlist(value, this.init_programs) === false) {
            this.form.programs.push(value);
          }
        });
      });
    },
    checkinlist(item, list) {
      let response = false;
      list.forEach((value) => {
        if (value.id === item.id) {
          response = true;
          return 0;
        }
      });
      return response;
    },
    getSelectLabel() {
      return this.$i18n.locale === "en" ? "name" : "name_local";
    },

    cancel() {
      this.init()
      this.$router.push({
        name: "offering",
        params: { id: this.$route.params.id },
      });
      this.updateFilterQueryParams({ tabNum: 1 });
      if (this.inline) {
        EventBus.$emit('changeIt', 'cancel');
        return this.$emit("hide");
      }
      //this.$router.push({ name: "offerings" });
    },
  },
};
</script>

<style scoped></style>
