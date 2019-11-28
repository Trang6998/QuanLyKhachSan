<template>
    <v-flex xs12>
        <v-breadcrumbs divider="/" class="pa-0">
            <v-icon slot="divider">chevron_right</v-icon>
            <v-breadcrumbs-item>
                <v-btn flat class="ma-0" @click="$router.go(-1)" small><v-icon>arrow_back</v-icon> Quay lại</v-btn>
            </v-breadcrumbs-item>
            <v-breadcrumbs-item to="/datphong" exact>DatPhong</v-breadcrumbs-item>
            <v-breadcrumbs-item>{{isUpdate?'Cập nhật':'Thêm mới'}}</v-breadcrumbs-item>
        </v-breadcrumbs>
        <v-card>
            <v-card-text>
                <v-form scope="frmAddEdit">
                    <v-layout row wrap>
                        <v-flex xs6 sm4 md3>
                            <v-autocomplete v-model="datPhong.NhanVienID"
                            :items="dsNhanVien"
                            :loading="dsNhanVienLoading"
                            :search-input.sync="searchNhanVien"
                            item-text="NhanVienID"
                            item-value="NhanVienID"
                            label="NhanVienID"
                            placeholder="Nhập NhanVienID"
                            :error-messages="errors.collect('NhanVienID', 'frmAddEdit')"
                            v-validate="'required'"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="NhanVienID"
                            clearable
                            ></v-autocomplete>
                        </v-flex>
                        <v-flex xs6 sm4 md3>
                            <v-autocomplete v-model="datPhong.LoaiPhongID"
                            :items="dsLoaiPhong"
                            :loading="dsLoaiPhongLoading"
                            :search-input.sync="searchLoaiPhong"
                            item-text="LoaiPhongID"
                            item-value="LoaiPhongID"
                            label="LoaiPhongID"
                            placeholder="Nhập LoaiPhongID"
                            :error-messages="errors.collect('LoaiPhongID', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="LoaiPhongID"
                            clearable
                            ></v-autocomplete>
                        </v-flex>
                        <v-flex xs6 sm4 md3>
                            <v-text-field
                            v-model="datPhong.HoTen"
                            label="HoTen"
                            type="text"
                            :error-messages="errors.collect('HoTen', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="HoTen"
                            hide-details
                            clearable
                            ></v-text-field>
                        </v-flex>

                        <v-flex xs6 sm4 md3>
                            <v-text-field
                            v-model="datPhong.SoDienThoai"
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
                            <v-text-field
                            v-model="datPhong.ThoiGianDat"
                            label="ThoiGianDat"
                            type="datetime-local"
                            :error-messages="errors.collect('ThoiGianDat', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="ThoiGianDat"
                            hide-details
                            clearable
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs6 sm4 md3>
                            <v-text-field
                            v-model="datPhong.SoLuongNguoi"
                            label="SoLuongNguoi"
                            type="number"
                            :error-messages="errors.collect('SoLuongNguoi', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="SoLuongNguoi"
                            hide-details
                            clearable
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs6 sm4 md3>
                            <v-text-field
                            v-model="datPhong.SoNgayDat"
                            label="SoNgayDat"
                            type="number"
                            :error-messages="errors.collect('SoNgayDat', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="SoNgayDat"
                            hide-details
                            clearable
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs6 sm4 md3>
                            <v-text-field
                            v-model="datPhong.TienCoc"
                            label="TienCoc"
                            type="number"
                            :error-messages="errors.collect('TienCoc', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="TienCoc"
                            hide-details
                            clearable
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs6 sm4 md3>
                            <v-text-field
                            v-model="datPhong.NgayTao"
                            label="NgayTao"
                            type="datetime-local"
                            :error-messages="errors.collect('NgayTao', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="NgayTao"
                            hide-details
                            clearable
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-tabs color="primary" dark slider-color="white">
                                <v-tab :key="1" ripple>
                                    HoaDon
                                </v-tab>
                                <v-tab-item :key="1">
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
                        <td>{{ props.item.DatPhong.NhanVienID }}</td>
                        <td>{{ props.item.DatPhong.DatPhongID }}</td>
                        <td>{{ props.item.DatPhong.KhachHangID }}</td>
                <td>{{ props.item.MaHoaDon }}</td>
                        <td>{{ props.item.NgayThanhToan === null ? "" : props.item.NgayThanhToan|moment('DD/MM/YYYY HH:mm:ss') }}</td>
                <td>{{ props.item.SoTaiKhoan }}</td>
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
    import DatPhongApi, { DatPhongApiSearchParams } from '@/apiResources/DatPhongApi';
    import { DatPhong } from '@/models/DatPhong';
    import { HoaDon } from '@/models/HoaDon';
    import HoaDonApi, { HoaDonApiSearchParams } from '@/apiResources/HoaDonApi';

    export default Vue.extend({
        $_veeValidate: {
            validator: 'new'
        },
        components: {},
        data() {
            return {
                isUpdate: false,
                datPhong: {} as DatPhong,
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
                loading: false,
                searchParamsDatPhong: {} as DatPhongApiSearchParams,
            }
        },
        watch: {
        },
        mounted() {
            if (this.$route.name === 'suaDatPhong') {
                this.isUpdate = true;
                let id = parseInt(this.$route.params.id, 10);
                this.getDataFromApi(id);
            } else {
                this.isUpdate = false;
            }
        },
        methods: {
            getDataFromApi(id: number): void {
                DatPhongApi.detail(id).then(res => {
                    this.datPhong = res;
                });
            },
            save(): void {
                this.$validator.validateAll('frmAddEdit').then((res) => {
                   if (res) {
                        this.datPhong.LoaiPhong = undefined;
                        this.datPhong.NhanVien = undefined;
                        this.datPhong.HoaDon = undefined;
                        if (this.isUpdate) {
                            let id = parseInt(this.$route.params.id, 10);
                            this.loading = true;
                            DatPhongApi.update(id, this.datPhong).then(res => {
                                this.loading = false;
                                this.$snotify.success('Cập nhật thành công!');
                            }).catch(res => {
                                this.loading = false;
                                this.$snotify.error('Cập nhật thất bại!');
                            });
                        } else {
                            this.loading = true;
                            DatPhongApi.insert(this.datPhong).then(res => {
                                this.$router.push('/datphong/' + res.DatPhongID);
                                this.datPhong = res;
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
            getDSHoaDon(): void {
                HoaDonApi.search(this.searchParamsHoaDon).then(res => {
                    this.dsHoaDon = res.Data;
                });
            },
        }
    });
</script>

