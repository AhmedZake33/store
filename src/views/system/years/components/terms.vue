<template>
    <b-table outlined :empty-text="$t('Global.empty_text')" show-empty :items="items"
             :fields="fields" striped responsive="sm">
                <template #cell(actions)="data">
                   <div>
                       <feather-icon v-b-tooltip.hover="$t('Global.edit')" icon="EditIcon" style="cursor: pointer"
                                     @click="$emit('update', data.item)"/>
                   </div>
                </template>
        <!--        <template #cell(pre_requisites)="data">-->
        <!--            <div v-for="(item, i) in data.item.pre_requisites" :key="i">-->
        <!--                {{ item.code }}-->
        <!--                <strong class="text-danger">,</strong>-->
        <!--            </div>-->
        <!--        </template>-->
    </b-table>
</template>


<script>
    import {BTable} from 'bootstrap-vue';

    export default {
        name: "terms",
        components: {BTable},
        props: {
            fields: [],
            items: [],
        },

        computed: {
            fields() {
            let fields = [
                {
                    key: 'code',
                    label: this.$t('Global.code'),
                    sortable: true,
                },
                {
                    key: 'name',
                    label: this.$t('Global.name_custom'),
                    sortable: false,
                },
                {
                    key: 'name_local',
                    label: this.$t('Global.arabic_name'),
                    sortable: false,
                },
                {
                    key: 'start_date',
                    label: this.$t('Global.start_date'),
                    sortable: true,
                },
                {
                    key: 'end_date',
                    label: this.$t('Global.end_date'),
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
        }
    }
</script>

<style scoped>

</style>
