<template>
  <div>
    <b-card class="mb-0">
        <b-tabs
            v-model="tabIndex"
            @input="saveStatus"
            lazy
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
                            'name':'', 
                            'name_local':'', 
                            'id':'',
                            'description':'',
                            'description_local':'',
                            'questions':'',
                            'status':''
                        }
                    "   
                >
                </Edit>
                <div v-if="item && !edit">
                    <ShowComponent 
                        :loading="load"
                        :data="item" 
                        :only="[
                                'name',
                                'name_local',
                                'id',
                                'description',
                                'description_local',
                                'questions',
                                'status'
                            ]" 
                        >
                        <template #name="{ data }">
                            <th scope="row" :width="'20%'">
                            {{ $t(`Global.name_custom`) }}
                            </th>
                            <td>
                            {{ data.name }}
                            </td>
                        </template>
                        <template #name_local="{ data }">
                            <th scope="row" :width="'20%'">
                                {{ $t(`Global.arabic_name`) }}
                            </th>
                            <td >
                                {{ data.name_local }}
                            </td>
                        </template>
                        <template #id="{ data }">
                            <th scope="row" :width="'20%'" v-if="$i18n.locale == 'ar'">
                                {{ $t(`Global.name_custom`) }}
                            </th>
                            <td v-if="$i18n.locale == 'ar'">
                                {{ data.name }}
                            </td>
                            <th scope="row" :width="'20%'" v-if="$i18n.locale == 'en'">
                                {{ $t(`Global.arabic_name`) }}
                            </th>
                            <td v-if="$i18n.locale == 'en'">
                                {{ data.name_local }}
                            </td>
                        </template>
                        
                        <template #description="{ data }">
                            <th scope="row" :width="'20%'">
                                {{ $t(`Global.description_custom`) }}
                            </th>
                            <td>
                                {{ data.description }}
                            </td>
                        </template>
                        <template #description_local="{ data }">
                            <th scope="row" :width="'20%'">
                                {{ $t(`Global.description_local`) }}
                            </th>
                            <td>
                                {{ data.description_local }}
                            </td>
                        </template>
                        <template #questions="{ data }">
                            <th scope="row" :width="'20%'" v-if="$i18n.locale == 'ar'">
                                {{ $t(`Global.description_custom`) }}
                            </th>
                            <td v-if="$i18n.locale == 'ar'">
                                {{ data.description }}
                            </td>
                            <th scope="row" :width="'20%'" v-if="$i18n.locale == 'en'">
                                {{ $t(`Global.description_local`) }}
                            </th>
                            <td v-if="$i18n.locale == 'en'">
                                
                                {{ data.description_local }}
                            </td>
                        </template>

                        <template #status="{ data }">
                            <th scope="row" :width="'20%'">
                                {{ $t(`Global.status`) }}
                            </th>
                            <td>
                                {{ $i18n.locale == 'ar' ? data.status.name_local : data.status.name }}
                            </td>
                        </template>
                        <template #edit v-if="item.status.id == 0 && item.can_edit == true">
                            <div class="mt-0 mb-1">
                                <feather-icon v-if="hasPermission('edit_questionnaireType')" @click="openEdit()" style="cursor: pointer"
                                icon="EditIcon" class="font-medium-3" v-b-tooltip.hover="$t('Global.edit')" />
                            </div>
                        </template>
                    </ShowComponent>
                </div>
            </b-tab>
            <b-tab>
                <template #title>
                    <feather-icon icon="HelpCircleIcon" />
                    <span>{{ $t("Global.questions") }}</span>
                </template>
                <Questions :typeId="id"/>
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
import Edit from "@/views/quality/questionnaires_types/edit.vue";
import ShowComponent from "@/views/components/info/show";
import Questions from "@/views/quality/questionnaires_questions/components/questions.vue";

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
        Questions
    },
    computed:{
        ...mapGetters({
            item: "questionnairesTypes/item",
            load: "questionnairesTypes/load",
        }),
        localLang() {
            return this.$i18n.locale;
        },
        id() {
            return this.$route.params.id ? this.$route.params.id : null;
        },
    },
    beforeMount() {
        if (this.$route.query) {
            if (this.$route.query.tabNum) {
                this.tabIndex = Number(this.$route.query.tabNum);
                this.setSelectedTab({ name: "", id: Number(this.$route.query.tabNum) });
            }
        }
    },
    methods:{
        init(id) {
            if(this.id || id){
                this.$store.dispatch("questionnairesTypes/get", this.id);
                this.edit = this.$route.query.inline == 'false' ? false : this.$route.query.inline;
            }else{
                this.edit = true
            }
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
            this.updateFilterQueryParams({ tabNum: index, ...this.getTabFilterData(index)});
            this.setSelectedTab({ name: '', id: this.tabIndex });
            this.visitedTabs.push(index);
        },
        // saveStatus(index) {
        //     this.edit = false;
        //     this.resetFilterQueryParams({});
        //     this.updateFilterQueryParams({
        //         tabNum: index,
        //         ...this.getTabFilterData(index),
        //     });
        //     this.visitedTabs.push(index);
        // },
    },
    mounted() {
      this.init();
    }
}
</script>

<style scoped>

</style>