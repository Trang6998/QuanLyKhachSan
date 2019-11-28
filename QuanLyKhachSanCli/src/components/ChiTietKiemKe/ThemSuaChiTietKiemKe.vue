<template>
    <v-flex xs12>
        <v-breadcrumbs divider="/" class="pa-0">
            <v-icon slot="divider">chevron_right</v-icon>
            <v-breadcrumbs-item>
                <v-btn flat class="ma-0" @click="$router.go(-1)" small><v-icon>arrow_back</v-icon> Quay lại</v-btn>
            </v-breadcrumbs-item>
            <v-breadcrumbs-item to="/chitietkiemke" exact>ChiTietKiemKe</v-breadcrumbs-item>
            <v-breadcrumbs-item>{{isUpdate?'Cập nhật':'Thêm mới'}}</v-breadcrumbs-item>
        </v-breadcrumbs>
        <v-card>
            <v-card-text>
                <v-form scope="frmAddEdit">
                    <v-layout row wrap>
                        <v-flex xs6 sm4 md3>
                            <v-autocomplete v-model="chiTietKiemKe.KiemKeID"
                            :items="dsKiemKe"
                            :loading="dsKiemKeLoading"
                            :search-input.sync="searchKiemKe"
                            item-text="KiemKeID"
                            item-value="KiemKeID"
                            label="KiemKeID"
                            placeholder="Nhập KiemKeID"
                            :error-messages="errors.collect('KiemKeID', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="KiemKeID"
                            clearable
                            ></v-autocomplete>
                        </v-flex>
                        <v-flex xs6 sm4 md3>
                            <v-autocomplete v-model="chiTietKiemKe.VatDungPhongID"
                            :items="dsVatDungPhong"
                            :loading="dsVatDungPhongLoading"
                            :search-input.sync="searchVatDungPhong"
                            item-text="VatDungPhongID"
                            item-value="VatDungPhongID"
                            label="VatDungPhongID"
                            placeholder="Nhập VatDungPhongID"
                            :error-messages="errors.collect('VatDungPhongID', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="VatDungPhongID"
                            clearable
                            ></v-autocomplete>
                        </v-flex>
                        <v-flex xs6 sm4 md3>
                            <v-text-field
                            v-model="chiTietKiemKe.SoLuongKiemKe"
                            label="SoLuongKiemKe"
                            type="number"
                            :error-messages="errors.collect('SoLuongKiemKe', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="SoLuongKiemKe"
                            hide-details
                            clearable
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs6 sm4 md3>
                            <v-text-field
                            v-model="chiTietKiemKe.GhiChu"
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
    import ChiTietKiemKeApi, { ChiTietKiemKeApiSearchParams } from '@/apiResources/ChiTietKiemKeApi';
    import { ChiTietKiemKe } from '@/models/ChiTietKiemKe';

    export default Vue.extend({
        $_veeValidate: {
            validator: 'new'
        },
        components: {},
        data() {
            return {
                isUpdate: false,
                chiTietKiemKe: {} as ChiTietKiemKe,
                loading: false,
                searchParamsChiTietKiemKe: {} as ChiTietKiemKeApiSearchParams,
            }
        },
        watch: {
        },
        mounted() {
            if (this.$route.name === 'suaChiTietKiemKe') {
                this.isUpdate = true;
                let id = parseInt(this.$route.params.id, 10);
                this.getDataFromApi(id);
            } else {
                this.isUpdate = false;
            }
        },
        methods: {
            getDataFromApi(id: number): void {
                ChiTietKiemKeApi.detail(id).then(res => {
                    this.chiTietKiemKe = res;
                });
            },
            save(): void {
                this.$validator.validateAll('frmAddEdit').then((res) => {
                   if (res) {
                        this.chiTietKiemKe.VatDungPhong = undefined;
                        this.chiTietKiemKe.KiemKe = undefined;
                        if (this.isUpdate) {
                            let id = parseInt(this.$route.params.id, 10);
                            this.loading = true;
                            ChiTietKiemKeApi.update(id, this.chiTietKiemKe).then(res => {
                                this.loading = false;
                                this.$snotify.success('Cập nhật thành công!');
                            }).catch(res => {
                                this.loading = false;
                                this.$snotify.error('Cập nhật thất bại!');
                            });
                        } else {
                            this.loading = true;
                            ChiTietKiemKeApi.insert(this.chiTietKiemKe).then(res => {
                                this.$router.push('/chitietkiemke/' + res.ChiTietKiemKeID);
                                this.chiTietKiemKe = res;
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

