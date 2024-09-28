<template>
  <div>

    <DataTable
      :total="total"
      :allowSearch="true"
      :filter="filter"
      @Refresh="refresh"
      style="text-transform: capitalize"
      :allow-search="hasPermission('edit_certificate')"
      :allowActions="false"
      @reset="reset"
      :allowFilterWithoutSearch="false"
      :paramsLoaded="paramsLoaded"
    >

      <template #action>
        <b-button

          @click="newCertificate"
          class="btn-icon"
          v-b-tooltip.hover="$t('Global.add')"
          variant="primary"
        >
          <feather-icon icon="PlusIcon"
        /></b-button>
      </template>
      <template #filter v-if="lookups">
        <b-col cols="12" md="4">
          <v-select
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            v-model="filter.certificate_id"
            :options="lookups.certificates"
            :label="$i18n.locale=='en'?'name':'name_local'"
            class="w-100 mb-2"
            :reduce="(val) => val.id"
            :placeholder="$t('Global.certificate')"
          />
        </b-col>
        <b-col cols="12" md="4">
          <v-select
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            v-model="filter.status"
            :options="lookups.status"
            :label="$i18n.locale == 'en' ? 'name'.replaceAll('_', ' '):'name_local'"
            class="w-100 mb-2"
            :reduce="(val) => val.name"
            :placeholder="$t('Global.status')"
          >
            <template v-slot:option="option">
              {{
                $i18n.locale == 'ar'
                    ? option.name_local.replaceAll('_', ' ')
                    : option.name.replaceAll('_', ' ')
              }}
            </template>
            <template
                #selected-option="{
                name,
                name_local
              }"
            >
              <div style="display: flex; align-items: baseline">
                <strong v-if="$i18n.locale == 'ar'"
                >{{ name_local.replaceAll('_', ' ') }} </strong
                >
                <strong v-else
                >{{ name.replaceAll('_', ' ') }}</strong
                >
              </div>
            </template>
            <template #no-options>
              {{ $t('noMatching') }}
            </template>
          </v-select>
        </b-col>
        <b-col v-if="!user_id" cols="12" md="4">
          <v-select
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              v-model="filter.faculty_id"
              :options="lookups.faculties"
              :label="$i18n.locale == 'en' ? 'name':'name_local'"
              class="w-100 mb-2"
              :reduce="(val) => val.id"
              :placeholder="$t('faculties')"
          />
        </b-col>
        <b-col v-if="!user_id" cols="12" md="4">
          <v-select
            :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
            v-model="filter.bylaw_id"
            :options="lookups.bylaw"
            :label="$i18n.locale == 'en' ? 'name':'name_local'"
            class="w-100 mb-2"
            :reduce="(val) => val.name"
            :placeholder="$t('Global.bylaw')"
            :disabled="!filter.faculty_id"
          />
        </b-col>
        <b-col v-if="!user_id" cols="12" md="4">
        <!--      Start of Signtures -->
          <v-select
              :dir="$store.state.appConfig.layout.isRTL ? 'rtl' : 'ltr'"
              v-model="filter.type_id"
              :options="lookups.types"
              :label="$i18n.locale=='en'?'name':'name_local'"

              class="w-100 mb-2"
              :reduce="(val) => val.id"
              :placeholder="$t('request_type')"
          />
        </b-col>
