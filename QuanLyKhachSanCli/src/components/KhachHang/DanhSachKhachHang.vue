<template>
    <v-flex xs12>
        <v-breadcrumbs divider="/" class="pa-0">
            <v-icon slot="divider">chevron_right</v-icon>
            <v-breadcrumbs-item>
                <v-btn flat class="ma-0" @click="$router.go(-1)" small><v-icon>arrow_back</v-icon> Quay lại</v-btn>
            </v-breadcrumbs-item>
            <v-breadcrumbs-item to="/khachhang" exact>KhachHang</v-breadcrumbs-item>
        </v-breadcrumbs>
        <v-card>
            <v-card-text>
                <v-layout row wrap>
                    <v-flex xs12>
                    <v-data-table :headers="tableHeader"
                                :items="dsKhachHang"
                                @update:pagination="getDataFromApi" :pagination.sync="searchParamsKhachHang"
                                :total-items="searchParamsKhachHang.totalItems"
                                :loading="loadingTable"
                                class="table-border table">
                        <template slot="items" slot-scope="props">
                    <td>{{ props.item.KhachHangID }}</td>
                    <td>{{ props.item.HoTen }}</td>
                    <td>{{ props.item.GioiTinh ? "Yes" : "No" }}</td>
                            <td>{{ props.item.NgaySinh === null ? "" : props.item.NgaySinh|moment('DD/MM/YYYY') }}</td>
                    <td>{{ props.item.SoDienThoai }}</td>
                    <td>{{ props.item.DiaChi }}</td>
                    <td>{{ props.item.CMND }}</td>
                    <td class="text-xs-center" style="width:80px;">
                        <v-btn flat icon small :to="'/khachhang/'+props.item.KhachHangID" class="ma-0">
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
                    <v-btn color="red darken-1" @click.native="deleteKhachHang" flat>Xác Nhận</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-flex>
</template>
<script lang="ts">
    import { Vue } from 'vue-property-decorator';
    import KhachHangApi, { KhachHangApiSearchParams } from '@/apiResources/KhachHangApi';
    import { KhachHang } from '@/models/KhachHang';

    export default Vue.extend({
        components: {},
        data() {
            return {
                dsKhachHang: [] as KhachHang[],
                tableHeader: [
                    { text: 'KhachHangID', value: 'KhachHangID', align: 'center', sortable: true },
                    { text: 'HoTen', value: 'HoTen', align: 'center', sortable: true },
                    { text: 'GioiTinh', value: 'GioiTinh', align: 'center', sortable: true },
                    { text: 'NgaySinh', value: 'NgaySinh', align: 'center', sortable: true },
                    { text: 'SoDienThoai', value: 'SoDienThoai', align: 'center', sortable: true },
                    { text: 'DiaChi', value: 'DiaChi', align: 'center', sortable: true },
                    { text: 'CMND', value: 'CMND', align: 'center', sortable: true },
                    { text: 'Thao tác', value: '#', align: 'center', sortable: false },
                ],
                searchParamsKhachHang: { includeEntities: true, rowsPerPage: 10 } as KhachHangApiSearchParams,
                loadingTable: false,
                selectedKhachHang: {} as KhachHang,
                dialogConfirmDelete: false,
            }
        },
        watch: {
        },
        created() {
            this.getDataFromApi(this.searchParamsKhachHang);
        },
        methods: {
            getDataFromApi(searchParamsKhachHang: KhachHangApiSearchParams): void {
                this.loadingTable = true;
                KhachHangApi.search(searchParamsKhachHang).then(res => {
                    this.dsKhachHang = res.Data;
                    this.searchParamsKhachHang.totalItems = res.Pagination.totalItems;
                    this.loadingTable = false;
                });
            },
            confirmDelete(khachHang: KhachHang): void {
                this.selectedKhachHang = khachHang;
                this.dialogConfirmDelete = true;
            },
            deleteKhachHang(): void {
                KhachHangApi.delete(this.selectedKhachHang.KhachHangID).then(res => {
                    this.$snotify.success('Xóa thành công!');
                    this.getDataFromApi(this.searchParamsKhachHang);
                    this.dialogConfirmDelete = false;
                }).catch(res => {
                    this.$snotify.error('Xóa thất bại!');
                });
            },
        }
    });
</script>

