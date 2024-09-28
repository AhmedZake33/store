<template>
  <div>
    <edit-component :name="$t('Create New Ticket')">
      <template #inputs>
        <validation-observer ref="fromRules">
          <b-form
            ref="formRequest"
            @submit.stop.prevent="save"
          >
            <b-row>
              <b-col md="12">
                <b-row>
                  <b-col md="12">
                    <b-form-group
                      :label="$t('Ticket Type')"
                      label-for="type-input"
                    >
                      <validation-provider
                        #default="{ errors }"
                        name="Ticket Type"
                        rules="required"
                      >
                        <v-select
                          v-model="formRequest.ticket_group_id"
                          :label="$i18n.locale == 'en' ? 'name':'name_local'"
                          :dir="$store.state.appConfig.layout.isRTL? 'rtl': 'ltr'"
                          :options="ticketTypes"
                          input-id="type-input"
                          :reduce="(val) => val.id"
                        >
                          <template #option="option">
                            <b> {{ getTranslatedName(option) }} </b>
                            <small v-if="option.faculty">
                              (
                              {{ getTranslatedName(option.faculty) }}
                              <span v-if="option.bylaw">
                                , {{ getTranslatedName(option.bylaw) }}
                              </span>
                              <span v-if="option.program">
                                , {{ getTranslatedName(option.program) }}
                              </span>
                              )
                            </small>
                          </template>
                          <template #selected-option="option">
                            <b> {{ getTranslatedName(option) }} </b>
                            <small v-if="option.faculty">
                              (
                              {{ getTranslatedName(option.faculty) }}
                              <span v-if="option.bylaw">
                                , {{ getTranslatedName(option.bylaw) }}
                              </span>
                              <span v-if="option.program">
                                , {{ getTranslatedName(option.program) }}
                              </span>
                              )
                            </small>
                          </template>
                          <template #no-options>
                            {{ $t("noMatching") }}
                          </template>
                        </v-select>
                        <ValidationErrors :frontend-errors="errors" />
                      </validation-provider>
                    </b-form-group>
                  </b-col>
                  <b-col md="12">
                    <b-form-group
                      :label="$t('Ticket Subject')"
                      label-for="desc-input"
                    >
                      <validation-provider
                        #default="{ errors }"
                        name="Ticket Subject"
                        rules="required"
                      >
                        <b-form-input v-model="formRequest.subject" />
                        <ValidationErrors :frontend-errors="errors" />
                      </validation-provider>
                    </b-form-group>
                  </b-col>
                  <b-col md="12">
                    <b-form-group
                        :label="$t('Ticket Description')"
                        label-for="desc-input"
                    >
                      <validation-provider
                          #default="{ errors }"
                          name="Ticket Description"
                          rules="required"
                      >
                        <b-form-textarea v-model="formRequest.description" />
                        <ValidationErrors :frontend-errors="errors" />
                      </validation-provider>
                    </b-form-group>
                  </b-col>
                  <b-col md="12">
                    <b-form-group
                      :label="$t('Attachment Files')"
                      label-for="file-input"
                    >
                      <validation-provider
                        #default="{ errors }"
                        name="Attachment Files"
                        rules=""
                      >
                        <b-form-file
                          ref="attachmentFiles"
                          v-model="formRequest.files"
                          accept=".jpg, .png, .gif, .pdf"
                          multiple
                        />
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
import { mapGetters, mapActions } from 'vuex'
import {
  BRow,
  BCol,
  BFormGroup,
  BForm,
  BButton,
  BFormFile,
  BFormInput,
  BFormTextarea,
} from 'bootstrap-vue'
import vSelect from 'vue-select'
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { required } from '@validations'
import Ripple from 'vue-ripple-directive'
import ValidationErrors from '@/views/components/common/ValidationErrors'
import EditComponent from '@/views/components/table/Edit'

import TicketApi from "@/api/system/ticket";
const ticketApi = new TicketApi()

export default {
  title: 'AddTicket',
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
  },
  directives: {
    Ripple,
  },
  computed: {
    ...mapGetters({
      options: 'app/lookups',
    }),
  },
  data() {
    return {
      formRequest: {
        ticket_group_id: null,
        subject: null,
        description: null,
        files: null,
      },
      query: {
        ticket_types: true,
        user_id: null,
      },
      load: false,
      ticketTypes: [],
      errorsdata: {},
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    ...mapActions({
      lookups: 'app/GET_LOOKUPS',
    }),
    init() {
      this.lookups(this.query).then(res => {
        this.ticketTypes = res.success.ticketTypes
      })
    },
    cancel() {
      this.$router.go(-1)
    },
    save() {
      this.$refs.fromRules.validate().then(success => {
        if (success) {
          this.load = true

          // to send form data with files
          const formData = new FormData()
          formData.append('ticket_group_id', this.formRequest.ticket_group_id)
          formData.append('subject', this.formRequest.subject)
          formData.append('description', this.formRequest.description)
          for (let i = 0; i < this.$refs.attachmentFiles.files.length; i++) {
            formData.append(`files[${i}]`, this.$refs.attachmentFiles.files[i])
          }
          ticketApi.add(formData).then(response => {
            this.$swal({
              icon: 'success',
              title: `${this.$t('Global.saved')}`,
              showConfirmButton: false,
              timer: 1500,
            })
            this.$router.go(-1)
          }).catch(error => {
            this.load = false
          })
        }
      })
    },
  },
}
</script>
