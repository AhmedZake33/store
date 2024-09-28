<template>
  <div>
    <DataTable :total="total" :allow-search="true" :filter="filter" :loading="load" @reset="filter = {}" @Refresh="init"
      :params-loaded="paramsLoaded">
      <template #action>

        <template>
          <b-button v-b-tooltip.hover="$t('Global.add')" variant="primary" class="btn-icon" @click="add">
            <feather-icon icon="PlusIcon" />
          </b-button>
        </template>
      </template>
      <!-- <template #filter>
        <b-col cols="12" md="4">
          <v-select v-model="filter.mandatory" :filter="fuseSearch" :clearable="true"
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" :options="mandatoryOption"
            :label="$i18n.locale == 'en' ? 'name' : 'name_local'" class="w-100 mb-2" :reduce="val => val.id"
            :placeholder="$t('Global.mandatory')">
            <template v-slot:option="option">
              {{ option.name }}
            </template>
            <template #selected-option="{ name, name_local }">
              <div style="display: flex; align-items: baseline">
                <strong v-if="$i18n.locale == 'ar'">{{ name_local }}</strong>
                <strong v-else>{{ name }}</strong>
              </div>
            </template>
            <template #no-options>
              {{ $t('noMatching') }}
            </template>
          </v-select>
        </b-col>
      </template> -->
      <template #customTable>
        <div class="bg-gray p-0 mb-1" style=" padding-left: 0rem !important; padding-right: 0rem !important">

        </div>
        <b-table :items="items" responsive striped :fields="specs_fields" primary-key="id" show-empty
          :empty-text="$t('Global.empty_text')">
          <template #cell(actions)="data">
            <div>
              <feather-icon v-b-tooltip.hover="$t('Global.edit')" icon="EditIcon" style="cursor: pointer"
                @click="onEditClick(data.item)" />

              <feather-icon v-b-tooltip.hover="$t('Global.delete')" icon="Trash2Icon" style="cursor: pointer"
                class="text-danger mr-1" @click="trash(data.item.id)" />
            </div>

          </template>
        </b-table>
      </template>
    </DataTable>
    <b-modal ref="my-modal" no-close-on-backdrop v-model="specialization" :title="$t('Global.specialization')" size="lg">
      <validation-observer ref="simpleRules">
        <b-form :class="load ? 'disabled_all' : ''">
          <div class="row">
            <b-col md="6">
              <b-form-group :label="$t('Global.name')" label-for="name">
                <validation-provider #default="{ errors }" name="name" rules="required|english">
                  <b-form-input     @keypress="
                        sanitizeEnglish($event);
                        sanitizeNumber($event);
                      " id="name" type="text" v-model="specialization_form.name"
                    :state="errors.length > 0 ? false : null" />
                  <small class="text-danger" v-for="(error, index) in errors" :key="index">
                    {{
                      $i18n.locale == "ar"
                      ? `حقل ${$t("Global.name")} مطلوب`
                      : error
                    }}
                  </small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group :label="$t('Global.name_local_name')" label-for="name_local">
                <validation-provider #default="{ errors }" name="name_local" rules="required|arabic">
                  <b-form-input   @keypress="
                        sanitizeArabic($event);
                        sanitizeNumber($event);
                      " id="name_local" type="text" v-model="specialization_form.name_local"
                    :state="errors.length > 0 ? false : null" />
                  <small class="text-danger" v-for="(error, index) in errors" :key="index">
                    {{
                      $i18n.locale == "ar"
                      ? `حقل ${$t("Global.name_local_name")} مطلوب`
                      :  ` ${$t("Global.name_local_name")} is required`
                    }}
                  </small>
                </validation-provider>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group :label="$t('Global.department')" label-for="department-input"
                invalid-feedback="department is required">
                <validation-provider #default="{ errors }" name="department_id" rules="required">
                  <v-select :filter="fuseSearch" v-model="specialization_form.department_id" :reduce="(val) => val.id"
                    :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'" :options="departments" class="w-100 mb-2"
                    :label="getSelectLabel()" :placeholder="$t('Global.department')">
                    <template v-slot:option="option">
                      {{ option.name }}
                    </template>
                    <template #no-options>
                      {{ $t("noMatching") }}
                    </template>
                  </v-select>
                  <small class="text-danger" v-for="(error, index) in errors" :key="index">
                    {{ $i18n.locale == 'ar' ? 'حقل القسم مطلوب' : 'Department Field is Required' }}
                  </small>
                </validation-provider>
              </b-form-group>
            </b-col>

            <!-- <pre>{{ EmtiazTrainingType }} , {{ name }}</pre> -->

          </div>
        </b-form>
      </validation-observer>
      <template #modal-footer>
        <b-row :class="load ? 'disabled_all' : ''">
          <b-col md="12">
            <b-button type="submit" variant="primary" class="mr-1" @click="submitspecialization()">
              {{ $t("Global.save") }}
            </b-button>
            <b-button type="reset" variant="outline-secondary" @click="cancelspecialization">
              {{ $t("Global.cancel") }}
            </b-button>
          </b-col>

        </b-row>
      </template>
    </b-modal>
  </div>