<!--        <b-col v-if="!user_id" cols="12" md="4">-->
<!--          <v-select-->
<!--              v-model="filter.student_id"-->
<!--              :dir="$i18n.locale=='en' ? 'ltr' : 'rtl'"-->
<!--              :placeholder="$i18n.locale=='en'?'Student':'طالب'"-->
<!--              @search="fetchOptions"-->
<!--              :options="studentData"-->
<!--              :filterable="false"-->
<!--              :reduce="(val) => val.id"-->
<!--              :label="$i18n.locale=='en'?'name':'name_local'"-->
<!--          >-->
<!--            <template slot="no-options">-->
<!--              {{$i18n.locale == 'en' ? 'Type Student Code or Name to search' : 'أكتب كود الطالب او اسمه للبحث'}}-->
<!--            </template>-->
<!--            <template slot="option" slot-scope="option">-->
<!--              <div class="d-center">-->
<!--                {{ $i18n.locale == 'en' ? (option.name ? option.name :option.name_local) : (option.name_local ? option.name_local : option.name )}}-->
<!--              </div>-->
<!--            </template>-->
<!--          <template #no-options>-->
<!--  {{ $t('noMatching') }}-->
<!--</template>-->
<!--</v-select>-->
<!--        </b-col>-->
      </template>
      <template #customTable>
        <b-table
          :busy="load"
                    @sort-changed="sortingChanged"
          no-local-sorting
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
          <template #cell(student)="data">
            <b-media
              vertical-align="center"
              class="d-inline-flex align-items-center"
              v-if="data.item.user || data.item.external_data"
            >
              <template #aside  v-if="data.item.user">
                <b-avatar size="32" :text="avatarText(data.item.user.name)" />
              </template>
              <div  v-if="data.item.external_data">
                External Request #({{
                  data.item.external_data.student_code
                }})
              </div>
              <div v-else>
              <b-link
                v-if="$i18n.locale == 'ar'"
                v-b-tooltip.hover="
                  data.item.user && data.item.user.name
                    ? data.item.user.name_local
                    : '-'
                "
                class="font-weight-bold d-inline-block text-nowrap"
                :to="{ name: 'student-show', params: { id: data.item.user.id } }"
              >
                {{
                  data.item.user
                    ? data.item.user.name_local
                      ? data.item.user.name_local
                      : data.item.user.name
                    : "_"
                }}
              </b-link>
              <b-link
                class="font-weight-bold d-inline-block text-nowrap"
                :to="{ name: 'student-show', params: { id: data.item.user.id } }"
                v-if="$i18n.locale == 'en'"
                v-b-tooltip.hover="
                  data.item.user && data.item.user.name
                    ? data.item.user.name
                    : '-'
                "
              >
                {{
                  data.item.user
                    ? data.item.user.name
                      ? data.item.user.name
                      : data.item.user.name_local
                    : "_"
                }}
              </b-link>
              </div>

            </b-media>
          </template>
          <template #cell(certificate)="data">
            <div
              class="font-weight-bold d-inline-block text-nowrap"
              v-if="!hasPermission('show_certificate') && data.item.service"
              v-b-tooltip.hover
              :title = '
                      $i18n.locale == "en"
                    ? data.item.service.name
                    ? data.item.service.name
                    : data.item.service.name_local
                    : data.item.service.name_local
                    ? data.item.service.name_local
                    : data.item.service.name
              '
            >
              {{
                $i18n.locale == "en"
                  ? data.item.service.name
                    ? data.item.service.name
                    : data.item.service.name_local
                  : data.item.service.name_local
                  ? data.item.service.name_local
                  : data.item.service.name
              }}
            </div>
            <b-link
              v-else-if="hasPermission('show_certificate') && data.item.service"
              class="font-weight-bold d-inline-block text-nowrap"
              :to="{ name: 'certificate', params: { id: data.item.id } }"
              :title = '$i18n.locale == "en"
                    ? data.item.service.name
                    ? data.item.service.name
                    : data.item.service.name_local
                  : data.item.service.name_local
                  ? data.item.service.name_local
                  : data.item.service.name'
              v-b-tooltip.hover
            >
              {{
                $i18n.locale == "en"
                  ? data.item.service.name
                    ? shortMyText(data.item.service.name)
                    : shortMyText(data.item.service.name_local)
                  : data.item.service.name_local
                  ? shortMyText(data.item.service.name_local)
                  : shortMyText(data.item.service.name)
              }}
            </b-link>
            <b-link
                v-else-if="data.item.external_data"
                class="font-weight-bold d-inline-block text-nowrap"
                :to="{ name: 'certificate-external', params: { id: data.item.id } }"
            >
              External Request #({{
              data.item.external_data.student_code
              }})
            </b-link>
            <div v-else class="font-weight-bold d-inline-block text-nowrap">
              -
            </div>
          </template>
          <template #cell(apply_to)="data">
            <div v-if="data.item.apply_to">
              {{
                data.item.apply_to
                  ? data.item.apply_to !='undefined'
                    ? data.item.apply_to
                    : "_"
                  : "_"
              }}
            </div>
          </template>
          <template #cell(quantity)="data">
            <div v-if="data.item.apply_to">
              {{
                data.item.quantity
                  ? data.item.quantity
                    ? data.item.quantity
                    : data.item.quantity
                  : "_"
              }}
            </div>
          </template>
          <template #cell(requested_at)="data">
            <div v-if="data.item.created_at">
              {{ toLocalDatetime(data.item.created_at, $i18n.locale) }}
            </div>
          </template>
          <template #cell(updated_at)="data">
            <div v-if="data.item.updated_at">
              {{ toLocalDatetime(data.item.updated_at, $i18n.locale) }}
            </div>
          </template>
          <template #cell(status)="data">
            <div >
              <b-badge
                  v-b-tooltip.hover.top="data.item.reject_reason"
                  pill :variant="`light-danger`" v-if="data.item.status=='rejected'" class="text-capitalize">{{
                $t(`Global.${data.item.status}`)
              }}</b-badge>
              <b-badge pill :variant="`light-success`" v-else-if="data.item.status=='approved'" class="text-capitalize">{{
                  $t(`Global.${data.item.status}`)
                }}</b-badge>
              <b-badge pill :variant="`light-primary`" v-else class="text-capitalize">{{
                  $t(`Global.${data.item.status}`)
                }}</b-badge>
            </div>
          </template>

