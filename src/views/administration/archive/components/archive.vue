<template>
  <div>
    <b-toast
        primary
        no-auto-hide
        v-model="showToast"
        append-toast
        id="example-toast"
    >
      <template #toast-title>
        <div class="d-flex flex-grow-1 align-items-center mr-1">
          <strong class="mr-auto">{{ $t("file_upload") }}</strong>
        </div>
      </template>
      <div v-if="uploadProgress" class="progress-wrapper">
        <b-card-text class="mb-0">
          {{ files ? files.name : "" }}
          {{ uploadProgress ? uploadProgress + "%" : "" || "" }}
        </b-card-text>
        <b-progress v-model="uploadProgress" max="100"/>
      </div>
    </b-toast>
    <DataTable
        :paramsLoaded="paramsLoaded"
        archive
        :total="total"
        :allow-search="allowSearch"
        :filter="filter"
        :loading="load"
        @Refresh="refresh"
    >
      <template #action>
        <upload
            archive
            v-if="profile"
            oneFile
            @changeFileList="fileList"
            @success="refresh"
            :url="`/archive/upload${parent && parent != 0 ? '/' + parent : ''}`"
            style="display: inline"
        >
          <template #upload-content>
            <b-button variant="primary" class="btn-icon" target="_blank">
              <feather-icon icon="UploadIcon"/>
              <span class="align-middle ml-50">{{ $t("Global.upload") }}</span>
            </b-button>
          </template>
        </upload>
        <b-dropdown right variant="primary" v-if="action_show">
          <template #button-content>
            {{ $t("Global.more") }}
            <b-badge v-if="selectedPaths.length" pill variant="light-success">
              {{ selectedPaths.length }} {{ $t("Global.item") }}
            </b-badge>
          </template>
          <b-dropdown-item v-if="more && enableExport">
            <a @click.prevent="exportFiles" href="#" target="_blank">
              <feather-icon icon="DownloadCloudIcon"/>
              <span class="align-middle ml-50">{{
                  $t("Global.export_file")
                }}</span>
            </a>
          </b-dropdown-item>
          <b-dropdown-item
              v-if="more && enableImport"
              @click="$refs.refInputElAll.click()"
          >
            <feather-icon icon="FolderPlusIcon"/>
            <span class="align-middle ml-50">{{
                $t("Global.Import_Files")
              }}</span>
          </b-dropdown-item>
          <b-dropdown-divider v-if="more"/>
          <b-dropdown-item v-if="more" @click="edit({})">
            <feather-icon icon="FolderIcon"/>
            <span class="align-middle ml-50">{{
                $t("Global.add_folder")
              }}</span>
          </b-dropdown-item>
          <!-- @click="$refs.refInputEl.click()" -->
          <upload
              archive
              @changeFileList="fileList"
              @success="refresh"
              :url="`/archive/upload${
              $route.query.parent_id && $route.query.parent_id != 0
                ? '/' + $route.query.parent_id
                : parent
                ? '/' + parent
                : ''
            }`"
              style="display: inline"
          >
            <template #upload-content>
              <b-dropdown-item>
                <feather-icon icon="UploadIcon"/>
                <span class="align-middle ml-50">{{
                    $t("Global.upload")
                  }}</span>
              </b-dropdown-item>
            </template>
          </upload>
          <template v-if="selectedPaths.length">
            <b-dropdown-divider/>
            <b-dropdown-item @click="paste()">
              <feather-icon icon="CopyIcon"/>
              <span class="align-middle ml-50">{{ $t("archive.paste") }}</span>
            </b-dropdown-item>
            <b-dropdown-item @click="move()">
              <feather-icon icon="FolderPlusIcon"/>
              <span class="align-middle ml-50">{{ $t("archive.move") }}</span>
            </b-dropdown-item>
            <b-dropdown-item @click="resetSelected()">
              <feather-icon icon="RepeatIcon"/>
              <span class="align-middle ml-50">{{
                  $t("archive.resetItem")
                }}</span>
            </b-dropdown-item>
          </template>
        </b-dropdown>
        <input ref="refInputEl" type="file" class="d-none" @change="upload"/>
        <input
            ref="refInputElAll"
            type="file"
            class="d-none"
            @change="uploadBackup"
        />
        <input
            ref="refInputElUpdate"
            type="file"
            class="d-none"
            @change="uploadItem"
        />
      </template>
      <template #customTable>
        <b-breadcrumb
            v-if="breadcrumb && lookups"
            class="breadcrumb-slash mb-2 font-weight-bolder font-medium-1"
        >
          <b-breadcrumb-item
              :active="item.active"
              v-for="(item, i) in getPaths(lookups.path)"
              :key="i"
              class="text-capitalize"
              @click="navigate(item.id)"
          >
            {{
              $i18n.locale == "en"
                  ? item.title || item.local_title
                  : item.local_title || item.title
            }}
          </b-breadcrumb-item>
        </b-breadcrumb>
        <DragTable v-if="list" @drop="sort">
          <b-table
              id="drag-index"
              class="position-relative"
              :sort-by.sync="filter.order_by"
              :sort-desc.sync="filter.order_direction"
              :items="items"
              responsive
              :fields="fields"
              primary-key="id"
              show-empty
              :empty-text="$t('Global.empty_text')"
          >
            <template #cell(actions)="data" v-if="actions">
              <div class="d-flex justify-content-end mx-1">
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
                <div v-if="profile">
                  <!-- <b-link>
                    <feather-icon icon="Edit2Icon" class="text-warning" @click="edit(data.item)" />
                  </b-link> -->
                  <b-link
                      v-b-tooltip.hover="$t('Global.refresh')"
                      v-if="data.item.type == 2"
                  >
                    <feather-icon
                        @click="updateItem(data.item)"
                        icon="RefreshCwIcon"
                    />
                  </b-link>
                  <b-link v-b-tooltip.hover="$t('Global.delete')">
                    <feather-icon
                        icon="Trash2Icon"
                        class="text-danger"
                        @click="remove(data.item.id)"
                    />
                  </b-link>
                </div>
                <div v-else>
                  <b-link
                      v-b-tooltip.hover="$t('Global.edit_content')"
                      v-if="data.item.type && data.item.type == 1"
                      :to="{ name: 'editor', params: { id: data.item.id } }"
                  >
                    <feather-icon icon="EditIcon"/>
                  </b-link>
                  <b-link
                      v-else
                      v-b-tooltip.hover="$t('Global.edit_content')"
                      class="disabled_all"
                  >
                    <feather-icon icon="EditIcon"/>
                  </b-link>
                  <b-link
                      v-b-tooltip.hover="$t('Global.refresh')"
                      v-if="data.item.type == 2"
                  >
                    <feather-icon
                        @click="updateItem(data.item)"
                        icon="RefreshCwIcon"
                    />
                  </b-link>
                  <b-link
                      v-else
                      v-b-tooltip.hover="$t('Global.refresh')"
                      class="disabled_all"
                  >
                    <feather-icon icon="RefreshCwIcon"/>
                  </b-link>
                  <b-link>
                    <feather-icon
                        v-b-tooltip.hover="$t('Global.edit')"
                        icon="Edit2Icon"
                        class="text-warning"
                        @click="edit(data.item)"
                    />
                  </b-link>
                  <b-link>
                    <feather-icon
                        v-b-tooltip.hover="$t('Global.select')"
                        v-if="selectedPaths.includes(data.item.id)"
                        icon="CheckCircleIcon"
                        class="text-success"
                        @click="selectItem(data.item.id)"
                    />
                    <feather-icon
                        v-else
                        v-b-tooltip.hover="$t('Global.select')"
                        icon="CircleIcon"
                        class="text-primary"
                        @click="selectItem(data.item.id)"
                    />
                  </b-link>
                  <b-link>
                    <feather-icon
                        icon="Trash2Icon"
                        v-b-tooltip.hover="$t('Global.delete')"
                        class="text-danger"
                        @click="remove(data.item.id)"
                    />
                  </b-link>
                </div>
              </div>
            </template>
            <template #cell(title)="data">
              <div
                  v-if="data.item.type == 0"
                  class="d-flex"
                  style="cursor: pointer"
                  @click="navigate(data.item.id)"
              >
                <feather-icon
                    icon="FolderIcon"
                    size="18"
                    class="text-capitalize text-primary font-weight-bold"
                />
                <div class="text-capitalize text-primary font-weight-bold">
                  {{ data.item.title }}
                </div>
                <div v-if="data.item.sub_title" class="text-dark font-small-2">
                  ({{ data.item.sub_title }}) -
                </div>
                <div v-if="data.item.short_name" class="text-dark font-small-3">
                  ({{ data.item.short_name }})
                </div>
              </div>
              <div
                  v-else-if="data.item.type == 1"
                  class="text-capitalize text-primary font-weight-bold"
                  style="cursor: pointer"
              >
                <feather-icon icon="LayoutIcon" size="18"/>
                <b-link
                    v-if="data.item.type && data.item.type == 1"
                    :to="{ name: 'editor', params: { id: data.item.id } }"
                >
                  {{ data.item.title }}
                </b-link>
                <b-link v-else class="disabled_all">
                  {{ data.item.title }}
                </b-link>
              </div>
              <a
                  v-else
                  class="text-capitalize"
                  style="cursor: pointer"
                  target="_blank"
                  :href="data.item.url"
              >
                <feather-icon
                    icon="FileIcon"
                    size="18"
                    class="align-middle text-body"
                />
                {{ data.item.title }}
              </a>
            </template>
            <template #cell(created_at)="data">
              <div>
                {{ toLocalDatetime(data.item.created_at, $i18n.locale) }}
              </div>
            </template>
          </b-table>
        </DragTable>
        <div v-else>
          <b-row class="match-height d-flex justify-content-center">
            <b-col v-for="(item, i) in items" :key="i" xl="4" md="4" sm="4">
              <div v-if="item.type == 0" @click="navigate(item.id)">
                <statistic-card-vertical
                    :icon="item.type == 0 ? `FolderIcon` : 'FileIcon'"
                    :statistic="item.title"
                    :statistic-title="item.size"
                    color="primary"
                    style="cursor: pointer"
                />
              </div>
              <a v-else :href="item.url" target="_blank">
                <statistic-card-vertical
                    :icon="item.type == 0 ? `FolderIcon` : 'FileIcon'"
                    :statistic="shortMyText(item.title, 20)"
                    :statistic-title="item.size"
                    color="primary"
                />
              </a>
            </b-col>
          </b-row>
        </div>
      </template>
    </DataTable>

    <b-modal
        id="archive-model"
        ref="archive_model"
        :cancel-title="$t('Global.cancel')"
        :ok-title="$t('Global.save')"
        no-close-on-backdrop
        size="lg"
        centered
        :title="$t('Global.add_folder')"
        @ok="submit"
    >
      <form ref="archive_form" @submit.stop.prevent="submit">
        <div class="row">
          <div v-if="!is_edit" class="col">
            <b-form-group
                :label="$t('Global.type')"
                label-for="folder"
                invalid-feedback="Folder is required"
            >
              <v-select
                  v-model="archive_form.type"
                  :options="type_options"
                  :reduce="(val) => val.value"
                  required
              >
                <template #option="{ label }">
                  <span style="margin: 0">{{ $t(`Global.${label}`) }}</span>
                </template>
              </v-select>
            </b-form-group>
          </div>
          <div class="col">
            <b-form-group
                :label="$t('Global.title')"
                label-for="address-input"
                invalid-feedback="address is required"
            >
              <b-form-input
                  id="address-input"
                  v-model="archive_form.title"
                  required
              />
            </b-form-group>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <b-form-group
                :label="$t('Global.subtitle')"
                label-for="subTitle-input"
                invalid-feedback="Sub Title is required"
            >
              <b-form-input
                  id="subTitle-input"
                  v-model="archive_form.sub_title"
                  required
              />
            </b-form-group>
          </div>
          <div class="col">
            <b-form-group
                :label="$t('Global.ShortName')"
                label-for="subTitle-input"
                invalid-feedback="ShortName is required"
            >
              <b-form-input v-model="archive_form.short_name" required/>
            </b-form-group>
          </div>
        </div>
        <b-form-group
            :label="$t('Global.description')"
            label-for="description-input"
            invalid-feedback="Description is required"
        >
          <b-form-textarea
              id="description-input"
              v-model="archive_form.description"
          />
        </b-form-group>
        <b-form-group :label="$t('Global.content_type')" label-for="content">
          <v-select
              v-model="archive_form.content_type"
              :options="content_type_options"
              :reduce="(val) => val.value"
          />
        </b-form-group>
        <div class="row">
          <div class="col">
            <b-form-group
                :label="$t('Global.date')"
                label-for="date-input"
                invalid-feedback="Date is required"
            >
              <b-form-datepicker v-model="archive_form.created_at"/>
            </b-form-group>
          </div>
          <div class="col">
            <b-form-group
                :label="$t('Global.link')"
                label-for="link-input"
                invalid-feedback="Link is required"
            >
              <b-form-input
                  id="link-input"
                  v-model="archive_form.link"
                  required
              />
            </b-form-group>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <b-form-checkbox v-model="archive_form.visible">{{
                $t("Global.visible")
              }}
            </b-form-checkbox>
          </div>
          <div class="col">
            <b-form-checkbox v-model="archive_form.editable">{{
                $t("Global.editable")
              }}
            </b-form-checkbox>
          </div>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
import {
  BCol,
  BLink,
  BCardText,
  BToast,
  BProgress,
  BRow,
  BBadge,
  BTable,
  BFormCheckbox,
  BDropdown,
  BFormInput,
  BFormGroup,
  BFormTextarea,
  BDropdownItem,
  BButton,
  BBreadcrumb,
  BBreadcrumbItem,
  BFormDatepicker,
  BDropdownDivider,
} from "bootstrap-vue";

import vSelect from "vue-select";
import {mapGetters} from "vuex";
import StatisticCardVertical from "@core/components/statistics-cards/StatisticCardVertical";
import ToastificationContent from "@core/components/toastification/ToastificationContent.vue";
import DataTable from "@/views/components/table/DataTable";
import DragTable from "@/views/components/table/DragTable";
import {getToken} from "@/utils/auth";
import upload from "@/views/components/common/upload.vue";
// import { error } from 'handsontable/helpers';
export default {
  components: {
    StatisticCardVertical,
    DataTable,
    DragTable,
    BRow,
    BCardText,
    BProgress,
    BToast,
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
    BDropdownDivider,
    upload,
  },
  props: {
    user: null,
    parent: null,
    list: {
      default: true,
      type: Boolean,
    },
    actions: {
      default: true,
      type: Boolean,
    },
    breadcrumb: {
      default: true,
      type: Boolean,
    },
    more: {
      default: true,
      type: Boolean,
    },
    profile: {
      default: false,
      type: Boolean,
    },

    action_show: {
      default: true,
      type: Boolean,
    },
    allowSearch: {
      default: true,
      type: Boolean,
    },
    studentShow: {
      default: false,
      type: Boolean,
    },
    enableImport: {
      default: true,
      type: Boolean,
    },
    enableExport: {
      default: true,
      type: Boolean,
    },
  },
  data() {
    return {
      showToast: false,
      filter: {removed: 0},
      archive_id: null,
      files: null,
      paramsLoaded: true,
      locale: this.$i18n.locale,
      type_options: [
        {label: "folder", value: 0},
        {label: "page", value: 1},
      ],
      content_type_options: [
        {
          value: "English Signature",
          label: "English Signature",
        },
        {
          value: "Arabic Signature",
          label: "Arabic Signature",
        },
        {
          value: "X509 Certificate",
          label: "X509 Certificate",
        },
        {
          value: "news_sidebar",
          label: "News Sidebar",
        },
        {
          value: "footer_banner",
          label: "Footer Banner",
        },
        {
          value: "slider",
          label: "Slider",
        },
        {
          value: "section",
          label: "Section",
        },
        {
          value: "mainSection",
          label: "Main Section",
        },
        {
          value: "faculty",
          label: "Faculty",
        },
        {
          value: "programs",
          label: "Programs",
        },
        {
          value: "departments",
          label: "Departments",
        },
        {
          value: "staff",
          label: "Staff",
        },
        {
          value: "index",
          label: "Index",
        },
        {
          value: "group",
          label: "Group",
        },
        {
          value: "folder",
          label: "Folder",
        },
        {
          value: "gallery",
          label: "Gallery",
        },
        {
          value: "tree",
          label: "Tree",
        },
        {
          value: "files",
          label: "Files",
        },
        {
          value: "modules",
          label: "Modules",
        },
        {
          value: "banner",
          label: "Banner",
        },
        {
          value: "link",
          label: "Link",
        },
        {
          value: "news",
          label: "News",
        },
        {
          value: "sociallink",
          label: "Footer Link",
        },
      ],
      archive_form: {},
      is_edit: false,
      selectedPaths: [],
      baseUrl: process.env.VUE_APP_BASE_URL,
      item_id: null,
      uploadingFile: null,
      progress: null,
      showUpload: null,
    };
  },
  watch: {
    "$i18n.locale"() {
      let query;
      if (this.$route.query.perPage) {
        query = {limit: this.$route.query.perPage};
      } else {
        query = {limit: 10};
      }
      this.refresh(query);
    },
  },
  computed: {
    ...mapGetters({
      items: "archive/archives",
      total: "archive/totalArchive",
      load: "archive/archiveLoad",
      lookups: "archive/lookups",
      uploadProgress: "app/uploadProgress",
      needDrop:'app/needDrop',
    }),
    fields() {
      let fields = [
        {
          key: "title",
          sortable: true,
          thStyle: {width: "40%"},
          label: this.$t("Global.title"),
        },
        {key: "content_type", sortable: true, label: this.$t("Global.type")},
        {
          key: "size",
          thStyle: {width: "10%"},
          label: this.$t("Global.size"),
        },
        {key: "created_at", label: this.$t("Global.created_at")},
        {
          key: "actions",
          thStyle: {width: "12%"},
          thClass: "customAction",
          tdClass: "customWidth",
          label: this.$t("Global.action"),
        },
      ];
      return fields;
    },
    current_id() {
      if (this.$store.getters["archive/currentId"]) {
        return this.$store.getters["archive/currentId"];
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
    getPaths(data) {
      data.map((el) => {
        if (el.id == this.$route.query.parent_id) {
          el.active = true;
        }
      });
      return data;
    },
    updateItem(item) {
      if (item?.id) {
        this.item_id = item.id;
        this.$refs.refInputElUpdate.click();
      } else {
        this.item_id = null;
      }
    },
    uploadItem(e) {
      const data = new FormData();
      data.append("file", e.target.files[0]);
      const id = this.item_id ? this.item_id : this.parent;
      this.showToast = true;
      this.$store
          .dispatch("archive/update", {
            id: this.item_id ? `${id}` : "",
            resource: data,
          })
          .then((_) => {
            this.refresh();
            this.showToast = false;
          })
          .catch((error) => {
            this.refresh();
            this.showToast = false;
          });
    },
    refresh(query = {}, load = true) {
      if (this.user) {
        query.user_id = this.user;
      }
      if (this.current_id) {
        query.parent_id = this.current_id;
      }
      if (this.$route.query.perPage) {
        query.limit = this.$route.query.perPage;
      }
      if (
          this.$route.query.page &&
          (this.$route.query.perPage || this.$route.query.limit)
      ) {
        if (this.$route.query.perPage) {
          query.offset =
              (Number(this.$route.query.page) - 1) * this.$route.query.perPage;
        }
        // if (this.$route.query.limit) {
        //   query.offset = (Number(this.$route.query.page) - 1) * this.$route.query.limit;
        // }
      }
      if (this.$route.query.parent_id) {
        query.parent_id = this.$route.query.parent_id;
      }
      if (this.studentShow && this.current_id == null) {
        return;
      }
      query = {...query, language: this.$i18n.locale, order_direction: "ASC"};
      this.$store.dispatch("archive/archives", {query, load}).then((_) => {
        this.paramsLoaded = false;
        this.$store.commit("archive/SET_CURRENT_ID", null);
      });
    },
    sort(columns) {
      if (columns.first != "" && columns.second != "") {
        let query = {};
        if (columns.first.order < columns.second.order) {
          query = {
            id: columns.first.id,
            neighbour_id: columns.second.id,
            position: "after",
          };
        } else {
          query = {
            id: columns.first.id,
            neighbour_id: columns.second.id,
            position: "before",
          };
        }
        this.$store.dispatch("archive/order", query).then(() => {
          this.refresh({}, false);
        });
      }
    },
    navigate(archive_id) {
      let query = {};
      if (this.$route.query.perPage) {
        this.$route.query.limit = this.$route.query.perPage;
      }
      if (
          this.$route.query.page &&
          (this.$route.query.perPage || this.$route.query.limit)
      ) {
        if (this.$route.query.perPage) {
          query = {
            limit: this.$route.query.perPage,
            parent_id: archive_id,
            perPage: this.$route.query.perPage || 10,
            page: this.$route.query.page || 1,
            offset:
                (Number(this.$route.query.page) - 1) * this.$route.query.perPage,
          };
        } else if (this.$route.query.limit) {
          query = {
            limit: 10,
            parent_id: archive_id,
            perPage: this.$route.query.perPage || 10,
            page: this.$route.query.page || 1,
            offset:
                (Number(this.$route.query.page) - 1) * this.$route.query.limit,
          };
        }
      } else {
        query = {
          limit: 10,
          parent_id: archive_id,
          perPage: this.$route.query.perPage || 10,
          page: this.$route.query.page || 1,
        };
      }
      this.$router.replace({query: query}).catch(()=>{});
      this.archive_id = archive_id;
      query = {...query, language: this.$i18n.locale, order_direction: "ASC"};
      this.$store.dispatch("archive/archives", {query});
    },
    remove(id) {
      this.$swal({
        title: `${this.$t("Global.deleteTitle")}`,
        text: `${this.$t("Global.deleteText")}`,
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: `${this.$t("Global.cancel")}`,
        confirmButtonText: `${this.$t("Global.deleteBtn")}`,
        customClass: {
          confirmButton: "btn btn-primary",
          cancelButton: "btn btn-outline-danger ml-1",
        },
        buttonsStyling: false,
      }).then((result) => {
        if (result.value) {
          this.$store.dispatch("archive/delete", {id}).then((_) => {
            this.refresh({});
            this.$swal({
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
              title: this.$t("Global.deleted"),
            });
          });
        }
      });
    },
    upload(e) {
      this.files = e.target.files[0];
      const data = new FormData();
      data.append("file", e.target.files[0]);
      const id = this.archive_id ? this.archive_id : this.parent;
      this.showToast = true;
      this.$store
          .dispatch("archive/upload", {
            id: id ? `/${id}` : "",
            resource: data,
          })
          .then((_) => {
            this.refresh();
            this.showToast = false;
          });
    },
    uploadBackup(e) {
      const data = new FormData();
      data.append("file", e.target.files[0]);
      const id = this.archive_id ? this.archive_id : this.parent;
      this.$store
          .dispatch("archive/import", {
            id: id ? `/${id}` : "",
            resource: data,
          })
          .then((_) => {
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
      if (this.is_edit) {
        this.$refs.archive_model.toggle();
        this.$store
            .dispatch("archive/rename", {
              resource: {
                parent_id: this.$route.query.parent_id
                    ? this.$route.query.parent_id
                    : this.current_id
                        ? this.current_id
                        : 0,
                language: this.$i18n.locale,
                ...this.archive_form,
              },
              id: this.archive_form.id,
            })
            .then((_) => {
              this.refresh();
              this.$refs.archive_model.toggle();
              this.$swal({
                icon: "success",
                title: `${this.$t("Global.saved")}`,
                showConfirmButton: false,
                timer: 1500,
              });
            });
      } else {
        this.$refs.archive_model.toggle();
        this.$store
            .dispatch("archive/add", {
              resource: {
                parent_id: this.$route.query.parent_id
                    ? this.$route.query.parent_id
                    : this.current_id
                        ? this.current_id
                        : 0,
                language: this.$i18n.locale,
                ...this.archive_form,
              },
            })
            .then((_) => {
              this.refresh();
              this.$refs.archive_model.toggle();
              this.$swal({
                icon: "success",
                title: `${this.$t("Global.saved")}`,
                showConfirmButton: false,
                timer: 1500,
              });
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
    resetSelected() {
      this.selectedPaths = [];
    },
    exportFiles() {
      if (!this.selectedPaths.length || this.selectedPaths.length > 1) {
        return this.$toast({
          component: ToastificationContent,
          position: "top-right",
          props: {
            variant: "success",
            title: `${this.$t("Errors.pleaseSelectAFile")}`,
          },
        });
      }

      this.$store.dispatch("archive/exportFiles", {archive_id: this.selectedPaths[0]})
          .then((res) => {
            this.refresh();
            this.$toast({
              component: ToastificationContent,
              position: "top-right",
              props: {
                variant: "success",
                title: `${this.$t("Global.saved")}`,
              },
            });
            this.resetSelected();
          })
          .catch((error) => {
            if(error.response.status === 400) {
              this.$toast({
                component: ToastificationContent,
                position: "top-right",
                props: {
                  title: this.$t('error'),
                  variant: 'danger',
                  text: this.$t('Errors.NoFilesToDownload'),
                },
              });
            }
          });
    },
    exportedLink() {
      window.open(`${this.exported()}`, "_blank");
    },
    exported() {
      const id = this.current_id ? this.current_id : 0;
      return `${this.baseUrl}/archive/export/${id}?token=${getToken()}`;
    },
    move() {
      this.$store
          .dispatch("archive/move", {
            marked_ids: this.selectedPaths,
            currentId: this.current_id ? this.current_id : 0,
          })
          .then((response) => {
            this.refresh();
            this.$toast({
              component: ToastificationContent,
              position: "top-right",
              props: {
                variant: "success",
                title: `${this.$t("Global.saved")}`,
              },
            });
            this.resetSelected();
          });
    },
    paste() {
      this.$store
          .dispatch("archive/paste", {
            marked_ids: this.selectedPaths,
            currentId: this.current_id ? this.current_id : 0,
          })
          .then((response) => {
            this.refresh();
            this.$toast({
              component: ToastificationContent,
              position: "top-right",
              props: {
                title: "Success",
                variant: "success",
                text: `${this.$t("Global.successMessage")}`,
              },
            });
            this.resetSelected();
          });
    },
  },
  mounted() {
  },
};
</script>

<style lang="scss">
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
