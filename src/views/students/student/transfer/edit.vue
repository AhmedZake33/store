<template>
  <div>
    <edit-component>
      <template #inputs>
        <validation-observer ref="fromRules">
          <b-form ref="formRequest" @submit.stop.prevent="save">
            <b-row>
              <b-col md="12">
                <b-row>
                  <b-col md="4">
                    <b-form-group
                      :label="$t('Transfer Type')"
                      label-for="type-input"
                    >
                      <validation-provider
                        #default="{ errors }"
                        name="Transfer Type"
                        rules="required"
                      >
                        <v-select
                          v-model="formRequest.type"
                          :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
                          :dir="
                            $store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'
                          "
                          :options="transferTypes"
                          :clearable="false"
                          input-id="type-input"
                          :reduce="(val) => val.id"
                        >
                          <template v-slot:option="option">
                            {{ getTranslatedName(option) }}
                          </template>
                          <template #selected-option="{ name, name_local }">
                            <div style="display: flex; align-items: baseline">
                              <strong>{{
                                getTranslatedName({
                                  name: name,
                                  name_local: name_local,
                                })
                              }}</strong>
                            </div>
                          </template>
                          <template #no-options>
                            {{ $t("noMatching") }}
                          </template>
                        </v-select>
                        <ValidationErrors :frontend-errors="errors" />
                      </validation-provider>
                    </b-form-group>
                  </b-col>

                  <b-col md="4" v-if="formRequest.type == 1">
                    <b-form-group :label="$t('Program')" label-for="type-input">
                      <validation-provider
                        #default="{ errors }"
                        name="Program"
                        rules="required"
                      >
                        <v-select
                          v-model="formRequest.program_id"
                          :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
                          :dir="
                            $store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'
                          "
                          :options="programs"
                          :clearable="false"
                          input-id="type-input"
                          :reduce="(val) => val.id"
                        >
                          <template v-slot:option="option">
                            {{ getTranslatedName(option) }}
                          </template>
                          <template #selected-option="{ name, name_local }">
                            <div style="display: flex; align-items: baseline">
                              <strong>{{
                                getTranslatedName({
                                  name: name,
                                  name_local: name_local,
                                })
                              }}</strong>
                            </div>
                          </template>
                          <template #no-options>
                            {{ $t("noMatching") }}
                          </template>
                        </v-select>
                        <ValidationErrors :frontend-errors="errors" />
                      </validation-provider>
                    </b-form-group>
                  </b-col>

                  <b-col md="4" v-if="formRequest.type == 2">
                    <b-form-group :label="$t('Bylaw')" label-for="type-input">
                      <validation-provider
                        #default="{ errors }"
                        name="Bylaw"
                        rules="required"
                      >
                        <v-select
                          v-model="formRequest.bylaw_id"
                          :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
                          :dir="
                            $store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'
                          "
                          :options="bylaws"
                          :clearable="false"
                          input-id="type-input"
                          :reduce="(val) => val.id"
                        >
                          <template v-slot:option="option">
                            {{ getTranslatedName(option) }}
                          </template>
                          <template #selected-option="{ name, name_local }">
                            <div style="display: flex; align-items: baseline">
                              <strong>{{
                                getTranslatedName({
                                  name: name,
                                  name_local: name_local,
                                })
                              }}</strong>
                            </div>
                          </template>
                          <template #no-options>
                            {{ $t("noMatching") }}
                          </template>
                        </v-select>
                        <ValidationErrors :frontend-errors="errors" />
                      </validation-provider>
                    </b-form-group>
                  </b-col>

                  <b-col
                    md="4"
                    v-if="formRequest.type == 2 && formRequest.bylaw_id"
                  >
                    <b-form-group :label="$t('Program')" label-for="type-input">
                      <validation-provider
                        #default="{ errors }"
                        name="Program"
                        rules="required"
                      >
                        <v-select
                          v-model="formRequest.program_id"
                          :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
                          :dir="
                            $store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'
                          "
                          :options="programs"
                          :clearable="false"
                          input-id="type-input"
                          :reduce="(val) => val.id"
                        >
                          <template v-slot:option="option">
                            {{ getTranslatedName(option) }}
                          </template>
                          <template #selected-option="{ name, name_local }">
                            <div style="display: flex; align-items: baseline">
                              <strong>{{
                                getTranslatedName({
                                  name: name,
                                  name_local: name_local,
                                })
                              }}</strong>
                            </div>
                          </template>
                          <template #no-options>
                            {{ $t("noMatching") }}
                          </template>
                        </v-select>
                        <ValidationErrors :frontend-errors="errors" />
                      </validation-provider>
                    </b-form-group>
                  </b-col>

                  <b-col md="4" v-if="formRequest.type == 3">
                    <b-form-group :label="$t('Faculty')" label-for="type-input">
                      <validation-provider
                        #default="{ errors }"
                        name="Faculty"
                        rules="required"
                      >
                        <v-select
                          v-model="formRequest.faculty_id"
                          :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
                          :dir="
                            $store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'
                          "
                          :options="faculties"
                          :clearable="false"
                          input-id="type-input"
                          :reduce="(val) => val.id"
                        >
                          <template v-slot:option="option">
                            {{ getTranslatedName(option) }}
                          </template>
                          <template #selected-option="{ name, name_local }">
                            <div style="display: flex; align-items: baseline">
                              <strong>{{
                                getTranslatedName({
                                  name: name,
                                  name_local: name_local,
                                })
                              }}</strong>
                            </div>
                          </template>
                          <template #no-options>
                            {{ $t("noMatching") }}
                          </template>
                        </v-select>
                        <ValidationErrors :frontend-errors="errors" />
                      </validation-provider>
                    </b-form-group>
                  </b-col>
                  <b-col
                    md="4"
                    v-if="formRequest.type == 3 && formRequest.faculty_id"
                  >
                    <b-form-group :label="$t('Program')" label-for="type-input">
                      <validation-provider
                        #default="{ errors }"
                        name="Program"
                        rules="required"
                      >
                        <v-select
                          v-model="formRequest.program_id"
                          :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
                          :dir="
                            $store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'
                          "
                          :options="programs"
                          :clearable="false"
                          input-id="type-input"
                          :reduce="(val) => val.id"
                        >
                          <template v-slot:option="option">
                            {{ getTranslatedName(option) }}
                          </template>
                          <template #selected-option="{ name, name_local }">
                            <div style="display: flex; align-items: baseline">
                              <strong>{{
                                getTranslatedName({
                                  name: name,
                                  name_local: name_local,
                                })
                              }}</strong>
                            </div>
                          </template>
                          <template #no-options>
                            {{ $t("noMatching") }}
                          </template>
                        </v-select>
                        <ValidationErrors :frontend-errors="errors" />
                      </validation-provider>
                    </b-form-group>
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
import { mapGetters, mapActions } from "vuex";
import {
  BRow,
  BCol,
  BFormGroup,
  BForm,
  BButton,
  BFormFile,
  BFormTextarea,
  BFormInput,
  BFormDatepicker,
} from "bootstrap-vue";
import vSelect from "vue-select";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { required } from "@validations";
import Ripple from "vue-ripple-directive";
import ValidationErrors from "@/views/components/common/ValidationErrors";
import EditComponent from "@/views/components/table/Edit";

