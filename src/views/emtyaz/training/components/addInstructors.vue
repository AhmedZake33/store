<template>
  <div>
    <add_instructors
      v-if="hasPermission('edit_offering') && params.status == 4"
      :inline="true"
      :params="params"
      @hide="params.status = 3"
    />

    <DataTable v-else :title="title" :allow-search="false" :loading="load">
      <template #action>
        <div>
          <b-button
            v-if="hasPermission('edit_offering')"
            v-b-tooltip.hover="$t('Global.add')"
            variant="primary"
            class="btn-icon"
            @click="
              params = {
                status: 4,
                faculty_id: faculty_id,
                bylaw_id: bylaw_id,
              };
              addClicked();
            "
          >
            <feather-icon icon="PlusIcon" />
          </b-button>
          <b-button
            v-else
            v-b-tooltip.hover="$t('Global.add')"
            variant="secondary"
            class="btn-icon"
            style="cursor: default"
          >
            <feather-icon icon="PlusIcon" />
          </b-button>
        </div>
      </template>

      <template #customTable>
        <b-table
          :sort-desc.sync="filter.order_direction"
          :sort-by.sync="filter.order_by"
          :items="getInstructors"
          responsive
          striped
          :fields="fields"
          primary-key="id"
          show-empty
          :empty-text="$t('Global.empty_text')"
        >
          <template #cell(name)="data">
            <b-link
              v-if="$i18n.locale == 'en'"
              v-b-tooltip.hover="data.item.name"
              :to="`/users/${data.item.id}`"
              class="font-weight-bold"
            >
              {{
                data.item
                  ? data.item.name
                    ? data.item.name
                    : data.item.name_local
                  : '_'
              }}
            </b-link>
            <b-link
              v-if="$i18n.locale == 'ar'"
              v-b-tooltip.hover="data.item.name_local"
              :to="`/users/${data.item.id}`"
            >
              {{
                data.item
                  ? data.item.name_local
                    ? data.item.name_local
                    : data.item.name
                  : '_'
              }}
            </b-link>
          </template>

          <template #cell(email)="data">
            <template>
              <div v-if="data.item.email">
                {{ data.item.email ? data.item.email : '_' }}
              </div>
            </template>
          </template>
          <template #cell(phone)="data">
            <template>
              <div v-if="data.item.phone" class="font-weight-bold">
                {{ data.item.phone ? data.item.phone : '_' }}
              </div>
            </template>
          </template>
          <template #cell(actions)="data">
            <div>
              <feather-icon
                v-b-tooltip.hover="$t('Global.delete')"
                icon="Trash2Icon"
                style="cursor: pointer"
                class="text-danger"
                @click="remove(data.item)"
              />
            </div>
          </template>
        </b-table>
      </template>
    </DataTable>
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
  BDropdownItem,
  BPagination,
  BOverlay,
  BCardHeader,
  BCardBody,
  BModal,
  VBModal,
  BPopover,
} from 'bootstrap-vue';
import { mapActions, mapGetters } from 'vuex';
import Ripple from 'vue-ripple-directive';
import vSelect from 'vue-select';
import add_instructors from '@/views/emtyaz/training/components/add_instructors';
import DataTable from '@/views/components/table/DataTable';
import { EventBus } from '@/main';

export default {
  name: 'Instructors',
  components: {
    DataTable,
    BCard,
    add_instructors,
    vSelect,
    BRow,
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
    'b-modal': VBModal,
    Ripple,
  },
  props: {
    title: String,
    bylaw_id: null,
    course_id: null,
    faculty_id: null,
    action_hide: Boolean,
    //noStatus: Boolean,
    inline: false,
    faculty: Object,
    faculty_id_course: null,
    instructors: null,
  },
  data() {
    return {
      filter: { export: 0, removed: 0, bylaw_id: null },
      params: {},
      newInstructors: null,
      changeName: null,
    };
  },
  computed: {
    ...mapGetters({}),
    fields() {
      let fields = [
        {
          key: 'name',
          label: this.$t('Global.name'),
          sortable: true,
        },
        {
          key: 'email',
          label: this.$t('Global.email'),
          sortable: true,
        },
        {
          key: 'phone',
          label: this.$t('Global.phone'),
          sortable: true,
        },
        {
          key: 'actions',
          label: this.$t('Global.actions'),
          thClass: 'customAction',
          tdClass: 'customWidth',
        },
      ];

      return fields;
    },
    getInstructors() {
      if (this.newInstructors) {
        return this.newInstructors;
      }
      let instructors = this.instructors;
      return instructors;
    },
  },
  mounted() {
    this.getInstructors;
  },
  methods: {
    ...mapActions({
      // removeInstructor: 'Emtyaz/removeInstructor',
    }),
    addClicked() {
      this.changeName = 'addInstructor';
      EventBus.$emit('changeIt', this.changeName);
    },

    /*  refresh(query) {
              if (this.bylaw_id) {
                  query = {...query, bylaw_id: this.bylaw_id}
              }
              if (this.course_id) {
                  query = {...query, course_id: this.course_id}
              }
              if (this.faculty_id) {
                  query = {...query, faculty_id: Number(this.faculty_id)}
              }
              this.$store.dispatch('programs/programs', {query})
          }, */
    remove(item) {
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
      }).then((result) => {
        if (result.value) {
          const payload = {
            trainingId: this.$route.params.id,
            instructorId: item.id,
          };

          this.$store
            .dispatch('Emtyaz/removeInstructor', payload)
            .then((response) => {
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
  },
};
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}
</style>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
