<template>
  <div>
    <!-- <div v-model="(locale = $i18n.locale)" /> -->
    <DataTable :paramsLoaded="paramsLoaded" :total="total" :browse="list ? false : true" :allow-search="true" :filter="filter" :loading="load" @Refresh="refresh">
      <template #action>
        <b-dropdown :right="!$store.state.appConfig.layout.isRTL" variant="primary">
          <template #button-content>
            {{ $t('Global.more') }}
            <b-badge v-if="$store.getters['archive/selectedItem'].length" pill variant="success" class="badge-glow"> {{ $store.getters['archive/selectedItem'].length }} </b-badge>
          </template>
          <b-dropdown-item @click="exportedLink()">
            <a :href="exported()" target="_blank">
              <feather-icon icon="DownloadCloudIcon" />
              <span class="align-middle ml-50">{{ $t('archive.export_file') }}</span>
            </a>
          </b-dropdown-item>
          <b-dropdown-item @click="$refs.refInputElAll.click()">
            <feather-icon icon="FolderPlusIcon" />
            <span class="align-middle ml-50">{{ $t('archive.Import_Files') }}</span>
          </b-dropdown-item>
          <b-dropdown-divider />
          <b-dropdown-item @click="edit({})">
            <feather-icon icon="FolderIcon" />
            <span class="align-middle ml-50">{{ $t('Global.add_folder') }}</span>
          </b-dropdown-item>

          <b-dropdown-item >
            <!-- <feather-icon icon="UploadIcon" /> -->
            <!-- <span class="align-middle ml-50">{{ $t('Global.upload') }}</span> -->
            <upload archive @changeFileList="fileList" @success="refresh" :url="`/archive/upload${$route.query.parent_id &&  $route.query.parent_id!=0 ? '/'+$route.query.parent_id : ''}`" style="display: inline">
              <template #upload-content>
                <feather-icon icon="UploadIcon" />
                <span class="align-middle ml-50">{{ $t('Global.upload') }}</span>
              </template>
            </upload>
          </b-dropdown-item>
          
          <template v-if="selectedPaths.length">
            <b-dropdown-divider />
            <b-dropdown-item @click="paste()">
              <feather-icon icon="CopyIcon" />
              <span class="align-middle ml-50">{{ $t('archive.paste') }}</span>
            </b-dropdown-item>
            <b-dropdown-item @click="move()">
              <feather-icon icon="FolderPlusIcon" />
              <span class="align-middle ml-50">{{ $t('archive.move') }}</span>
            </b-dropdown-item>
            <b-dropdown-item @click="resetSelected()">
              <feather-icon icon="RepeatIcon" />
              <span class="align-middle ml-50">{{ $t('archive.resetItem') }}</span>
            </b-dropdown-item>
          </template>
        </b-dropdown>
        <input ref="refInputEl" type="file" class="d-none" @change="upload" />
        <input ref="refInputElAll" type="file" class="d-none" @change="uploadBackup" />
      </template>
      <template #customTable>
        <b-breadcrumb v-if="lookups" class="breadcrumb-slash mb-2 font-weight-bolder font-medium-1 px-2">
          <b-breadcrumb-item v-for="(item, i) in lookups.path" :key="i" class="text-capitalize" @click="navigate(item.id)">
            {{ item.title }}
          </b-breadcrumb-item>
        </b-breadcrumb>
        <DragTable v-if="list" @drop="sort">
          <b-table id="drag-index" class="position-relative" :sort-by.sync="filter.order_by" :sort-desc.sync="filter.order_direction" :items="items" responsive :fields="fields" primary-key="id" show-empty :empty-text="$t('Global.empty_text')">
            <template #cell(actions)="data">
              <div class="d-flex justify-content-between mx-1">
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
                <b-link v-if="data.item.type == 1" :to="{ name: 'editor', params: { id: data.item.id } }">
                  <feather-icon icon="EditIcon" />
                </b-link>
                <b-link v-else class="disabled_all">
                  <feather-icon icon="EditIcon" />
                </b-link>
                <b-link v-if="data.item.type == 2">
                  <feather-icon icon="RefreshCwIcon" />
                </b-link>
                <b-link v-else class="disabled_all">
                  <feather-icon icon="RefreshCwIcon" />
                </b-link>
                <b-link>
                  <feather-icon icon="Edit2Icon" class="text-warning" @click="edit(data.item)" />
                </b-link>
                <b-link>
                  <feather-icon v-if="selectedPaths.includes(data.item.id)" icon="CheckCircleIcon" class="text-success" @click="selectItem(data.item.id)" />
                  <feather-icon v-else icon="CircleIcon" class="text-primary" @click="selectItem(data.item.id)" />
                </b-link>
                <b-link>
                  <feather-icon icon="TrashIcon" class="text-danger" @click="remove(data.item.id)" />
                </b-link>
              </div>
            </template>
            <template #cell(title)="data">
              <div v-if="data.item.type == 0" class="d-flex" style="cursor: pointer" @click="navigate(data.item.id)">
                <feather-icon icon="FolderIcon" size="18" class="text-capitalize text-primary font-weight-bold" />
                <div class="text-capitalize text-primary font-weight-bold">
                  {{ data.item.title }}
                </div>
                <div v-if="data.item.sub_title" class="text-dark font-small-2">({{ data.item.sub_title }}) -</div>
                <div v-if="data.item.short_name" class="text-dark font-small-3">({{ data.item.short_name }})</div>
              </div>
              <div v-else-if="data.item.type == 1" class="text-capitalize text-primary font-weight-bold" style="cursor: pointer">
                <feather-icon icon="LayoutIcon" size="18" />
                {{ data.item.title }}
              </div>
              <a v-else class="text-capitalize" style="cursor: pointer" target="_blank" :href="data.item.url">
                <feather-icon icon="FileIcon" size="18" class="align-middle text-body" />
                {{ data.item.title }}
              </a>
            </template>
            <template #cell(created_at)="data">
              <div>{{ toLocalDatetime(data.item.created_at, 'en') }}</div>
            </template>
          </b-table>
        </DragTable>
        <div v-else class="custom_list">
          <b-list-group class="px-2">
            <b-list-group-item :key="item.id" :class="$store.getters['archive/selectedItem'].includes(item) ? 'custom_selected' : ''" @click="item.type == 0 ? navigate(item.id) : item.type == 2 ? selectedItem(item) : ''" v-for="(item, i) in items" v-if="item.type == 0" class="d-flex pointer">
              <span class="mr-1">
                <feather-icon :icon="item.type == 0 ? `FolderIcon` : 'FileIcon'" size="16" />
              </span>
              <span>{{ item.title }}</span>
            </b-list-group-item>

            <b-list-group-item :key="item.id" :class="$store.getters['archive/selectedItem'].includes(item) ? 'custom_selected' : ''" class="d-flex pointer" @click="item.type == 0 ? navigate(item.id) : item.type == 2 ? selectedItem(item) : ''" v-else>
              <span class="mr-1">
                <feather-icon :icon="item.type == 0 ? `FolderIcon` : 'FileIcon'" size="17" />
              </span>
              <span>{{ item.title }}</span>
            </b-list-group-item>
          </b-list-group>
          <!-- <b-row class="match-height d-flex flex-wrap custom_gap">
            <b-col v-for="(item, i) in items" :key="i" xl="1" lg="1" md="4" sm="6">
              <div v-if="item.type == 0" @click="item.type == 0 ? navigate(item.id) : selectedItem(item)" :class="$store.getters['archive/selectedItem'].includes(item) ? 'custom_selected' : ''">
                <statistic-card-vertical :icon="item.type == 0 ? `FolderIcon` : 'FileIcon'" :statistic="shortMyText(item.title, 20)" no-body :statistic-title="item.size" :color="item.type == 0 ? 'primary' : 'info'" small style="cursor: pointer" />
              </div>
              <a v-else @click="item.type == 0 ? navigate(item.id) : selectedItem(item)" target="_blank" :class="$store.getters['archive/selectedItem'].includes(item) ? 'custom_selected' : ''">
                <statistic-card-vertical :icon="item.type == 0 ? `FolderIcon` : 'FileIcon'" :statistic="shortMyText(item.title, 20)" :statistic-title="item.size" small :color="item.type == 0 ? 'primary' : 'info'" />
              </a>
            </b-col>
          </b-row> -->
        </div>
      </template>
    </DataTable>

    <b-modal modal-class="custom_model" id="archive-model" ref="archive_model" no-close-on-backdrop size="lg" centered title="Add Folder" @ok="submit">
      <form ref="archive_form" @submit.stop.prevent="submit">
        <div class="row">
          <div v-if="!is_edit" class="col">
            <b-form-group label="Type" label-for="folder" invalid-feedback="Folder is required">
              <v-select v-model="archive_form.type" :options="type_options" :reduce="val => val.value" required />
            </b-form-group>
          </div>
          <div class="col">
            <b-form-group label="Title" label-for="address-input" invalid-feedback="address is required">
              <b-form-input id="address-input" v-model="archive_form.title" required />
            </b-form-group>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <b-form-group label="Sub Title" label-for="subTitle-input" invalid-feedback="Sub Title is required">
              <b-form-input id="subTitle-input" v-model="archive_form.sub_title" required />
            </b-form-group>
          </div>
          <div class="col">
            <b-form-group label="ShortName" label-for="subTitle-input" invalid-feedback="ShortName is required">
              <b-form-input v-model="archive_form.short_name" required />
            </b-form-group>
          </div>
        </div>
        <b-form-group label="Description" label-for="description-input" invalid-feedback="Description is required">
          <b-form-textarea id="description-input" v-model="archive_form.description" />
        </b-form-group>
        <b-form-group label="Content Type" label-for="content">
          <v-select v-model="archive_form.content_type" :options="content_type_options" :reduce="val => val.value" />
        </b-form-group>
        <div class="row">
          <div class="col">
            <b-form-group label="Date" label-for="date-input" invalid-feedback="Date is required">
              <b-form-datepicker v-model="archive_form.created_at" />
            </b-form-group>
          </div>
          <div class="col">
            <b-form-group label="Link" label-for="link-input" invalid-feedback="Link is required">
              <b-form-input id="link-input" v-model="archive_form.link" required />
            </b-form-group>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <b-form-checkbox v-model="archive_form.visible">Visible</b-form-checkbox>
          </div>
          <div class="col">
            <b-form-checkbox v-model="archive_form.editable">Editable</b-form-checkbox>
          </div>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
