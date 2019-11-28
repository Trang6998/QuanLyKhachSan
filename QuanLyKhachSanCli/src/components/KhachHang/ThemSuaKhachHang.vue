<template>
    <v-flex xs12>
        <v-breadcrumbs divider="/" class="pa-0">
            <v-icon slot="divider">chevron_right</v-icon>
            <v-breadcrumbs-item>
                <v-btn flat class="ma-0" @click="$router.go(-1)" small><v-icon>arrow_back</v-icon> Quay lại</v-btn>
            </v-breadcrumbs-item>
            <v-breadcrumbs-item to="/khachhang" exact>KhachHang</v-breadcrumbs-item>
            <v-breadcrumbs-item>{{isUpdate?'Cập nhật':'Thêm mới'}}</v-breadcrumbs-item>
        </v-breadcrumbs>
        <v-card>
            <v-card-text>
                <v-form scope="frmAddEdit">
                    <v-layout row wrap>
                        <v-flex xs6 sm4 md3>
                            <v-text-field
                            v-model="khachHang.HoTen"
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
                            <v-checkbox v-model="khachHang.GioiTinh" label="GioiTinh"
                            :error-messages="errors.collect('GioiTinh', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="GioiTinh"
                            ></v-checkbox>
                        </v-flex>
                        <v-flex xs6 sm4 md3>
                            <v-text-field
                            v-model="khachHang.NgaySinh"
                            label="NgaySinh"
                            type="date"
                            :error-messages="errors.collect('NgaySinh', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="NgaySinh"
                            hide-details
                            clearable
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs6 sm4 md3>
                            <v-text-field
                            v-model="khachHang.SoDienThoai"
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
                            v-model="khachHang.DiaChi"
                            label="DiaChi"
                            type="text"
                            :error-messages="errors.collect('DiaChi', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="DiaChi"
                            hide-details
                            clearable
                            ></v-text-field>
                        </v-flex>

                        <v-flex xs6 sm4 md3>
                            <v-text-field
                            v-model="khachHang.CMND"
                            label="CMND"
                            type="text"
                            :error-messages="errors.collect('CMND', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="CMND"
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
                        <td>{{ props.item.KhachHang.NhanVienID }}</td>
                        <td>{{ props.item.KhachHang.DatPhongID }}</td>
                        <td>{{ props.item.KhachHang.KhachHangID }}</td>
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
    import KhachHangApi, { KhachHangApiSearchParams } from '@/apiResources/KhachHangApi';
    import { KhachHang } from '@/models/KhachHang';
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
                khachHang: {} as KhachHang,
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
                searchParamsKhachHang: {} as KhachHangApiSearchParams,
            }
        },
        watch: {
        },
        mounted() {
            if (this.$route.name === 'suaKhachHang') {
                this.isUpdate = true;
                let id = parseInt(this.$route.params.id, 10);
                this.getDataFromApi(id);
            } else {
                this.isUpdate = false;
            }
        },
        methods: {
            getDataFromApi(id: number): void {
                KhachHangApi.detail(id).then(res => {
                    this.khachHang = res;
                });
            },
            save(): void {
                this.$validator.validateAll('frmAddEdit').then((res) => {
                   if (res) {
                        this.khachHang.HoaDon = undefined;
                        if (this.isUpdate) {
                            let id = parseInt(this.$route.params.id, 10);
                            this.loading = true;
                            KhachHangApi.update(id, this.khachHang).then(res => {
                                this.loading = false;
                                this.$snotify.success('Cập nhật thành công!');
                            }).catch(res => {
                                this.loading = false;
                                this.$snotify.error('Cập nhật thất bại!');
                            });
                        } else {
                            this.loading = true;
                            KhachHangApi.insert(this.khachHang).then(res => {
                                this.$router.push('/khachhang/' + res.KhachHangID);
                                this.khachHang = res;
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

