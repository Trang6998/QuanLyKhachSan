<template>
    <v-card width="100%" style="padding: 20px">
        <v-layout row wrap>
            <v-flex xs12>
                <h3>Danh sách hóa đơn</h3>
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
                        <v-datepicker v-model="searchParamsHoaDon.tuNgay" label="Từ ngày"  ma-0 pa-0 
                                      hide-details @input="getDataFromApi(searchParamsHoaDon)"></v-datepicker>
                    </v-flex>
                    <v-flex xs2>
                        <v-datepicker v-model="searchParamsHoaDon.denNgay" label="Đến ngày"  ma-0 pa-0 
                                      hide-details @input="getDataFromApi(searchParamsHoaDon)"></v-datepicker>
                    </v-flex>
                </v-layout>
            </v-flex>
            <v-flex xs12>
                <v-layout norwap>
                    <v-flex xs6>
                        <v-radio-group v-model="searchParamsHoaDon.trangThai" style="margin:auto" hide-details @change="getDataFromApi(searchParamsHoaDon)" row>
                            <v-radio label="Tất cả" :value="null"></v-radio>
                            <v-radio label="Chưa thanh toán" :value="false"></v-radio>
                            <v-radio label="Đã thanh toán" :value="true"></v-radio>
                        </v-radio-group>
                    </v-flex>
                    <v-spacer></v-spacer>
                    <v-btn small @click="showModalThemSua(false,{})" style="margin-top: auto" color="primary">+ Khách thuê phòng</v-btn>
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
                        <td>{{ props.item.TrangThai ? "Đã thanh toán" : "Chưa thanh toán" }}</td>
                        <td class="text-xs-center" style="width:80px;">
                            <v-btn flat icon small @click="showModalThemSua(true, props.item)" class="ma-0">
                                <v-icon small>{{props.item.TrangThai? 'remove_red_eye':'edit'}}</v-icon>
                            </v-btn>
                            <v-btn flat color="red" icon small class="ma-0" v-show="!props.item.TrangThai"  @click="confirmDelete(props.item)">
                                <v-icon small>delete</v-icon>
                            </v-btn>
                        </td>
                    </template>
                </v-data-table>
            </v-flex>
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
            <them-sua-hoa-don ref="themSuaHoaDon" @getLaiDanhSach="getDataFromApi(searchParamsHoaDon)"></them-sua-hoa-don>
        </v-layout>
    </v-card>
</template>
<script lang="ts">
    import { Vue } from 'vue-property-decorator';
    import HoaDonApi, { HoaDonApiSearchParams } from '@/apiResources/HoaDonApi';
    import { HoaDon } from '@/models/HoaDon';
    import ThemSuaHoaDon from './ThemSuaHoaDon.vue';
    export default Vue.extend({
        components: {
            ThemSuaHoaDon
        },
        data() {
            return {
                dsHoaDon: [] as HoaDon[],
                tableHeader: [
                    { text: 'STT', value: 'HoaDonID', align: 'center', sortable: true },
                    { text: 'Mã hóa đơn', value: 'MaHoaDon', align: 'center', sortable: true },
                    { text: 'Tên khách hàng', value: 'KhachHang.KhachHangID', align: 'center', sortable: true },
                    { text: 'Số điện thoại', value: 'KhachHang.KhachHangID', align: 'center', sortable: true },
                    { text: 'Ngày nhận phòng', value: 'NgayThanhToan', align: 'center', sortable: true },
                    { text: 'Tổng tiền', value: 'TongTien', align: 'center', sortable: true },
                    { text: 'Trạng thái', value: 'NgayThanhToan', align: 'center', sortable: true },
                    { text: 'Thao tác', value: '#', align: 'center', sortable: false },
                ],
                searchParamsHoaDon: { includeEntities: true, rowsPerPage: 10 , trangThai: null as any} as HoaDonApiSearchParams,
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
            showModalThemSua(isUpdate: boolean, item: any) {
                (this.$refs.themSuaHoaDon as any).show(isUpdate, item);
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

