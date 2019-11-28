<template>
    <v-flex xs12>
        <v-breadcrumbs divider="/" class="pa-0">
            <v-icon slot="divider">chevron_right</v-icon>
            <v-breadcrumbs-item>
                <v-btn flat class="ma-0" @click="$router.go(-1)" small><v-icon>arrow_back</v-icon> Quay lại</v-btn>
            </v-breadcrumbs-item>
            <v-breadcrumbs-item to="/chitietphieunhap" exact>ChiTietPhieuNhap</v-breadcrumbs-item>
            <v-breadcrumbs-item>{{isUpdate?'Cập nhật':'Thêm mới'}}</v-breadcrumbs-item>
        </v-breadcrumbs>
        <v-card>
            <v-card-text>
                <v-form scope="frmAddEdit">
                    <v-layout row wrap>
                        <v-flex xs6 sm4 md3>
                            <v-autocomplete v-model="chiTietPhieuNhap.PhieuNhapID"
                            :items="dsPhieuNhapKho"
                            :loading="dsPhieuNhapKhoLoading"
                            :search-input.sync="searchPhieuNhapKho"
                            item-text="PhieuNhapID"
                            item-value="PhieuNhapID"
                            label="PhieuNhapID"
                            placeholder="Nhập PhieuNhapID"
                            :error-messages="errors.collect('PhieuNhapID', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="PhieuNhapID"
                            clearable
                            ></v-autocomplete>
                        </v-flex>
                        <v-flex xs6 sm4 md3>
                            <v-autocomplete v-model="chiTietPhieuNhap.ThuocTinhID"
                            :items="dsVatDung"
                            :loading="dsVatDungLoading"
                            :search-input.sync="searchVatDung"
                            item-text="VatDungID"
                            item-value="VatDungID"
                            label="ThuocTinhID"
                            placeholder="Nhập ThuocTinhID"
                            :error-messages="errors.collect('ThuocTinhID', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="ThuocTinhID"
                            clearable
                            ></v-autocomplete>
                        </v-flex>
                        <v-flex xs6 sm4 md3>
                            <v-text-field
                            v-model="chiTietPhieuNhap.SoLuong"
                            label="SoLuong"
                            type="number"
                            :error-messages="errors.collect('SoLuong', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="SoLuong"
                            hide-details
                            clearable
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs6 sm4 md3>
                            <v-text-field
                            v-model="chiTietPhieuNhap.GiaNhap"
                            label="GiaNhap"
                            type="number"
                            :error-messages="errors.collect('GiaNhap', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="GiaNhap"
                            hide-details
                            clearable
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs6 sm4 md3>
                            <v-text-field
                            v-model="chiTietPhieuNhap.GhiChu"
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
    import ChiTietPhieuNhapApi, { ChiTietPhieuNhapApiSearchParams } from '@/apiResources/ChiTietPhieuNhapApi';
    import { ChiTietPhieuNhap } from '@/models/ChiTietPhieuNhap';

    export default Vue.extend({
        $_veeValidate: {
            validator: 'new'
        },
        components: {},
        data() {
            return {
                isUpdate: false,
                chiTietPhieuNhap: {} as ChiTietPhieuNhap,
                loading: false,
                searchParamsChiTietPhieuNhap: {} as ChiTietPhieuNhapApiSearchParams,
            }
        },
        watch: {
        },
        mounted() {
            if (this.$route.name === 'suaChiTietPhieuNhap') {
                this.isUpdate = true;
                let id = parseInt(this.$route.params.id, 10);
                this.getDataFromApi(id);
            } else {
                this.isUpdate = false;
            }
        },
        methods: {
            getDataFromApi(id: number): void {
                ChiTietPhieuNhapApi.detail(id).then(res => {
                    this.chiTietPhieuNhap = res;
                });
            },
            save(): void {
                this.$validator.validateAll('frmAddEdit').then((res) => {
                   if (res) {
                        this.chiTietPhieuNhap.VatDung = undefined;
                        this.chiTietPhieuNhap.PhieuNhapKho = undefined;
                        if (this.isUpdate) {
                            let id = parseInt(this.$route.params.id, 10);
                            this.loading = true;
                            ChiTietPhieuNhapApi.update(id, this.chiTietPhieuNhap).then(res => {
                                this.loading = false;
                                this.$snotify.success('Cập nhật thành công!');
                            }).catch(res => {
                                this.loading = false;
                                this.$snotify.error('Cập nhật thất bại!');
                            });
                        } else {
                            this.loading = true;
                            ChiTietPhieuNhapApi.insert(this.chiTietPhieuNhap).then(res => {
                                this.$router.push('/chitietphieunhap/' + res.ChiTietPhieuNhapID);
                                this.chiTietPhieuNhap = res;
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
        }
    });
</script>

