<template>
    <v-flex xs12>
        <v-breadcrumbs divider="/" class="pa-0">
            <v-icon slot="divider">chevron_right</v-icon>
            <v-breadcrumbs-item>
                <v-btn flat class="ma-0" @click="$router.go(-1)" small><v-icon>arrow_back</v-icon> Quay lại</v-btn>
            </v-breadcrumbs-item>
            <v-breadcrumbs-item to="/loaiphong" exact>LoaiPhong</v-breadcrumbs-item>
            <v-breadcrumbs-item>{{isUpdate?'Cập nhật':'Thêm mới'}}</v-breadcrumbs-item>
        </v-breadcrumbs>
        <v-card>
            <v-card-text>
                <v-form scope="frmAddEdit">
                    <v-layout row wrap>
                        <v-flex xs6 sm4 md3>
                            <v-text-field
                            v-model="loaiPhong.TenLoaiPhong"
                            label="TenLoaiPhong"
                            type="text"
                            :error-messages="errors.collect('TenLoaiPhong', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="TenLoaiPhong"
                            hide-details
                            clearable
                            ></v-text-field>
                        </v-flex>

                        <v-flex xs6 sm4 md3>
                            <v-text-field
                            v-model="loaiPhong.GiaPhong"
                            label="GiaPhong"
                            type="number"
                            :error-messages="errors.collect('GiaPhong', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="GiaPhong"
                            hide-details
                            clearable
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs6 sm4 md3>
                            <v-text-field
                            v-model="loaiPhong.MoTa"
                            label="MoTa"
                            type="text"
                            :error-messages="errors.collect('MoTa', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="MoTa"
                            hide-details
                            clearable
                            ></v-text-field>
                        </v-flex>

                        <v-flex xs12>
                            <v-tabs color="primary" dark slider-color="white">
                                <v-tab :key="1" ripple>
                                    BangGia
                                </v-tab>
                                <v-tab-item :key="1">
                                    <v-card flat>
                                            <div class="text-xs-right">
                                                <v-btn color="info" to="/banggia/add" small>Thêm mới</v-btn>
                                            </div>
                                        <v-card-text class="pa-0">
                <v-data-table :headers="tableHeaderBangGia"
                              :items="dsBangGia"
                              :pagination.sync="searchParamsBangGia"
                              :total-items="searchParamsBangGia.totalItems"
                              :loading="dsBangGiaLoading"
                              class="table-border table">
                    <template slot="items" slot-scope="props">
                <td>{{ props.item.BangGiaID }}</td>
                        <td>{{ props.item.LoaiPhong.LoaiPhongID }}</td>
                <td>{{ props.item.GiaPhong }}</td>
                        <td>{{ props.item.ApDungTuNgay === null ? "" : props.item.ApDungTuNgay|moment('DD/MM/YYYY') }}</td>
                        <td>{{ props.item.ApDungDenNgay === null ? "" : props.item.ApDungDenNgay|moment('DD/MM/YYYY') }}</td>
                        </template>
                    </v-data-table>
                                        </v-card-text>
                                    </v-card>
                                </v-tab-item>
                                <v-tab :key="2" ripple>
                                    DatPhong
                                </v-tab>
                                <v-tab-item :key="2">
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
                        <td>{{ props.item.LoaiPhong.LoaiPhongID }}</td>
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
                                <v-tab :key="3" ripple>
                                    Phong
                                </v-tab>
                                <v-tab-item :key="3">
                                    <v-card flat>
                                            <div class="text-xs-right">
                                                <v-btn color="info" to="/phong/add" small>Thêm mới</v-btn>
                                            </div>
                                        <v-card-text class="pa-0">
                <v-data-table :headers="tableHeaderPhong"
                              :items="dsPhong"
                              :pagination.sync="searchParamsPhong"
                              :total-items="searchParamsPhong.totalItems"
                              :loading="dsPhongLoading"
                              class="table-border table">
                    <template slot="items" slot-scope="props">
                <td>{{ props.item.PhongID }}</td>
                <td>{{ props.item.SoPhong }}</td>
                <td>{{ props.item.TrangThai ? "Yes" : "No" }}</td>
                        <td>{{ props.item.LoaiPhong.LoaiPhongID }}</td>
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
    import LoaiPhongApi, { LoaiPhongApiSearchParams } from '@/apiResources/LoaiPhongApi';
    import { LoaiPhong } from '@/models/LoaiPhong';
    import { BangGia } from '@/models/BangGia';
    import BangGiaApi, { BangGiaApiSearchParams } from '@/apiResources/BangGiaApi';
    import { DatPhong } from '@/models/DatPhong';
    import DatPhongApi, { DatPhongApiSearchParams } from '@/apiResources/DatPhongApi';
    import { Phong } from '@/models/Phong';
    import PhongApi, { PhongApiSearchParams } from '@/apiResources/PhongApi';

    export default Vue.extend({
        $_veeValidate: {
            validator: 'new'
        },
        components: {},
        data() {
            return {
                isUpdate: false,
                loaiPhong: {} as LoaiPhong,
                dsBangGia: [] as BangGia[],
                dsBangGiaLoading: false,
                searchBangGia: '',
                searchParamsBangGia: { includeEntities: true } as BangGiaApiSearchParams,
                tableHeaderBangGia: [
                    { text: 'BangGiaID', value: 'BangGiaID', align: 'center', sortable: true },
                    { text: 'LoaiPhongID', value: 'LoaiPhongID', align: 'center', sortable: true },
                    { text: 'GiaPhong', value: 'GiaPhong', align: 'center', sortable: true },
                    { text: 'ApDungTuNgay', value: 'ApDungTuNgay', align: 'center', sortable: true },
                    { text: 'ApDungDenNgay', value: 'ApDungDenNgay', align: 'center', sortable: true },
                ],
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
                dsPhong: [] as Phong[],
                dsPhongLoading: false,
                searchPhong: '',
                searchParamsPhong: { includeEntities: true } as PhongApiSearchParams,
                tableHeaderPhong: [
                    { text: 'PhongID', value: 'PhongID', align: 'center', sortable: true },
                    { text: 'SoPhong', value: 'SoPhong', align: 'center', sortable: true },
                    { text: 'TrangThai', value: 'TrangThai', align: 'center', sortable: true },
                    { text: 'LoaiPhongID', value: 'LoaiPhongID', align: 'center', sortable: true },
                ],
                loading: false,
                searchParamsLoaiPhong: {} as LoaiPhongApiSearchParams,
            }
        },
        watch: {
        },
        mounted() {
            if (this.$route.name === 'suaLoaiPhong') {
                this.isUpdate = true;
                let id = parseInt(this.$route.params.id, 10);
                this.getDataFromApi(id);
            } else {
                this.isUpdate = false;
            }
        },
        methods: {
            getDataFromApi(id: number): void {
                LoaiPhongApi.detail(id).then(res => {
                    this.loaiPhong = res;
                });
            },
            save(): void {
                this.$validator.validateAll('frmAddEdit').then((res) => {
                   if (res) {
                        this.loaiPhong.BangGia = undefined;
                        this.loaiPhong.DatPhong = undefined;
                        this.loaiPhong.Phong = undefined;
                        if (this.isUpdate) {
                            let id = parseInt(this.$route.params.id, 10);
                            this.loading = true;
                            LoaiPhongApi.update(id, this.loaiPhong).then(res => {
                                this.loading = false;
                                this.$snotify.success('Cập nhật thành công!');
                            }).catch(res => {
                                this.loading = false;
                                this.$snotify.error('Cập nhật thất bại!');
                            });
                        } else {
                            this.loading = true;
                            LoaiPhongApi.insert(this.loaiPhong).then(res => {
                                this.$router.push('/loaiphong/' + res.LoaiPhongID);
                                this.loaiPhong = res;
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
            getDSBangGia(): void {
                BangGiaApi.search(this.searchParamsBangGia).then(res => {
                    this.dsBangGia = res.Data;
                });
            },
            getDSDatPhong(): void {
                DatPhongApi.search(this.searchParamsDatPhong).then(res => {
                    this.dsDatPhong = res.Data;
                });
            },
            getDSPhong(): void {
                PhongApi.search(this.searchParamsPhong).then(res => {
                    this.dsPhong = res.Data;
                });
            },
        }
    });
</script>

