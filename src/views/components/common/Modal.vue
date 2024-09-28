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
      <div :class="load ? 'disabled_all' : ''" class="demo-vertical-spacing">
        <validation-observer ref="importForm">
          <b-col md="12">
            <b-form-group class="left_right" :label="$t('Global.upload_files')">
              <validation-provider #default="{ errors }" :rules="'required'">
                <b-form-file
                    multiple
                    accept=".xlsx"
                    v-model="migrationFiles"
                    :placeholder="$t('Global.upload_files')"
                    :drop-placeholder="$t('Global.upload_files')"
                />
                <ValidationErrors
                    :default-message="true"
                    :frontend-errors="errors"
                />
              </validation-provider>
            </b-form-group>
            <p class="text-dark font-small-3" v-if="hint">
              <b class="text-danger">* {{ $t('Global.Hints') }}</b
              >: {{ hint }}
            </p>
          </b-col>
        </validation-observer>
      </div>
      <div class="mt-2" :class="load ? 'disabled_all' : ''">
        <b-col cols="12" md="12">
          <div class="d-flex justify-content-end">
            <b-button
                type="submit"
                variant="primary"
                class="mr-1"
                @click="uploadMigrationData"
            >
              {{ $t('Global.import') }}
            </b-button>
            <b-button
                type="reset"
                variant="outline-primary"
                @click="toggleModal()"
            >
              {{ $t('Global.cancel') }}
            </b-button>
          </div>
        </b-col>
      </div>
    </b-modal>
    <b-modal
        ref="my-modal"
        size="lg"
        v-model="statusModal"
        hide-footer
        no-close-on-backdrop
        no-close-on-esc
        hide-header-close
    >
      <template #modal-title>
        <div class="d-flex justify-content-between w-100">

          <strong>
            {{ $t('Global.import_progress') }}
            <b-spinner small v-if="!isDone" label="Spinning"></b-spinner>
          </strong>

          <div>
            <b-form-checkbox
                v-model="showError"
                name="is-vertical-menu-collapsed"
                class="mr-0"
                switch
                inline
            >
              {{ $t('Global.Show Error Only') }}
            </b-form-checkbox>
          </div>
        </div>
      </template>
      <div class="demo-vertical-spacing">
        <b-form>
          <b-col
              cols="12"
              md="12"
              class="height-250 overflow-y-scroll"
              v-if="status_messages.length"
          >
            <div
                class="bg-gray"
                v-for="(status_message, index) in status_messages"
                :key="index"
                v-if="checkStatusMsg(status_message.class)"
            >
              <b-alert v-if="status_message.class === 'info'" :variant="status_message.class" show>
                <div class="alert-body">
                  <span>
                    {{ status_message.message }}
                  </span>
                </div>
              </b-alert>
              <template v-if="showError">
                <b-alert v-if="status_message.class === 'danger'" :variant="status_message.class" show>
                  <div class="alert-body">
                  <span>
                    {{ status_message.index + '- ' + status_message.message }}
                  </span>
                  </div>
                </b-alert>
              </template>
              <template v-else-if="status_message.class !== 'info'">
                <b-alert :variant="status_message.class" show>
                  <div class="alert-body">
                    <span>
                      {{ status_message.index + '- ' + status_message.message }}
                    </span>
                  </div>
                </b-alert>
              </template>
            </div>
          </b-col>
        </b-form>
      </div>
      <div class="mt-2" v-if="showCloseButton">
        <b-col cols="12" md="12">
          <div class="d-flex justify-content-end">
            <b-button
                type="reset"
                variant="outline-primary"
                @click="statusModal = false"
            >
              {{ $t('Global.close') }}
            </b-button>
          </div>
        </b-col>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'
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
  BFormGroup
} from 'bootstrap-vue'
import { ValidationProvider, ValidationObserver, localize } from 'vee-validate'
import ValidationErrors from '@/views/components/common/ValidationErrors'
import { required } from '@validations'

