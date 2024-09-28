<template>
  <b-row>
    <b-col cols="12">
      <b-card :title="$i18n.locale == 'en' ? header : header" tag="article"
        style="max-width: 100%; text-transform: capitalize;" class="mb-2">
        <b-card-header style="padding: 0 !important; margin-bottom: 6%" :class="classObject" v-if="!refresh"
          class="mb-2">
          <b-col class="col-4" style="font-size: 14px">
            <h4>

            </h4>
          </b-col>

        </b-card-header>
        <b-card-body v-if="items" style="padding: 0 !important;">
          <list :data="items" :only="[]">
            <template #custom_show>

              <tr>
                <th scope="row" :width="'40%'">
                  {{ $t('Global.student') }}
                </th>
                <td class="d-flex flex-wrap">
                  <div class="d-flex">
                    <div class="d-flex flex-wrap">
                      <div>
                        <div class="d-flex flex-wrap">
                          <div>
                            <span>
                              <b-link class="font-weight-bold d-inline-block"
                                :to="{ name: 'student-show', params: { id: items.student_id } }">
                                {{ $i18n.locale == 'en' ? items.student.user_name : items.student.user_name_local }}
                              </b-link>
                            </span>
                            <span />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <th scope="row" :width="'40%'">
                  {{ $t('Global.request_change') }}
                </th>
                <td class="d-flex flex-wrap">
                  <div class="d-flex">
                    <div class="d-flex flex-wrap">
                      <div>
                        <div class="d-flex flex-wrap">
                          <div>
                            <span>

                              {{ $i18n.locale == 'en' ? items.field.name : items.field.name_local }}

                            </span>
                            <span />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <th scope="row" :width="'40%'">
                  {{ $t('Global.new_data') }}
                </th>
                <td class="d-flex flex-wrap">
                  <div class="d-flex">
                    <div class="d-flex flex-wrap">
                      <div>
                        <div class="d-flex flex-wrap">
                          <div>
                            <span>
                              {{ getDescription(items.description) }}

                            </span>
                            <span />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <th scope="row" :width="'40%'">
                  {{ $t('Global.original_data') }}
                </th>
                <td class="d-flex flex-wrap">
                  <div class="d-flex">
                    <div class="d-flex flex-wrap">
                      <div>
                        <div class="d-flex flex-wrap">
                          <div>
                            <span>
                              {{ getDescription(items.original_data) }}
                            </span>
                            <span />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <th scope="row" :width="'40%'">
                  {{ $t('attached') }}
                </th>
                <td class="d-flex flex-wrap">
                  <div class="d-flex">
                    <div class="d-flex flex-wrap">
                      <div>
                        <div class="d-flex flex-wrap">
                          <div>
                            <a :href="items.documents.url" target="_blank" v-if="items.documents != null">
                              <span>
                                {{ $t('proveDocument') }}
                              </span>
                            </a>
                            <span />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </list>
          <b-col class="xs_mini col-8" :class="classObject2">
            <b-button-group>
              <b-button class="btn-icon mr-1 ml-1" variant="primary" @click="update(1)" :disabled="items.status.id != 1"
                v-if="hasPermission('accept_correctionRequests')">
                <span>
                  {{ $i18n.locale == 'en' ? "Approve" : "قبول" }}
                </span>
              </b-button>
              <b-button class="btn-icon mr-1 ml-1" variant="danger" @click="openModal" :disabled="items.status.id != 1"
                v-if="hasPermission('reject_correctionRequests')">
                <span>
                  {{ $i18n.locale == 'en' ? "Reject" : "رفض" }}
                </span>
              </b-button>
              <b-modal ref="modal" :title="$t('Global.reject_reason')" @ok="submitReason" :ok-title="$t('Global.ok')" :cancel-title="$t('Global.cancel')">
                <b-col cols="12">
                  <b-form-group class="left_right" :label="$t('Global.reject_reason')"
                    label-for="rejectionReason-input">
                    <b-form-textarea id="rejectionReason-input" v-model="rejectionReason" rows="5"
                      required="required"></b-form-textarea>
                  </b-form-group>
                </b-col>
              </b-modal>
            </b-button-group>
          </b-col>
        </b-card-body>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>

import {
  BCard, BCol, BRow, BLink, BFormInput, BListGroup, BListGroupItem, BSpinner, BCardHeader, BCardBody, BButtonGroup, BFormGroup, BFormTextarea
} from 'bootstrap-vue'
import List from '@/views/components/info/list'
import CorrectionRequest from '@/api/student/correciton_requests/correction_request'
import ToastificationContent from '@core/components/toastification/ToastificationContent'
import { ValidationProvider, ValidationObserver, localize } from 'vee-validate';
import ValidationErrors from '@/views/components/common/ValidationErrors';
const correctionRequest = new CorrectionRequest()

export default {
  name: 'Show',
  components: {
    BCard, BCol, BRow, BLink, List, BFormInput, BListGroup, BListGroupItem, BSpinner, BCardHeader, BCardBody, BButtonGroup, BFormGroup, BFormTextarea,
    ValidationProvider,
    ValidationObserver,
    ValidationErrors
  },
  data() {
    return {
      items: null,
      refresh: false,
      rejectionReason: ''

    }
  },
  mounted() {
    this.init()
  },
  computed: {
    header() {
      return this.$t('Student_Request_Data')
    },
    id() {
      return this.$route.params.id
    },
    classObject() {
      const isEnglish = this.$i18n.locale === 'en'
      return {
        'flex-class-end': this.$i18n.locale === 'en',
        'flex-class-start': this.$i18n.locale === 'ar',
      }
    },
    classObject2() {
      const isEnglish = this.$i18n.locale === 'en'
      return {
        'align-item-right': this.$i18n.locale === 'en',
        'align-item-left': this.$i18n.locale === 'ar',
      }
    },
  },
  methods: {

    init() {
      correctionRequest.get(this.id).then(data => {
        this.items = data.data
      })
    },
    openModal() {
      this.$refs.modal.show();
    },
    submitReason() {
  
      this.$refs.modal.hide();
      this.update(0, this.rejectionReason);
    },
    update(val, reason) {
     
      let payload = {
        id: this.$route.params.id,
        query: {
          approve: val,
          reason: reason
        }
      }
      correctionRequest.update(payload).then(data => {
        return data.data
      }).then(val => {
        if (val.updated == 1) {
          this.$toast({
            component: ToastificationContent,
            props: {
              title: 'Form Submitted',
              icon: 'EditIcon',
              variant: 'success',
            },
          });
          this.$router.push('/correction_requests');
        }
      })
    },
    getDescription(value) {
      if (typeof value === 'object' && value !== null) {
        return this.getTranslatedName(value)
      } else {
        return value;
      }
    }
  },
  watch: {
  },
}

</script>

<style scoped></style>
