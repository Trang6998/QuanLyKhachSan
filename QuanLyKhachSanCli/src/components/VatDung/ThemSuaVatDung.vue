<template>
    <v-dialog v-model="dialog" width="500" persistent scrollable>
        <v-container pa-0 grid-list-md>
            <v-card>
                <v-card-title class="primary white--text" style="padding: 5px 15px 5px 15px">
                    <h3>{{isUpdate ? 'Cập nhật vật dụng' : 'Thêm mới vật dụng'}}</h3>
                    <v-spacer></v-spacer>
                    <v-btn class="white--text ma-0" small @click.native="dialog = false" icon dark><v-icon>close</v-icon></v-btn>
                </v-card-title>
                <v-card-text>
                    <v-form scope="frmAddEdit">
                        <v-layout row wrap>
                            <v-flex xs6>
                                <v-text-field v-model="vatDung.TenVatDung"
                                              label="Tên vật dụng"
                                              type="text"
                                              :error-messages="errors.collect('Tên vật dụng', 'frmAddEdit')"
                                              v-validate="'required'"
                                              data-vv-scope="frmAddEdit"
                                              data-vv-name="Tên vật dụng"
                                              clearable></v-text-field>
                            </v-flex>

                            <v-flex xs6>
                                <v-text-field v-model="vatDung.SoLuongKho"
                                              label="Số lượng kho"
                                              type="text"
                                              :error-messages="errors.collect('Số lượng kho', 'frmAddEdit')"
                                              v-validate="'required'"
                                              data-vv-scope="frmAddEdit"
                                              data-vv-name="Số lượng kho"
                                              clearable></v-text-field>
                            </v-flex>

                            <v-flex xs12>
                                <v-textarea v-model="vatDung.MoTa"
                                              label="Mô tả"
                                              type="text"
                                              :error-messages="errors.collect('Mô tả', 'frmAddEdit')"
                                              v-validate="''"
                                              data-vv-scope="frmAddEdit"
                                              data-vv-name="Mô tả"
                                              hide-details
                                              clearable></v-textarea>
                            </v-flex>
                        </v-layout>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="primary" :disabled="loading" :loading="loading" @click.native="save">{{isUpdate?'Cập nhật':'Thêm mới'}}</v-btn>
                </v-card-actions>
            </v-card>
        </v-container>
    </v-dialog>
</template>

<script lang="ts">
    import { Vue } from 'vue-property-decorator';
    import VatDungApi, { VatDungApiSearchParams } from '@/apiResources/VatDungApi';
    import { VatDung } from '@/models/VatDung';
    import { ChiTietPhieuNhap } from '@/models/ChiTietPhieuNhap';
    import ChiTietPhieuNhapApi, { ChiTietPhieuNhapApiSearchParams } from '@/apiResources/ChiTietPhieuNhapApi';
    import { VatDungPhong } from '@/models/VatDungPhong';
    import VatDungPhongApi, { VatDungPhongApiSearchParams } from '@/apiResources/VatDungPhongApi';

    export default Vue.extend({
        $_veeValidate: {
            validator: 'new'
        },
        components: {},
        data() {
            return {
                dialog: false,
                isUpdate: false,
                vatDung: {} as VatDung,
                dsVatDungPhong: [] as VatDungPhong[],
                dsVatDungPhongLoading: false,
                searchVatDungPhong: '',
                searchParamsVatDungPhong: { includeEntities: true } as VatDungPhongApiSearchParams,
                loading: false,
                searchParamsVatDung: {} as VatDungApiSearchParams,
            }
        },
        watch: {
        },
        
        methods: {
            show(isUpdate: boolean, item: any) {
                this.dialog = true;
                this.isUpdate = isUpdate;
                this.vatDung = item;
            },

            getDataFromApi(id: number): void {
                VatDungApi.detail(id).then(res => {
                    this.vatDung = res;
                });
            },
            save(): void {
                this.$validator.validateAll('frmAddEdit').then((res) => {
                   if (res) {
                        this.vatDung.ChiTietPhieuNhap = undefined;
                        this.vatDung.VatDungPhong = undefined;
                        if (this.isUpdate) {
                            this.loading = true;
                            VatDungApi.update(this.vatDung.VatDungID, this.vatDung).then(res => {
                                this.loading = false;
                                this.dialog = false;
                                this.$emit("getLaiDanhSach");
                                this.$snotify.success('Cập nhật thành công!');
                            }).catch(res => {
                                this.loading = false;
                                this.$snotify.error('Cập nhật thất bại!');
                            });
                        } else {
                            this.loading = true;
                            VatDungApi.insert(this.vatDung).then(res => {
                                this.dialog = false;
                                this.$emit("getLaiDanhSach");
                                this.vatDung = res;
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
            }
        }
    });
</script>

