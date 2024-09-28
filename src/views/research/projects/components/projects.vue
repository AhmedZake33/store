<template>
  <DataTable
      :total="total"
      :filter="filter"
      :loading="load"
      :params-loaded="paramsLoaded"
      @Refresh="refresh"
      @reset="reset"
  >
    <template #action>
      <b-button
          v-b-tooltip.hover="$t('Global.add')"
          class="btn-icon"
          variant="primary"
          @click="goToEdit(null)"
      >
        <feather-icon icon="PlusIcon"/>
      </b-button>
    </template>
    <template #customTable>
      <b-table
          class="position-relative"
          :items="items"
          responsive
          :fields="fields"
          primary-key="id"
          show-empty
          :empty-text="$t('Global.empty_text')"
      >
        <template #cell(id)="data">
          {{ data.item.id }}
        </template>

        <template #cell(title)="data">
          {{ data.item.title }}
        </template>

        <template #cell(description)="data">
          {{ data.item.description }}
        </template>

        <template #cell(information)="data">
          <span class="text-success">
              {{ $t('PIs') }}:
          </span>
          <template v-for="(pi, i) in data.item.pis">
            <span :key="pi.user.id" class="text-success">
              {{ (i > 0 ? (", " + getTranslatedName(pi.user)) : getTranslatedName(pi.user)) }}
            </span>
          </template>
          <br>
          <span class="text-primary">
              {{ $t('Team') }}:
          </span>
          <template v-for="(member, k) in data.item.team">
            <span :key="member.user.id" class="text-primary">
              {{ (k > 0 ? (", " + getTranslatedName(member.user)) : getTranslatedName(member.user)) }}
            </span>
          </template>
          <br>
          <span class="text-secondary">
              {{ $t('Partners') }}:
          </span>
          <template v-for="(partner, j) in data.item.partners">
            <span :key="partner.user.id" class="text-secondary">
              {{ (j > 0 ? (", " + getTranslatedName(partner.user)) : getTranslatedName(partner.user)) }}
            </span>
          </template>
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
                v-b-tooltip.hover="$t('Global.view')"
                icon="EyeIcon"
                style="cursor: pointer"
                @click="goToShow(data.item.id)"
                class="text-primary"
            />
            <feather-icon
                v-b-tooltip.hover="$t('Global.edit')"
                icon="EditIcon"
                style="cursor: pointer"
                @click="goToEdit(data.item.id)"
                class="text-primary"
            />
            <feather-icon
                v-b-tooltip.hover="$t('Global.delete')"
                icon="Trash2Icon"
                style="cursor: pointer"
                class="text-danger"
                @click="deleteProject(data.item.id)"
            />
          </div>
        </template>
      </b-table>
    </template>
  </DataTable>
</template>
<script>
import {
  VBModal,
  BTable,
  BBadge,
  BCol,
  BLink,
} from 'bootstrap-vue'
import Ripple from 'vue-ripple-directive'
import vSelect from 'vue-select'
import DataTable from '@/views/components/table/DataTable'

import ProjectApi from '@/api/research/projects/projects'
import {mapActions, mapGetters} from 'vuex'

const projectApi = new ProjectApi()

export default {
  name: 'MyProjects',
  components: {
    DataTable,
    BTable,
    vSelect,
    BBadge,
    BCol,
    BLink,
  },
  directives: {
    'b-modal': VBModal,
    Ripple,
  },
  data() {
    return {
      filter: {status: null},
      items: [],
      total: 0,
      lookup: [],
      load: false,
      paramsLoaded: true,
    }
  },
  computed: {
    fields() {
      return [
        {
          key: 'id',
          label: this.$t('Code'),
        },
        {
          key: 'title',
          label: this.$t('Title'),
        },
        {
          key: 'description',
          label: this.$t('Description'),
        },
        {
          key: 'information',
          label: this.$t('Information'),
        },
        {
          key: 'actions',
          label: this.$t('Global.actions'),
          thClass: 'customAction',
          tdClass: 'customWidth',
        },
      ]
    },
    lookups() {
      return this.lookup
    },
  },
  watch: {},
  methods: {
    ...mapActions({
      getLookup: 'app/GET_LOOKUPS',
    }),
    refresh(query = null) {
      this.load = true
      projectApi.list('my-projects', query).then(response => {
        this.items = response.data
        this.total = response.meta.count
        this.lookup = response.meta.lookup
        this.load = false
      }).then(() => {
        this.paramsLoaded = false
      }).catch(error => {
        this.load = false
      })
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
    editProject(id) {
      this.$router.push({
        name: "edit_project",
        params: {
          id: id,
        },
      });
    },
    deleteProject(id) {
      this.$swal({
        title: `${this.$t('Global.deleteTitle')}`,
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
          this.popoverShow = false;
          projectApi.remove(id).then(response => {
            this.$swal({
              icon: 'success',
              title: this.$t('Global.Deleted'),
              showConfirmButton: false,
              timer: 1500,
            })
            this.refresh()
          });
        }
      });
    },
    goToEdit(id) {
      this.$emit('toEditProject', id)
    },
    goToShow(id) {
      this.$emit('toShowProject', id)
    }
  },
}
</script>
