<template>
    <v-dialog v-model="dialog" width="500" persistent scrollable>
        <v-container pa-0 grid-list-md>
            <v-card>
                <v-card-title class="primary white--text" style="padding: 5px 15px 5px 15px">
                    <h3>{{isUpdate ? 'Cập nhật nhân viên' : 'Thêm mới nhân viên'}}</h3>
                    <v-spacer></v-spacer>
                    <v-btn class="white--text ma-0" small @click.native="dialog = false" icon dark><v-icon>close</v-icon></v-btn>
                </v-card-title>

                <v-card-text>
                    <v-form scope="frmAddEdit">
                        <v-layout row wrap>
                            <v-flex xs6>
                                <v-text-field v-model="nhanVien.TenNhanVien"
                                              label="Tên nhân viên"
                                              type="text"
                                              :error-messages="errors.collect('Tên nhân viên', 'frmAddEdit')"
                                              v-validate="'required'"
                                              data-vv-scope="frmAddEdit"
                                              data-vv-name="Tên nhân viên"
                                              clearable></v-text-field>
                                <v-spacer></v-spacer>
                            </v-flex>

                            <v-flex xs6>
                                <v-text-field v-model="nhanVien.SoDienThoai"
                                              label="Số điện thoại"
                                              type="text"
                                              :error-messages="errors.collect('Số điện thoại', 'frmAddEdit')"
                                              v-validate="'required'"
                                              data-vv-scope="frmAddEdit"
                                              data-vv-name="Số điện thoại"
                                              clearable></v-text-field>
                            </v-flex>

                            <v-flex xs6>
                                <v-autocomplete v-model="nhanVien.BoPhanID"
                                                :items="dsBoPhan"
                                                :loading="dsBoPhanLoading"
                                                :search-input.sync="searchBoPhan"
                                                item-text="TenBoPhan"
                                                item-value="BoPhanID"
                                                label="Tên bộ phận"
                                                placeholder="Nhập tên bộ phận"
                                                :error-messages="errors.collect('BoPhanID', 'frmAddEdit')"
                                                v-validate="''"
                                                data-vv-scope="frmAddEdit"
                                                data-vv-name="BoPhanID"
                                                clearable></v-autocomplete>
                            </v-flex>
                            <v-flex xs6>
                                <v-text-field v-model="nhanVien.TenDangNhap"
                                              label="Tên đăng nhập"
                                              type="text"
                                              :error-messages="errors.collect('TenDangNhap', 'frmAddEdit')"
                                              v-validate="''"
                                              data-vv-scope="frmAddEdit"
                                              data-vv-name="TenDangNhap"
                                              hide-details disabled
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
        </v-container>
</v-dialog>
</template>

<script lang="ts">
    import { Vue } from 'vue-property-decorator';
    import NhanVienApi, { NhanVienApiSearchParams } from '@/apiResources/NhanVienApi';
    import { NhanVien } from '@/models/NhanVien';
    import { BoPhan } from '@/models/BoPhan';
    import BoPhanApi, { BoPhanApiSearchParams } from '@/apiResources/BoPhanApi';

    export default Vue.extend({
        $_veeValidate: {
            validator: 'new'
        },
        components: {},
        data() {
            return {
                dialog: false,
                isUpdate: false,
                nhanVien: {} as NhanVien,
                dsBoPhan: [] as BoPhan[],
                dsBoPhanLoading: false,
                searchBoPhan: '',
                searchParamsBoPhan: { includeEntities: true } as BoPhanApiSearchParams,
                loading: false,
                searchParamsNhanVien: {} as NhanVienApiSearchParams,
            }
            
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
        created() {
            this.getDSBoPhan();
        },
        methods: {
            show(isUpdate: boolean, item: any) {
                this.dialog = true;
                this.isUpdate = isUpdate;
                this.nhanVien = item;
            },
            getDataFromApi(id: number): void {
                NhanVienApi.detail(id).then(res => {
                    this.nhanVien = res;
                });
            },
            save(): void {
                this.$validator.validateAll('frmAddEdit').then((res) => {
                   if (res) {
                        if (this.isUpdate) {
                            this.loading = true;
                            NhanVienApi.update(this.nhanVien.NhanVienID, this.nhanVien).then(res => {
                                this.loading = false;
                                this.dialog = false;
                                this.$snotify.success('Cập nhật thành công!');
                                this.$emit("getLaiDanhSach");
                            }).catch(res => {
                                this.loading = false;
                                this.$snotify.error('Cập nhật thất bại!');
                            });
                        } else {
                            this.loading = true;
                            NhanVienApi.insert(this.nhanVien).then(res => {
                                this.$router.push('/nhanvien/');
                                this.nhanVien = res;
                                this.isUpdate = true;
                                this.loading = false;
                                this.$snotify.success('Thêm mới thành công!');
                                this.dialog = false
                                this.$emit("getLaiDanhSach");
                            }).catch(res => {
                                this.loading = false;
                                this.$snotify.error('Thêm mới thất bại!');
                            });
                        }
                    }
                });
            },

            getDSBoPhan(): void {
                BoPhanApi.search(this.searchParamsBoPhan).then(res => {
                    this.dsBoPhan = res.Data;
                });
            },
        }
    });
</script>

