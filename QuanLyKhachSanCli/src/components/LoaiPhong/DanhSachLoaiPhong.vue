<template>
    <v-flex xs12>
        <v-breadcrumbs divider="/" class="pa-0">
            <v-icon slot="divider">chevron_right</v-icon>
            <v-breadcrumbs-item>
                <v-btn flat class="ma-0" @click="$router.go(-1)" small><v-icon>arrow_back</v-icon> Quay lại</v-btn>
            </v-breadcrumbs-item>
            <v-breadcrumbs-item to="/loaiphong" exact>LoaiPhong</v-breadcrumbs-item>
        </v-breadcrumbs>
        <v-card>
            <v-card-text>
                <v-layout row wrap>
                    <v-flex xs12>
                    <v-data-table :headers="tableHeader"
                                :items="dsLoaiPhong"
                                @update:pagination="getDataFromApi" :pagination.sync="searchParamsLoaiPhong"
                                :total-items="searchParamsLoaiPhong.totalItems"
                                :loading="loadingTable"
                                class="table-border table">
                        <template slot="items" slot-scope="props">
                    <td>{{ props.item.LoaiPhongID }}</td>
                    <td>{{ props.item.TenLoaiPhong }}</td>
                    <td>{{ props.item.MoTa }}</td>
                    <td class="text-xs-center" style="width:80px;">
                        <v-btn flat icon small :to="'/loaiphong/'+props.item.LoaiPhongID" class="ma-0">
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
                    <v-btn color="red darken-1" @click.native="deleteLoaiPhong" flat>Xác Nhận</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-flex>
</template>
<script lang="ts">
    import { Vue } from 'vue-property-decorator';
    import LoaiPhongApi, { LoaiPhongApiSearchParams } from '@/apiResources/LoaiPhongApi';
    import { LoaiPhong } from '@/models/LoaiPhong';

    export default Vue.extend({
        components: {},
        data() {
            return {
                dsLoaiPhong: [] as LoaiPhong[],
                tableHeader: [
                    { text: 'LoaiPhongID', value: 'LoaiPhongID', align: 'center', sortable: true },
                    { text: 'TenLoaiPhong', value: 'TenLoaiPhong', align: 'center', sortable: true },
                    { text: 'MoTa', value: 'MoTa', align: 'center', sortable: true },
                    { text: 'Thao tác', value: '#', align: 'center', sortable: false },
                ],
                searchParamsLoaiPhong: { includeEntities: true, rowsPerPage: 10 } as LoaiPhongApiSearchParams,
                loadingTable: false,
                selectedLoaiPhong: {} as LoaiPhong,
                dialogConfirmDelete: false,
            }
        },
        watch: {
        },
        created() {
            this.getDataFromApi(this.searchParamsLoaiPhong);
        },
        methods: {
            getDataFromApi(searchParamsLoaiPhong: LoaiPhongApiSearchParams): void {
                this.loadingTable = true;
                LoaiPhongApi.search(searchParamsLoaiPhong).then(res => {
                    this.dsLoaiPhong = res.Data;
                    this.searchParamsLoaiPhong.totalItems = res.Pagination.totalItems;
                    this.loadingTable = false;
                });
            },
            confirmDelete(loaiPhong: LoaiPhong): void {
                this.selectedLoaiPhong = loaiPhong;
                this.dialogConfirmDelete = true;
            },
            deleteLoaiPhong(): void {
                LoaiPhongApi.delete(this.selectedLoaiPhong.LoaiPhongID).then(res => {
                    this.$snotify.success('Xóa thành công!');
                    this.getDataFromApi(this.searchParamsLoaiPhong);
                    this.dialogConfirmDelete = false;
                }).catch(res => {
                    this.$snotify.error('Xóa thất bại!');
                });
            },
        }
    });
</script>

