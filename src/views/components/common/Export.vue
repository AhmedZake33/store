<template>
  <div class="custom_modal">
    <b-modal
      ref="my-modal"
      :size="size"
      v-model="show"
      hide-footer
      :title="title"
      no-close-on-backdrop
      no-close-on-esc
      hide-header-close
    >
      <validation-observer ref="simpleRules">
        <b-form ref="form" @submit.stop.prevent="Export">
          <b-overlay :show="apiLink && !lookups[apiLink]">
            <b-row
              class="my-2 years d-flex text-capitalize justify-content-start w-100 align-items-left"
            >
              <slot name="filters_modal"></slot>
              <template>
                <b-col cols="12" md="6">
                  <b-form-group class="left_right" label-for="export_type">
                    <validation-provider
                      #default="{ errors }"
                      :rules="validation(null, 0).rule"
                      name="export_type"
                    >
                      <v-select
                        :filter="fuseSearch"
                        :dir="
                          $store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'
                        "
                        v-model="filter.export_type"
                        :options="
                          lookups[apiLink] && lookups[apiLink].export_types
                        "
                        class="w-100 bg-white"
                        clearable
                        label="export_type"
                        :reduce="(val) => val.code"
                        :placeholder="$t('Global.types')"
                      >
                        <template v-slot:option="option">
                          {{
                            $i18n.locale == "ar"
                              ? option.name_local
                              : option.name
                          }}
                        </template>
                        <template #selected-option="{ name, name_local }">
                          <div style="display: flex; align-items: baseline">
                            <strong v-if="$i18n.locale == 'ar'"
                              >{{ name_local }}
                            </strong>
                            <strong v-else>{{ name }}</strong>
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

                <b-col class="mb-1" cols="12" md="6">
                  <b-form-group class="left_right" label-for="export_fields">
                    <validation-provider
                      #default="{ errors }"
                      :rules="validation(null, 0).rule"
                      name="export_fields"
                    >
                      <v-select
                        :filter="fuseSearch"
                        :dir="
                          $store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'
                        "
                        v-model="filter.export_fields"
                        :options="
                          lookups[apiLink] && lookups[apiLink].export_fields
                        "
                        class="w-100 bg-white"
                        clearable
                        :closeOnSelect="false"
                        multiple
                        label="export_fields"
                        :reduce="(val) => val.code"
                        :placeholder="$t('Fields')"
                      >
                        <template v-slot:option="option">
                          {{
                            $i18n.locale == "ar"
                              ? option.name_local
                              : option.name
                          }}
                        </template>
                        <template #selected-option="{ name, name_local }">
                          <div style="display: flex; align-items: baseline">
                            <strong v-if="$i18n.locale == 'ar'"
                              >{{ name_local }}
                            </strong>
                            <strong v-else>{{ name }}</strong>
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

                <b-col cols="12" md="6">
                  <b-form-group class="left_right" label-for="export_language">
                    <validation-provider
                      #default="{ errors }"
                      :rules="validation(null, 0).rule"
                      name="export_language"
                    >
                      <v-select
                        :filter="fuseSearch"
                        :dir="
                          $store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'
                        "
                        v-model="filter.export_language"
                        :options="
                          lookups[apiLink] && lookups[apiLink].export_languages
                        "
                        class="w-100 bg-white"
                        clearable
                        label="export_language"
                        :reduce="(val) => val.code"
                        :placeholder="$t('Language')"
                      >
                        <template v-slot:option="option">
                          {{
                            $i18n.locale == "ar"
                              ? option.name_local
                              : option.name
                          }}
                        </template>
                        <template #selected-option="{ name, name_local }">
                          <div style="display: flex; align-items: baseline">
                            <strong v-if="$i18n.locale == 'ar'"
                              >{{ name_local }}
                            </strong>
                            <strong v-else>{{ name }}</strong>
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
              </template>
            </b-row>
          </b-overlay>
        </b-form>
      </validation-observer>
      <div class="mt-2" :class="load ? 'disabled_all' : ''">
        <b-col cols="12" md="12">
          <div class="d-flex justify-content-end">
            <b-button
              type="submit"
              variant="primary"
              class="mr-1"
              @click="Export()"
            >
              {{ $t("Global.export") }}
            </b-button>
            <b-button
              type="reset"
              variant="outline-primary"
              @click="toggleModal()"
            >
              {{ $t("Global.cancel") }}
            </b-button>
          </div>
        </b-col>
      </div>
    </b-modal>
  </div>
</template>
    
    <script>
import { mapGetters, mapActions } from "vuex";
import {
  BFormInput,
  BAlert,
  BFormCheckbox,
  BSpinner,
  BCol,
  BForm,
  BModal,
  VBModal,
  BFormFile,
  BButton,
  BRow,
  BOverlay,
  BFormGroup,
} from "bootstrap-vue";
import { ValidationProvider, ValidationObserver, localize } from "vee-validate";
import ValidationErrors from "@/views/components/common/ValidationErrors";
import vSelect from "vue-select";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import Multiselect from "@/views/components/common/Multiselect.vue";
export default {
  components: {
    Multiselect,
    vSelect,
    ValidationErrors,
    ValidationProvider,
    ValidationObserver,
    BOverlay,
    BAlert,
    BRow,
    BSpinner,
    BFormInput,
    BFormCheckbox,
    BForm,
    BButton,
    BFormFile,
    BModal,
    VBModal,
    BFormGroup,
    BCol,
  },
  props: {
    show: Boolean,
    title: String,
    size: String,
    link: String,
    hint: String,
    apiLink: String,
    bylaw_id: Number,
    queryCourse:{},
    passedFilters: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      error: [],
      filter: {},
    };
  },
  computed: {
    ...mapGetters({
      load: "Report/load",
      lookups: "app/stateLookups",
    }),
  },
  methods: {
    ...mapActions({
      ExportSysReports: "Report/ExportSysReports",
    }),
    toggleModal() {
      this.show = false;
      this.$emit("close");
    },
    async Export() {
      this.$refs.simpleRules.validate().then((success) => {
        if (success) {
          this.$toast(
            {
              component: ToastificationContent,
              props: {
                icon: "FileTextIcon",
                text: this.$t("Global.downloading_in_progress"),
                variant: "info",
              },
            },
            {
              position: "top-center",
              timeout: false,
              closeOnClick: false,
              draggable: false,
            }
          );

          let payload = {
            title: this.title,
            link: this.apiLink,
            query: { ...this.passedFilters, ...this.filter },
            export: true,
          };
          if (this.bylaw_id) {
            payload.query = { ...payload.query, bylaw_id: this.bylaw_id };
          }
          if(this.queryCourse){
            payload.query = { ...payload.query , ...this.queryCourse};
          }
          console.log(payload.query);
          this.ExportSysReports(payload)
            .then((response) => {
              this.toggleModal();
              this.downloadURI(response.url)
              document.querySelector(".toastification-close-icon").click();
            })
            .catch((error) => {
              this.toggleModal();
              document.querySelector(".toastification-close-icon").click();
            });
        }
      });
    },
  },
};
</script>
    
    <style>
.modal-dialog.modal-lg .modal-title {
  width: 100% !important;
}
</style>