<!--          <template #cell(actions)="data">-->
<!--&lt;!&ndash;            <div v-if="data.item.status == 'new' || data.item.status == 'unpaid' ">&ndash;&gt;-->
<!--&lt;!&ndash;              <b-link&ndash;&gt;-->
<!--&lt;!&ndash;                :to="{ name: 'edit_certification', params: { id: data.item.id } }"&ndash;&gt;-->
<!--&lt;!&ndash;                class="mx-1"&ndash;&gt;-->
<!--&lt;!&ndash;                v-if="!data.item.external_data"&ndash;&gt;-->
<!--&lt;!&ndash;              >&ndash;&gt;-->
<!--&lt;!&ndash;                <feather-icon icon="EditIcon" />&ndash;&gt;-->
<!--&lt;!&ndash;              </b-link>&ndash;&gt;-->
<!--&lt;!&ndash;            </div>&ndash;&gt;-->
<!--&lt;!&ndash;            <div v-if="data.item.status == 'rejected'">&ndash;&gt;-->
<!--&lt;!&ndash;              <b-button  class="btn-icon"&ndash;&gt;-->
<!--&lt;!&ndash;                         variant="flat-info"&ndash;&gt;-->
<!--&lt;!&ndash;                         v-b-modal.modal-2&ndash;&gt;-->
<!--&lt;!&ndash;                        @click="showReason(data.item.reject_reason)"&ndash;&gt;-->
<!--&lt;!&ndash;              >&ndash;&gt;-->
<!--&lt;!&ndash;              <feather-icon icon="AlertTriangleIcon" />&ndash;&gt;-->
<!--&lt;!&ndash;              </b-button>&ndash;&gt;-->
<!--&lt;!&ndash;            </div>&ndash;&gt;-->
<!--          </template>-->
        </b-table>
      </template>
      <template  #studentSerach>
        <b-col class="CustomBtn w-100" v-if="!user_id" cols="12" md="6"   style="padding: 0 !important;">
          <v-select
              class="CustomBtn"
              v-model="filter.student_id"
              :dir="$i18n.locale=='en' ? 'ltr' : 'rtl'"
              :placeholder="$i18n.locale=='en'?'Search For a Student':'ابحث عن طالب'"
              @search="fetchOptions"
              :options="studentData"
              :filterable="false"
              :reduce="(val) => val.id"
              :label="$i18n.locale=='en'?'name':'name_local'"
          >
            <template slot="no-options">
              {{$i18n.locale == 'en' ? 'Type Student Code or Name to Search' : 'أكتب كود الطالب او اسمه للبحث'}}
            </template>
            <template slot="option" slot-scope="option">
              <div class="d-center">
                {{ $i18n.locale == 'en' ? (option.name ? option.name :option.name_local) : (option.name_local ? option.name_local : option.name )}}
              </div>
            </template>
           <template #no-options>
            {{ $t("search_input_text") }}
           </template>
          </v-select>
        </b-col>
        <span v-else></span>
      </template>
    </DataTable>
    <b-modal
        id="modal-2"
        :title="$i18n.locale == 'en' ? 'Reject Reason' : 'سبب الرفض' "
        :ok-title="$i18n.locale == 'en' ? 'OK' : 'حسنا' "
        ok-only
    >
      {{rejectMessage}}
    </b-modal>
    <b-modal
      id="newCerificate"
      :title="$i18n.locale == 'en' ? 'Request Certificate' : 'طلب شهادة' "
      v-model="newCertificateModal"
      no-close-on-backdrop
      hide-footer
    >
      <NewCertifice 
        @hide="hideModal()"
        @refresh="refresh()"
        :user_id="user_id"
        :certificateslookups="lookups && lookups.certificates ? lookups.certificates : null"
      />
    </b-modal>
  </div>
</template>

<script>
import {
  BCard,
  BRow,
  BCol,
  BFormInput,
  BButton,
  BTable,
  BMedia,
  BAvatar,
  BLink,
  BBadge,
  BDropdown,
  BSpinner,
  BDropdownItem,
  BPagination,
  BOverlay,
  BCardHeader,
  BCardBody,
  BModal,
  VBModal,
  BPopover,
  VBTooltip,
} from "bootstrap-vue";
import DataTable from "@/views/components/table/DataTable";
import { mapActions, mapGetters } from 'vuex'
import Ripple from "vue-ripple-directive";
import vSelect from "vue-select";
import { avatarText } from "@core/utils/filter";
import NewCertifice from '@/views/for_student/service/certification/add'

