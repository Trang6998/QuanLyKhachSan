<template>
    <v-card width="100%" style="padding: 20px">
        <v-layout row wrap>
            <v-flex xs12>
                <h3>Thống kê doanh thu</h3>
            </v-flex>
            <v-flex xs12>
                <v-layout norwap>
                    <v-flex xs6 md5>
                        <v-text-field label="Tìm kiếm"
                                      append-icon="search"
                                      placeholder="Nhập mã hóa đơn, họ tên, SĐT khách hàng ..."
                                      hide-details
                                      v-model="searchParamsHoaDon.query"
                                      @input="getDataFromApi(searchParamsHoaDon)">

                        </v-text-field>
                    </v-flex>
                    <v-flex xs2>
                        <v-datepicker v-model="searchParamsHoaDon.tuNgay" label="Từ ngày" ma-0 pa-0
                                      hide-details @input="getDataFromApi(searchParamsHoaDon)"></v-datepicker>
                    </v-flex>
                    <v-flex xs2>
                        <v-datepicker v-model="searchParamsHoaDon.denNgay" label="Đến ngày" ma-0 pa-0
                                      hide-details @input="getDataFromApi(searchParamsHoaDon)"></v-datepicker>
                    </v-flex>
                    <v-spacer></v-spacer>
                    <v-btn small color="primary" :href="exportFile()" target="_blank" class="ma-0">
                        Tải xuống
                    </v-btn>
                </v-layout>
            </v-flex>
            <v-flex xs12>
                <v-data-table :headers="tableHeader"
                              :items="dsHoaDon"
                              @update:pagination="getDataFromApi" :pagination.sync="searchParamsHoaDon"
                              :total-items="searchParamsHoaDon.totalItems"
                              :loading="loadingTable"
                              class="table-border table">
                    <template slot="items" slot-scope="props">
                        <td>{{ props.index + 1 }}</td>
                        <td>{{ props.item.MaHoaDon }}</td>
                        <td>{{ props.item.KhachHang ? props.item.KhachHang.HoTen : ''}}</td>
                        <td>{{ props.item.KhachHang ? props.item.KhachHang.SoDienThoai : ''}}</td>
                        <td>{{ props.item.ThoiGianNhanPhong === null ? "" : props.item.ThoiGianNhanPhong|moment('DD/MM/YYYY HH:mm:ss') }}</td>
                        <td>{{ (props.item.TongThanhToan != 0) ? (props.item.TongThanhToan + (props.item.PhuThu? props.item.PhuThu: 0)) : 0}}</td>
                        <td>{{ props.item.NhanVien ? props.item.NhanVien.TenNhanVien : "" }}</td>
                        
                    </template>
                </v-data-table>
            </v-flex>
        </v-layout>
    </v-card>
</template>
<script lang="ts">
    import { Vue } from 'vue-property-decorator';
    import { HTTP } from '@/HTTPServices';
    import APIS from '@/apisServer';
    import { HoaDon } from '@/models/HoaDon';
    import HoaDonApi, { HoaDonApiSearchParams } from '@/apiResources/HoaDonApi';

    export default Vue.extend({
        components: {},
        data() {
            return {
                APIS: APIS,
                dsHoaDon: [] as HoaDon[],
                tableHeader: [
                    { text: 'STT', value: 'HoaDonID', align: 'center', sortable: true },
                    { text: 'Mã hóa đơn', value: 'MaHoaDon', align: 'center', sortable: true },
                    { text: 'Tên khách hàng', value: 'KhachHang.KhachHangID', align: 'center', sortable: true },
                    { text: 'Số điện thoại', value: 'KhachHang.KhachHangID', align: 'center', sortable: true },
                    { text: 'Ngày nhận phòng', value: 'NgayThanhToan', align: 'center', sortable: true },
                    { text: 'Tổng tiền', value: 'TongTien', align: 'center', sortable: true },
                    { text: 'Thu ngân', value: 'NgayThanhToan', align: 'center', sortable: true },
                ],
                searchParamsHoaDon: { includeEntities: true, rowsPerPage: 10, tinhTrang: -1 } as HoaDonApiSearchParams,
                loadingTable: false,
                page: 1,
            }
        },
        watch: {

        },
        computed: {

        },
        created() {
            this.searchParamsHoaDon.tuNgay = this.$moment().startOf('month');
            this.searchParamsHoaDon.denNgay = new Date();
            this.searchParamsHoaDon.trangThai = true
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
            exportFile() {
                return APIS.HOST + 'Export/ExportHoaDon?tuNgay=' + this.searchParamsHoaDon.tuNgay +
                    '&denNgay=' + this.searchParamsHoaDon.denNgay;
            },
            soSanhNgay(tuNgay: Date, denNgay: Date) {
                if (tuNgay.toString().slice(0, 10) == denNgay.toString().slice(0, 10)) {
                    return true;
                }
                else return false;
            }
        }
    });
</script>

<style>
    .xxx .theme--light.v-pagination .v-pagination__item {
        display: -webkit-box !important;
        background: #fff;
        color: #000;
        width: auto;
        min-width: 34px;
        padding: 0 5px;
    }
</style>