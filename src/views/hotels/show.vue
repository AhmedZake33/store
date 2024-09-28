<template>
    <b-row v-if="hasPermission('access_hotel')">
      <b-col cols="12">
        <b-card style="max-width: 100%; text-transform: capitalize" class="mb-2">
          <b-card-header style="padding: 15px 0 !important">
            <b-col class="col-md-4" style="font-size: 14px">
              <h4>
                {{ $i18n.locale == "en" ? "Reservation" : "الحجز " }}
              </h4>
            </b-col>
            <!-- <b-col
              class="xs_mini col-8"
              :style="$i18n.locale == 'ar' ? 'text-align: left' : 'text-align: right'"
            >
            <b-button-group>
              <b-button
                class="btn-icon ml-1"
                @click="status(3)"
                variant="success"
                v-if="items.status == 1"
              >
                <span>
                  {{ $i18n.locale == "en" ? "Accept" : "قبول" }}
                </span>
              </b-button>
              <b-button
                class="btn-icon ml-1"
                @click="status(4)"
                variant="danger"
                v-if="items.status == 1"
              >
                <span>
                  {{ $t('Global.reject') }}
                </span>
              </b-button>
              <b-button
                class="btn-icon xs ml-1"
                @click="status(1)"
                variant="danger"
                v-if="items.status == 4 || items.status == 3"
              >
                <span>
                  {{ $i18n.locale == "en" ? "Reset" : "اعادة تعيين" }}
                </span>
              </b-button>
            </b-button-group>
            </b-col> -->
            <b-col
              class="xs_mini col-8"
              :style="$i18n.locale == 'ar' ? 'text-align: left' : 'text-align: right'"
            >
            <b-button-group>
              <b-button
                class="btn-icon"
                @click="status(3)"
                variant="success"
                v-if="items.status == 1"
              >
                <span>
                  {{ $i18n.locale == "en" ? "Accept" : "قبول" }}
                </span>
              </b-button>
              <b-button
                class="btn-icon"
                @click="status(4)"
                variant="danger"
                v-if="items.status == 1"
              >
                <span>
                  {{ $t('Global.reject') }}
                </span>
              </b-button>
              <b-button
                class="btn-icon"
                @click="status(1)"
                variant="danger"
                v-if="items.status == 4 || items.status == 3"
              >
                <span>
                  {{ $i18n.locale == "en" ? "Reset" : "اعادة تعيين" }}
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
                          {{ $i18n.locale == 'ar' ? items.user.name_local: items.user.name }}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
  
                <tr v-if="items.hotel_service">
                  <th scope="row" :width="'15%'">
                    {{ $t("Global.type") }}
                  </th>
                  <td class="d-flex flex-wrap">
                    <div class="d-flex">
                      <div class="d-flex flex-wrap">
                        <div>
                            <span>{{items.hotel_service.occupancy == 1? $i18n.locale == "ar" ? " زوجي " : 'Double ' :$i18n.locale == "ar"? " فردي "  : 'Single '}}</span>
                            <span>{{$i18n.locale == "ar"? items.hotel_service.name_local  : items.hotel_service.name}}</span>
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
                            :variant="handleColorNaming(lookups, items.status)"
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
                    {{ $t("Global.message") }}
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
      <b-modal no-close-on-backdrop ref="my-modal" v-model="reason_modal" hide-footer :title="$t('Global.note')">
      <div class="demo-vertical-spacing">
        <validation-observer ref="ruleForm">
          <b-form>
            <b-col cols="12" md="12">
              <b-form-group :label="$t('Global.message')" label-for="Message">
                <validation-provider #default="{ errors }" name="Message" :rules="'required'">
                  <b-form-textarea v-model="message" :state="errors.length > 0 ? false : null" type="number" />
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
  import { ValidationProvider, ValidationObserver, localize } from 'vee-validate';
  import { required, email } from '@validations';
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
      localize
    },
    computed: {
        ...mapGetters({
      loading: "Hotel/load",
      items: "Hotel/reservation",
      lookups: 'Hotel/lookups',
      load: 'Hotel/load'
    }),
      id() {
        return this.$route.params.id ? this.$route.params.id : null;
      },
    },
    data() {
      return {
        reason_modal:false,
        message:null,
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
        getItem: "Hotel/reservation",
      }),
      status(status_id){
        if(status_id == 4){
          this.reason_modal = true
        }else{
          this.$store
          .dispatch("Hotel/updateStatus", {
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
          .dispatch("Hotel/updateStatus", {
            query: {
               status: status_id ,
               reason: this.message
            },
            id: this.items.id,
          })
          .then((_) => {
            this.reason_modal = false
            this.reason = null
            this.showBtn = false
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
  