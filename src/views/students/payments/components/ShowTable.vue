<template>
  <app-collapse type="margin">
    <!--    <app-collapse-item :title="title">-->
    <b-table
      :empty-text="$t('Global.empty_text')"
      show-empty
      :busy="loading"
      :items="items"
      :fields="filedDate"
      striped
      responsive
    >
      <template #table-busy>
        <div class="text-center text-black my-2">
          <b-spinner class="align-middle"></b-spinner>
        </div>
      </template>
      <template #cell(created_by)="data">
        <b-media
          v-if="data.item.created_by"
          vertical-align="center"
          class="d-flex align-items-center"
        >
          <template #aside>
            <b-avatar size="32" :text="avatarText(data.item.created_by.name)" />
          </template>
          <b-link
            :to="{ name: 'user-show', params: { id: data.item.created_by.id } }"
            v-if="$i18n.locale == 'en'"
            v-b-tooltip.hover="data.item.created_by.name"
            class="font-weight-bold d-block text-nowrap"
          >
            {{
              data.item.created_by
                ? shortMyText(data.item.created_by.name, 30)
                : "_"
            }}
          </b-link>
          <b-link
            :to="{ name: 'user-show', params: { id: data.item.created_by.id } }"
            v-if="$i18n.locale == 'ar'"
            v-b-tooltip.hover="data.item.created_by.name_local"
          >
            {{
              data.item.created_by
                ? shortMyText(data.item.created_by.name_local, 30)
                : "_"
            }}
          </b-link>
        </b-media>
      </template>
      <template #cell(status)="data">
        <b-badge
          pill
          v-if="data.item.status"
          :variant="`${getCustomStatus(data.item.status.id).color}`"
          class="text-capitalize"
        >
          {{
            $i18n.locale == "ar"
              ? data.item.status.name_local
              : data.item.status.name
          }}
        </b-badge>
      </template>
      <!-- <template #cell(currency)="data">
        {{
          $i18n.locale == "ar"
            ? data.item.currency.name_local
            : data.item.currency.name
        }}
      </template> -->
      <template #cell(actions)="data">
        <div v-if="data.item">
          <div>
              <!-- <b-link>
                <feather-icon 
                  v-b-tooltip.hover="$t('Global.edit')"
                  icon="EditIcon" 
                  @click="open(data.item.id)" 
                  class="text-primary mr-1"
                />
              </b-link> -->
              <b-link>
                <feather-icon 
                  v-b-tooltip.hover="$t('Global.delete')" 
                  icon="Trash2Icon"  
                  class="text-danger ml-1"
                  @click="deleteInstallment(data.item.id)" 
                />
              </b-link>
          </div>
        </div>
      </template>
    </b-table>
    <!--    </app-collapse-item>-->
  </app-collapse>
</template>

<script>
import {
  BTable,
  BOverlay,
  BFormCheckbox,
  BButton,
  BCard,
  BRow,
  BCol,
  BAvatar,
  BBadge,
  BLink,
  BMedia,
  BSpinner,
} from "bootstrap-vue";
import BCardActions from "@core/components/b-card-actions/BCardActions.vue";
import AppCollapse from "@core/components/app-collapse/AppCollapse.vue";
import AppCollapseItem from "@core/components/app-collapse/AppCollapseItem.vue";

export default {
  components: {
    BTable,
    BLink,
    BMedia,
    BSpinner,
    BButton,
    BFormCheckbox,
    BCard,
    BRow,
    BCol,
    BBadge,
    BAvatar,
    BCardActions,
    AppCollapse,
    AppCollapseItem,
    BOverlay,
  },
  props: {
    items: null,
    canMakeInstallment: null,
    fields: [],
    inner: [],
    title: String,
    type: String,
    loading: false,
  },
  computed: {
    filedDate() {
      return this.fields;
    },
  },
  methods: {
    getCustomStatus(id) {
      if (id == 0 || id == "unpaid") {
        return {
          color: "danger",
          name: "Unpaid",
        };
      } else if (id == 1 || id == "paid") {
        return {
          color: "light-success",
          name: "Fully Paid",
        };
      } else if (id == 2 || id == "partially paid") {
        return {
          color: "primary",
          name: "Partially Paid",
        };
      } else if (id == 3 || id == "over paid") {
        return {
          color: "success",
          name: "Over Paid",
        };
      } else if (id == 5 || id == "new") {
        return {
          color: "light-primary",
          name: "New",
        };
      } else if (id == 5 || id == "refund") {
        return {
          color: "warning",
          name: "Refund",
        };
      } else if(id == 4){
        return{
            color: 'primary',
            name: 'paid'
        }
      }
    },
    deleteInstallment(id) {
      if (this.items) {
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
              this.$store.dispatch('payments/removeInstallment', id).then(response => {
                  this.$swal({
                      icon: 'success',
                      title: this.$t('Global.Deleted'),
                      showConfirmButton: false,
                      timer: 1500,
                  })
                  this.$emit('refresh');
              });
            }
        });
      }
    },
  },
};
</script>
