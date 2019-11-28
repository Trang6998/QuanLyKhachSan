<template>
    <v-flex xs12>
        <v-breadcrumbs divider="/" class="pa-0">
            <v-icon slot="divider">chevron_right</v-icon>
            <v-breadcrumbs-item>
                <v-btn flat class="ma-0" @click="$router.go(-1)" small><v-icon>arrow_back</v-icon> Quay lại</v-btn>
            </v-breadcrumbs-item>
            <v-breadcrumbs-item to="/bophan" exact>BoPhan</v-breadcrumbs-item>
        </v-breadcrumbs>
        <v-card>
            <v-card-text>
                <v-layout row wrap>
                    <v-flex xs12>
                    <v-data-table :headers="tableHeader"
                                :items="dsBoPhan"
                                @update:pagination="getDataFromApi" :pagination.sync="searchParamsBoPhan"
                                :total-items="searchParamsBoPhan.totalItems"
                                :loading="loadingTable"
                                class="table-border table">
                        <template slot="items" slot-scope="props">
                    <td>{{ props.item.BoPhanID }}</td>
                    <td>{{ props.item.TenBoPhan }}</td>
                    <td>{{ props.item.NhiemVu }}</td>
                    <td>{{ props.item.GhiChu }}</td>
                    <td class="text-xs-center" style="width:80px;">
                        <v-btn flat icon small :to="'/bophan/'+props.item.BoPhanID" class="ma-0">
                            <v-icon small>edit</v-icon>
                        </v-btn>
                        <v-btn flat color="red" icon small class="ma-0" @click="confirmDelete(props.item)">
                            <v-icon small>delete</v-icon>
                        </v-btn>
                    </td>
                            </template>
                        </v-data-table>
                    </v-flex xs12>
                </v-layout>
            </v-card-text>
        </v-card>
        <v-dialog v-model="dialogConfirmDelete" max-width="290">
                    <v-card>
                <v-card-title class="headline">Xác nhận xóa</v-card-title>
                <v-card-text class="pt-3">Bạn có chắc chắn muốn xóa?</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click.native="dialogConfirmDelete=false" flat>Hủy</v-btn>
                    <v-btn color="red darken-1" @click.native="deleteBoPhan" flat>Xác Nhận</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-flex>
</template>
<script lang="ts">
    import { Vue } from 'vue-property-decorator';
    import BoPhanApi, { BoPhanApiSearchParams } from '@/apiResources/BoPhanApi';
    import { BoPhan } from '@/models/BoPhan';

    export default Vue.extend({
        components: {},
        data() {
            return {
                dsBoPhan: [] as BoPhan[],
                tableHeader: [
                    { text: 'BoPhanID', value: 'BoPhanID', align: 'center', sortable: true },
                    { text: 'TenBoPhan', value: 'TenBoPhan', align: 'center', sortable: true },
                    { text: 'NhiemVu', value: 'NhiemVu', align: 'center', sortable: true },
                    { text: 'GhiChu', value: 'GhiChu', align: 'center', sortable: true },
                    { text: 'Thao tác', value: '#', align: 'center', sortable: false },
                ],
                searchParamsBoPhan: { includeEntities: true, rowsPerPage: 10 } as BoPhanApiSearchParams,
                loadingTable: false,
                selectedBoPhan: {} as BoPhan,
                dialogConfirmDelete: false,
            }
        },
        watch: {
        },
        created() {
            this.getDataFromApi(this.searchParamsBoPhan);
        },
        methods: {
            getDataFromApi(searchParamsBoPhan: BoPhanApiSearchParams): void {
                this.loadingTable = true;
                BoPhanApi.search(searchParamsBoPhan).then(res => {
                    this.dsBoPhan = res.Data;
                    this.searchParamsBoPhan.totalItems = res.Pagination.totalItems;
                    this.loadingTable = false;
                });
            },
            confirmDelete(boPhan: BoPhan): void {
                this.selectedBoPhan = boPhan;
                this.dialogConfirmDelete = true;
            },
            deleteBoPhan(): void {
                BoPhanApi.delete(this.selectedBoPhan.BoPhanID).then(res => {
                    this.$snotify.success('Xóa thành công!');
                    this.getDataFromApi(this.searchParamsBoPhan);
                    this.dialogConfirmDelete = false;
                }).catch(res => {
                    this.$snotify.error('Xóa thất bại!');
                });
            },
        }
    });
</script>

