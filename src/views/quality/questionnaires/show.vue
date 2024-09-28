<template>
  <div>
    <b-card class="mb-0">
        <b-tabs
            v-model="tabIndex"
            @input="saveStatus"
            vertical
            nav-wrapper-class="nav-hidden"
            align="left"
        >
            <b-tab>
                <template #title>
                    <feather-icon icon="BookOpenIcon" />
                    <span>{{ $t("Global.basic_info") }}</span>
                </template>
                <Edit 
                    v-if="edit" 
                    @hide="cancel()"
                    @refresh="init"
                    :inline="true"
                    :tabNumber="0" 
                    :data="
                        id ? item : 
                        {
                            'questionnaire_type':'',
                            'destination':'',
                            'faculty':'',
                            'bylaw':'',
                            'program':'',
                            'course':'',
                            'starts_at':'',
                            'ends_at':'',
                            'type':'',
                            'anonymous_url':'',
                            'active':''
                        }
                    "   
                >
                </Edit>
                <div v-if="item && !edit">
                    <ShowComponent 
                        :loading="load"
                        :data="item" 
                        :only="[
                                'questionnaire_type',
                                'destination',
                                'starts_at',
                                'ends_at',
                                'type',
                                'anonymous_url',
                                'active'
                            ]" 
                        >
                        <template #questionnaire_type="{ data }">
                            <th scope="row" :width="'20%'">
                                {{ $t(`Global.questionnaire_type`) }}
                            </th>
                            <td>
                                {{ $i18n.locale == 'ar' ? data.questionnaire_type.name_local : data.questionnaire_type.name }}
                            </td>
                        </template>
                        <template #destination="{ data }">
                            <th scope="row" :width="'20%'">
                                {{ $t(`Global.destination`) }}
                            </th>
                            <td>
                                <div class="d-flex" v-if="data.destination">
                                    <span 
                                        v-for="item in data.destination"
                                        :key="item.id"
                                    >
                                        {{ $i18n.locale == 'ar' ? item.name_local : item.name }}, &nbsp;
                                    </span>
                                </div>
                            </td>
                        </template>
                        <template #starts_at="{ data }">
                            <th scope="row" :width="'20%'">
                                {{ $t(`Global.start_date`) }}
                            </th>
                            <td>
                                {{ data.starts_at }}
                            </td>
                        </template>
                        <template #ends_at="{ data }">
                            <th scope="row" :width="'20%'">
                                {{ $t(`Global.end_date`) }}
                            </th>
                            <td>
                                {{ data.ends_at }}
                            </td>
                        </template>
                        <template #type="{ data }">
                            <th scope="row" :width="'20%'">
                                {{ $t(`Global.type`) }}
                            </th>
                            <td>
                                {{ $i18n.locale == 'ar' ? data.type.name_local : data.type.name }}
                            </td>
                        </template>
                        <template #anonymous_url="{ data }">
                            <th scope="row" :width="'20%'">
                                {{ $t(`Global.url`) }}
                            </th>
                            <td>
                                <a :href="data.anonymous_url">
                                    {{ $i18n.locale == 'ar' ? data.anonymous_url : data.anonymous_url }}    
                                </a>
                            </td>
                        </template>
                        <!-- <template #active="{ data }">
                            <th scope="row" :width="'20%'">
                                {{ $t(`Global.active`) }}
                            </th>
                            <td v-if="data.item.active">
                                <span v-if="$i18n.locale == 'ar'">
                                    {{ data.item.active == 'Active' ? 'نشط' : 'غير نشط' }}
                                </span>
                                <span v-else>
                                    {{ data.active }}
                                </span>
                            </td>
                        </template> -->
                        <template #edit v-if="hasPermission('edit_questionnaire')">
                            <div class="mt-0 mb-1">
                            <feather-icon v-if="hasPermission('edit_questionnaire')" @click="openEdit()" style="cursor: pointer"
                                icon="EditIcon" class="font-medium-3" v-b-tooltip.hover="$t('Global.edit')" />
                            </div>
                        </template>
                    </ShowComponent>
                </div>
            </b-tab>

        </b-tabs>
    </b-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import 
{
    BBadge,
    BLink,
    BTab,
    BTabs,
    BCard
} from "bootstrap-vue";
import Edit from "@/views/quality/questionnaires/edit.vue";
import ShowComponent from "@/views/components/info/show";


export default {
    name:'Show',
    data(){
        return {
            edit: false,
            visitedTabs: [],
            tabIndex: 0,
            index: 0,
        }
    },
    components:{
        ShowComponent,
        Edit,
        BBadge,
        BLink,
        BTab,
        BTabs,
        BCard,
    },
    computed:{
        ...mapGetters({
            item: "questionnaires/item",
            load: "questionnaires/load",
            lookups: "questionnaires/lookups",
        }),
        localLang() {
            return this.$i18n.locale;
        },
        id() {
            return this.$route.params.id ? this.$route.params.id : null;
        },
    },
    methods:{
        init(id) {
            this.$store.dispatch('questionnaires/getQuestionnaireLookups').then(_=>{
                if(this.id || id){
                    this.$store.dispatch("questionnaires/get", this.id);
                    this.edit = this.$route.query.inline == 'false' ? false : this.$route.query.inline;
                }else{
                    this.edit = true
                }
            })
        },
        openEdit() {
            this.edit = true;
            this.updateFilterQueryParams({ tabNum: this.$route.query.tabNum || 0, inline: true });
        },
        cancel() {
            this.edit = false;
            this.updateFilterQueryParams({ tabNum: this.$route.query.tabNum || 0, inline: false });
        },
        checkTabVisited(index) {
            return this.visitedTabs.includes(index);
        },
        saveStatus(index) {
            this.edit = false;
            this.resetFilterQueryParams({});
            this.updateFilterQueryParams({
                tabNum: index,
                ...this.getTabFilterData(index),
            });
            this.visitedTabs.push(index);
        },
    },
    mounted() {
      this.init();
    }
}
</script>

<style scoped>

</style>