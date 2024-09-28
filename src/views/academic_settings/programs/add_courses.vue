<template>
  <div>
    <edit-component :name="title" :add="params && params.status == 1">
      <template #inputs>
        <validation-observer ref="simpleRules">
          <b-form ref="form" @submit.stop.prevent="save">
            <b-row :class="updateLoad ? 'disabled_all' : ''">
              <b-col md="12">
                <b-row v-for="(input, k) in form.courses" :key="k">
                  <b-col md="6">
                    <b-form-group :label="$t('Global.course')" label-for="mc-course">
                      <validation-provider #default="{ errors }" name="course_id" rules="required">
                        <v-select  :class="errors.length > 0 ? 'custom_invalid' : ''" v-model="input.course_id" :filter="fuseSearch" :options="filterCourses ? filterCourses.filter(el => hid_courses.indexOf(el.id) < 0) : []" class="w-100">
                          <template #no-options>
                            {{ $t('noMatching') }}
                          </template>
                          <template v-slot:option="option">
                            {{ $i18n.locale == 'ar' ? option.code + ':' + option.name_local : option.code + ':' + option.name }}
                          </template>
                          <template #selected-option="{ name, name_local, code }">
                            <div style="display: flex; align-items: baseline">
                              <strong v-if="$i18n.locale == 'ar'">{{ code + ':' + name_local || code + ':' + name }}</strong>
                              <strong v-else>{{ code + ':' + name || code + ':' + name_local }}</strong>
                            </div>
                          </template>
                        </v-select>
                        <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                      </validation-provider>
                    </b-form-group>
                  </b-col>
                  <b-col md="5">
                    <b-form-group :label="$t('Global.semester')" label-for="mc-course">
                      <validation-provider #default="{ errors }" name="semester" rules="required">
                        <v-select :class="errors.length > 0 ? 'custom_invalid' : ''" v-model="input.semester" :options="semesters" class="w-100" :reduce="val => val">
                          <template #no-options>
                            {{ $t('noMatching') }}
                          </template>
                        </v-select>
                        <small v-if="errors.length" class="text-danger"> {{ validation(null, 0).message }}</small>
                      </validation-provider>
                    </b-form-group>
                  </b-col>
                  <b-col lg="1" md="1" class="mb-50">
                    <b-button v-ripple.400="'rgba(234, 84, 85, 0.15)'" variant="outline-danger" class="mt-0 mt-md-2 float-right" @click="remove(k)">
                      <feather-icon icon="XIcon" />
                    </b-button>
                  </b-col>
                </b-row>
              </b-col>
              <b-col md="12">
                <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" class="float-right mt-0 mt-md-2" variant="primary" @click="addNewLevel">
                  <feather-icon icon="PlusIcon" class="text-md-right" />
                </b-button>
              </b-col>

              <b-col cols="12">
                <hr />
              </b-col>
              <!-- submit and reset -->
              <b-col md="12" :class="loading ? 'disabled_all' : ''">
                <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" type="submit" variant="primary" class="mr-1">
                  {{ $t('Global.save') }}
                </b-button>
                <b-button v-ripple.400="'rgba(186, 191, 199, 0.15)'" type="reset" variant="outline-secondary" @click="cancel">
                  {{ $t('Global.cancel') }}
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
import { mapActions, mapGetters } from 'vuex';
import { BButton, BCard, BCardGroup, BCardText, BCol, BForm, BFormCheckbox, BFormGroup, BFormInput, BListGroup, BListGroupItem, BRow, BFormTextarea } from 'bootstrap-vue';
import vSelect from 'vue-select';
import Ripple from 'vue-ripple-directive';
import draggable from 'vuedraggable';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
import { ValidationProvider, ValidationObserver, localize } from 'vee-validate';
import EditComponent from '@/views/components/table/Edit';

export default {
  title: 'Edit',
  components: {
    BCard,
    BCol,
    BCardText,
    BFormTextarea,
    BCardGroup,
    BListGroup,
    BListGroupItem,
    BRow,
    draggable,
    BFormGroup,
    BFormInput,
    BFormCheckbox,
    BForm,
    BButton,
    EditComponent,
    vSelect,
    ToastificationContent,
    ValidationProvider,
    ValidationObserver,
    localize,
  },
  directives: {
    Ripple,
  },
  computed: {
    ...mapGetters({
      item: 'programs/item',
      load: 'programs/load',
      options: 'students/lookups',
      updateLoad: 'app/load',
    }),
    filterCourses() {
      if (this.options && this.options.courses) {
        return this.options.courses.filter(course => {
          return this.form.courses.every(f => {
            return f.course_id?.id != course.id;
          });
        });
      }
    },
    // filterSemesters() {
    //   if (this.semesters) {
    //     return this.semesters.filter(semester => {
    //       return this.form.courses.every(f => {
    //         return f.semester != semester;
    //       });
    //     });
    //   }
    // },
    id() {
      if (this.params && this.params.id) return this.params.id;
      return this.$route.params.id ? this.$route.params.id : null;
    },
    title() {
      return this.$t('Global.program_course_add');
    },
    query() {
      const data = {
        bylaw_id: this.form.bylaw_id,
        courses: true,
      };
      return data;
    },
  },
  props: {
    inline: { default: false, Type: Boolean },
    params: {},
    hid_courses:[]
  },
  data() {
    return {
      loading:false,
      semesters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      form: {
        courses: [
          {
            course_id: null,
            level_id: null,
            semester: null,
          },
        ],
      },
      errorsdata: {},
    };
  },
  mounted() {
    this.init();
  },

  methods: {
    ...mapActions({
      getItem: 'programs/get',
      lookups: 'students/lookup',
      saveData: 'programs/sync',
    }),
    addNewLevel() {
      this.form.courses.push({
        course_id: null,
        level_id: null,
      });
    },
    remove(index) {
      this.form.courses.splice(index, 1);
    },
    init() {
      let query = { program_courses: true, levels: true, bylaw_id: this.item.bylaw_id };
      this.lookups(query);
      if ((this.id && !this.params) || (this.params && this.params.status == 2)) {
        this.getItem(this.id);
      }
    },

    save() {
      this.$refs.simpleRules.validate().then(success => {
        if (success) {
          let idsForm = {};
          idsForm.courses = [];
          this.form.courses.forEach((element, i) => {
            if (element.course_id) {
              idsForm.courses.push({
                course_id: element.course_id.id,
                level_id: null,
                semester: element.semester,
              });
            }
          });

          if (this.params && this.params.bylaw_id) {
            idsForm.bylaw_id = this.params.bylaw_id;
          }
          if (this.params && this.params.faculty_id) {
            idsForm.faculty_id = this.params.faculty_id;
          }
          const payload = {
            id: this.params && this.params.status == 1 ? null : this.id,
            query: idsForm,
          };
          this.loading = true
          this.saveData(payload)
            .then(response => {
              this.loading = false,
              this.$swal({
                icon: 'success',
                title: `${this.$t('Global.saved')}`,
                showConfirmButton: false,
                timer: 1500,
              });
              if (this.inline) {
                this.$emit('refresh');
                return this.$emit('hide');
              }
              this.$router.push({ name: 'programs' });
            })
            .catch(error => {
              const errors = [error.response.data.errors];
              errors.forEach((error, index) => {
                const error_data = Object.values(error)[index][0];
                this.errorsdata = error;
              });
            });
        }
      });
    },
    cancel() {
      if (this.inline) {
        return this.$emit('hide');
      }
      this.$router.push({ name: 'programs' });
    },
  },
};
</script>

<style scoped></style>
