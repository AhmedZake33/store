<template>
  <div>
    <DataTable
      :total="total"
      :allowSearch="false"
      :filter="filter"
      @Refresh="refresh"
      @Export="Export"
      style="text-transform: capitalize"
      :allow-search="false"
      :allowActions="false"
      :loading="load"
      :paramsLoaded="paramsLoaded"
  >
<!--    <template #action>-->
<!--      <b-button-->
<!--          @click="newCertificate"-->
<!--          class="btn-icon"-->
<!--          v-b-tooltip.hover="$t('Global.add')"-->
<!--          v-if="hasPermission('add_certificateSetting')"-->
<!--          variant="primary"-->
<!--      >-->
<!--        <feather-icon icon="PlusIcon"-->
<!--        /></b-button>-->
<!--      <b-button  v-if="hasPermission('export_certificateSetting')"-->
<!--         v-b-tooltip.hover="$t('Global.export_excel')"  class="btn-icon ml-1" variant="primary" @click="filter.export = 1">-->
<!--        <feather-icon icon="FileTextIcon" />-->
<!--      </b-button>-->
<!--    </template>-->
    <template #customTable>
      <b-table
          :busy="load"
                    @sort-changed="sortingChanged"
          no-local-sorting
          class="position-relative"
          :items="items"
          responsive
          striped
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
        <template #cell(name)="data">
          <div>
<!--            <b-link-->
<!--                class="font-weight-bold d-inline-block text-nowrap"-->
<!--                :to="{ name: 'certificates_settings_edit', params: { id: data.item.id } }"-->
<!--            >-->
<!--              {{ $i18n.locale == 'en' ?  data.item.name : data.item.name_local }}-->
<!--            </b-link>-->
              {{ $i18n.locale == 'en' ?  data.item.name : data.item.name_local }}
          </div>
        </template>
        <template #cell(amount)="data">
          <div>
            {{  data.item.payment_settings.value_usd }}
          </div>
        </template>
        <template #cell(local_amount)="data">
          <div>
            {{ data.item.payment_settings.value_local }}
          </div>
        </template>
        <template #cell(signs)="data">
          <div>
            <span v-for="(service,index) in data.item.service_roles" :key="index">
              {{ $i18n.locale == 'en' ? ( service.name ?service.name:service.name_local ) : (service.name_local ? service.name_local : service.name ) }}
            <small v-if=" index < data.item.service_roles.length-1 ">,</small>
            </span>
          </div>
        </template>
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
            <feather-icon
                v-b-tooltip.hover="$t('Global.edit')"
                icon="EditIcon"
                style="cursor: pointer;margin-left: 3px"
                @click="showModal(data.item,true)"
                class="text-primary"
            />
<!--            <feather-icon-->
<!--                v-if="hasPermission('delete_certificateSetting')"-->
<!--                v-b-tooltip.hover="$t('Global.delete')"-->
<!--                icon="Trash2Icon"-->
<!--                :style="$i18n.locale == 'en' ? 'margin-left:5%' :'margin-right:5%'"-->
<!--                style="cursor: pointer;"-->
<!--                class="text-danger"-->
<!--                @click="remove(data.item.id)"-->
<!--            />-->
          </div>
        </template>
      </b-table>
    </template>
  </DataTable>
    <div class="all-modals">
      <!-- modal -->
      <b-modal
          id="modal-prevent-closing"
          ref="my-modal"
          size="lg"
          :title="titleData"
          no-close-on-backdrop
          hide-footer
          @show="resetModal"
          @hidden="resetModal"
      >
        <EditCertificateSettings
            :data-input="getInputData()"
            :year_id="yearId"
            :is-edit-show="isEditable"
            @hideModal="hideModal()"
            @refresh = "refresh()"
        />
        <div />
      </b-modal>
    </div>
  </div>
</template>
<script>
import DataTable from '@/views/components/table/DataTable'
import { BTable, BLink } from 'bootstrap-vue'
import { mapActions,mapGetters } from 'vuex'
import EditCertificateSettings from '@/views/services_settings/certificates/edit'

export default {
  components: {
    DataTable,
    BTable,
    BLink,
    EditCertificateSettings,
  },
  props: {
    yearId: null,
  },
  data(){
    return{
      filter: { removed: 0, export: 0},
      paramsLoaded:true,
      showEdit:false,
      getTitle:null,
      inputAsProp:null
    }
  },
  methods:{
    ...mapActions({
      getItems: 'certificateSettings/certificates',
      exportExcel: 'certificateSettings/export',
    }),
    inputDataFunc(){
      return this.inputAsProp
    },
    refresh(query = null) {
      query = { ...query, user_id: this.user_id, year_id: this.yearId ? this.yearId : 9 };
      this.getItems(query)
          .then((data)=>{
        this.paramsLoaded =false
      });
    },
    newCertificate(){
      this.$router.push({ name: "certificates_settings_edit" });
    },
    remove(id) {
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
          this.$store.dispatch('certificateSettings/remove', id).then(_ => {
            this.refresh()
            this.$swal({
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
              title: this.$t('Global.deleted'),
            })
          })
        }
      })
    },
    open(id) {
      window.open(
          this.$router.resolve({name: 'certificates_settings_edit', params: {year_id:this.yearId,id:id}}).href,
          '_self',
      )
    },
    Export(query) {
      this.exportExcel({ ...query, language: this.$i18n.locale });
      this.filter.export = 0;
    },
    showModal(data, showEdit = false) {
      this.inputAsProp = data
      this.$i18n.locale === 'en' ? this.getTitle = (data.name ? data.name : data.name_local) : this.getTitle = (data.name_local ? data.name_local : data.name)
      this.showEdit = showEdit
      this.$refs['my-modal'].toggle('#toggle-btn')
    },
    hideModal() {
      this.$refs['my-modal'].toggle('#toggle-btn')
    },
    cancel() {
      this.edit = false
    },
    resetModal() {
    },
    gettitleData(){
      return this.getTitle
    },
    getInputData(){
      return this.inputAsProp
    }
  },
  computed:{
  ...mapGetters({
    items:'certificateSettings/items',
    total:'certificateSettings/total',
    needDrop:'app/needDrop',
    load:'certificateSettings/load'
  }),
    fields(){
    return  [
      {
        key: "id",
        label: this.$t("code"),
        sortable: true,
        thStyle: { width: "5%" },
      },
      {
        key: "name",
        sortable: true,
        label: this.$t("name"),
        thStyle: { width: "15%" },
      },
      {
        key: "amount",
        label: this.$t("amount_usd"),
        sortable: true,
        thStyle: { width: "10%" },
      },
      {
        key: "local_amount",
        label: this.$t('amount_egp'),
        sortable: true,
        thStyle: { width: "10%" },
      },
      {
        key: "signs",
        label: this.$t("signs"),
        thStyle: { width: "30%" },
      },
      {
        key: "actions",
        label: this.$t("Global.actions"),
        thStyle: {width: '10%'},
      },
    ];
    },
    inputData() {
      return this.inputAsProp
    },
    isEditable() {
      return this.showEdit
    },
    titleData(){
      return this.getTitle
    },

  },
  watch:{

  },
  // mounted() {
  //   let payload = { removed: 0, export: 0}
  //   this.getItems(payload).then((data)=>{
  //     this.paramsLoaded =false
  //   });
  // }
}
</script>

<style>

</style>
