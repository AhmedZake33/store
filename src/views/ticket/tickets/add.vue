<template>
  <div>
    <edit-component :name="$t('New Correction Request')">
      <template #inputs>
        <validation-observer ref="fromRules">
          <b-form
            ref="formRequest"
            @submit.stop.prevent="save"
          >
            <b-row>
              <b-col
                v-for="(input, k) in formRequest.corrections"
                :key="k"
                md="12"
              >
                <b-row>
                  <b-col md="12">
                    <b-row>
                      <b-col md="11">
                        <b-row>
                          <b-col cols="12" md="6">
                            <b-form-group
                                :label="$t('Global.student')"
                                label-for="code-input"
                            >
                              <validation-provider
                                  #default="{ errors }"
                                  name="student input"
                                  rules="required"
                              >
                                <v-select
                                    v-model="input.student_id"
                                    :dir="$i18n.locale=='en' ? 'ltr' : 'rtl'"
                                    @search="fetchOptions"
                                    :options="studentData"
                                    :filterable="false"
                                    :reduce="(val) => val.id"
                                    :label="$i18n.locale=='en'?'name':'name_local'"
                                >
                                  <template slot="no-options">
                                    {{noOptionMsg}}
                                  </template>
                                  <template slot="option" slot-scope="option">
                                    <div class="d-center">
                                      {{ $i18n.locale == 'en' ? (option.name ? option.name
                                        :option.name_local) : (option.name_local ? option.name_local :
                                        option.name )}}
                                    </div>
                                  </template>
                                </v-select>
                                <ValidationErrors :frontend-errors="errors"
                                                  :backend-errors="getBackendFieldError(errorsdata,'student_id')"/>
                              </validation-provider>
                            </b-form-group>
                          </b-col>
                          <b-col md="6">
                            <b-form-group
                              v-if="options"
                              :label="$t('Correction Type')"
                              label-for="type-input"
                            >
                              <validation-provider
                                #default="{ errors }"
                                :name=" 'Correction Type (' + (k+1) + ')'"
                                rules="required"
                              >
                                <v-select
                                  v-model="input.type"
                                  :label="$i18n.locale == 'en' ? 'name':'name_local'"
                                  :dir="$store.state.appConfig.layout.isRTL? 'rtl': 'ltr'"
                                  :options="correctionTypes"
                                  :clearable="false"
                                  input-id="type-input"
                                  :reduce="(val) => val.id"
                                  @input="(prop) => correctionTypeUpdated(input, prop, k)"
                                >
                                  <template v-slot:option="option">
                                    {{ getTranslatedName(option) }}
                                  </template>
                                  <template #selected-option="{ name, name_local }">
                                    <div style="display: flex;align-items: baseline;">
                                      <strong>{{ getTranslatedName({name:name, name_local:name_local}) }}</strong>
                                    </div>
                                  </template>
                                  <template #no-options>
                                    {{ $t("noMatching") }}
                                  </template>
                                </v-select>
                                <ValidationErrors :frontend-errors="validationErrorMessage(errors)" />
                              </validation-provider>
                            </b-form-group>
                          </b-col>
                          <b-col md="6">
                            <b-form-group
                              v-if="options"
                              :label="$t('Correction Field')"
                              label-for="field-input"
                            >
                              <validation-provider
                                #default="{ errors }"
                                :name=" 'Correction Field (' + (k+1) + ')'"
                                rules="required"
                              >
                                <v-select
                                  v-if="correctionTypeChanged"
                                  :disabled="!input.type"
                                  v-model="input.field"
                                  :label="$i18n.locale == 'en' ? 'name':'name_local'"
                                  :dir="$store.state.appConfig.layout.isRTL? 'rtl': 'ltr'"
                                  :options="correctionTypeFields[input.type]"
                                  :clearable="false"
                                  input-id="field-input"
                                  :reduce="(val) => val.id"
                                >
                                  <template v-slot:option="option">
                                    {{ getTranslatedName(option) }}
                                  </template>
                                  <template #selected-option="{ name, name_local }">
                                    <div style="display: flex;align-items: baseline;">
                                      <strong>{{ getTranslatedName({name:name, name_local:name_local}) }}</strong>
                                    </div>
                                  </template>
                                  <template #no-options>
                                    {{ $t("noMatching") }}
                                  </template>
                                </v-select>
                                <ValidationErrors :frontend-errors="validationErrorMessage(errors)" />
                              </validation-provider>
                            </b-form-group>
                          </b-col>
                          <b-col md="6">
                            <b-form-group
                              v-if="options"
                              :label="$t('Correction File')"
                              label-for="file-input"
                            >
                              <validation-provider
                                #default="{ errors }"
                                :name="$t('Correction File')"
                                rules="fileValidate"
                              >
                                <b-form-file
                                    v-model="input.file"
                                    accept=".jpg, .png, .gif, .pdf"
                                    ref="attachmentFile"
                                />
                                <ValidationErrors :frontend-errors="errors" />
                              </validation-provider>
                            </b-form-group>
                          </b-col>
                          <b-col md="6">
                            <b-form-group
                                :label="$t('Correction Description')"
                                label-for="desc-input"
                            >
                              <validation-provider
                                  #default="{ errors }"
                                  :name="$t('Correction Description')"
                                  rules="required"
                              >
                                <b-form-textarea v-model="input.description" />
                                <ValidationErrors :frontend-errors="errors" />
                              </validation-provider>
                            </b-form-group>
                          </b-col>
                        </b-row>
                      </b-col>
                      <b-col md="1">
                        <b-button
                          v-if="k !=0"
                          v-ripple.400="'rgba(234, 84, 85, 0.15)'"
                          variant="outline-danger"
                          class="mt-0 mt-md-2 float-right"
                          @click="remove(k)"
                        >
                          <feather-icon icon="XIcon" />
                        </b-button>
                      </b-col>
                    </b-row>
                  </b-col>
                </b-row>
              </b-col>
              <!-- submit and reset -->
              <b-col md="12">
                <b-button
                  v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                  type="submit"
                  variant="primary"
                  class="mr-1"
                >
                  {{ $t("Global.send") }}
                </b-button>
                <b-button
                  v-ripple.400="'rgba(186, 191, 199, 0.15)'"
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
import { mapGetters, mapActions } from 'vuex'
import {
  BRow,
  BCol,
  BFormGroup,
  BForm,
  BButton,
  BFormFile,
  BFormTextarea,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { required } from "@validations";
import Ripple from 'vue-ripple-directive'
import ValidationErrors from '@/views/components/common/ValidationErrors'
import EditComponent from '@/views/components/table/Edit'

import CorrectionRequest from '@/api/student/correciton_requests/correction_request'

const correctionRequest = new CorrectionRequest()

export default {
  title: 'new_correction_request',
  components: {
    EditComponent,
    BCol,
    BRow,
    BFormGroup,
    BForm,
    BButton,
    vSelect,
    ValidationErrors,
    ValidationProvider,
    ValidationObserver,
    BFormFile,
    BFormTextarea,
  },
  directives: {
    Ripple,
  },
  computed: {
    ...mapGetters({
      options: 'app/lookups',
    }),
    studentData: function () {
      return this.studentsOptions;

    },
    noOptionMsg:function (){
      let msg='';
      if(this.hasValue == null || this.hasValue.length < 1){
        this.$i18n.locale == 'en' ? msg = 'Type Student Code or Name to search' : msg = 'أكتب كود الطالب او اسمه للبحث'
      }else{
        this.$i18n.locale == 'en' ? msg = 'No Match Option' : msg = 'لا يوجد نتائج للبحث'
      }
      return msg
    }
  },
  data() {
    return {
      formRequest: {
        corrections: [
          {
            type: null,
            field: null,
            description: null,
            file: null,
          },
        ],
      },
      query: {
        correctionRequestTypes: true,
      },
      load: false,
      correctionTypes: [],
      correctionTypeFields: [],
      correctionTypeChanged: true,
      studentsOptions: [],
      errorsdata:{},
      hasValue:null
    }
  },
  methods: {
    ...mapActions({
        lookups: 'app/GET_LOOKUPS',
        studentslookup: 'students/lookup',
        checkBankMisrPaymentStatus: 'certificates/checkBankMisrPaymentStatus'
    }),

    init() {
      this.lookups(this.query).then(res=>{
        this.correctionTypes = res.success.correction_types;
      })
    },
    cancel() {
      this.$router.go(-1)
    },
    save() {
      this.$refs.fromRules.validate().then(success => {
        if (success) {
          // to send form data with image
          const sendArrayFormData = new Promise((resolve, reject) => {
            this.formRequest.corrections.forEach((correction,index)=>{
              let formData = new FormData();
              formData.append('field_id', correction.field);
              formData.append('student_id', correction.student_id);
              formData.append('description', correction.description);
              if (this.$refs.attachmentFile[index].files.length == 1) {
                formData.append('file', this.$refs.attachmentFile[index].files[0]);
              }

              this.load = true
              correctionRequest.add(formData).then(response => {
                this.successToast(`Send Request ${index+1}`);
                this.load = false
              }).catch(error => {
                this.load = false
              })

              // to send resolve
              if(index === this.formRequest.corrections.length-1) resolve();
            });
          });
          sendArrayFormData.then(()=>{
            this.$swal({
              icon: 'success',
              title: `${this.$t('Global.saved')}`,
              showConfirmButton: false,
              timer: 1500,
            })
            this.$router.go(-1)
          })
        }
      })
    },
    addNewCard() {
      this.formRequest.corrections.push({
        type: null,
        field: null,
        description: null,
        file: null,
      })
    },
    remove(index) {
      this.formRequest.corrections.splice(index, 1)
    },
    validationErrorMessage(errors){
      if (errors.length){
        errors[0] = errors[0].replace(/\(.*?\)/gi, "");
      }
      return errors;
    },
    correctionTypeUpdated(data, typeId, index){
      // to reset depend fields
      this.formRequest.corrections[index].field = null;

      // to check if this type cached in array or not
      if (this.correctionTypeFields[typeId]) return;

      // query to get correction type other fields
      const query = {
        correctionRequestTypeId: typeId,
        correctionRequestFields: true,
      };
      this.correctionTypeChanged = false;
      this.lookups(query).then(res=>{
        this.correctionTypeFields[typeId] = res.success.correction_fields;
        this.correctionTypeChanged = true;
      }).catch(err=>{
        this.correctionTypeChanged = true;
      });
    },
    fetchOptions(search, loading) {
      //  ... do some asynchronous stuff!

      let query = {
        studentQuery: search,
      }
      if (search.length > 1) {
        this.hasValue = search
            loading(true)
        this.studentslookup(query).then((res) => {
          this.studentsOptions = res.success.students
          loading(false)
        }).catch((err) => {
          loading(false)
        })
      }
    },
  },
  mounted() {
    this.init()
  },
  watch:{
    'input.file'(val){
    }
  }
}
</script>
