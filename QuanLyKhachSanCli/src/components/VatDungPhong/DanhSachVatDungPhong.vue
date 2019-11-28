<template>
    <v-flex xs12>
        <v-breadcrumbs divider="/" class="pa-0">
            <v-icon slot="divider">chevron_right</v-icon>
            <v-breadcrumbs-item>
                <v-btn flat class="ma-0" @click="$router.go(-1)" small><v-icon>arrow_back</v-icon> Quay lại</v-btn>
            </v-breadcrumbs-item>
            <v-breadcrumbs-item to="/vatdungphong" exact>VatDungPhong</v-breadcrumbs-item>
        </v-breadcrumbs>
        <v-card>
            <v-card-text>
                <v-layout row wrap>
                    <v-flex xs12>
                    <v-data-table :headers="tableHeader"
                                :items="dsVatDungPhong"
                                @update:pagination="getDataFromApi" :pagination.sync="searchParamsVatDungPhong"
                                :total-items="searchParamsVatDungPhong.totalItems"
                                :loading="loadingTable"
                                class="table-border table">
                        <template slot="items" slot-scope="props">
                    <td>{{ props.item.VatDungPhongID }}</td>
                    <td>{{ props.item.SoLuong }}</td>
                    <td>{{ props.item.GhiChu }}</td>
                            <td>{{ props.item.VatDung.VatDungID }}</td>
                            <td>{{ props.item.Phong.PhongID }}</td>
                    <td class="text-xs-center" style="width:80px;">
                        <v-btn flat icon small :to="'/vatdungphong/'+props.item.VatDungPhongID" class="ma-0">
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
                    <v-btn color="red darken-1" @click.native="deleteVatDungPhong" flat>Xác Nhận</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-flex>
</template>
<script lang="ts">
    import { Vue } from 'vue-property-decorator';
    import VatDungPhongApi, { VatDungPhongApiSearchParams } from '@/apiResources/VatDungPhongApi';
    import { VatDungPhong } from '@/models/VatDungPhong';

    export default Vue.extend({
        components: {},
        data() {
            return {
                dsVatDungPhong: [] as VatDungPhong[],
                tableHeader: [
                    { text: 'VatDungPhongID', value: 'VatDungPhongID', align: 'center', sortable: true },
                    { text: 'SoLuong', value: 'SoLuong', align: 'center', sortable: true },
                    { text: 'GhiChu', value: 'GhiChu', align: 'center', sortable: true },
                    { text: 'VatDungID', value: 'VatDung.VatDungID', align: 'center', sortable: true },
                    { text: 'PhongID', value: 'Phong.PhongID', align: 'center', sortable: true },
                    { text: 'Thao tác', value: '#', align: 'center', sortable: false },
                ],
                searchParamsVatDungPhong: { includeEntities: true, rowsPerPage: 10 } as VatDungPhongApiSearchParams,
                loadingTable: false,
                selectedVatDungPhong: {} as VatDungPhong,
                dialogConfirmDelete: false,
            }
        },
        watch: {
        },
        created() {
            this.getDataFromApi(this.searchParamsVatDungPhong);
        },
        methods: {
            getDataFromApi(searchParamsVatDungPhong: VatDungPhongApiSearchParams): void {
                this.loadingTable = true;
                VatDungPhongApi.search(searchParamsVatDungPhong).then(res => {
                    this.dsVatDungPhong = res.Data;
                    this.searchParamsVatDungPhong.totalItems = res.Pagination.totalItems;
                    this.loadingTable = false;
                });
            },
            confirmDelete(vatDungPhong: VatDungPhong): void {
                this.selectedVatDungPhong = vatDungPhong;
                this.dialogConfirmDelete = true;
            },
            deleteVatDungPhong(): void {
                VatDungPhongApi.delete(this.selectedVatDungPhong.VatDungPhongID).then(res => {
                    this.$snotify.success('Xóa thành công!');
                    this.getDataFromApi(this.searchParamsVatDungPhong);
                    this.dialogConfirmDelete = false;
                }).catch(res => {
                    this.$snotify.error('Xóa thất bại!');
                });
            },
        }
    });
</script>

