<template>
    <DataTable :total="total" :filter="filter" :loading="load" @Refresh="refresh" @reset="reset">
        <template #filter>
            <b-col md="6">
                <b-form-group>
                    <flat-pickr placeholder="Date from to" v-model="filter.rangeDate" class="form-control"
                                :config="{ mode: 'range' }"/>
                </b-form-group>
            </b-col>
        </template>
        
        <template #customTable>
            <b-table class="position-relative" :items="items" responsive :fields="fields" primary-key="id" show-empty
                     :empty-text="$t('Global.empty_text')"  @sort-changed="sortingChanged"
                    no-local-sorting>
                <template #cell(user)="data">
                    <b-media vertical-align="center" v-if="data.item.user" class="d-flex align-items-center">
                        <template #aside>
                            <b-avatar size="32" :text="avatarText(data.item.user.name)"/>
                        </template>
                        <b-link class="font-weight-bold d-block text-nowrap"
                                :to="{ name: 'user-show', params: { id: data.item.user.id } }">
                            {{ data.item.user.name }}
                        </b-link>
                        <small class="text-muted">{{ data.item.user.name_local }}</small>
                    </b-media>
                </template>
                <template #cell(last_message)="data">
                    <span v-b-tooltip.hover="data.item.last_message?data.item.last_message.message:'-'" class="text-nowrap" v-if="data.item.last_message">
                        {{data.item.last_message ? shortMyText(data.item.last_message.message,30) : '-'}}
                    </span>
                </template>
                <template #cell(created_at)="data">
                    <!-- <span class="text-nowrap">{{ toLocalDatetime(data.item.created_at, $i18n.locale, true) }}</span> -->
                    <!-- <span class="text-nowrap">{{ toLocalDatetime(data.item.last_message.sent_at, $i18n.locale, true) }}</span> -->
                    <span class="text-nowrap">{{ data.item.last_message.sent_at }}</span>
                </template>

                <template #cell(status)="data">
                    <b-badge pill variant="primary" v-if="data.item.status">
                      <span v-if="$i18n.locale == 'ar'">
                            {{data.item.status.name_local}}
                      </span>
                        <span v-else>
                            {{data.item.status.name}}
                      </span>
                    </b-badge>
                </template>

                <template #cell(actions)="data">
                    <div v-if="data.item.user">
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
                        <b-link :to="{ name: 'global-chat', params: { chat_id: data.item.id, user_id: data.item.user ? data.item.user.id:0 } }">
                            <feather-icon class="font-large-1" icon="MessageCircleIcon"/>
                        </b-link>
                    </div>
                </template>
            </b-table>
        </template>
    </DataTable>
</template>

<script>
    import {
        BCard,
        BFormGroup,
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
        BPagination
    } from 'bootstrap-vue';
    import vSelect from 'vue-select';
    import DataTable from '@/views/components/table/DataTable';
    import flatPickr from 'vue-flatpickr-component';
    import {mapGetters} from 'vuex';

    export default {
        name: "chats",
        components: {
            BCard,
            flatPickr,
            BRow,
            BFormGroup,
            DataTable,
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

            vSelect,
        },
        data() {
            return {
                filter: {removed: 0},
                paramsLoaded: true,
            };
        },
        computed: {
            ...mapGetters({
                items: 'chats/items',
                total: 'chats/total',
                needDrop:'app/needDrop',
                load: 'chats/load',
            }),
            fields() {
                let fields = [
                    {
                        label: this.$t('Global.name'),
                        key: 'user',
                        sortable: true,
                    },
                    {
                        label: this.$t('Global.last_message'),
                        key: 'last_message',
                    },
                    // {
                    //     label: this.$t('Global.status'),
                    //     key: 'status',
                    //     sortable: true,
                    // },
                    {
                        label: this.$t('Global.created_at'),
                        key: 'created_at',
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
        },
        methods: {
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
            refresh(query) {
                this.$store.dispatch('chats/items', {query}).then((data) => {
                    this.paramsLoaded = false;
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
    @import '@core/scss/vue/libs/vue-flatpicker.scss';
</style>
