<template>
    <v-flex xs12>
        <v-breadcrumbs divider="/" class="pa-0">
            <v-icon slot="divider">chevron_right</v-icon>
            <v-breadcrumbs-item>
                <v-btn flat class="ma-0" @click="$router.go(-1)" small><v-icon>arrow_back</v-icon> Quay lại</v-btn>
            </v-breadcrumbs-item>
            <v-breadcrumbs-item to="/nhanvien" exact>NhanVien</v-breadcrumbs-item>
            <v-breadcrumbs-item>{{isUpdate?'Cập nhật':'Thêm mới'}}</v-breadcrumbs-item>
        </v-breadcrumbs>
        <v-card>
            <v-card-text>
                <v-form scope="frmAddEdit">
                    <v-layout row wrap>
                        <v-flex xs6 sm4 md3>
                            <v-text-field
                            v-model="nhanVien.TenNhanVien"
                            label="TenNhanVien"
                            type="text"
                            :error-messages="errors.collect('TenNhanVien', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="TenNhanVien"
                            hide-details
                            clearable
                            ></v-text-field>
                        </v-flex>

                        <v-flex xs6 sm4 md3>
                            <v-text-field
                            v-model="nhanVien.SoDienThoai"
                            label="SoDienThoai"
                            type="text"
                            :error-messages="errors.collect('SoDienThoai', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="SoDienThoai"
                            hide-details
                            clearable
                            ></v-text-field>
                        </v-flex>

                        <v-flex xs6 sm4 md3>
                            <v-autocomplete v-model="nhanVien.BoPhanID"
                            :items="dsBoPhan"
                            :loading="dsBoPhanLoading"
                            :search-input.sync="searchBoPhan"
                            item-text="BoPhanID"
                            item-value="BoPhanID"
                            label="BoPhanID"
                            placeholder="Nhập BoPhanID"
                            :error-messages="errors.collect('BoPhanID', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="BoPhanID"
                            clearable
                            ></v-autocomplete>
                        </v-flex>
                        <v-flex xs6 sm4 md3>
                            <v-text-field
                            v-model="nhanVien.TenDangNhap"
                            label="TenDangNhap"
                            type="text"
                            :error-messages="errors.collect('TenDangNhap', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="TenDangNhap"
                            hide-details
                            clearable
                            ></v-text-field>
                        </v-flex>

                        <v-flex xs6 sm4 md3>
                            <v-text-field
                            v-model="nhanVien.MatKhau"
                            label="MatKhau"
                            type="text"
                            :error-messages="errors.collect('MatKhau', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="MatKhau"
                            hide-details
                            clearable
                            ></v-text-field>
                        </v-flex>

                        <v-flex xs6 sm4 md3>
                            <v-text-field
                            v-model="nhanVien.LoaiTaiKhoanID"
                            label="LoaiTaiKhoanID"
                            type="number"
                            :error-messages="errors.collect('LoaiTaiKhoanID', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="LoaiTaiKhoanID"
                            hide-details
                            clearable
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-tabs color="primary" dark slider-color="white">
                                <v-tab :key="1" ripple>
                                    DatPhong
                                </v-tab>
                                <v-tab-item :key="1">
                                    <v-card flat>
                                            <div class="text-xs-right">
                                                <v-btn color="info" to="/datphong/add" small>Thêm mới</v-btn>
                                            </div>
                                        <v-card-text class="pa-0">
                <v-data-table :headers="tableHeaderDatPhong"
                              :items="dsDatPhong"
                              :pagination.sync="searchParamsDatPhong"
                              :total-items="searchParamsDatPhong.totalItems"
                              :loading="dsDatPhongLoading"
                              class="table-border table">
                    <template slot="items" slot-scope="props">
                <td>{{ props.item.DatPhongID }}</td>
                        <td>{{ props.item.NhanVien.LoaiPhongID }}</td>
                <td>{{ props.item.HoTen }}</td>
                <td>{{ props.item.SoDienThoai }}</td>
                        <td>{{ props.item.ThoiGianDat === null ? "" : props.item.ThoiGianDat|moment('DD/MM/YYYY HH:mm:ss') }}</td>
                <td>{{ props.item.SoLuongNguoi }}</td>
                <td>{{ props.item.SoNgayDat }}</td>
                <td>{{ props.item.TienCoc }}</td>
                        <td>{{ props.item.NgayTao === null ? "" : props.item.NgayTao|moment('DD/MM/YYYY HH:mm:ss') }}</td>
                        </template>
                    </v-data-table>
                                        </v-card-text>
                                    </v-card>
                                </v-tab-item>
                                <v-tab :key="2" ripple>
                                    HoaDon
                                </v-tab>
                                <v-tab-item :key="2">
                                    <v-card flat>
                                            <div class="text-xs-right">
                                                <v-btn color="info" to="/hoadon/add" small>Thêm mới</v-btn>
                                            </div>
                                        <v-card-text class="pa-0">
                <v-data-table :headers="tableHeaderHoaDon"
                              :items="dsHoaDon"
                              :pagination.sync="searchParamsHoaDon"
                              :total-items="searchParamsHoaDon.totalItems"
                              :loading="dsHoaDonLoading"
                              class="table-border table">
                    <template slot="items" slot-scope="props">
                <td>{{ props.item.HoaDonID }}</td>
                        <td>{{ props.item.NhanVien.NhanVienID }}</td>
                        <td>{{ props.item.NhanVien.DatPhongID }}</td>
                        <td>{{ props.item.NhanVien.KhachHangID }}</td>
                <td>{{ props.item.MaHoaDon }}</td>
                        <td>{{ props.item.NgayThanhToan === null ? "" : props.item.NgayThanhToan|moment('DD/MM/YYYY HH:mm:ss') }}</td>
                <td>{{ props.item.SoTaiKhoan }}</td>
                <td>{{ props.item.TongTien }}</td>
                        </template>
                    </v-data-table>
                                        </v-card-text>
                                    </v-card>
                                </v-tab-item>
                                <v-tab :key="3" ripple>
                                    KiemKe
                                </v-tab>
                                <v-tab-item :key="3">
                                    <v-card flat>
                                            <div class="text-xs-right">
                                                <v-btn color="info" to="/kiemke/add" small>Thêm mới</v-btn>
                                            </div>
                                        <v-card-text class="pa-0">
                <v-data-table :headers="tableHeaderKiemKe"
                              :items="dsKiemKe"
                              :pagination.sync="searchParamsKiemKe"
                              :total-items="searchParamsKiemKe.totalItems"
                              :loading="dsKiemKeLoading"
                              class="table-border table">
                    <template slot="items" slot-scope="props">
                <td>{{ props.item.KiemKeID }}</td>
                        <td>{{ props.item.NgayKiemKe === null ? "" : props.item.NgayKiemKe|moment('DD/MM/YYYY HH:mm:ss') }}</td>
                        <td>{{ props.item.NhanVien.NhanVienID }}</td>
                <td>{{ props.item.GhiChu }}</td>
                        </template>
                    </v-data-table>
                                        </v-card-text>
                                    </v-card>
                                </v-tab-item>
                                <v-tab :key="4" ripple>
                                    PhieuNhapKho
                                </v-tab>
                                <v-tab-item :key="4">
                                    <v-card flat>
                                            <div class="text-xs-right">
                                                <v-btn color="info" to="/phieunhapkho/add" small>Thêm mới</v-btn>
                                            </div>
                                        <v-card-text class="pa-0">
                <v-data-table :headers="tableHeaderPhieuNhapKho"
                              :items="dsPhieuNhapKho"
                              :pagination.sync="searchParamsPhieuNhapKho"
                              :total-items="searchParamsPhieuNhapKho.totalItems"
                              :loading="dsPhieuNhapKhoLoading"
                              class="table-border table">
                    <template slot="items" slot-scope="props">
                <td>{{ props.item.PhieuNhapID }}</td>
                        <td>{{ props.item.NgayNhap === null ? "" : props.item.NgayNhap|moment('DD/MM/YYYY') }}</td>
                <td>{{ props.item.TongTien }}</td>
                        </template>
                    </v-data-table>
                                        </v-card-text>
                                    </v-card>
                                </v-tab-item>
                            </v-tabs>
                        </v-flex>

                    </v-layout>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn class="primary" :disabled="loading" :loading="loading" @click.native="save">{{isUpdate?'Cập nhật':'Thêm mới'}}</v-btn>
            </v-card-actions>
        </v-card>
    </v-flex>
