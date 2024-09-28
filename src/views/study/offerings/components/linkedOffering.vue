<template>
    <div>
    <b-overlay :show="show" rounded="sm">
        <add v-if="hasPermission('edit_offering') && params.status == 4" :inline="true" :params="params" @hide="params.status = 3"/>
        <DataTable
                v-else
                :title="title"
                :allow-search="false"
                :loading="load"
                @Refresh="refresh" >
            <template #action>
                <div>
                    <b-button
                        v-if="hasPermission('edit_offering') && status != 'Frozen' && status != 'Published'"
                            v-b-tooltip.hover="$t('Global.add')"
                            variant="primary"
                            class="btn-icon"
                            @click="params = { status: 4 }; addClicked()"
                    >
                        <feather-icon icon="PlusIcon"/>
                    </b-button>
                    <b-button
                        v-else
                            v-b-tooltip.hover="$t('Global.add')"
                            variant="secondary"
                            class="btn-icon"
                            style="cursor:default;"
                    >
                        <feather-icon icon="PlusIcon"/>
                    </b-button>
                </div>
            </template>

            <template #customTable>
                <b-table
                       
                        :items="getLinkedOffering"
                        responsive
                        striped
                        :fields="fields"
                        primary-key="id"
                        show-empty
                        :empty-text="$t('Global.empty_text')"
                >
                    <template #cell(course)="data">
                        <b-link
                                v-if="$i18n.locale == 'en'"
                                :to="{ name: 'course', params: { id: data.item.course.id } }"
                                class="font-weight-bold"
                        >
                          {{data.item.course.code? data.item.course.code : ' '}}  {{
                            data.item.course ? data.item.course.name
                            ? data.item.course.name
                            : data.item.course.name_local
                            : '_'
                            }}
                        </b-link>
                        <b-link
                                v-if="$i18n.locale == 'ar'"
                               :to="{ name: 'course', params: { id: data.item.course.id } }"
                        >
                            {{
                           data.item
                            ? data.item.course.name_local
                            ? data.item.course.name_local
                            : data.item.course.name
                            : '_'
                            }}
                        </b-link>
                    </template>
                   <template #cell(id)="data">
                    <div class="d-flex">
                        <b-link
                        :to="{ name: 'offering', params: { id: data.item.id } }"
                         target="_blank"
                        >
                        {{data.item.id}}
                        </b-link>
                    </div> 
                    </template>
                   <template #cell(semester)="data">
                    <div class="d-flex">
                       <span v-if="$i18n.locale == 'en' && data.item.term">
                       {{data.item.term.name? data.item.term.name: data.item.term.name_local}}
                       </span>
                       <span v-if="$i18n.locale == 'ar' && data.item.term">
                       {{data.item.term.name_local? data.item.term.name_local: data.item.term.name}}
                       </span>
                    </div> 
                    </template>
                   <template #cell(status)="data">
                    <div class="d-flex">
                       <span v-if="$i18n.locale == 'en' && data.item.status">
                       {{data.item.status.name? data.item.status.name: data.item.status.name_local}}
                       </span>
                       <span v-if="$i18n.locale == 'ar' && data.item.status">
                       {{data.item.status.name_local? data.item.status.name_local: data.item.status.name}}
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
                              <b-link
                                :to="{ name: 'offering', params: { id: data.item.id } }"
                                  target="_blank"
                                >
                                <feather-icon
                                    v-b-tooltip.hover="$t('Global.show')"
                                    icon="EyeIcon"
                                    class="text-primary"
                                />
                                </b-link>
                                <b-link>
                                 <feather-icon
                                    v-b-tooltip.hover="$t('Global.delete')"
                                    icon="Trash2Icon"
                                    style="cursor: pointer"
                                    class="text-danger"
                                    @click="remove(data.item)"
                                    v-if="hasPermission('edit_offering')"
                                  />
                                </b-link>
                                
                        </div>
                       
                    </template>
                </b-table>
            </template>
        </DataTable>
    </b-overlay>       
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
    } from 'bootstrap-vue'
    import {mapActions, mapGetters} from 'vuex'
    import Ripple from 'vue-ripple-directive'
    import vSelect from 'vue-select'
    import Add from '@/views/study/offerings/components/add_linked_offering';
    import DataTable from '@/views/components/table/DataTable'
    import { EventBus } from '@/main';

    export default {
        name: 'LinkedOffering',
        components: {
            DataTable,
            BCard,
            Add,
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
            action_hide: Boolean,
            //noStatus: Boolean,
            inline: false,
            linkedOfferings:null,
            status: null
        },
        data() {
            return {
                params: {},
                newLinkedOffering:false,
                changeName:null,
                show: true,
            }
        },
        computed: {
            ...mapGetters({
                load: 'offerings/load',
                item: "offerings/item",
            }),
            fields() {
                let fields = [
                  
                    {
                        key: 'id',
                        label: this.$t('Global.id'),
                        sortable: true,
                    },
                    {
                        key: 'course',
                        label: this.$t('Global.course'),
                        sortable: true,
                    },
                   /*  {
                        key: 'instructors',
                        label: this.$t('Global.instructors'),
                        sortable: false,
                    }, */
                  
                    {
                        key: 'semester',
                        label: this.$t('Global.semester'),
                        sortable: true,
                    },
                  
                    {
                        key: 'status',
                        label: this.$t('Global.status'),
                        sortable: true,
                    },
                  
                    
                    {
                        key: 'actions',
                        label: this.$t('Global.actions'),
                        thClass: 'customAction',
                        tdClass: 'customWidth',
                    },
                ]
               
                return fields
            },
             getLinkedOffering()
            {
            if(this.newLinkedOffering)
            {
                if(this.item)
                {
                    if(this.item.linked_offering.length > 0)
                    {
                         return this.item.linked_offering
                    }
                }
            }
            let linkedOfferings = this.linkedOfferings
            this.show = false
            return linkedOfferings
            }
            
        },
         mounted() {
            this.init()
            //this.getLinkedOffering()
        },
        methods: {
            ...mapActions({
               removeLinkedOffering:'offerings/removeLinkedOffering',
               getItem: "offerings/get",


            }),
            init() {
              this.getItem(this.$route.params.id);
            },
             addClicked() {
                this.changeName = "addLinkedOffering"
                EventBus.$emit('changeIt', this.changeName);
                   },
           
            refresh(query) {
              
                //this.$store.dispatch('programs/programs', {query})
            },
            remove(item) {
                let query = { linkedOfferingsIds: [item.id] , offering_id:this.$route.params.id}
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
                        this.show = true
                    this.removeLinkedOffering(query).then(response => {
                        this.init()
                        this.newLinkedOffering = true
                        this.show = false
                    this.getLinkedOffering
                    
                        //this.refresh();
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
      
    }
</script>

<style lang="scss" scoped>
    .per-page-selector {
        width: 90px;
    }
</style>

<style lang="scss">
    @import '@core/scss/vue/libs/vue-select.scss';
</style>
