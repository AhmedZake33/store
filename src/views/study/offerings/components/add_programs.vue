<template>
  <div>
    <edit-component :name="title" :add="params && params.status == 1">
      <template #inputs>
        <validation-observer ref="simpleRules">
          <b-form ref="form" @submit.stop.prevent="save">
            <b-row>
              <b-col md="12">
                <b-row v-for="(input, k) in form.programs" :key="k">
                  <b-col md="6">
                    <b-form-group :label="$t('Global.program')" label-for="mc-course">
                      <validation-provider #default="{ errors }" name="program_id" rules="required">
                        <v-select :class="errors.length > 0 ? 'custom_invalid' : ''"  v-model="input.program_id" :filter="fuseSearch" :options="options.programs" class="w-100" :reduce="val => val.id" :label="getSelectLabel()" />
                        <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                      </validation-provider>
                    </b-form-group>
                  </b-col>

                  <b-col md="5">
                    <b-form-group :label="$t('Global.semester')" label-for="mc-course">
                      <validation-provider #default="{ errors }" name="semester" rules="required">
                        <v-select :class="errors.length > 0 ? 'custom_invalid' : ''" v-model="input.semester" :options="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]" class="w-100" :reduce="val => val" />
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
              <b-col md="12">
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
    }),
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
        programs: true,
      };
      return data;
    },
  },
  props: {
    inline: { default: false, Type: Boolean },
    params: {},
  },
  data() {
    return {
      form: {
        programs: [
          {
            course_id: Number(this.$route.params.id),
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
      saveData: 'courses/sync',
    }),
    addNewLevel() {
      this.form.programs.push({
        course_id: Number(this.$route.params.id),
      });
    },
    remove(index) {
      this.form.programs.splice(index, 1);
    },
    init() {
      let query = { programs: true, bylaw_id: this.params.bylaw_id };
      this.lookups(query);
      if ((this.id && !this.params) || (this.params && this.params.status == 2)) {
        this.getItem(this.id);
      }
    },
    save() {
      this.$refs.simpleRules.validate().then(success => {
        if (success) {
          const payload = {
            id: this.id,
            query: this.form,
          };
          this.saveData(payload)
            .then(response => {
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