</template>

<script lang="ts">
    import { Vue } from 'vue-property-decorator';
    import NhanVienApi, { NhanVienApiSearchParams } from '@/apiResources/NhanVienApi';
    import { NhanVien } from '@/models/NhanVien';
    import { DatPhong } from '@/models/DatPhong';
    import DatPhongApi, { DatPhongApiSearchParams } from '@/apiResources/DatPhongApi';
    import { HoaDon } from '@/models/HoaDon';
    import HoaDonApi, { HoaDonApiSearchParams } from '@/apiResources/HoaDonApi';
    import { KiemKe } from '@/models/KiemKe';
    import KiemKeApi, { KiemKeApiSearchParams } from '@/apiResources/KiemKeApi';
    import { PhieuNhapKho } from '@/models/PhieuNhapKho';
    import PhieuNhapKhoApi, { PhieuNhapKhoApiSearchParams } from '@/apiResources/PhieuNhapKhoApi';

    export default Vue.extend({
        $_veeValidate: {
            validator: 'new'
        },
        components: {},
        data() {
            return {
                isUpdate: false,
                nhanVien: {} as NhanVien,
                dsDatPhong: [] as DatPhong[],
                dsDatPhongLoading: false,
                searchDatPhong: '',
                searchParamsDatPhong: { includeEntities: true } as DatPhongApiSearchParams,
                tableHeaderDatPhong: [
                    { text: 'DatPhongID', value: 'DatPhongID', align: 'center', sortable: true },
                    { text: 'LoaiPhongID', value: 'LoaiPhongID', align: 'center', sortable: true },
                    { text: 'HoTen', value: 'HoTen', align: 'center', sortable: true },
                    { text: 'SoDienThoai', value: 'SoDienThoai', align: 'center', sortable: true },
                    { text: 'ThoiGianDat', value: 'ThoiGianDat', align: 'center', sortable: true },
                    { text: 'SoLuongNguoi', value: 'SoLuongNguoi', align: 'center', sortable: true },
                    { text: 'SoNgayDat', value: 'SoNgayDat', align: 'center', sortable: true },
                    { text: 'TienCoc', value: 'TienCoc', align: 'center', sortable: true },
                    { text: 'NgayTao', value: 'NgayTao', align: 'center', sortable: true },
                ],
                dsHoaDon: [] as HoaDon[],
                dsHoaDonLoading: false,
                searchHoaDon: '',
                searchParamsHoaDon: { includeEntities: true } as HoaDonApiSearchParams,
                tableHeaderHoaDon: [
                    { text: 'HoaDonID', value: 'HoaDonID', align: 'center', sortable: true },
                    { text: 'NhanVienID', value: 'NhanVienID', align: 'center', sortable: true },
                    { text: 'DatPhongID', value: 'DatPhongID', align: 'center', sortable: true },
                    { text: 'KhachHangID', value: 'KhachHangID', align: 'center', sortable: true },
                    { text: 'MaHoaDon', value: 'MaHoaDon', align: 'center', sortable: true },
                    { text: 'NgayThanhToan', value: 'NgayThanhToan', align: 'center', sortable: true },
                    { text: 'SoTaiKhoan', value: 'SoTaiKhoan', align: 'center', sortable: true },
                    { text: 'TongTien', value: 'TongTien', align: 'center', sortable: true },
                ],
                dsKiemKe: [] as KiemKe[],
                dsKiemKeLoading: false,
                searchKiemKe: '',
                searchParamsKiemKe: { includeEntities: true } as KiemKeApiSearchParams,
                tableHeaderKiemKe: [
                    { text: 'KiemKeID', value: 'KiemKeID', align: 'center', sortable: true },
                    { text: 'NgayKiemKe', value: 'NgayKiemKe', align: 'center', sortable: true },
                    { text: 'NhanVienID', value: 'NhanVienID', align: 'center', sortable: true },
                    { text: 'GhiChu', value: 'GhiChu', align: 'center', sortable: true },
                ],
                dsPhieuNhapKho: [] as PhieuNhapKho[],
                dsPhieuNhapKhoLoading: false,
                searchPhieuNhapKho: '',
                searchParamsPhieuNhapKho: { includeEntities: true } as PhieuNhapKhoApiSearchParams,
                tableHeaderPhieuNhapKho: [
                    { text: 'PhieuNhapID', value: 'PhieuNhapID', align: 'center', sortable: true },
                    { text: 'NgayNhap', value: 'NgayNhap', align: 'center', sortable: true },
                    { text: 'TongTien', value: 'TongTien', align: 'center', sortable: true },
                ],
                loading: false,
                searchParamsNhanVien: {} as NhanVienApiSearchParams,
            }
        },
        watch: {
        },
        mounted() {
            if (this.$route.name === 'suaNhanVien') {
                this.isUpdate = true;
                let id = parseInt(this.$route.params.id, 10);
                this.getDataFromApi(id);
            } else {
                this.isUpdate = false;
            }
        },
        methods: {
            getDataFromApi(id: number): void {
                NhanVienApi.detail(id).then(res => {
                    this.nhanVien = res;
                });
            },
            save(): void {
                this.$validator.validateAll('frmAddEdit').then((res) => {
                   if (res) {
                        this.nhanVien.BoPhan = undefined;
                        this.nhanVien.DatPhong = undefined;
                        this.nhanVien.HoaDon = undefined;
                        this.nhanVien.KiemKe = undefined;
                        this.nhanVien.PhieuNhapKho = undefined;
                        if (this.isUpdate) {
                            let id = parseInt(this.$route.params.id, 10);
                            this.loading = true;
                            NhanVienApi.update(id, this.nhanVien).then(res => {
                                this.loading = false;
                                this.$snotify.success('Cập nhật thành công!');
                            }).catch(res => {
                                this.loading = false;
                                this.$snotify.error('Cập nhật thất bại!');
                            });
                        } else {
                            this.loading = true;
                            NhanVienApi.insert(this.nhanVien).then(res => {
                                this.$router.push('/nhanvien/' + res.NhanVienID);
                                this.nhanVien = res;
                                this.isUpdate = true;
                                this.loading = false;
                                this.$snotify.success('Thêm mới thành công!');
                            }).catch(res => {
                                this.loading = false;
                                this.$snotify.error('Thêm mới thất bại!');
                            });
                        }
                    }
                });
            },
            getDSDatPhong(): void {
                DatPhongApi.search(this.searchParamsDatPhong).then(res => {
                    this.dsDatPhong = res.Data;
                });
            },
            getDSHoaDon(): void {
                HoaDonApi.search(this.searchParamsHoaDon).then(res => {
                    this.dsHoaDon = res.Data;
                });
            },
            getDSKiemKe(): void {
                KiemKeApi.search(this.searchParamsKiemKe).then(res => {
                    this.dsKiemKe = res.Data;
                });
            },
            getDSPhieuNhapKho(): void {
                PhieuNhapKhoApi.search(this.searchParamsPhieuNhapKho).then(res => {
                    this.dsPhieuNhapKho = res.Data;
                });
            },
        }
    });
</script>