export default {
  components: {
    DataTable,
    BCard,
    vSelect,
    BRow,
    NewCertifice,
    BSpinner,
    BCol,
    BOverlay,
    BCardHeader,
    BCardBody,
    BFormInput,
    BButton,
    BTable,
    BMedia,
    BAvatar,
    BLink,
    BBadge,
    BDropdown,
    BDropdownItem,
    BPagination,
    BModal,
    VBModal,
    BPopover,
  },
  directives: {
    "b-modal": VBModal,
    'b-tooltip': VBTooltip,
    Ripple,
  },
  props: {
    user_id: null,
    studentShow:false
  },
  data() {
    return {
      filter: {
        certificate_id:null,
        status:null,
        faculty_id:null,
        bylaw_id:null,
        type_id:null,
        order_direction:true,
        student_id:null,
        removed:0,
        export:0,
      },
      selectedStudent:null,
      newCertificateModal: false,
      showlist:false,
      studentsOptions:[],
      reject_message:null,
      paramsLoaded:true,
    };
  },
  computed: {
    ...mapGetters({
      items:    "certificates/items",
      total:    "certificates/total",
      load:     "certificates/load",
      lookups:  "certificates/lookups",
    }),

    fields: function () {
      if (this.user_id) {
        return [
          // {
          //   key: 'id',
          //   label: '#',
          //   sortable: true,
          //   thStyle: { width: "5%" },
          // },
          {
            key: "certificate",
            sortable: false,
            label: this.$t("Global.certificate"),
            thStyle: { width: "35%" },
          },
          {
            key: "requested_at",
            label: this.$t("Global.requested_at"),
            sortable: true,
          },
          {
            key: "quantity",
            label: this.$t("Global.quantity"),
            sortable: false,
          },
          {
            key: "apply_to",
            label: this.$t("Global.apply_to"),
            sortable: false,
          },
          {},
          {
            key: "status",
            label: this.$t("Global.status"),
            sortable: false,
          }
        ];
      }
      return [
        // {
        //   key: "id",
        //   label: this.$t("Global.code"),
        //   sortable: true,
        //   thStyle: { width: "5%" },
        // },
        {
          key: "student",
          sortable: true,
          label: this.$t("Global.student"),
          thStyle: { width: "10%" },
        },
        {
          key: "certificate",
          label: this.$t("Global.certificate"),
          sortable: true,
          thStyle: { width: "10%" },
        },
        {
          key: "requested_at",
          label: this.$t("Global.requested_at"),
          sortable: true,
        },
        {
          key: "updated_at",
          label: this.$t("Global.updated_at"),
          sortable: true,
        },
        {
          key: "status",
          label: this.$t("Global.status"),
          sortable: true,
        },

      ];
    },
    searchStudent : function (val) {
      let search = this.selectedStudent;
    },
    studentData: function (){
      return this.studentsOptions;
    },
    rejectMessage:function (){
      return this.reject_message
    }
  },

  methods: {
    ...mapActions({
      getStudentLookup:'students/lookup'
    }),
    refresh(query) {
      query = { ...query, user_id: this.user_id };
      this.$store.dispatch("certificates/certificates", { query: query })
      .then((data)=>{
          this.paramsLoaded =false
      });
    },
    newCertificate() {
      // this.$router.push({ name: "add_certification" });
      this.newCertificateModal = true
    },
    showList(){
      this.showlist=true
    },
    fetchOptions (search, loading) {
      //  ... do some asynchronous stuff!
      let query={
        studentQuery:search
      }

      if(search.length > 1){
        loading(true)
      this.getStudentLookup(query).then((res)=>{
        this.studentsOptions=res.success.students
        loading(false)
      }).catch((err)=>{
        loading(false)
      })
      }
    },
    showReason(reason){
      this.reject_message = reason;
    },
    reset(){
      this.filter = {
        certificate_id:null,
        status:null,
        faculty_id:null,
        bylaw_id:null,
        type_id:null,
        sort_direction:null,
        student_id:null,
        removed:0,
        export:0,
      }
    },
    hideModal(){
      this.newCertificateModal = false
    }
  },
};
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}
</style>

<style lang="scss" scoped>
@import "@core/scss/vue/libs/vue-select.scss";
ul{
  margin-top: 10px;
  list-style-type: none;
  transition: 0.3s linear;
}
ul li{
  border-radius: 4px;
}
ul li:last-child{
  border-radius: 4px;
}
ul li {
  padding: 5px;
}
ul li:hover{
  background-color: #00cfe8;
}

</style>