</template>


<script>
import TabTable from '@/views/students/student/components/TabTable';
import ValidationErrors from "@/views/components/common/ValidationErrors";
import axios from 'axios';
import request from '../../../../utils/request';

import DataTable from '@/views/components/table/DataTable';
import { ValidationProvider, ValidationObserver, localize } from 'vee-validate';
import vSelect from "vue-select";
import { mapActions, mapGetters } from 'vuex';
import { required } from "@validations";

import {
  BTab,
  BTabs,
  BCard,
  BLink,
  BCol,
  BRow,
  BAvatar,
  BModal,
  BForm,
  BFormInput,
  BFormGroup,
  BDropdown,
  BDropdownItem,
  BFormCheckbox,
  BTable,
  BTr,
  BTh
} from 'bootstrap-vue';
export default {

  components: {
    ValidationProvider,
    ValidationObserver,
    vSelect,
    BTab,
    BTabs,
    BCard,
    BLink,
    BCol,
    BRow,
    BAvatar,
    BModal,
    BForm,
    BFormInput,
    BFormGroup,
    BDropdown,
    BDropdownItem,
    BFormCheckbox,
    BTable,
    BTr,
    BTh,
    TabTable,
    DataTable
  },
  data() {
    return {
      paramsLoaded: true,
      checked: false,
      selectedDepartment: null,
      departments: [],
      specialization_id: null,
      specializationedit: {
        id: null,
        name: null,
        name_local: null,
        department_id: null,
      },
      specialization: false,
      specialization_form: {
        name: null,
        name_local: null,
        department_id: null,

      },
      mandatoryOption: [{ id: 0, name: 'No', name_local: 'لا' }, { id: 1, name: 'Yes', name_local: 'نعم' }],
      filter: {
        mandatory: null,
        bylaw_id: this.$route.params.id,
        order_direction: "DESC",
      },
    }
  },
  props: {
    faculty_id: {
      type: Number, // Adjust the type based on your actual data type
      default: null,
    },
  },
  methods: {

    add() {


      this.specialization_id = null,

        this.specialization_form = {
          // id: null,
          name: null,
          name_local: null,
          department_id: null,
          // specialization_id: null,
        };

      this.checked = false;
      this.specialization = true;
    },
    fetchData() {

      return request({
        url: 'departments',
        method: 'post',
        data: {
          bylaw_id: this.$route.params.id,
        },
      })
        .then(response => {
          this.departments = response.data;

        })
        .catch(error => {
          console.error(error);
        });
    },
    ...mapActions({
      getLookups: "app/GET_LOOKUPS",

      fetchDepartments: 'app/GET_INDEX_LOOKUPS',
    }),
    cancelspecialization() {
      this.specialization = {
        // id: null,
        name: null,
        name_local: null,
        specialization_id: null,
        // department_id: null,
      };
      this.checked = false;
      this.specialization = false;
    },
    onEditClick(data) {

      this.specialization_id = data.id;
      this.specialization_form.name = data.name;
      this.specialization_form.name_local = data.name_local;
      this.specialization_form.department_id = data.department_id;
      this.specialization = true;
    },


    submitspecialization() {
    // Check if the form is already being submitted
    if (this.loading) {
      return;
    }

    this.loading = true; // Set loading to true to disable the button

    this.$refs.simpleRules.validate().then((success) => {
      if (success) {
        const payload = this.specialization_form;
        this.$store.dispatch('bylaws/addSpecialization', { id: this.specialization_id, payload: payload })
          .then((response) => {
            this.$swal({
              icon: "success",
              title: `${this.$t("Global.saved")}`,
              showConfirmButton: false,
              timer: 1500,
            });
            this.specialization = false;
            this.init({ bylaw_id: this.$route.params.id ? this.$route.params.id : null, otherParams: 'value' });
          })
          .catch((error) => {
            this.$swal({
              icon: "error",
              text: this.$t("Global.errorMessage"),
              showConfirmButton: false,
              timer: 3000,
            });
          })
          .finally(() => {
            this.loading = false; // Reset loading after the request is complete
          });
      } else {
        this.loading = false; // Reset loading if validation fails
      }
    });
  },
    trash(id) {


      this.$swal({
        title: `${this.$t('Global.deleteTitle')}`,
        text: `${this.$t('Global.deleteText')}`,
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: `${this.$t('Global.cancel')}`,
        confirmButtonText: `${this.$t('Global.deleteBtn')}`,
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-outline-danger ml-1',
        },
        buttonsStyling: false,
      }).then(result => {
        if (result.value) {
          this.$store.dispatch('bylaws/delete_specialization', id).then(_ => {
            this.init({ bylaw_id: this.$route.params.id ? this.$route.params.id : null, otherParams: 'value' });
            this.$swal({
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
              title: this.$t('Global.deleted'),
            });
          });
        }
      });
    },
    init(query) {
      if (query && Object.keys(query).length > 0) {
        query.bylaw_id =  this.$route.params.id
        this.$store.dispatch('bylaws/specialization', { query: query })
          .then((res) => {
            this.paramsLoaded = false;
          })
          .catch(() => { });
      }
    },


    openEdit(id, bylaw) {
      // :to="{ name: 'emtyaz_course_add'}"
      this.$router.push({
        name: "emtyaz_course_show",
        params: { id: id, bylaw: Number(bylaw) }
      });
    }
  },
  mounted() {
    this.init({ bylaw_id: this.$route.params.id ? this.$route.params.id : null, otherParams: 'value' });
    this.fetchData();
  },
  computed: {
    ...mapGetters({
      items: "bylaws/items",
      total: "bylaws/total",
      load: "bylaws/load",
    }),
    specs_fields() {
      return [

        {
          key: 'name',
          label: this.$t('Global.name'),
        },
        {
          key: 'name_local',
          // label: 'name_local',
          label: this.$t('Global.name_local_name'),
        },
        {
          key: this.$i18n.locale === 'ar' ? 'department.name_local' : 'department.name',
           label: 'period',
         label: this.$t('Global.department'),

        },
        // {
        //   key: 'department.name_local',
        //    label: 'period',
        //  label: this.$t('Global.department'),

        // },
        {
          key: 'actions',
          label: this.$t('Global.actions'),
          thClass: 'customAction',
          tdClass: 'customWidth',
        },
      ];
    },
    fields() {
      let field = [
        {
          key: 'name',
          label: this.$t('Global.name'),
          thStyle: { width: '30%' },
        },
        {
          key: 'id',
          label: 'id',
        },
        {
          key: 'name_local',
          label: 'name_local',
        },
        {
          key: 'department',
          label: 'department',
        },
        {
          key: 'type',
          label: 'type',
        },
      ];
      return field;
    },
  }
}
</script>