<template>
    <div
        <DataTable
      :total="total"
      :allowSearch="true"
      :filter="filter"
      @Refresh="refresh"
      style="text-transform: capitalize"
      :allow-search="hasPermission('access_hotel')"
      :allowActions="false"
      @reset="reset"
      :loading="load"
      :paramsLoaded="paramsLoaded"
    >

      <template #action>
        
      </template>
      <template #filter>
        <b-col cols="12" md="4" v-if="lookups">
          <v-select
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            v-model="filter.status"
            :options="lookups.statuses"
            :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
            class="w-100 mb-2"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.status')"
          />
        </b-col>

        <b-col cols="12" md="4" v-if="lookups">
            <v-select
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            v-model="filter.type"
            :options="lookups.types"
            :label="$i18n.locale == 'en' ? 'name' : 'name_local'"
            class="w-100 mb-2"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.type')"
            />
        </b-col>
      </template>

      <template #customTable>
        <b-table
          :sort-desc.sync="filter.order_direction"
          :sort-by.sync="filter.order_by"
          class="position-relative"
          :items="items"
          responsive
          :fields="fields"
          primary-key="id"
          show-empty
          :empty-text="$t('Global.empty_text')"
        >
          <template #table-busy>
            <div class="text-center text-black my-2">
              <b-spinner class="align-middle"></b-spinner>
            </div>
          </template>
          <template #cell(user)="data">
            <div v-if="data && data.item && data.item.user">
              <b-media
                vertical-align="center"
                class="d-inline-flex align-items-center"
                v-if="data.item.user || data.item.external_data"
              >
                <template #aside v-if="data.item.user">
                  <b-avatar size="32" :text="avatarText(data.item.user.name)" />
                </template>
                <b-link
                  v-if="$i18n.locale == 'ar'"
                  class="font-weight-bold d-inline-block text-nowrap"
                  :to="{
                    name: 'student-show',
                    params: { id: data.item.user.id },
                  }"
                >
                  {{
                    data.item.user
                      ? $i18n.locale == 'ar'
                        ? data.item.user.name_local
                        : data.item.user.name
                      : "_"
                  }}
                </b-link>
                <b-link
                  class="font-weight-bold d-inline-block text-nowrap"
                  :to="{
                    name: 'student-show',
                    params: { id: data.item.user.id },
                  }"
                  v-if="$i18n.locale == 'en'"
                >
                  {{
                    data.item.user
                      ? $i18n.locale == 'ar'
                        ? data.item.user.name_local
                        : data.item.user.name
                      : "_"
                  }}
                </b-link>
              </b-media>
            </div>
          </template>
          
        <template #cell(status)="data">
            <div v-if="data && data.item">
              <b-badge
                pill
                :variant="handleColorNaming(lookups, data.item.status)"
                class="text-capitalize"
              >
                {{ $t(`${handleStatusNaming(lookups, data.item.status)}`) }}
              </b-badge>
            </div>
        </template>

        <template #cell(type)="data">
            <div v-if="data && data.item">
                <span>{{data.item.hotel_service.occupancy == 1? $i18n.locale == "ar" ? " ثنائي " : 'Double ' :$i18n.locale == "ar"? " فردي "  : 'Single '}}</span>
                <span>{{$i18n.locale == "ar"? data.item.hotel_service.name_local  : data.item.hotel_service.name}}</span>
            </div>
        </template>

        <!-- <template #cell(payment_status)="data">
            <div v-if="data.item.payment_status_object != null">
                <span v-if="data.item.payment_status == 0">
                <b-link
                    :to="{
                    name: 'PaymentConfirmation',
                    params: { id: data.item.payment_id },
                    query: { returnUrl: $router.resolve({ name: 'Other' }).href },
                    }"
                >
                    {{ $t("Pay Now") }}
                </b-link>
                </span>
                <span v-else>
                
                    {{
                    $i18n.locale == "ar"
                    ? data.item.payment_status_object.name_local
                    : data.item.payment_status_object.name
                    }}
                
                </span>
            </div>
            
        </template> -->
          
          <template #cell(actions)="data">
            <div>
              <b-dropdown
                v-if="needDrop"
                v-ripple.400="'rgba(255, 255, 255, 0.15)'"
                variant="flat-primary"
                class="dropdown-icon-wrapper custom_action_drop"
              >
                <template #button-content>
                  <feather-icon
                    icon="MoreVerticalIcon"
                    size="16"
                    class="align-middle"
                  />
                </template>
              </b-dropdown>
              <b-link
                :to="{ name: 'show_reservation', params: { id: data.item.id } }"         
                >
                <feather-icon
                  v-b-tooltip.hover="$t('Global.show')"
                  icon="EyeIcon"
                  class="text-primary"
                />
              </b-link>
                <div class="align-items-center" v-if="data.item.removed != 1 && hasPermission('delete_hotel')">
                    <feather-icon @click="remove(data.item.id)" v-b-tooltip.hover="$t('Global.delete')" icon="Trash2Icon" style="cursor: pointer" class="text-danger" />
                </div>
             
            </div>
          </template>
        </b-table>
      </template>
     
    </DataTable>
    </div>
