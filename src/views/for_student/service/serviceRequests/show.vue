<template>
    <b-row v-if="hasPermission('access_other')">
      <b-col cols="12">
        <b-card style="max-width: 100%; text-transform: capitalize" class="mb-2">
          <b-card-header style="padding: 15px 0 !important">
            <b-col class="col-md-4" style="font-size: 14px">
              <h4>
                {{ $i18n.locale == "en" ? "Other Services" : "الخدمات الاخري" }}
              </h4>
            </b-col>
            <b-col
              class="xs_mini col-8"
              :style="$i18n.locale == 'ar' ? 'text-align: left' : 'text-align: right'"
            >
            <b-button-group>
              <b-button
                class="btn-icon"
                @click="status(2)"
                variant="success"
                v-if="items.status == 1 && hasPermission('approve_other')"
              >
                <span>
                  {{ $i18n.locale == "en" ? "Approve" : "قبول" }}
                </span>
              </b-button>
              
              
              <b-button
                class="btn-icon"
                @click="status(3)"
                variant="success"
                v-if="items.status == 2 && hasPermission('delivered_other')"
              >
              <span>
                  {{ $i18n.locale == "en" ? "Delivered" : "تم الاستلام " }}
                </span>
              </b-button>
              <b-button
                class="btn-icon xs"
                @click="status(1)"
                variant="secondary"
                v-if="
                  (items.status == 3 || items.status == 2 || items.status == 4) && hasPermission('reset_other')
                "
              >
                <span>
                  {{ $i18n.locale == "en" ? "Reset" : "اعادة تعيين" }}
                </span>
              </b-button>
              <b-button
                class="btn-icon"
                @click="status(4)"
                variant="danger"
                v-if="items.status == 1 && hasPermission('reject_other')"
              >
                <span>
                  {{$i18n.locale == "en" ? "Reject" : "رفض " }}
                </span>
              </b-button>
            </b-button-group>
            </b-col>
          </b-card-header>
  
          <b-card-body style="padding: 0 !important">
            <div
              v-if="loading"
              style='
                position: absolute;
                width: 100%;
                top: 0;
                bottom: 0;
                left: 0;
                right: 0;
                background-color: #fff;
                opacity: 0.8;
                text-align: center;
                z-index: 999;
              '
            >
              <b-spinner
                variant="primary"
                style="position: absolute; top: 40px; z-index: 1000"
              />
            </div>
            
            <list v-else :data="items" style="padding: 0 !important" :only="[]">
              <template #custom_show>
                <tr v-if="items.user">
                  <th scope="row" :width="'15%'">
                    {{ $t("Global.student") }}
                  </th>
                  <td class="d-flex flex-wrap">
                    <div class="d-flex">
                      <div class="d-flex flex-wrap">
                        <div>
                          <span v-if="$i18n.locale == 'en'">{{ items.user.name ? items.user.name : items.user.name_local }}</span>
                          <span v-if="$i18n.locale == 'ar'">{{ items.user.name_local ? items.user.name_local : items.user.name }}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
  
                <tr v-if="items.service">
                  <th scope="row" :width="'15%'">
                    {{ $t("Global.service_type") }}
                  </th>
                  <td class="d-flex flex-wrap">
                    <div class="d-flex">
                      <div class="d-flex flex-wrap">
                        <div>
                          <span v-if="$i18n.locale == 'en'">{{ items.service.name?items.service.name:items.service.name_local }}</span>
                          <span v-if="$i18n.locale == 'ar'">{{ items.service.name?items.service.name_local:items.service.name }}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>

                <tr>
                  <th scope="row" :width="'15%'">
                    {{ $t("Global.status") }}
                  </th>
                  <td class="d-flex flex-wrap">
                    <div class="d-flex">
                      <div class="d-flex flex-wrap">
                        <div>
                          <b-badge
                            pill
                            :variant="`danger`"
                            v-if="items.status == 4"
                            class="text-capitalize"
                          >
                            {{
                              $t(`${handleStatusNaming(lookups, items.status)}`)
                            }}
                          </b-badge>
                          <b-badge
                            pill
                            :variant="`primary`"
                            v-else-if="items.status == 2"
                            class="text-capitalize"
                          >
                            {{
                              $t(`${handleStatusNaming(lookups, items.status)}`)
                            }}
                          </b-badge>
                          <b-badge
                            pill
                            :variant="`warning`"
                            v-else-if="items.status == 1"
                            class="text-capitalize"
                          >
                            {{
                              $t(`${handleStatusNaming(lookups, items.status)}`)
                            }}
                          </b-badge>
                          <b-badge
                            pill
                            :variant="`success`"
                            v-else
                            class="text-capitalize"
                          >
                            {{
                              $t(`${handleStatusNaming(lookups, items.status)}`)
                            }}
                          </b-badge>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>

                <tr v-if="items.reason">
                  <th scope="row" :width="'15%'">
                    {{ $t("Global.reason") }}
                  </th>
                  <td class="d-flex flex-wrap">
                    <div class="d-flex">
                      <div class="d-flex flex-wrap">
                        <div>
                          {{ items.reason }}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>

                <tr v-if="items.payment_status_object">
                  <th scope="row" :width="'15%'">
                    {{ $t("Global.Payment") }}
                  </th>
                  <td class="d-flex flex-wrap">
                    <div class="d-flex">
                      <div class="d-flex flex-wrap">
                        <div>
                          
                          <b-badge
                            pill
                            :variant="items.payment_status_object.color"
                            v-if="$i18n.locale == 'en'"
                            class="text-capitalize"
                          >

                          {{ items.payment_status_object?items.payment_status_object.name:items.payment_status_object.name_local }}
                          </b-badge>
                          <b-badge
                            pill
                            :variant="items.payment_status_object.color"
                            v-else-if="$i18n.locale == 'ar'"
                            class="text-capitalize"
                          >

                          {{ items.payment_status_object?items.payment_status_object.name_local:items.payment_status_object.name }}
                          </b-badge>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
  
    
              </template>
            </list>
          </b-card-body>
        </b-card>
      </b-col>
      <!-- <b-modal id="modal_applicant" v-model="reason_modal" no-close-on-backdrop
      :title="$t('Global.note')">
                <b-form-textarea
                id="textarea-no-resize"
                :placeholder="$t('Global.reason')"
                rows="3"
                no-resize
                v-model="reason"
              ></b-form-textarea>
          <template #modal-footer>
            <b-button
                class="btn-icon"
                @click="refuse(4)"
                variant="primary"
                v-if="items.status == 1"
                :class="showBtn ? 'disabled_all mr-1' : 'mr-1'"
              >
                <span v-if="!showBtn">
                  {{ $t("save") }}
                </span>
                  <b-spinner
                      v-if="showBtn"
                      small
                      :label="$t('Global.loading')"
                  ></b-spinner>
                
              </b-button>
              <b-button class="btn-icon"  @click="close_modal">{{ $t('Global.cancel') }}</b-button>
          </template>
      </b-modal> -->
      <b-modal no-close-on-backdrop ref="my-modal" v-model="reason_modal" hide-footer :title="$t('Global.note')">
        <div class="demo-vertical-spacing">
          <validation-observer ref="ruleForm">
            <b-form>
              <b-col cols="12" md="12">
                <b-form-group :label="$t('Global.message')" label-for="Message">
                  <validation-provider #default="{ errors }" name="Message" :rules="'required'">
                    <b-form-textarea v-model="reason" :state="errors.length > 0 ? false : null" type="number" />
                    <small v-if="errors.length" class="text-danger">{{ validation(null, 0).message }}</small>
                  </validation-provider>
                </b-form-group>
              </b-col>
            </b-form>
          </validation-observer>
        </div>
        <div class="mt-2">
          <b-col cols="12" md="12">
            <div class="d-flex justify-content-end">
              <b-button type="submit" variant="primary" class="mr-1" @click="refuse(4)" :disabled="showBtn">
                {{ $t('Global.save') }}
                <b-spinner
                    v-if="showBtn"
                    small
                    :label="$t('Global.loading')"
                ></b-spinner>
              </b-button>
              <b-button type="reset" variant="outline-primary" @click="close_modal">
                {{ $t('Global.cancel') }}
              </b-button>
            </div>
          </b-col>
        </div>
      </b-modal>
    </b-row>
  </template>
  
  <script>
  import { mapActions, mapGetters } from "vuex";
  import {
    BCard,
    BCol,
    BRow,
    BLink,
    BOverlay,
    BSpinner,
    BCardHeader,
    BCardBody,
    BFormGroup,
    BButtonGroup,
    BFormInput,
    BForm,
    BBadge,
    BFormTextarea
  } from "bootstrap-vue";
  import form from "@/store/modules/quality/forms/form";
  import List from "@/views/components/info/list";
  import { required, email } from '@validations';
  import { ValidationProvider, ValidationObserver, localize } from 'vee-validate';
  export default {
    name: "Show",
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
      BButtonGroup,
      BBadge,
      BFormTextarea,
      ValidationProvider,
      ValidationObserver,
    },
    computed: {
        ...mapGetters({
      loading: "services/load",
      items: "services/request",
      "lookups" : "services/lookups"
    }),
      id() {
        return this.$route.params.id ? this.$route.params.id : null;
      },
    },
    data() {
      return {
        reason_modal:false,
        reason:null,
        showBtn:false
      };
    },
    mounted() {
      this.init();
    },
    methods: {
      init() {
        this.getItem(this.id).then((res) => {
          
        });
      },
      close_modal(){
        this.reason_modal = false
      },
  
      ...mapActions({
        getItem: "services/getRequest",
      }),
      status(status_id){
        if(status_id == 4){
          this.reason_modal = true
        }else{
           this.$store
          .dispatch("services/updateStatus", {
            query: { status: status_id },
            id: this.items.id,
          })
          .then((_) => {
            this.$swal({
              icon: "success",
              title: `${this.$t("Global.saved")}`,
              showConfirmButton: false,
              timer: 1500,
            });
            this.init();
          });
        }
       
      },
      refuse(status_id){
        this.showBtn = true
        this.$store
          .dispatch("services/updateStatus", {
            query: {
               status: status_id ,
               reason: this.reason
            },
            id: this.items.id,
          })
          .then((_) => {
            this.reason_modal = false
            this.reason = null
            this.$swal({
              icon: "success",
              title: `${this.$t("Global.saved")}`,
              showConfirmButton: false,
              timer: 1500,
            });
            this.init();
          });
      }
  
    },
  };
  </script>
  
  <style scoped>
  .flex-class-start {
    justify-content: flex-start;
  }
  
  .flex-class-end {
    justify-content: flex-end;
  }
  
  .align-item-right {
    text-align: right;
  }
  
  .align-item-left {
    text-align: left;
  }
  </style>
  