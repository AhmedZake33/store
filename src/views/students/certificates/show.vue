<template>
  <b-row v-if="hasPermission('show_certificate')">
    <b-col cols="6" >
      <b-card
        style="max-width: 100%; text-transform: capitalize; position: relative"
        class="mb-2"
      >
        <b-card-header
          style="padding: 0 !important; margin-bottom: 6%"
          :class="classObject"
          v-if="!refresh"
        >
          <b-col
            class="col-4"
            style="font-size: 14px"
          >
            <h4 style="margin-bottom: 0">
              {{ $i18n.locale == 'en' ? 'Student':'الطالب' }}
            </h4>
          </b-col>
          <b-col
            v-if="hasPermission('edit_certificate')"
            class="xs_mini col-8"
            :class="classObject2"
          >
            <div v-if="items.status != 'incomplete'">

           
              <b-button
                v-if="items.current_status && items.can_approve"
                class="btn-icon "
                variant="primary"
                @click="status(items.current_status.id,'sign')"
                style="font-size: 10px;margin-right: 6px"
              >
                <span>
                  {{ $i18n.locale == 'en' ? "Approve" : "قبول" }}
                </span>
              </b-button>
              <b-button
                  v-if="items.status != 'new' && items.status != 'unpaid' && items.status != 'Ready To Deliver' "
                  class="btn-icon xs"
                  @click="status(16,'reset')"
                  variant="secondary"
                  style="font-size: 10px;margin-right: 6px"
              >
                <span>
                  {{ $i18n.locale == 'en' ? "Reset" : "إعاده" }}
                </span>
              </b-button>
              <!-- <b-button
                v-b-modal.modal-2
                @click="open"
                class="btn-icon"
                variant="warning"
                v-if="items.status != 'rejected' && items.current_status "
                id="toggle-btn"
                style="font-size: 10px;margin-right: 6px"
              >
                <span >
                  {{ $i18n.locale == 'en' ? "Update" : "تعديل" }}
                </span>
              </b-button> -->
                <b-button
                    v-if="!items.current_status && items.status != 'rejected' && items.status !== 'Ready To Deliver'&& items.status !== 'delivered'"
                    class="btn-icon "
                    variant="primary"
                    @click="status('ready_to_deliver','status')"
                    style="font-size: 10px;margin-right: 6px"
                >
                  {{ $t('ready_to_deliver')}}
              </b-button>
                <b-button
                    v-if="items.status == 'Ready To Deliver' && items.status != 'delivered'"
                    class="btn-icon "
                    variant="primary"
                    @click="status('delivered','status')"
                    style="font-size: 10px;margin-right: 6px"
                >
                  {{ $t('delivered')}}
                </b-button>
                <b-button
                  v-b-modal.modal-1
                  variant="danger"
                  class="btn-icon "
                  v-if="items.status != 'rejected' && items.current_status "
                  style="font-size: 10px;margin-right: 6px"
              >
              <span >
                {{ $t('reject') }}
              </span>
              </b-button>
          </div>
            <b-modal
              id="modal-2"
              :title="$t('Global.update')"
              :ok-title="$t('Global.save')"
              @ok="handleOk"
              :cancel-title="$t('Global.cancel')"
              v-if="!loading"
              ref="update-modal"
            >
              <validation-observer ref="simpleRules">
                <b-form
                    ref="fom"
                    @submit.stop.prevent="status('updated','status')"
                    v-if="items.user"
                >
                <b-form-group
                  class="left_right"
                  :label="$t('Global.english_name')"
                  label-for="name"
                >
                  <validation-provider
                      #default="{ errors }"
                      name="English Name input"
                      rules="english|required"
                  >
                  ({{items.name}})
                  <b-form-input
                    id="name"
                    v-model="cert.name"
                  />
                    <ValidationErrors :frontend-errors="errors"
                                      :backend-errors="getBackendFieldError(errorsdata,'name')"/>
                  </validation-provider>
                </b-form-group>
                <b-form-group
                    class="left_right"
                    :label="$t('Global.arabic_name')"
                    label-for="nameArabic"
                >
                  <validation-provider
                      #default="{ errors }"
                      name="Arabic Name input"
                      rules="arabic|required"
                  >
                  <b-form-input
                      id="nameArabic"
                      v-model="cert.name_local"
                  />
                  <ValidationErrors :frontend-errors="errors"
                                    :backend-errors="getBackendFieldError(errorsdata,'name_local')"/>
                  </validation-provider>
                </b-form-group>
                <!-- National id -->
                <b-form-group
                    class="left_right"
                    :label="$t('Global.national_id')"
                    label-for="nationalID"

                >
                  <validation-provider
                      #default="{ errors }"
                      name="NationalID"
                      :rules="items.user.nationality.id == 2 ? 'ssn|required' : 'ssn'"
                      :bails="false"
                  >
                  <b-form-input
                      id="nationalID"
                      v-model="cert.national_id"
                      style="text-transform: capitalize"
                  />
                    <ValidationErrors :frontend-errors="errors"
                                      :backend-errors="getBackendFieldError(errorsdata,'national_id')"/>
                  </validation-provider>
                </b-form-group>
                <!-- Passport -->
                <b-form-group
                      class="left_right"
                      :label="$t('Global.passport')"
                      label-for="passport"
                  >
                    <validation-provider
                        #default="{ errors }"
                        name="Passport"
                        :rules="items.user.nationality.id == 2 ? 'passport|min:8' : 'passport|required|min:8'"
                        :bails="false"
                    >
                      <b-form-input
                          id="passport"
                          v-model="cert.passport_number"
                          style="text-transform: capitalize"
                      />
                      <ValidationErrors :frontend-errors="errors"
                                        :backend-errors="getBackendFieldError(errorsdata,'passport')"/>
                    </validation-provider>
                  </b-form-group>
                <!--   Apply to -->
                <b-form-group
                    v-if=" items.apply_to !== 'undefined' "
                    class="left_right"
                    :label="$t('Global.apply_to')"
                    label-for="apply-to"
                >
                  <validation-provider
                      #default="{ errors }"
                      name="Apply  To input"
                      rules="alpha"
                  >
                  {{items.apply_to != 'undefined' ? (items.apply_to):'()' }}
                  <b-form-input
                      id="apply-to"
                      v-model="items.apply"
                  />
                  <ValidationErrors :frontend-errors="errors"
                                    :backend-errors="getBackendFieldError(errorsdata,'national_id')"/>
                  </validation-provider>
                </b-form-group>
              </b-form>
              </validation-observer>
            </b-modal>

            <b-modal
              id="modal-1"
              :title="$t('rejected')"
              :ok-title="$t('Global.save')"
              :cancel-title="$t('Global.cancel')"
              @ok="status('rejected','status')"

            >
              <b-form
                ref="form"

              >
                <b-form-group
                  class="left_right"
                  :label="$t('Global.reason')"
                  label-for="name-input"
                >
                  <b-form-input
                    id="name-input"
                    v-model="form.reject_reason"
                    @keypress="isLetter($event)"
                  />
                </b-form-group>
              </b-form>
            </b-modal>

