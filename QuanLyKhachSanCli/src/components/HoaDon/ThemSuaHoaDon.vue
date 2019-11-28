<template>
    <v-flex xs12>
        <v-breadcrumbs divider="/" class="pa-0">
            <v-icon slot="divider">chevron_right</v-icon>
            <v-breadcrumbs-item>
                <v-btn flat class="ma-0" @click="$router.go(-1)" small><v-icon>arrow_back</v-icon> Quay lại</v-btn>
            </v-breadcrumbs-item>
            <v-breadcrumbs-item to="/hoadon" exact>HoaDon</v-breadcrumbs-item>
            <v-breadcrumbs-item>{{isUpdate?'Cập nhật':'Thêm mới'}}</v-breadcrumbs-item>
        </v-breadcrumbs>
        <v-card>
            <v-card-text>
                <v-form scope="frmAddEdit">
                    <v-layout row wrap>
                        <v-flex xs6 sm4 md3>
                            <v-autocomplete v-model="hoaDon.NhanVienID"
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
                            <v-autocomplete v-model="hoaDon.DatPhongID"
                            :items="dsDatPhong"
                            :loading="dsDatPhongLoading"
                            :search-input.sync="searchDatPhong"
                            item-text="DatPhongID"
                            item-value="DatPhongID"
                            label="DatPhongID"
                            placeholder="Nhập DatPhongID"
                            :error-messages="errors.collect('DatPhongID', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="DatPhongID"
                            clearable
                            ></v-autocomplete>
                        </v-flex>
                        <v-flex xs6 sm4 md3>
                            <v-autocomplete v-model="hoaDon.KhachHangID"
                            :items="dsKhachHang"
                            :loading="dsKhachHangLoading"
                            :search-input.sync="searchKhachHang"
                            item-text="KhachHangID"
                            item-value="KhachHangID"
                            label="KhachHangID"
                            placeholder="Nhập KhachHangID"
                            :error-messages="errors.collect('KhachHangID', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="KhachHangID"
                            clearable
                            ></v-autocomplete>
                        </v-flex>
                        <v-flex xs6 sm4 md3>
                            <v-text-field
                            v-model="hoaDon.MaHoaDon"
                            label="MaHoaDon"
                            type="text"
                            :error-messages="errors.collect('MaHoaDon', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="MaHoaDon"
                            hide-details
                            clearable
                            ></v-text-field>
                        </v-flex>

                        <v-flex xs6 sm4 md3>
                            <v-text-field
                            v-model="hoaDon.NgayThanhToan"
                            label="NgayThanhToan"
                            type="datetime-local"
                            :error-messages="errors.collect('NgayThanhToan', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="NgayThanhToan"
                            hide-details
                            clearable
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs6 sm4 md3>
                            <v-text-field
                            v-model="hoaDon.SoTaiKhoan"
                            label="SoTaiKhoan"
                            type="text"
                            :error-messages="errors.collect('SoTaiKhoan', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="SoTaiKhoan"
                            hide-details
                            clearable
                            ></v-text-field>
                        </v-flex>

                        <v-flex xs6 sm4 md3>
                            <v-text-field
                            v-model="hoaDon.TongTien"
                            label="TongTien"
                            type="number"
                            :error-messages="errors.collect('TongTien', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="TongTien"
                            hide-details
                            clearable
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-tabs color="primary" dark slider-color="white">
                                <v-tab :key="1" ripple>
                                    DatDichVu
                                </v-tab>
                                <v-tab-item :key="1">
                                    <v-card flat>
                                            <div class="text-xs-right">
                                                <v-btn color="info" to="/datdichvu/add" small>Thêm mới</v-btn>
                                            </div>
                                        <v-card-text class="pa-0">
                <v-data-table :headers="tableHeaderDatDichVu"
                              :items="dsDatDichVu"
                              :pagination.sync="searchParamsDatDichVu"
                              :total-items="searchParamsDatDichVu.totalItems"
                              :loading="dsDatDichVuLoading"
                              class="table-border table">
                    <template slot="items" slot-scope="props">
                <td>{{ props.item.DatDichVuID }}</td>
                <td>{{ props.item.SoLuong }}</td>
                        <td>{{ props.item.HoaDon.DichVuID }}</td>
                        <td>{{ props.item.HoaDon.HoaDonID }}</td>
                        </template>
                    </v-data-table>
                                        </v-card-text>
                                    </v-card>
                                </v-tab-item>
                                <v-tab :key="2" ripple>
                                    ThuePhong
                                </v-tab>
                                <v-tab-item :key="2">
                                    <v-card flat>
                                            <div class="text-xs-right">
                                                <v-btn color="info" to="/thuephong/add" small>Thêm mới</v-btn>
                                            </div>
                                        <v-card-text class="pa-0">
                <v-data-table :headers="tableHeaderThuePhong"
                              :items="dsThuePhong"
                              :pagination.sync="searchParamsThuePhong"
                              :total-items="searchParamsThuePhong.totalItems"
                              :loading="dsThuePhongLoading"
                              class="table-border table">
                    <template slot="items" slot-scope="props">
                <td>{{ props.item.ThuePhongID }}</td>
                        <td>{{ props.item.HoaDon.PhongID }}</td>
                        <td>{{ props.item.HoaDon.HoaDonID }}</td>
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
    import HoaDonApi, { HoaDonApiSearchParams } from '@/apiResources/HoaDonApi';
    import { HoaDon } from '@/models/HoaDon';
    import { DatDichVu } from '@/models/DatDichVu';
    import DatDichVuApi, { DatDichVuApiSearchParams } from '@/apiResources/DatDichVuApi';
    import { ThuePhong } from '@/models/ThuePhong';
    import ThuePhongApi, { ThuePhongApiSearchParams } from '@/apiResources/ThuePhongApi';

    export default Vue.extend({
        $_veeValidate: {
            validator: 'new'
        },
        components: {},
        data() {
            return {
                isUpdate: false,
                hoaDon: {} as HoaDon,
                dsDatDichVu: [] as DatDichVu[],
                dsDatDichVuLoading: false,
                searchDatDichVu: '',
                searchParamsDatDichVu: { includeEntities: true } as DatDichVuApiSearchParams,
                tableHeaderDatDichVu: [
                    { text: 'DatDichVuID', value: 'DatDichVuID', align: 'center', sortable: true },
                    { text: 'SoLuong', value: 'SoLuong', align: 'center', sortable: true },
                    { text: 'DichVuID', value: 'DichVuID', align: 'center', sortable: true },
                    { text: 'HoaDonID', value: 'HoaDonID', align: 'center', sortable: true },
                ],
                dsThuePhong: [] as ThuePhong[],
                dsThuePhongLoading: false,
                searchThuePhong: '',
                searchParamsThuePhong: { includeEntities: true } as ThuePhongApiSearchParams,
                tableHeaderThuePhong: [
                    { text: 'ThuePhongID', value: 'ThuePhongID', align: 'center', sortable: true },
                    { text: 'PhongID', value: 'PhongID', align: 'center', sortable: true },
                    { text: 'HoaDonID', value: 'HoaDonID', align: 'center', sortable: true },
                ],
                loading: false,
                searchParamsHoaDon: {} as HoaDonApiSearchParams,
            }
        },
        watch: {
        },
        mounted() {
            if (this.$route.name === 'suaHoaDon') {
                this.isUpdate = true;
                let id = parseInt(this.$route.params.id, 10);
                this.getDataFromApi(id);
            } else {
                this.isUpdate = false;
            }
        },
        methods: {
            getDataFromApi(id: number): void {
                HoaDonApi.detail(id).then(res => {
                    this.hoaDon = res;
                });
            },
            save(): void {
                this.$validator.validateAll('frmAddEdit').then((res) => {
                   if (res) {
                        this.hoaDon.DatPhong = undefined;
                        this.hoaDon.NhanVien = undefined;
                        this.hoaDon.KhachHang = undefined;
                        this.hoaDon.DatDichVu = undefined;
                        this.hoaDon.ThuePhong = undefined;
                        if (this.isUpdate) {
                            let id = parseInt(this.$route.params.id, 10);
                            this.loading = true;
                            HoaDonApi.update(id, this.hoaDon).then(res => {
                                this.loading = false;
                                this.$snotify.success('Cập nhật thành công!');
                            }).catch(res => {
                                this.loading = false;
                                this.$snotify.error('Cập nhật thất bại!');
                            });
                        } else {
                            this.loading = true;
                            HoaDonApi.insert(this.hoaDon).then(res => {
                                this.$router.push('/hoadon/' + res.HoaDonID);
                                this.hoaDon = res;
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
            getDSDatDichVu(): void {
                DatDichVuApi.search(this.searchParamsDatDichVu).then(res => {
                    this.dsDatDichVu = res.Data;
                });
            },
            getDSThuePhong(): void {
                ThuePhongApi.search(this.searchParamsThuePhong).then(res => {
                    this.dsThuePhong = res.Data;
                });
            },
        }
    });
</script>

