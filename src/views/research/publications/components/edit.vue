<template>
  <b-row class="new_edit" :class="load_data ? 'disabled_all' : ''" v-if="languages.length && types.length">
    <b-col cols="12">
      <validation-observer ref="simpleForm">
        <b-form v-if="form" ref="form" @submit.stop.prevent="save">
          <b-tabs v-model="tabNumber" @input="saveStatus" vertical nav-wrapper-class="nav-hidden" align="left">
            <b-tab>
              <template id="publication_info" #title>
                <feather-icon :class="publicationsInfoClass" icon="BookOpenIcon"/>
                <span :class="publicationsInfoClass">{{ $t('Publication Information') }}</span>
              </template>
              <ShowComponent :data="form" :loading="load"
                             :only="['title', 'type_of_source', 'journal_name', 'language', 'year', 'info', 'eid', 'doi']">
                <template #edit>
                  <div class="mb-2">
                    <feather-icon v-b-tooltip.hover="$t('Global.close')" style="cursor: pointer" icon="XCircleIcon"
                                  class="font-medium-3" @click="cancel()"/>
                  </div>
                </template>
                <template #title="{ data }">
                  <th scope="row" :width="'20%'">
                    {{ $t(`Title`) }}
                  </th>
                  <td>
                    <b-form-group label-for="title-input">
                      <validation-provider
                          #default="{ errors }"
                          name="title"
                          rules="required"
                      >
                        <b-form-input v-model="form.title"/>
                        <ValidationErrors :frontend-errors="validationErrorMessage(errors)"/>
                      </validation-provider>
                    </b-form-group>
                  </td>
                </template>
                <template #type_of_source>
                  <th scope="row" :width="'20%'">
                    {{ $t('Type of source') }}
                  </th>
                  <td>
                    <validation-provider
                        #default="{ errors }"
                        name="type_of_source"
                        rules="required"
                    >
                      <b-form-group
                          label-for="type-input"
                      >
                        <v-select
                            v-model="form.type_of_source"
                            :dir="$store.state.appConfig.layout.isRTL? 'rtl': 'ltr'"
                            :options="types"
                            :get-option-label="option => $t(option.name)"
                            input-id="type-input"
                            :reduce="(val) => val.id"
                        >
                          <template #no-options>
                            {{ $t("noMatching") }}
                          </template>
                        </v-select>
                        <ValidationErrors :frontend-errors="validationErrorMessage(errors)"/>
                      </b-form-group>
                    </validation-provider>
                  </td>
                </template>
                <template #journal_name="{ data }">
                  <th scope="row" :width="'20%'">
                    {{ $t(`Source name`) }}
                  </th>
                  <td>
                    <b-form-group
                        label-for="source-input"
                    >
                      <validation-provider
                          #default="{ errors }"
                          name="type_of_source_name"
                          rules="required"
                      >
                        <b-form-input v-model="form.journal_name"/>
                        <ValidationErrors :frontend-errors="validationErrorMessage(errors)"/>
                      </validation-provider>
                    </b-form-group>
                  </td>
                </template>
                <template #language>
                  <th scope="row" :width="'20%'">
                    {{ $t('Language') }}
                  </th>
                  <td>
                    <validation-provider
                        #default="{ errors }"
                        name="language"
                        rules="required"
                    >
                      <b-form-group
                          label-for="type-input"
                      >
                        <v-select
                            v-model="form.language"
                            :dir="$store.state.appConfig.layout.isRTL? 'rtl': 'ltr'"
                            :options="languages"
                            :get-option-label="option => $t(option.name)"
                            input-id="type-input"
                            :reduce="(val) => val.id"
                        >
                          <template #no-options>
                            {{ $t("noMatching") }}
                          </template>
                        </v-select>
                        <ValidationErrors :frontend-errors="validationErrorMessage(errors)"/>
                      </b-form-group>
                    </validation-provider>
                  </td>
                </template>
                <template #year="{ data }">
                  <th scope="row" :width="'20%'">
                    {{ $t(`Year`) }}
                  </th>
                  <td>
                    <b-form-group
                        label-for="year-input"
                    >
                      <validation-provider
                          #default="{ errors }"
                          name="year"
                          rules="required|number"
                      >
                        <b-form-input v-model="form.year"/>
                        <ValidationErrors :frontend-errors="validationErrorMessage(errors)"/>
                      </validation-provider>
                    </b-form-group>
                  </td>
                </template>
                <template #info="{ data }">
                  <th scope="row" :width="'20%'">
                    {{ $t(`Info`) }}
                  </th>
                  <td>
                    <b-form-group
                        label-for="info-input"
                    >
                      <validation-provider
                          #default="{ errors }"
                          name="info"
                      >
                        <b-form-input v-model="form.info"/>
                        <ValidationErrors :frontend-errors="validationErrorMessage(errors)"/>
                      </validation-provider>
                    </b-form-group>
                  </td>
                </template>
                <template #eid="{ data }">
                  <th scope="row" :width="'20%'">
                    EID
                  </th>
                  <td>
                    <b-form-group
                        label-for="eid-input"
                    >
                      <validation-provider
                          #default="{ errors }"
                          name="eid"
                      >
                        <b-form-input v-model="form.eid"/>
                        <ValidationErrors :frontend-errors="validationErrorMessage(errors)"/>
                      </validation-provider>
                    </b-form-group>
                  </td>
                </template>
                <template #doi="{ data }">
                  <th scope="row" :width="'20%'">
                    DOI
                  </th>
                  <td>
                    <b-form-group
                        label-for="doi-input"
                    >
                      <validation-provider
                          #default="{ errors }"
                          name="doi"
                      >
                        <b-form-input v-model="form.doi"/>
                        <ValidationErrors :frontend-errors="validationErrorMessage(errors)"/>
                      </validation-provider>
                    </b-form-group>
                  </td>
                </template>
              </ShowComponent>
              <b-row>
                <b-col md="12">
                  <b-button @click="save" variant="primary" class="mr-1">
                    {{ $t('Global.save') }}
                  </b-button>
                  <b-button type="reset" variant="outline-secondary" @click="cancel()">
                    {{ $t('Global.cancel') }}
                  </b-button>
                </b-col>
              </b-row>
            </b-tab>
            <b-tab v-if="form.id">
              <template #title>
                <feather-icon :class="authorsClass" icon="UsersIcon"/>
                <span :class="authorsClass">{{ $t('Authors') }}</span>
              </template>
              <div class="text-center text-black my-2" v-if="load">
                <b-spinner class="align-middle"></b-spinner>
              </div>
              <div v-else>
                <Members/>
              </div>
            </b-tab>
            <b-tab v-if="form.id">
              <template id="attachment_file" #title>
                <feather-icon :class="fileClass" icon="FileIcon"/>
                <span :class="fileClass">{{ $t('Attachment File') }}</span>
              </template>
              <ShowComponent :data="form" :loading="load" :only="['file']">
                <template #file="{ data }">
                  <th scope="row" :width="'20%'">
                    {{ $t(`File`) }}
                  </th>
                  <td>
                    <table class="mt-2 mt-xl-0" style="width: 100%">
                      <tr>
                        <th style="padding: 0px;border: 0;width: 85%" v-if="form.file">
                          <a :href="form.file.url" target="_blank">{{ "Publication File." + form.file.extension }}</a>
                        </th>
                        <th style="padding: 0px;border: 0;width: 85%" v-else>
                          <span>{{ $t('No Attachment') }}</span>
                        </th>
                        <td style="padding: 0px;border: 0;width: 15%">
                          <feather-icon
                              v-b-tooltip.hover="$t('Global.upload_attachment')"
                              icon="UploadCloudIcon"
                              style="cursor: pointer"
                              @click="$refs.refInputEl.click()"
                              class="text-primary"
                          />
                          <feather-icon
                              v-b-tooltip.hover="$t('Global.delete')"
                              icon="Trash2Icon"
                              style="cursor: pointer"
                              class="text-danger"
                              @click="deleteFile(form.file.id)"
                          />
                        </td>
                      </tr>
                    </table>
                    <input ref="refInputEl" type="file" @change="updateFile" class="d-none"/>
                  </td>
                </template>
              </ShowComponent>
            </b-tab>
          </b-tabs>
        </b-form>
      </validation-observer>
    </b-col>
  </b-row>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import {
  BCard,
  BCol,
  BForm,
  BFormDatepicker,
  BFormFile,
  BFormGroup,
  BFormInput,
  BFormTextarea,
  BOverlay,
  BRow,
  BTab,
  BTabs,
  BSpinner
} from 'bootstrap-vue';
import vSelect from 'vue-select';
import 'vue-form-wizard/dist/vue-form-wizard.min.css';
import {ValidationObserver, ValidationProvider} from 'vee-validate';
import {required} from '@validations';
import ValidationErrors from '@/views/components/common/ValidationErrors';
import ShowComponent from '@/views/components/info/show';
import Members from '@/views/research/publications/components/members';