<!--            Delevery part -->


          </b-col>
        </b-card-header>
        <b-card-body  style="padding: 0 !important;">
          <list
            style="padding: 0 !important;"
            :data="items"
            :only="[

            ]"

          >
            <template
              v-if="items.status != 'rejected' "
              #edit
            />
            <template #custom_show>
              <tr>
                <th
                  scope="row"
                  :width="'40%'"
                >
                  {{ $t('print_count') }}
                </th>
                <td
                  class="d-flex flex-wrap"
                >
                  <div
                    class="d-flex"
                  >
                    <div
                      class="d-flex flex-wrap"
                    >
                      <div>
                        <div
                          class="d-flex flex-wrap"
                        >
                          <div>
                            <span>
                              {{ items.quantity }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <th
                  scope="row"
                  :width="'40%'"
                >
                  {{ $t('Global.status') }}
                </th>
                <td
                  class="d-flex flex-wrap"
                >
                  <div
                    class="d-flex"
                  >
                    <div
                      class="d-flex flex-wrap"
                    >
                      <div>
                        <div
                          class="d-flex flex-wrap"
                        >
                          <div>

                            <b-badge
                                v-b-tooltip.hover.top="items.reject_reason"
                                pill :variant="`light-danger`" v-if="items.status=='rejected'" class="text-capitalize">{{
                                $t(`${items.status}`)
                              }}</b-badge>
                            <b-badge pill :variant="`light-success`" v-else-if="items.status=='approved'" class="text-capitalize">{{
                                $t(`${items.status}`)
                              }}</b-badge>
                            <b-badge pill :variant="`light-primary`" v-else class="text-capitalize">{{
                                $t(`${items.status}`)
                              }}</b-badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

              <tr v-if="items.status == 'rejected'">
                <th
                  scope="row"
                  :width="'40%'"
                >
                  {{ $t('Global.reason') }}
                </th>
                <td
                  class="d-flex flex-wrap"
                >
                  <div
                    class="d-flex"
                  >
                    <div
                      class="d-flex flex-wrap"
                    >
                      <div>
                        <div
                          class="d-flex flex-wrap"
                        >
                          <div>
                            <span>
                              {{ $t(items.reject_reason) }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <th
                  scope="row"
                  :width="'40%'"
                >
                  {{ $t('Global.certificate') }}
                </th>
                <td
                  class="d-flex flex-wrap"
                >
                  <div
                    class="d-flex"
                  >
                    <div
                      class="d-flex flex-wrap"
                    >
                      <div>
                        <div
                          class="d-flex flex-wrap"
                        >
                          <div>
                            <span>{{ $i18n.locale == 'en' ? items.service.name : items.service.name_local }}</span>
                            <span />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <th
                  scope="row"
                  :width="'40%'"
                >
                  {{ $t('Global.name') }}
                </th>
                <td
                  class="d-flex flex-wrap"
                >
                  <div
                    class="d-flex"
                  >
                    <div
                      class="d-flex flex-wrap"
                    >
                      <div>
                        <div
                          class="d-flex flex-wrap"
                        >
                          <div>
                            <span >
                              <b-link
                                :to="{ name: 'student-show', params: { id: items.user.id } }"
                              >{{ items.user ?((items.user.name)? items.user.name :items.user.name_local ) : '_' }}
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
                <th
                    scope="row"
                    :width="'40%'"
                >
                  {{ $t('requested_by') }}
                </th>
                <td
                    class="d-flex flex-wrap"
                >
                  <div
                      class="d-flex"
                  >
                    <div
                        class="d-flex flex-wrap"
                    >
                      <div>
                        <div
                            class="d-flex flex-wrap"
                        >
                          <div>
                            <span>{{ items.created_by ? ((items.created_by)? items.created_by.name :items.created_by.name_local ) : '_' }}</span>
                            <span />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <th
                  scope="row"
                  :width="'40%'"
                >
                  {{ $t('request') }}
                </th>
                <td
                  class="d-flex flex-wrap"
                >
                  <div
                    class="d-flex"
                  >
                    <div
                      class="d-flex flex-wrap"
                    >
                      <div>
                        <div
                          class="d-flex flex-wrap"
                        >
                          <div>
                            <span>{{ items.created_at ? ((items.created_at)? items.created_at :items.created_at ) : '_' }}</span>
                            <span />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <th
                  scope="row"
                  :width="'40%'"
                >
                  {{ $t('updated_at') }}
                </th>
                <td
                  class="d-flex flex-wrap"
                >
                  <div
                    class="d-flex"
                  >
                    <div
                      class="d-flex flex-wrap"
                    >
                      <div>
                        <div
                          class="d-flex flex-wrap"
                        >
                          <div>
                            <span> {{ items.updated_at ? ((items.updated_at)? items.updated_at :items.updated_at ) : '_' }}</span>
                            <span />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

              <tr v-if="items.apply_to!=='undefined'">
                <th
                  scope="row"
                  :width="'40%'"
                >
                  {{ $t('apply_to') }}
                </th>
                <td
                  class="d-flex flex-wrap"
                >
                  <div
                    class="d-flex"
                  >
                    <div
                      class="d-flex flex-wrap"
                    >
                      <div>
                        <div
                          class="d-flex flex-wrap"
                        >
                          <div>
                            <span>{{ items.apply_to ? ((items.apply_to)? items.apply_to :items.apply_to ) : '_' }}</span>
                            <span />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <th
                  scope="row"
                  :width="'40%'"
                >
                  {{ $t('english_name') }}
                </th>
                <td
                  class="d-flex flex-wrap"
                >
                  <div
                    class="d-flex"
                  >
                    <div
                      class="d-flex flex-wrap"
                    >
                      <div>
                        <div
                          class="d-flex flex-wrap"
                        >
                          <div>
                            <span>  {{ items.name ? ((items.name)? items.name :items.name ) : '_' }}</span>
                            <span />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <th
                  scope="row"
                  :width="'40%'"
                >
                  {{ $t('Global.phone') }}
                </th>
                <td
                  class="d-flex flex-wrap"
                >
                  <div
                    class="d-flex"
                  >
                    <div
                      class="d-flex flex-wrap"
                    >
                      <div>
                        <div
                          class="d-flex flex-wrap"
                        >
                          <div>
                            <span>  {{ items.phone ? ((items.phone)? items.phone :items.phone ) : '_' }}</span>
                            <span />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <th
                  scope="row"
                  :width="'40%'"
                >
                  {{ $t('attached') }}
                </th>
                <td
                  class="d-flex flex-wrap"
                >
                  <div
                    class="d-flex"
                  >
                    <div
                      class="d-flex flex-wrap"
                    >
                      <div>
                        <div
                          class="d-flex flex-wrap"
                        >
                          <div>
                            <a
                              :href="items.documents[0].url"
                              target="_blank"
                            >
                              <span>
                                {{ $t('nationalIDImage') }}
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
          <hr>
            <b-card :title="$t('signs')">
            <app-timeline
                style="padding: 0 !important;"
                :title="$t('signs')"
                v-if="items && items.service_roles"
            >
              <app-timeline-item
                  v-for="(signature,index) in items.service_roles"
                  :key="index"
                  :title="$i18n.locale == 'en' ? signature.role.name : signature.role.name_local"
                  :subtitle="items.signatures[index] && items.signatures[index].service_role ? (items.signatures[index].service_role.role.name==signature.role.name?
                  items.signatures[index].user_at:'no'):''"
                  :time="items.signatures[index] && items.signatures[index].service_role? (items.signatures[index].service_role.role.name==signature.role.name?
                  $i18n.locale == 'en' ? items.signatures[index].user.name : items.signatures[index].user.name_local:'no'):''"
                  :variant="items.signatures[index] ?'success':'secondary '"
              />
            </app-timeline>
            </b-card>
          <div v-if="loading" style="
          position: absolute;
          width: 100%;
          top:0;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: #eee;
          opacity: 0.8;
          text-align: center;
          z-index: 999;
          " >
            <b-spinner variant="primary" style="position: absolute;top: 60px;z-index: 1000" />
          </div>
        </b-card-body>

      </b-card>
    </b-col>
    <b-col cols="6">
      <b-card
        :title="$t('certificate_information')"
        tag="article"
        style="max-width: 70rem;"
        class="mb-2"
      >
        <b-row>
          <b-col class="xs_mini" v-if="items.status==='delivered'">
            <iframe
              :src="pdf"
              :frameborder="0"
              style="width:100%; height:600px;"
            />
          </b-col>
          <b-col class="xs_mini" v-else-if="items.status !== 'delivered'">
            <iframe
                    :src="computedPdf"
                    :frameborder="0"
                    style="width:100%; height:600px;"
                    v-if="refreshphaseComputed == false"
            />
            <div v-else style="
          position: absolute;
          width: 100%;
          top:0;
          bottom: 0;
          left: 0;
          right: 0;
          background-color: #eee;
          opacity: 0.8;
          text-align: center;
          z-index: 999;
          " >
              <b-spinner variant="primary" style="position: absolute;top: 60px;z-index: 1000" />
            </div>
          </b-col>