import { BCol, BLink, BRow, BListGroup, BListGroupItem, BBadge, BTable, BFormCheckbox, BDropdown, BFormInput, BFormGroup, BFormTextarea, BDropdownItem, BButton, BBreadcrumb, BBreadcrumbItem, BFormDatepicker } from 'bootstrap-vue';

import vSelect from 'vue-select';
import { mapGetters } from 'vuex';
import StatisticCardVertical from '@core/components/statistics-cards/StatisticCardVertical';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
import DataTable from '@/views/components/table/DataTable';
import DragTable from '@/views/components/table/DragTable';
import { getToken } from '@/utils/auth';
import upload from '@/views/components/common/upload.vue';

export default {
  components: {
    StatisticCardVertical,
    DataTable,
    DragTable,
    BRow,
    upload,
    BListGroup,
    BListGroupItem,
    BFormCheckbox,
    BCol,
    BLink,
    BTable,
    BDropdown,
    BDropdownItem,
    vSelect,
    BBadge,
    BButton,
    BBreadcrumb,
    BBreadcrumbItem,
    BFormInput,
    BFormGroup,
    BFormTextarea,
    BFormDatepicker,
  },
  props: {
    user: null,
    parent: null,
    list: Boolean,
  },
  data() {
    return {
      paramsLoaded: true,
      fields: [
        // {key: 'id', sortable: true,},
        // {key: 'order', sortable: true,},
        { key: 'title', sortable: true, thStyle: { width: '40%' } },
        { key: 'content_type', label: 'Type', sortable: true },
        { key: 'size', thStyle: { width: '10%' } },
        { key: 'created_at', label: 'Date' },
        {
          key: 'actions',
          thStyle: { width: '12%' },
          thClass: 'customAction',
          tdClass: 'customWidth',
        },
      ],
      filter: { removed: 0 },
      archive_id: null,
      locale: this.$i18n.locale,
      type_options: [
        { label: 'Folder', value: 0 },
        { label: 'Page', value: 1 },
      ],
      content_type_options: [
        {
          value: 'section',
          label: 'Section',
        },
        {
          value: 'mainSection',
          label: 'Main Section',
        },
        {
          value: 'group',
          label: 'Group',
        },
        {
          value: 'folder',
          label: 'Folder',
        },
        {
          value: 'gallery',
          label: 'Gallery',
        },
        {
          value: 'tree',
          label: 'Tree',
        },
        {
          value: 'files',
          label: 'Files',
        },
        {
          value: 'modules',
          label: 'Modules',
        },
        {
          value: 'banner',
          label: 'Banner',
        },
        {
          value: 'link',
          label: 'Link',
        },
        {
          value: 'news',
          label: 'News',
        },
        {
          value: 'mainlink',
          label: 'Footer Main Link',
        },
        {
          value: 'faculties',
          label: 'Footer faculties',
        },
      ],
      archive_form: {},
      is_edit: false,
      uploadingFile:null,
      showUpload:null,
      selectedPaths: [],
      baseUrl: process.env.VUE_APP_BASE_URL,
    };
  },
  watch: {
    watch: {
      '$i18n.locale': function () {
        this.refresh({ limit: 10 });
      },
    },
  },
  computed: {
    ...mapGetters({
      items: 'archive/archives',
      total: 'archive/totalArchive',
      load: 'archive/archiveLoad',
      lookups: 'archive/lookups',
      needDrop:'app/needDrop',
    }),
    current_id() {
      if (this.$store.getters['archive/currentId']) {
        return this.$store.getters['archive/currentId'];
      }
      return this.archive_id ? this.archive_id : this.parent;
    },
  },
  methods: {
    fileList(files, progress) {
      this.uploadingFile = files;
      this.progress = progress;
      this.showUpload = true;
    },
    refresh(query = {}, load = true) {
      if (this.user) {
        query.user_id = this.user;
      }
      if (this.current_id) {
        query.parent_id = this.current_id;
      }
      if (this.$route.query.parent_id) {
        query.parent_id = this.$route.query.parent_id;
      }
      query = { ...query, language: this.$i18n.locale, order_direction: 'ASC', limit: 100 };
      this.$store.dispatch('archive/archives', { query, load }).then(_ => {
        this.paramsLoaded = false;
        this.$store.commit('archive/SET_CURRENT_ID', null);
      });
    },

    sort(columns) {
      if (columns.first != '' && columns.second != '') {
        let query = {};
        if (columns.first.order < columns.second.order) {
          query = {
            id: columns.first.id,
            neighbour_id: columns.second.id,
            position: 'after',
          };
        } else {
          query = {
            id: columns.first.id,
            neighbour_id: columns.second.id,
            position: 'before',
          };
        }
        this.$store.dispatch('archive/order', query).then(() => {
          this.refresh({}, false);
        });
      }
    },

    navigate(archive_id) {
      let query = {
        limit: 10,
        parent_id: archive_id,
      };
      this.$router.replace({ query: query }).catch(()=>{});
      this.archive_id = archive_id;
      query = { ...query, language: this.$i18n.locale, order_direction: 'ASC', limit: 400 };
      this.$store.dispatch('archive/archives', { query });
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
          this.$store.dispatch('archive/delete', { id }).then(_ => {
            this.refresh({});
            this.$swal({
              icon: 'success',
              timer: 1500,
              showConfirmButton: false,
              title: this.$t('Global.deleted'),
            });
          });
        }
      });
    },

    upload(e) {
      const data = new FormData();
      data.append('file', e.target.files[0]);
      const id = this.archive_id ? this.archive_id : this.parent;
      this.$store
        .dispatch('archive/upload', {
          id: id ? `/${id}` : '',
          resource: data,
        })
        .then(_ => {
          this.refresh();
        });
    },
    uploadBackup(e) {
      const data = new FormData();
      data.append('file', e.target.files[0]);
      const id = this.archive_id ? this.archive_id : this.parent;
      this.$store
        .dispatch('archive/import', {
          id: id ? `/${id}` : '',
          resource: data,
        })
        .then(_ => {
          this.refresh();
        });
    },

    edit(item) {
      if (item.id) {
        this.is_edit = true;
      } else {
        this.is_edit = false;
      }
      this.archive_form = item;
      this.$refs.archive_model.show();
    },
    submit(e) {
      e.preventDefault();
      // if (this.$refs.archive_form.checkValidity()) {
      if (this.is_edit) {
        this.$store
          .dispatch('archive/rename', {
            resource: {
              parent_id: this.current_id ? this.current_id : 0,
              language: this.$i18n.locale,
              ...this.archive_form,
            },
            id: this.archive_form.id,
          })
          .then(_ => {
            this.refresh();
            this.$refs.archive_model.toggle();
          });
      } else {
        this.$store
          .dispatch('archive/add', {
            resource: {
              parent_id: this.current_id ? this.current_id : 0,
              language: this.$i18n.locale,
              ...this.archive_form,
            },
          })
          .then(_ => {
            this.refresh();
            this.$refs.archive_model.toggle();
          });
      }

      // }
    },
    selectItem(id) {
      if (!this.selectedPaths.includes(id)) {
        this.selectedPaths.push(id);
      } else {
        for (let i = 0; i < this.selectedPaths.length; i++) {
          if (this.selectedPaths[i] === id) {
            this.selectedPaths.splice(i, 1);
          }
        }
      }
    },
    selectedItem(item) {
      if (!this.$store.getters['archive/selectedItem'].includes(item)) {
        this.$store.commit('archive/SET_SELECTED_ITEM', item);
      } else {
        for (let i = 0; i < this.$store.getters['archive/selectedItem'].length; i++) {
          if (this.$store.getters['archive/selectedItem'][i] === item) {
            this.$store.commit('archive/REMOVE_SELECTED_ITEM', i);
          }
        }
      }
    },
    resetSelected() {
      this.selectedPaths = [];
    },
    exportedLink() {
      window.open(`${this.exported()}`, '_blank');
    },
    exported() {
      const id = this.current_id ? this.current_id : 0;
      return `${this.baseUrl}/archive/export/${id}?token=${getToken()}`;
    },
    move() {
      this.$store
        .dispatch('archive/move', {
          marked_ids: this.selectedPaths,
          currentId: this.current_id ? this.current_id : 0,
        })
        .then(response => {
          this.refresh();
          this.$toast({
            component: ToastificationContent,
            position: 'top-right',
            props: {
              variant: 'success',
              title: `${this.$t('Global.saved')}`,
            },
          });
          this.resetSelected();
        });
    },
    paste() {
      this.$store
        .dispatch('archive/paste', {
          marked_ids: this.selectedPaths,
          currentId: this.current_id ? this.current_id : 0,
        })
        .then(response => {
          this.refresh();
          this.$toast({
            component: ToastificationContent,
            position: 'top-right',
            props: {
              title: 'Success',
              variant: 'success',
              text: `${this.$t('Global.successMessage')}`,
            },
          });
          this.resetSelected();
        });
    },
  },
};
</script>

<style lang="scss">
.match-height.custom_gap div .card-body {
  padding: 0;
}
.custom_list {
  min-height: 100px;
  max-height: 400px;
  overflow-y: auto;
  .list-group-item {
    padding-top: 3px;
    padding-bottom: 3px;
  }
}
.custom_selected {
  .card-body {
    box-shadow: 0 6px 15px 0 #ddd;
    border-radius: 10px;
  }
  background-color: aliceblue;
}
.custom_gap {
  gap: 0.5rem;
}
.per-page-selector {
  width: 90px;
}

.width-25 {
  width: 25% !important;
}

.width-50 {
  width: 50% !important;
}

.width-70 {
  width: 70% !important;
}
</style>
