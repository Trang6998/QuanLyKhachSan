<template>
    <v-flex xs12>
        <v-breadcrumbs divider="/" class="pa-0">
            <v-icon slot="divider">chevron_right</v-icon>
            <v-breadcrumbs-item>
                <v-btn flat class="ma-0" @click="$router.go(-1)" small><v-icon>arrow_back</v-icon> Quay lại</v-btn>
            </v-breadcrumbs-item>
            <v-breadcrumbs-item to="/hoadon" exact>HoaDon</v-breadcrumbs-item>
        </v-breadcrumbs>
        <v-card>
            <v-card-text>
                <v-layout row wrap>
                    <v-flex xs12>
                    <v-data-table :headers="tableHeader"
                                :items="dsHoaDon"
                                @update:pagination="getDataFromApi" :pagination.sync="searchParamsHoaDon"
                                :total-items="searchParamsHoaDon.totalItems"
                                :loading="loadingTable"
                                class="table-border table">
                        <template slot="items" slot-scope="props">
                    <td>{{ props.item.HoaDonID }}</td>
                            <td>{{ props.item.NhanVien.NhanVienID }}</td>
                            <td>{{ props.item.DatPhong.DatPhongID }}</td>
                            <td>{{ props.item.KhachHang.KhachHangID }}</td>
                    <td>{{ props.item.MaHoaDon }}</td>
                            <td>{{ props.item.NgayThanhToan === null ? "" : props.item.NgayThanhToan|moment('DD/MM/YYYY HH:mm:ss') }}</td>
                    <td>{{ props.item.SoTaiKhoan }}</td>
                    <td>{{ props.item.TongTien }}</td>
                    <td class="text-xs-center" style="width:80px;">
                        <v-btn flat icon small :to="'/hoadon/'+props.item.HoaDonID" class="ma-0">
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
                    <v-btn color="red darken-1" @click.native="deleteHoaDon" flat>Xác Nhận</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-flex>
</template>
<script lang="ts">
    import { Vue } from 'vue-property-decorator';
    import HoaDonApi, { HoaDonApiSearchParams } from '@/apiResources/HoaDonApi';
    import { HoaDon } from '@/models/HoaDon';

    export default Vue.extend({
        components: {},
        data() {
            return {
                dsHoaDon: [] as HoaDon[],
                tableHeader: [
                    { text: 'HoaDonID', value: 'HoaDonID', align: 'center', sortable: true },
                    { text: 'NhanVienID', value: 'NhanVien.NhanVienID', align: 'center', sortable: true },
                    { text: 'DatPhongID', value: 'DatPhong.DatPhongID', align: 'center', sortable: true },
                    { text: 'KhachHangID', value: 'KhachHang.KhachHangID', align: 'center', sortable: true },
                    { text: 'MaHoaDon', value: 'MaHoaDon', align: 'center', sortable: true },
                    { text: 'NgayThanhToan', value: 'NgayThanhToan', align: 'center', sortable: true },
                    { text: 'SoTaiKhoan', value: 'SoTaiKhoan', align: 'center', sortable: true },
                    { text: 'TongTien', value: 'TongTien', align: 'center', sortable: true },
                    { text: 'Thao tác', value: '#', align: 'center', sortable: false },
                ],
                searchParamsHoaDon: { includeEntities: true, rowsPerPage: 10 } as HoaDonApiSearchParams,
                loadingTable: false,
                selectedHoaDon: {} as HoaDon,
                dialogConfirmDelete: false,
            }
        },
        watch: {
        },
        created() {
            this.getDataFromApi(this.searchParamsHoaDon);
        },
        methods: {
            getDataFromApi(searchParamsHoaDon: HoaDonApiSearchParams): void {
                this.loadingTable = true;
                HoaDonApi.search(searchParamsHoaDon).then(res => {
                    this.dsHoaDon = res.Data;
                    this.searchParamsHoaDon.totalItems = res.Pagination.totalItems;
                    this.loadingTable = false;
                });
            },
            confirmDelete(hoaDon: HoaDon): void {
                this.selectedHoaDon = hoaDon;
                this.dialogConfirmDelete = true;
            },
            deleteHoaDon(): void {
                HoaDonApi.delete(this.selectedHoaDon.HoaDonID).then(res => {
                    this.$snotify.success('Xóa thành công!');
                    this.getDataFromApi(this.searchParamsHoaDon);
                    this.dialogConfirmDelete = false;
                }).catch(res => {
                    this.$snotify.error('Xóa thất bại!');
                });
            },
        }
    });
</script>