</template>

<script>
import DataTable from "@/views/components/table/DataTable";
import { mapActions, mapGetters } from 'vuex';
import vSelect from "vue-select";
import {
//   BCard,
//   BRow,
  BCol,
//   BFormInput,
//   BButton,
  BTable,
  BMedia,
  BAvatar,
  BLink,
  BBadge,
//   BDropdown,
//   BDropdownItem,
//   BPagination,
//   BOverlay,
//   BCardHeader,
//   BCardBody,
//   BModal,
//   VBModal,
//   BPopover,
} from "bootstrap-vue";
export default {
    components:{
        DataTable,
        BTable,BAvatar,BLink,BMedia,BBadge,BCol,vSelect
    },
    data(){
        return {
            filter: {
                type: null,
                status: null,
                removed:0
            },
            paramsLoaded:true
        }
    },
    methods : {
        remove(id){
            this.$swal({
                title: `${this.$t('Global.deleteTitle')}`,
                text: `${this.$t('Global.deleteText')}`,
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
                    this.$store.dispatch('Hotel/delete',{id : id}).then(()=>{
                    this.refresh(this.filter);
                    this.$swal({
                    icon: 'success',
                    title: this.$t('Global.deleted'),
                    showConfirmButton: false,
                    timer: 1500,
                    });
                });
                }
            });
        },
        reset() {
      let terms = [
        "term_id",
        "admission_term_id",
        "admission_term_PG_id",
        "admission_term_UG_id",
        "control_term_id",
        "exam_term_id",
        "transfer_term_id",
      ];
      let query = { ...this.$route.query, ...{} };
      let currentTerm = terms.find((el) => {
        return Object.keys(query).some((qu) => {
          return el == qu;
        });
      });
      Object.keys(query).forEach((key) => {
        if (key != currentTerm && key != "removed" && key != "export") {
          this.filter[key] = null;
        }
      });
      this.resetFilterQueryParams(terms);
    },
        newReservation(){
            this.$router.push({name : 'new_reservations'});
        },
        refresh(query){
            this.$store.dispatch('Hotel/reservations',{query : query}).then(()=>{
                this.paramsLoaded = false;
            });
        }
    },
    computed:{
        ...mapGetters({
      items:    "Hotel/reservations",
      total:    "Hotel/totalReservations",
      load:     "Hotel/load",
      needDrop:'app/needDrop',
      lookups: "Hotel/lookups"
    }),
    fields: function () {
      return [
        {
          key: "user",
          sortable: false,
          label: this.$t("Global.student_name"),
          thStyle: { width: "30%" },
        },
        {
          key: "type",
          sortable: false,
          label: this.$t("Global.type"),
          thStyle: { width: "30%" },
        },
        {
          key: "status",
          label: this.$t("Global.status"),
          sortable: false,
        },
        // {
        //   key: "payment_status",
        //   label: this.$t("Global.payment"),
        //   sortable: false,
        // },
        {
          key: "actions",
          label: this.$t("Global.actions"),
          thClass: "customAction",
          tdClass: "customWidth",
        //   thStyle: { width: "25%" },
        },
      ];
    },
    },
    mounted(){
       
    }
}
</script>

<style scoped>
.text-capitalize {
  margin-right: 5px;
}
</style>