export default {
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
    BFormInput,
    BFormDatepicker,
  },
  directives: {
    Ripple,
  },
  computed: {
    ...mapGetters({
      options: "internalTransfer/lookups",
    }),
    query() {
      const data = {
        transferTypes: true,
      };
      return data;
    },
  },
  data() {
    return {
      formRequest: {
        type: null,
      },
      load: false,
      transferTypes: [],
      programs: [],
      bylaws: [],
      faculties: [],
    };
  },
  methods: {
    ...mapActions({
      lookups: "internalTransfer/getTransferLookups",
      addTransferRequest: "internalTransfer/addTransferRequest",
    }),
    init() {
      if (this.$route.params.student_id) {
        let query = {...{query : this.query}, student_id: this.$route.params.student_id}
        this.lookups(query)
            .then((res) => {
              this.transferTypes = res.success.transferTypes
            })
      }
    },
    save() {
      this.$refs.fromRules.validate().then((success) => {
        if (success) {
          let query = {
            type: this.formRequest.type,
            faculty_id: this.formRequest.faculty_id,
            bylaw_id: this.formRequest.bylaw_id,
            program_id: this.formRequest.program_id,
            student_id: this.$route.params.student_id,
            request_edit: true
          };

          this.load = true;
          this.addTransferRequest(query)
            .then((response) => {
              this.successToast(`${this.$t("Request Sent Successfully")}`);
              this.load = false;
            })
            .catch((error) => {
              this.errorToast(error.title);
              this.load = false;
            });
          this.$router.go(-1);
        }
      });
    },
    cancel() {
      this.$router.go(-1);
    },
  },
  mounted() {
    this.init();
  },
  watch: {
    'formRequest.student_id': function (val) {
      let query = {...{query : this.query}, student_id: this.$route.params.student_id};
      this.lookups(query).then(res => {
        this.transferTypes = res.success.transferTypes
      })
    },

    'formRequest.type': function (val) {
      if (this.formRequest.type == 1) {
        let query = {...{query:{transferSelected: this.formRequest.type}}, student_id: this.$route.params.student_id};
        this.lookups(query).then(res => {
          this.programs = res.success.programs;
        })
      }

      if (this.formRequest.type == 2) {
        let query = {...{query:{transferSelected: this.formRequest.type}}, student_id: this.$route.params.student_id, transferSelected: this.formRequest.type};
        this.lookups(query).then(res => {
          this.bylaws = res.success.bylaws;
        })
      }

      if (this.formRequest.type == 3) {
        let query = {...{query:{transferSelected: this.formRequest.type}}, student_id: this.$route.params.student_id, transferSelected: this.formRequest.type};
        this.lookups(query).then(res => {
          this.faculties = res.success.faculties;
        })
      }
    },

    'formRequest.bylaw_id': function (val) {
      let query = {...{query:{transferSelected: this.formRequest.type, bylaw_id: this.formRequest.bylaw_id}}, student_id: this.$route.params.student_id, transferSelected: this.formRequest.type};
      this.lookups(query).then(res => {
        this.programs = res.success.programs;
      })
    },

    'formRequest.faculty_id': function (val) {
      let query = {...{query:{transferSelected: this.formRequest.type,faculty_id: this.formRequest.faculty_id}}, student_id: this.$route.params.student_id, transferSelected: this.formRequest.type};
      this.lookups(query).then(res => {
        this.programs = res.success.programs;
      })
    },
  },
};
</script>
