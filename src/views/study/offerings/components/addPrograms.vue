<template>
    <div>
   <!-- 
        <add v-if="hasPermission('edit_offering') && params.status == 4" :inline="true" :params="params" @hide="params.status = 3" 
                :course_id="course_id" @refresh="refresh" />
      -->
        <DataTable
               
                :title="title"
                :allow-search="false"
                :filter="filter"
                @reset="filter = {export:0 , removed: 0,bylaw_id: null}"
                @Refresh="refresh"
               
        >
           <!--  <template #action>
               
                <div>
                    <b-button
                        v-if="hasPermission('edit_offering')"
                            v-b-tooltip.hover="$t('Global.add')"
                            variant="primary"
                            class="btn-icon"
                            @click="params = { status: 4, faculty_id: faculty_id, bylaw_id: bylaw_id }"
                    >
                        <feather-icon icon="PlusIcon"/>
                    </b-button>
                </div>
            </template> -->
           
            <template #customTable >
                <b-table
                                  @sort-changed="sortingChanged"
          no-local-sorting
                        :items="$store.getters['offerings/item'].programs"
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
                                :to="{ name: 'program', params: { id: data.item.id } }"
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
                                :to="{ name: 'program', params: { id: data.item.id } }"
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
                  
                    <template #cell(bylaw)="data">
                       
                        <template>
                            <div v-if="data.item.bylaw">
                                <b-link v-if="$i18n.locale == 'en'"
                                        v-b-tooltip.hover="data.item.bylaw.name"
                                        :to="{ name: 'bylaw', params: { id: data.item.bylaw.id } }"
                                        class="font-weight-bold"
                                >
                                    {{data.item.bylaw?  data.item.bylaw.name + ' ' + '(' + data.item.bylaw.code + ')'  : '_'}}
                                </b-link>
                                <b-link v-if="$i18n.locale == 'ar'"
                                        v-b-tooltip.hover="data.item.bylaw.name_local"
                                        :to="{ name: 'bylaw', params: { id: data.item.bylaw.id } }"
                                        class="font-weight-bold"
                                >
                                    {{data.item.bylaw?  data.item.bylaw.name + ' ' + '(' + data.item.bylaw.code + ')'  : '_'}}
                                </b-link>
                            </div>
                        </template>
                    </template>
                    <template #cell(stage)="data">
                        <div v-if="data.item.bylaw.stage">
                        <span v-if="$i18n.locale == 'en'">
                            {{data.item.bylaw.stage.name}}
                        </span>
                            <span v-else>
                            {{data.item.bylaw.stage.name_local}}
                        </span>
                        </div>
                    </template>
  
                   <!--  <template #cell(actions)="data">
                        <div>
                           
                            <feather-icon
                                    v-b-tooltip.hover="$t('Global.delete')"
                                    icon="Trash2Icon"
                                    style="cursor: pointer"
                                    class="text-danger"
                                    @click="remove(data.item.id)"
                                    v-if="hasPermission('edit_offering')"
                            />
                        </div>
                    </template> -->
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
    } from 'bootstrap-vue'
    import {mapActions, mapGetters} from 'vuex'
    import Ripple from 'vue-ripple-directive'
    import vSelect from 'vue-select'
    import Edit from '@/views/academic_settings/programs/edit'
    import Add from '@/views/study/offerings/components/add_programs';
    import DataTable from '@/views/components/table/DataTable'

    export default {
        name: 'Programs',
        components: {
            DataTable,
            BCard,
            Add,
            vSelect,
            BRow,
            BCol,
            Edit,
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
            faculty:Object,
            faculty_id_course: null,
            programs: null,
        },
        data() {
            return {
                filter: {export: 0, removed: 0, bylaw_id: null},
                params: {},
                newPrograms:null,

            }
        },
        mounted() {
             this.getPrograms
        },
        computed: {
            ...mapGetters({
                //items: 'programs/items',
                // total: 'programs/total',
                load: 'programs/load',
                //lookups: 'programs/lookups',
                items: 'offerings/item',
                load: 'offerings/load',
            }),
             getPrograms(){
            if(this.newPrograms)
            {
                return this.newPrograms
            }
           // let programs = this.programs
            return this.$store.getters['offerings/item'].programs
            },
            fields() {
                let fields = [
                  
                    {
                        key: 'name',
                        label: this.$t('Global.name'),
                        sortable: true,
                    },
                    {
                        key: 'bylaw',
                        label: this.$t('Global.bylaw'),
                        sortable: true,
                    },
                    {
                        key: 'stage',
                        label: this.$t('Global.stage'),
                        sortable: true,
                    },
                  
                    /* 
                    {
                        key: 'actions',
                        label: this.$t('Global.actions'),
                        thClass: 'customAction',
                        tdClass: 'customWidth',
                    }, */
                ]
                
                return fields
            },
            
        },
        methods: {
            ...mapActions({
                removeProgram:'offerings/removeProgram',
            }),
           
            refresh(query) {
                this.getPrograms
              /*   if (this.bylaw_id) {
                    query = {...query, bylaw_id: this.bylaw_id}
                }
                if (this.course_id) {
                    query = {...query, course_id: this.course_id}
                }
                if (this.faculty_id) {
                    query = {...query, faculty_id: Number(this.faculty_id)}
                } */
                //this.$store.dispatch('offerings/item', {query})
                 this.$emit('refresh')
            },
            remove(id) {
               let query = { program_id : id , offering_id:this.$route.params.id}
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
                    this.removeProgram(query).then(response => {
                        this.newPrograms=response.data.programs
                        this.getPrograms
                    
                        this.refresh();
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
        watch: {
           /*  'filter.faculty_id'() {
                this.filter.bylaw_id = 0;
            } */
        }
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