export default {
  components: {
    BAlert,
    BSpinner,
    BFormInput,
    BFormCheckbox,
    BForm,
    ValidationProvider,
    ValidationObserver,
    ValidationErrors,
    BButton,
    BFormFile,
    BModal,
    VBModal,
    BFormGroup,
    BCol
  },
  props: {
    show: Boolean,
    title: String,
    size: String,
    link: String,
    hint: String,
  },
  data() {
    return {
      migrationFiles: [],
      status_messages: [],
      error: [],
      showError: false,
      isDone: false,
      statusModal: false,
      showCloseButton: false,
      statusIndex: 1,
    }
  },
  computed: {
    ...mapGetters({
      load: 'bylaws/load',
    }),
  },
  methods: {
    toggleModal() {
      this.show = !this.show
      this.toggleMigrationModal()
    },
    checkStatusMsg(data) {
      return typeof data !== undefined
    },
    setStatusesMessages(object, type) {
      if (typeof object.done !== undefined) {
        let status_message = {}
        status_message.status = object.status
        if (type === 'failed') {
          status_message.index = this.statusIndex++;
          status_message.class = 'danger'
          this.error.push(object)
        } else if (type === 'hint') {
          status_message.class = 'info'
        } else {
          status_message.index = this.statusIndex++;
          status_message.class = 'success'
        }
        status_message.message = object.message
        this.status_messages.push(status_message)
      }
      return true
    },
    async uploadMigrationData() {
      this.$refs.importForm.validate()
          .then((success) => {
            if (success) {
              this.$swal({
                title: 'Are you sure?',
                text: `${this.$t('Global.confirmUpload')}`,
                icon: 'warning',
                showCloseButton: true,
                showCancelButton: true,
                cancelButtonText: `${this.$t('Global.cancel')}`,
                confirmButtonText: `${this.$t('Global.yes_import')}`,
                customClass: {
                  confirmButton: 'btn btn-primary',
                  cancelButton: 'btn btn-outline-danger ml-1',
                },
                buttonsStyling: false,
              })
                  .then(async (result) => {
                    if (result.value) {
                      this.status_messages = []
                      this.show = true
                      this.showCloseButton = false
                      this.statusModal = true
                      const data = new FormData()
                      for (let i = 0; i < this.migrationFiles.length; i++) {
                        let file = this.migrationFiles[i]
                        data.append('files[' + i + ']', file)
                      }

                      data.append('page_url', window.location.href)
                      let url = process.env.VUE_APP_BASE_URL + `${this.link}`
                      const response = await fetch(url, {
                        headers: {
                          Authorization: 'Bearer ' + getToken(),
                        },
                        method: 'POST',
                        body: data,
                      })
                      const reader = response.body
                          .pipeThrough(new TextDecoderStream())
                          .getReader()
                      while (!this.isDone) {
                        const {
                          value,
                          done
                        } = await reader.read()
                        if (done || this.isDone) {
                          this.migrationFiles = []
                          this.toggleModal()
                          this.$emit('refresh')
                          this.showCloseButton = true
                          this.$swal({
                            icon: 'success',
                            title: this.$t('Global.success'),
                            showConfirmButton: true,
                            text: this.$t('Global.import_done_successfully'),
                          })
                          break
                        }

                        let allObjects =
                            typeof value !== 'undefined' ? value.split('}') : {}
                        if (allObjects.length) {
                          for (let i = 0; i < allObjects.length; i++) {
                            if (allObjects[i].trim() !== '' && allObjects[i].trim()) {
                              let object = allObjects[i] + '}'
                              object = JSON.parse(object)
                              if (object.done === false && object.failed === false && object.hint === false) {
                                this.setStatusesMessages(object)
                              } else if (object.done === false && object.failed === false && object.hint === true) {
                                this.setStatusesMessages(object, 'hint')
                              } else if (object.done === false && object.failed === true && object.hint === false) {
                                this.setStatusesMessages(object, 'failed')
                              } else if (object.done === true && this.error && this.error.length) {
                                this.isDone = true
                                this.migrationFiles = []
                                this.show = false
                                this.$emit('refresh')
                                this.showCloseButton = true
                                this.$swal({
                                  icon: 'success',
                                  title: this.$t('Global.success'),
                                  showConfirmButton: true,
                                  text: this.$t('Global.with_error', { 'errorCount': this.error.length }),
                                })
                              } else if (object.done === true && object.failed === false) {
                                this.isDone = true
                                this.migrationFiles = []
                                this.toggleModal()
                                this.$emit('refresh')
                                this.showCloseButton = true
                                this.$swal({
                                  icon: 'success',
                                  title: this.$t('Global.success'),
                                  showConfirmButton: true,
                                  text: this.$t('Global.import_done_successfully'),
                                })
                              } else if (object.failed === true && object.done === true) {
                                this.isDone = true
                                this.migrationFiles = []
                                this.toggleModal()
                                this.$emit('refresh')
                                this.showCloseButton = true
                                this.$swal({
                                  icon: 'error',
                                  title: this.$t('Global.failed'),
                                  showConfirmButton: true,
                                  text: object.message,
                                })
                              }
                            }
                          }
                        }
                      }
                    }
                  })
            }
          })
    },
  },
}
</script>

<style>
.modal-dialog.modal-lg .modal-title {
  width: 100% !important
}
</style>