import PublicationsApi from "@/api/research/publications/publications";

const publicationsApi = new PublicationsApi()

import ArchiveApi from "@/api/administration/archive/archive";
import {getAuth} from "@/auth/utils";

const archiveApi = new ArchiveApi()

export default {
  components: {
    ShowComponent,
    BOverlay,
    BRow,
    BFormDatepicker,
    BCol,
    BForm,
    BFormGroup,
    BCard,
    BFormInput,
    vSelect,
    BFormTextarea,
    ValidationProvider,
    ValidationObserver,
    ValidationErrors,
    BTabs,
    BTab,
    BFormFile,
    Members,
    BSpinner
  },
  props: {
    publicationData: {default: {}, type: [Array, Object]},
    languages: {default: {}, type: [Array, Object]},
    types: {default: {}, type: [Array, Object]},
    tabIndex: {default: 0, type: Number},
  },
  computed: {
    ...mapGetters({
      lookups: 'app/lookups',
      publication: 'publications/item',
      load: 'publications/load',
      load_data: 'app/load',
    }),
    id() {
      return this.$route.params && this.$route.params.id ? this.$route.params.id : null;
    },
  },
  data() {
    return {
      errorsdata: {},
      publicationsInfoClass: '',
      authorsClass: '',
      fileClass: '',
      form: {
        title: '',
        type_of_source: null,
        journal_name: '',
        year: '',
        info: '',
        eid: '',
        doi: '',
        language: null,
        authors: [],
        file: null
      },
      authors: [],
      tabNumber: 0,
    }
  },
  beforeMount() {
    if (this.$route.query.tabNum)
      this.tabNumber = +this.$route.query.tabNum
    else if (+this.tabIndex)
      this.tabNumber = +this.tabIndex
  },
  mounted() {
    this.init();
  },
  methods: {
    ...mapActions({
      getLookups: 'app/GET_LOOKUPS',
      savePublication: 'publications/put',
    }),
    cancel(id = null) {
      if (this.$route.name == "add_publication") {
        if (id)
          this.$router.push({name: 'show_publication', params: {id: id}});
        else {
          let userId = this.authUser().type.type == 1 ? this.authUser().id : '';
          this.$router.push({name: 'publications', params: {id: userId}})
        }

      } else {
        return this.$emit('hideEdit');
      }
    },
    init() {
      if (this.id) {
        this.form = {...this.publicationData};
      }
    },
    validateAsync: function (index) {
      if (this.$route.params.id) return true;
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          this.$refs.simpleForm.validate().then(success => {
            if (success) {
              resolve(true);
            } else {
              resolve(false);
            }
          });
        }, 1000);
      });
    },
    saveStatus(index) {
      this.updateFilterQueryParams({tabNum: index});
    },
    save() {
      this.$refs.simpleForm.validate().then(success => {
        this.publicationsInfoClass = '';
        this.authorsClass = '';
        this.fileClass = '';
        if (success) {
          // to send form data with files
          const formData = new FormData()
          formData.append('type_of_source', this.form.type_of_source)
          formData.append('language', this.form.language)
          formData.append('title', this.form.title)
          formData.append('journal_name', this.form.journal_name)
          formData.append('year', this.form.year)
          formData.append('info', (this.form.info ? this.form.info : ''))
          formData.append('eid', (this.form.eid ? this.form.eid : ''))
          formData.append('doi', (this.form.doi ? this.form.doi : ''))
          formData.append('user_id', getAuth().id)

          publicationsApi.add(this.id, formData).then(response => {
            this.$swal({
              icon: 'success',
              title: `${this.$t('Global.saved')}`,
              showConfirmButton: false,
              timer: 1500,
            })
            this.$store.dispatch("publications/get", response.data.id).then(() => {
              if (this.$route.name == "add_publication")
                this.$router.go(-1);
              this.cancel(response.data.id);
            })
          }).catch(error => {

          })
        } else {
          let specificErrors = [];
          Object.keys(this.$refs.simpleForm.errors).forEach(key => {
            if (this.$refs.simpleForm.errors[key].length) {
              specificErrors.push(key);
            }
          });

          if (specificErrors.length) {
            if (specificErrors[0] == "Authors") {
              this.tabNumber = 1;
            } else if (specificErrors[0] == "Attachment File") {
              this.tabNumber = 2;
            } else {
              this.tabNumber = 0;
            }
          }

        }
      })
    },
    deleteFile(id) {
      this.$swal({
        title: `${this.$t('Global.deleteTitle')}`,
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
          this.popoverShow = false;
          archiveApi.remove(id).then(response => {
            this.$swal({
              icon: 'success',
              title: this.$t('Global.Deleted'),
              showConfirmButton: false,
              timer: 1500,
            })
            this.form.file = null;
          });
        }
      });
    },
    updateFile(e) {
      let file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      const that = this;
      reader.onload = e => {
        that.uploadFile(file);
      };
    },
    uploadFile(file) {
      let data = new FormData();
      data.append('file', file);
      this.loading = true;

      let payload = {
        id: this.form.id,
        data: data,
      };
      this.$store.dispatch('publications/putFile', payload).then(() => {
        this.$store.dispatch('publications/get', this.id).then((_) => {
          this.init();
          this.loading = false;
        });
      });
    },
    validationErrorMessage(errors) {
      if (errors[0] && errors[0].includes("between")) {
        errors[0] = this.$t('total must be less than max total');
      } else if (errors[0] && errors[0].includes("required")) {
        errors[0] = this.$t('Validation.selectFiled');

      }
      return errors;
    },
  },
};
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-wizard.scss';
@import '@core/scss/vue/libs/vue-select.scss';

.wizard-btn,
.wizard-icon-container {
  background-color: #054978 !important;
  border-color: #054978 !important;
}

.stepTitle.active {
  color: #054978 !important;
}
</style>
