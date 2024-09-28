<template>
    <div v-if="$route.meta.breadcrumb || $route.meta.pageTitle" id="myHeader" class="floating-nav header-navbar">
        <!-- Content Left -->
        <div class="breadcrumbs-top">
            <div>
                <!-- {{ pageDetails }} -->
                <!-- <h2 class="content-header-title float-left pr-1 mb-0">
                            {{ t($route.meta.pageTitle) }}
                          </h2> -->
                <div class="breadcrumb-wrapper" style="margin-inline-start: 10px">
                    <b-breadcrumb>
                        <b-breadcrumb-item to="/">
                            <feather-icon icon="HomeIcon" size="16" class="align-text-top"/>
                        </b-breadcrumb-item>
                        <!-- {{$route.meta.breadcrumb}} -->
                        <!-- {{moreDetails}} -->
                        <!-- <b-breadcrumb-item v-if="moreDetails" :active="moreDetails.active" :to="'moreDetails'">
                                      {{ moreDetails ? $i18n.locale == 'ar'? moreDetails.name_local || moreDetails.name : moreDetails.name || moreDetails.name_local  : '' }}
                                    </b-breadcrumb-item> -->
                        <!-- <b-breadcrumb-item v-if="moreDetails.length"  v-for="item in moreDetails" :active="false" >
                                      {{  $i18n.locale == 'ar'? item.name_local || item.name : item.name || item.name_local  }}
                                    </b-breadcrumb-item>  -->
                        <b-breadcrumb-item v-if="$store.getters['app/path'].length == 0" v-for="item in breadCrumbTree"
                                           :key="item.text" :active="item.active"
                                           :to="item.type && item.type == 'link' ? item.to + $route.params.id : item.to">
                            <span v-if="item.active && pageDetails">
                                {{getPath(item.text , pageDetails)}}
                            </span>
                            <span v-else>
                                {{ t(item.text) }}
                            </span>
                        </b-breadcrumb-item>

                        <!--                        <b-breadcrumb-item v-else-->
                        <!--                                           v-for="item in $store.getters['app/path']" :key="item.name"-->
                        <!--                                           :active="item.active" :to="item.route ? item.route : ''">-->
                        <!--                            {{ t(item.name) }}-->
                        <!--                        </b-breadcrumb-item>-->
                        <!--            <b-breadcrumb-item v-for="(item, i) in getPaths(pageDetails)" :key="item.name" :to="{path:item.path ? item.path : '' , query:item.params}" :active="i == getPaths().length - 1">-->
                        <!--&lt;!&ndash;              {{ i == getPaths(pageDetails).length - 1 && pageDetails && pageDetails.print_code && pageDetails.code ? pageDetails.code + ':' : '' }}&ndash;&gt;-->
                        <!--&lt;!&ndash;              <span v-if="i == getPaths(pageDetails).length - 1 && pageDetails">&ndash;&gt;-->
                        <!--&lt;!&ndash;                {{ $i18n.locale == 'ar' ? pageDetails.name_local : pageDetails.name }}&ndash;&gt;-->
                        <!--&lt;!&ndash;              </span>&ndash;&gt;-->
                        <!--              <span v-if="item.name_local">-->
                        <!--                 {{ $i18n.locale == 'ar' ? item.name_local : item.name }}-->
                        <!--              </span>-->
                        <!--              <span v-else>-->
                        <!--                 {{ t(item.name) }}-->
                        <!--              </span>-->
                        <!--            </b-breadcrumb-item>-->

                        <!-- <b-breadcrumb-item v-if="$route.query.bread"
                                                       :active="true" >
                                        {{ t($route.query.bread) }}
                                    </b-breadcrumb-item> -->
                    </b-breadcrumb>
                </div>
            </div>
        </div>

        <!-- Content Right -->
        <!-- <b-col class="content-header-right text-md-right d-md-block d-none mb-1" md="3" cols="12">
                  <b-dropdown variant="link" no-caret toggle-class="p-0" right>
                    <template #button-content>
                      <b-button v-ripple.400="'rgba(255, 255, 255, 0.15)'" variant="primary" class="btn-icon">
                        <feather-icon icon="SettingsIcon" />
                      </b-button>
                    </template>

                    <b-dropdown-item :to="{ name: 'apps-todo' }">
                      <feather-icon icon="CheckSquareIcon" size="16" />
                      <span class="align-middle ml-50">Todo</span>
                    </b-dropdown-item>

                    <b-dropdown-item :to="{ name: 'apps-chat' }">
                      <feather-icon icon="MessageSquareIcon" size="16" />
                      <span class="align-middle ml-50">Chat</span>
                    </b-dropdown-item>

                    <b-dropdown-item :to="{ name: 'apps-email' }">
                      <feather-icon icon="MailIcon" size="16" />
                      <span class="align-middle ml-50">Email</span>
                    </b-dropdown-item>

                    <b-dropdown-item :to="{ name: 'apps-calendar' }">
                      <feather-icon icon="CalendarIcon" size="16" />
                      <span class="align-middle ml-50">Calendar</span>
                    </b-dropdown-item>
                  </b-dropdown>
                </b-col> -->
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import {BBreadcrumb, BBreadcrumbItem, BRow, BCol, BDropdown, BDropdownItem, BButton} from 'bootstrap-vue';
    import Ripple from 'vue-ripple-directive';
    import {useUtils as useAclUtils} from '@core/libs/acl';
    import {useUtils as useI18nUtils} from '@core/libs/i18n';

    export default {
        directives: {
            Ripple,
        },
        components: {
            BBreadcrumb,
            BBreadcrumbItem,
            BRow,
            BCol,
            BDropdown,
            BDropdownItem,
            BButton,
        },
        setup(props) {
            const {t} = useI18nUtils();
            const {canViewVerticalNavMenuLink} = useAclUtils();

            return {
                t,
            };
        },
        methods: {
            addSticky() {
                var header = document.getElementById('myHeader');
                if (header) {
                    var sticky = header.offsetTop;
                    if (window.pageYOffset > 10) {
                        header.classList.add('sticky');
                    } else {
                        header.classList.remove('sticky');
                    }
                }
            },
            getPath(last, pageDetails) {
                if (last && typeof last == 'string' && last.search('edit') >= 0 && pageDetails) {
                    if (last && last.search('course') >= 0) {
                        if (this.$i18n.locale == 'ar') {
                            return `${this.$t('Global.edit')}   : ${pageDetails.code ? pageDetails.code + " " : ''}  ${pageDetails.name_local || pageDetails.name}  `;
                        } else {
                            return ` ${this.$t('Global.edit')} :  ${pageDetails.code ? pageDetails.code + " " : ''}  ${pageDetails.name || pageDetails.name_local} `;
                        }

                    } else {

                        if (this.$i18n.locale == 'ar') {
                            return ` ${this.$t('Global.edit')} :  ${pageDetails.name_local || pageDetails.name} `;
                        } else {
                            return `${this.$t('Global.edit')}   : ${pageDetails.name || pageDetails.name_local}  `;
                        }
                    }

                } else if (last && typeof last == 'string' && pageDetails) {
                    if (last && last.search('course') >= 0) {

                        if (this.$i18n.locale == 'ar') {
                            return `${pageDetails.code ? pageDetails.code + " " : ''}  ${pageDetails.name_local || pageDetails.name}  `;
                        } else {
                            return ` ${pageDetails.code ? pageDetails.code + " " : ''}  ${pageDetails.name || pageDetails.name_local} `;
                        }

                    } else {
                        if (this.$i18n.locale == 'ar') {
                            return `${pageDetails.name_local || pageDetails.name} `;
                        } else {
                            return `${pageDetails.name || pageDetails.name_local}  `;
                        }
                    }
                }
            }
        },
        watch: {
            // pageDetails(newVal,oldVal){
            //   window.onpopstate = function() {
            //     this.$store.commit('app/BACK')
            //   }.bind(this);
            //   this.$store.commit('app/UPDATE_MORE_DETAILS',{active:true,text:'test',type:false,name:newVal?.name,name_local:newVal?.name_local,id:newVal?.id})
            // }
            $route(to, from) {
                //push path and calculate the path

                this.getPath(from, to);
            },
        },
        // beforeRouteLeave(to, from, next) {
        //   // if no hash then handle back button
        //   if (!to.hash) {
        //     // handleBackButton();
        //     // next(false); // this stops the navigation
        //     // return;
        //   }
        // },
        created() {
            this.$nextTick(() => {
                window.addEventListener('scroll', this.addSticky);
            });
        },
        computed: {
            ...mapGetters({
                pageDetails: 'app/pageDetails',
                moreDetails: 'app/moreDetails',
            }),
            breadCrumbTree() {
                let data = this.$route.meta.breadcrumb;
                let first = data[0];
                // let last = data[this.$route.meta.breadcrumb.length - 1];

                if (first && ['faculties', 'bylaws', 'programs', 'departments', 'courses', 'academic_settings'].includes(first.text.toLowerCase())) {
                    // let  shift_data  = data.shift();
                    let paths = [];
                    if (this.pageDetails && this.pageDetails.faculty) {
                        paths = [
                            {
                                text: 'academic_settings',
                            },
                            {
                                text: 'Faculties',
                                to: '/settings/faculties'
                            }, {
                                text: this.$i18n.locale == 'ar' ? this.pageDetails.faculty.name_local : this.pageDetails.faculty.name,
                                to: `/faculties/${this.pageDetails.faculty.id}`
                            }];
                    }

                    if (this.pageDetails && this.pageDetails.faculty && this.pageDetails.bylaw) {
                        paths = [
                            {
                                text: 'academic_settings',
                            },
                            {
                                text: 'Faculties',
                                to: '/settings/faculties'
                            }, {
                                text: this.$i18n.locale == 'ar' ? this.pageDetails.faculty.name_local : this.pageDetails.faculty.name,
                                to: `/faculties/${this.pageDetails.faculty.id}`
                            },
                            {
                                text: this.$i18n.locale == 'ar' ? this.pageDetails.bylaw.name_local : this.pageDetails.bylaw.name,
                                to: `/bylaws/${this.pageDetails.bylaw.id}`
                            }
                        ];
                    }

                    if (this.pageDetails && this.pageDetails.bylaw && !this.pageDetails.faculty ) {
                        paths = [
                            {
                                text: 'academic_settings',
                            },
                            {
                                text: 'Bylaws',
                                to: '/settings/bylaws'
                            }, {
                                text: this.$i18n.locale == 'ar' ? this.pageDetails.bylaw.name_local : this.pageDetails.bylaw.name,
                                to: `/bylaws/${this.pageDetails.bylaw.id}`
                            }];
                    }

                    let all_path = paths.concat(data)
                    if (all_path.length > 3) {
                        return paths.concat(data.filter(el => !['faculties', 'bylaws', 'programs', 'departments', 'courses' , 'academic_settings'].includes(el.text.toLowerCase())))
                    }
                    return paths.concat(data)
                }

                // if (last && ['add', 'edit'].includes(last.text.toLowerCase())) {
                //     return data;
                // }

                return data;

                // return this.$route.meta.breadcrumb;
            },
        },
    };
</script>

<style lang="scss">
    #myHeader {
        -webkit-transition: all 0.3s;
        -moz-transition: all 0.3s;
        -ms-transition: all 0.3s;
        -o-transition: all 0.3s;
        transition: all 0.3s;
    }
</style>
