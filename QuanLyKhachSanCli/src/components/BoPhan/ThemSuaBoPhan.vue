<template>
    <v-flex xs12>
        <v-breadcrumbs divider="/" class="pa-0">
            <v-icon slot="divider">chevron_right</v-icon>
            <v-breadcrumbs-item>
                <v-btn flat class="ma-0" @click="$router.go(-1)" small><v-icon>arrow_back</v-icon> Quay lại</v-btn>
            </v-breadcrumbs-item>
            <v-breadcrumbs-item to="/bophan" exact>BoPhan</v-breadcrumbs-item>
            <v-breadcrumbs-item>{{isUpdate?'Cập nhật':'Thêm mới'}}</v-breadcrumbs-item>
        </v-breadcrumbs>
        <v-card>
            <v-card-text>
                <v-form scope="frmAddEdit">
                    <v-layout row wrap>
                        <v-flex xs6 sm4 md3>
                            <v-text-field
                            v-model="boPhan.TenBoPhan"
                            label="TenBoPhan"
                            type="text"
                            :error-messages="errors.collect('TenBoPhan', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="TenBoPhan"
                            hide-details
                            clearable
                            ></v-text-field>
                        </v-flex>

                        <v-flex xs6 sm4 md3>
                            <v-text-field
                            v-model="boPhan.NhiemVu"
                            label="NhiemVu"
                            type="text"
                            :error-messages="errors.collect('NhiemVu', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="NhiemVu"
                            hide-details
                            clearable
                            ></v-text-field>
                        </v-flex>

                        <v-flex xs6 sm4 md3>
                            <v-text-field
                            v-model="boPhan.GhiChu"
                            label="GhiChu"
                            type="text"
                            :error-messages="errors.collect('GhiChu', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="GhiChu"
                            hide-details
                            clearable
                            ></v-text-field>
                        </v-flex>

                        <v-flex xs12>
                            <v-tabs color="primary" dark slider-color="white">
                                <v-tab :key="1" ripple>
                                    NhanVien
                                </v-tab>
                                <v-tab-item :key="1">
                                    <v-card flat>
                                            <div class="text-xs-right">
                                                <v-btn color="info" to="/nhanvien/add" small>Thêm mới</v-btn>
                                            </div>
                                        <v-card-text class="pa-0">
                <v-data-table :headers="tableHeaderNhanVien"
                              :items="dsNhanVien"
                              :pagination.sync="searchParamsNhanVien"
                              :total-items="searchParamsNhanVien.totalItems"
                              :loading="dsNhanVienLoading"
                              class="table-border table">
                    <template slot="items" slot-scope="props">
                <td>{{ props.item.NhanVienID }}</td>
                <td>{{ props.item.TenNhanVien }}</td>
                <td>{{ props.item.SoDienThoai }}</td>
                <td>{{ props.item.TenDangNhap }}</td>
                <td>{{ props.item.MatKhau }}</td>
                <td>{{ props.item.LoaiTaiKhoanID }}</td>
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
    import BoPhanApi, { BoPhanApiSearchParams } from '@/apiResources/BoPhanApi';
    import { BoPhan } from '@/models/BoPhan';
    import { NhanVien } from '@/models/NhanVien';
    import NhanVienApi, { NhanVienApiSearchParams } from '@/apiResources/NhanVienApi';

    export default Vue.extend({
        $_veeValidate: {
            validator: 'new'
        },
        components: {},
        data() {
            return {
                isUpdate: false,
                boPhan: {} as BoPhan,
                dsNhanVien: [] as NhanVien[],
                dsNhanVienLoading: false,
                searchNhanVien: '',
                searchParamsNhanVien: { includeEntities: true } as NhanVienApiSearchParams,
                tableHeaderNhanVien: [
                    { text: 'NhanVienID', value: 'NhanVienID', align: 'center', sortable: true },
                    { text: 'TenNhanVien', value: 'TenNhanVien', align: 'center', sortable: true },
                    { text: 'SoDienThoai', value: 'SoDienThoai', align: 'center', sortable: true },
                    { text: 'TenDangNhap', value: 'TenDangNhap', align: 'center', sortable: true },
                    { text: 'MatKhau', value: 'MatKhau', align: 'center', sortable: true },
                    { text: 'LoaiTaiKhoanID', value: 'LoaiTaiKhoanID', align: 'center', sortable: true },
                ],
                loading: false,
                searchParamsBoPhan: {} as BoPhanApiSearchParams,
            }
        },
        watch: {
        },
        mounted() {
            if (this.$route.name === 'suaBoPhan') {
                this.isUpdate = true;
                let id = parseInt(this.$route.params.id, 10);
                this.getDataFromApi(id);
            } else {
                this.isUpdate = false;
            }
        },
        methods: {
            getDataFromApi(id: number): void {
                BoPhanApi.detail(id).then(res => {
                    this.boPhan = res;
                });
            },
            save(): void {
                this.$validator.validateAll('frmAddEdit').then((res) => {
                   if (res) {
                        this.boPhan.NhanVien = undefined;
                        if (this.isUpdate) {
                            let id = parseInt(this.$route.params.id, 10);
                            this.loading = true;
                            BoPhanApi.update(id, this.boPhan).then(res => {
                                this.loading = false;
                                this.$snotify.success('Cập nhật thành công!');
                            }).catch(res => {
                                this.loading = false;
                                this.$snotify.error('Cập nhật thất bại!');
                            });
                        } else {
                            this.loading = true;
                            BoPhanApi.insert(this.boPhan).then(res => {
                                this.$router.push('/bophan/' + res.BoPhanID);
                                this.boPhan = res;
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
            getDSNhanVien(): void {
                NhanVienApi.search(this.searchParamsNhanVien).then(res => {
                    this.dsNhanVien = res.Data;
                });
            },
        }
    });
</script>