<!--          <b-col class="xs_mini" v-else-if="items.status !== 'delivered' && refreshphaseComputed == false">-->
<!--            frame three {{refreshphaseComputed}}-->
<!--           -->
<!--          </b-col>-->
        </b-row>
      </b-card>
    </b-col>
  </b-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  BCard, BCol, BRow, BLink, BOverlay, BSpinner, BCardHeader, BCardBody, BFormGroup,BBadge,
  BFormInput, BForm,BButtonGroup
} from 'bootstrap-vue'
import form from '@/store/modules/quality/forms/form'
import List from '@/views/components/info/list'
import ValidationErrors from "@/views/components/common/ValidationErrors";
import {required, email, regex, integer} from '@validations'
import {ValidationProvider, ValidationObserver, localize} from 'vee-validate'
import BCardCode from '@core/components/b-card-code'
import AppTimeline from '@core/components/app-timeline/AppTimeline.vue'
import AppTimelineItem from '@core/components/app-timeline/AppTimelineItem.vue'
import Vue from 'vue'
export default {
  name: 'Show',
  components: {
    BCard,
    BCol,
    BRow,
    BLink,
    List,
    BOverlay,
    BSpinner,
    BCardHeader,
    BCardBody,
    BFormGroup,
    BFormInput,
    BForm,
    BBadge,
    ValidationProvider,
    ValidationObserver,
    ValidationErrors,
    Vue,
    BButtonGroup,
    BCardCode,
    AppTimeline,
    AppTimelineItem,
  },
  data() {
    return {
      errorsdata: {},
      editable: true,
      delivery: false,
      cert: {},
      fields: [
        'created_at',
        'status',
      ],
      flag:null,
      items: null,
      fom: {
        name: null,
      },
      form: {
        user_id: null,
        service_id: null,
        status: null,
      },
      temp:{
        name:null,
        name_local:null,
      },
      refresh:false,
      refreshphase:false,
      pdf:'',
    }
  },
  computed: {
    ...mapGetters({
      loading: 'certificates/load',
    }),
    id() {
      return this.$route.params.id ? this.$route.params.id : null
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
    refreshphaseComputed(){

      return this.refreshphase
    },
    computedPdf(){
      return this.pdf
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.getItem(this.id)
        .then(res => {
          console.log(res.data[0]);
          if(res){
            this.items = res.data[0]
            this.pdf = res.data[1].pdf
          }
          
          
        })
    },

    ...mapActions({
      getItem: 'certificates/get',
      changeName: 'certificates/changeStudentName',
      updateCert: 'certificates/put',
    }),

    open() {
      if (this.items) {
        this.cert.name = this.items?.user?.name
        this.cert.name_local = this.items?.user?.name_local
        this.cert.national_id = this.items?.user?.national_id
        this.cert.passport_number = this.items?.user?.passport_number
      }
    },

    handleOk(e) {
      e.preventDefault();
      // Prevent modal from closing
      this.$refs.simpleRules.validate().then(qq=>{
        if(qq == true){
          this.status('updated','status')
          this.$nextTick(() => {
            this.$refs['update-modal'].toggle('#toggle-btn')
          })
        }
      });

    },
    async status(value, type = null, e ) {
      let globaluser = null;
      if (value === 'updated') {
        let payload = await this.updateName();
        globaluser = await this.changeName(payload)
        globaluser = globaluser.data
      }
        this.changeStatusFunc(value,type,globaluser);
    },

    async updateName(){
      let payload = {}
      let approval = await this.$refs.simpleRules.validate()
      if (approval) {
        this.fom = {
          name: this.cert.name,
          name_local: this.cert.name_local,
          national_id: this.cert.national_id,
          apply_to: this.items.apply,
          certificate_id: this.items.id,
          passport_number: this.cert.passport_number,
        }
        payload = {
          id: this.items.user.id,
          query: this.fom,
        }
      }
      return payload
    },

    changeStatusFunc(value,type,globaluser){
      this.form = {
        user_id: this.items.user.id,
        service_id: this.items.service.id,
        quantity: this.items.quantity,
        status: value,
        update_type: type,
        reject_reason: this.form.reject_reason,
      }
      let payload = {
        id: this.id,
        query: this.form
      }
      this.refreshphase = true
      this.updateCert(payload)
          .then(response => {
            this.refreshphase = false
                let pdf = this.pdf
                this.items = response.data
                this.items.user = globaluser != null ? globaluser : this.items.user;
                this.pdf = response.data.pdf
            this.$swal({
                  icon: 'success',
                  title: `${this.$t('Global.saved')}`,
                  showConfirmButton: false,
                  timer: 1500,
                })
                this.init()
            if(this.items.status==='Ready To Deliver'){
              window.location.reload()
            }
              }
          ).then(res=>{
        this.refreshphase = false
      })
    },
  },
}
</script>

<style scoped>

.flex-class-start{
  justify-content: flex-start;
}

.flex-class-end{
  justify-content: flex-end;
}

.align-item-right{
  text-align: right;
}

.align-item-left{
  text-align: left;
}

</style>
