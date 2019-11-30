<template>
        <v-flex xs12>
            <v-breadcrumbs divider="/" class="pa-0">
                <v-icon slot="divider">chevron_right</v-icon>
                <v-breadcrumbs-item>
                    <v-btn flat class="ma-0" @click="$router.go(-1)" small><v-icon>arrow_back</v-icon> Quay lại</v-btn>
                </v-breadcrumbs-item>
                <v-breadcrumbs-item to="/banggia" exact>BangGia</v-breadcrumbs-item>
                <v-breadcrumbs-item>{{isUpdate?'Cập nhật':'Thêm mới'}}</v-breadcrumbs-item>
            </v-breadcrumbs>
            <v-card>
                <v-card-text>
                    <v-form scope="frmAddEdit">
                        <v-layout row wrap>
                            <v-flex xs6 sm4 md3>
                                <v-autocomplete v-model="bangGia.LoaiPhongID"
                                                :items="dsLoaiPhong"
                                                :loading="dsLoaiPhongLoading"
                                                :search-input.sync="searchLoaiPhong"
                                                item-text="TenLoaiPhong"
                                                item-value="LoaiPhongID"
                                                label="LoaiPhongID"
                                                placeholder="Nhập LoaiPhongID"
                                                :error-messages="errors.collect('LoaiPhongID', 'frmAddEdit')"
                                                v-validate="''"
                                                data-vv-scope="frmAddEdit"
                                                data-vv-name="LoaiPhongID"
                                                clearable></v-autocomplete>
                            </v-flex>
                            <v-flex xs6 sm4 md3>
                                <v-text-field v-model="bangGia.GiaPhong"
                                              label="GiaPhong"
                                              type="number"
                                              :error-messages="errors.collect('GiaPhong', 'frmAddEdit')"
                                              v-validate="''"
                                              data-vv-scope="frmAddEdit"
                                              data-vv-name="GiaPhong"
                                              hide-details
                                              clearable></v-text-field>
                            </v-flex>
                            <v-flex xs6 sm4 md3>
                                <v-text-field v-model="bangGia.ApDungTuNgay"
                                              label="ApDungTuNgay"
                                              type="date"
                                              :error-messages="errors.collect('ApDungTuNgay', 'frmAddEdit')"
                                              v-validate="''"
                                              data-vv-scope="frmAddEdit"
                                              data-vv-name="ApDungTuNgay"
                                              hide-details
                                              clearable></v-text-field>
                            </v-flex>
                            <v-flex xs6 sm4 md3>
                                <v-text-field v-model="bangGia.ApDungDenNgay"
                                              label="ApDungDenNgay"
                                              type="date"
                                              :error-messages="errors.collect('ApDungDenNgay', 'frmAddEdit')"
                                              v-validate="''"
                                              data-vv-scope="frmAddEdit"
                                              data-vv-name="ApDungDenNgay"
                                              hide-details
                                              clearable></v-text-field>
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
    import BangGiaApi, { BangGiaApiSearchParams } from '@/apiResources/BangGiaApi';
    import { BangGia } from '@/models/BangGia';
    import { LoaiPhong } from '@/models/LoaiPhong';
    import LoaiPhongApi, { LoaiPhongApiSearchParams } from '@/apiResources/LoaiPhongApi';

    export default Vue.extend({
        $_veeValidate: {
            validator: 'new'
        },
        components: {},
        data() {
            return {
                dialog: false,
                isUpdate: false,
                bangGia: {} as BangGia,
                dsLoaiPhong: [] as LoaiPhong[],
                dsLoaiPhongLoading: false,
                searchLoaiPhong: '',
                searchParamsLoaiPhong: { includeEntities: true } as LoaiPhongApiSearchParams,
                loading: false,
                searchParamsBangGia: {} as BangGiaApiSearchParams,
            }
        },
        watch: {
        },
        mounted() {
            if (this.$route.name === 'suaBangGia') {
                this.isUpdate = true;
                let id = parseInt(this.$route.params.id, 10);
                this.getDataFromApi(id);
            } else {
                this.isUpdate = false;
            }
        },
        created() {
            this.getDsLoaiPhong();
        },
        methods: {
            show(isUpdate: boolean, item: any) {
                this.dialog = true;
                this.isUpdate = isUpdate;
                this.bangGia = item;
            },
            getDataFromApi(id: number): void {
                BangGiaApi.detail(id).then(res => {
                    this.bangGia = res;
                });
            },
            save(): void {
                this.$validator.validateAll('frmAddEdit').then((res) => {
                   if (res) {
                        this.bangGia.LoaiPhong = undefined;
                        this.bangGia.ThuePhong = undefined;
                        if (this.isUpdate) {
                            let id = parseInt(this.$route.params.id, 10);
                            this.loading = true;
                            BangGiaApi.update(id, this.bangGia).then(res => {
                                this.loading = false;
                                this.$snotify.success('Cập nhật thành công!');
                            }).catch(res => {
                                this.loading = false;
                                this.$snotify.error('Cập nhật thất bại!');
                            });
                        } else {
                            this.loading = true;
                            BangGiaApi.insert(this.bangGia).then(res => {
                                this.$router.push('/banggia/' + res.BangGiaID);
                                this.bangGia = res;
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
            getDsLoaiPhong(): void {
                LoaiPhongApi.search(this.searchParamsLoaiPhong).then(res => {
                    this.dsLoaiPhong = res.Data;
                });
            },
        }
    });
</script>

