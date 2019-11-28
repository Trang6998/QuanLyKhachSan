<template>
    <v-flex xs12>
        <v-breadcrumbs divider="/" class="pa-0">
            <v-icon slot="divider">chevron_right</v-icon>
            <v-breadcrumbs-item>
                <v-btn flat class="ma-0" @click="$router.go(-1)" small><v-icon>arrow_back</v-icon> Quay lại</v-btn>
            </v-breadcrumbs-item>
            <v-breadcrumbs-item to="/thuephong" exact>ThuePhong</v-breadcrumbs-item>
            <v-breadcrumbs-item>{{isUpdate?'Cập nhật':'Thêm mới'}}</v-breadcrumbs-item>
        </v-breadcrumbs>
        <v-card>
            <v-card-text>
                <v-form scope="frmAddEdit">
                    <v-layout row wrap>
                        <v-flex xs6 sm4 md3>
                            <v-autocomplete v-model="thuePhong.PhongID"
                            :items="dsPhong"
                            :loading="dsPhongLoading"
                            :search-input.sync="searchPhong"
                            item-text="PhongID"
                            item-value="PhongID"
                            label="PhongID"
                            placeholder="Nhập PhongID"
                            :error-messages="errors.collect('PhongID', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="PhongID"
                            clearable
                            ></v-autocomplete>
                        </v-flex>
                        <v-flex xs6 sm4 md3>
                            <v-autocomplete v-model="thuePhong.HoaDonID"
                            :items="dsHoaDon"
                            :loading="dsHoaDonLoading"
                            :search-input.sync="searchHoaDon"
                            item-text="HoaDonID"
                            item-value="HoaDonID"
                            label="HoaDonID"
                            placeholder="Nhập HoaDonID"
                            :error-messages="errors.collect('HoaDonID', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="HoaDonID"
                            clearable
                            ></v-autocomplete>
                        </v-flex>
                        <v-flex xs6 sm4 md3>
                            <v-text-field
                            v-model="thuePhong.ThoiGianNhanPhong"
                            label="ThoiGianNhanPhong"
                            type="datetime-local"
                            :error-messages="errors.collect('ThoiGianNhanPhong', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="ThoiGianNhanPhong"
                            hide-details
                            clearable
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs6 sm4 md3>
                            <v-text-field
                            v-model="thuePhong.ThoiGianTraPhong"
                            label="ThoiGianTraPhong"
                            type="datetime-local"
                            :error-messages="errors.collect('ThoiGianTraPhong', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="ThoiGianTraPhong"
                            hide-details
                            clearable
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs6 sm4 md3>
                            <v-autocomplete v-model="thuePhong.BangGiaID"
                            :items="dsBangGia"
                            :loading="dsBangGiaLoading"
                            :search-input.sync="searchBangGia"
                            item-text="BangGiaID"
                            item-value="BangGiaID"
                            label="BangGiaID"
                            placeholder="Nhập BangGiaID"
                            :error-messages="errors.collect('BangGiaID', 'frmAddEdit')"
                            v-validate="''"
                            data-vv-scope="frmAddEdit"
                            data-vv-name="BangGiaID"
                            clearable
                            ></v-autocomplete>
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
    import ThuePhongApi, { ThuePhongApiSearchParams } from '@/apiResources/ThuePhongApi';
    import { ThuePhong } from '@/models/ThuePhong';

    export default Vue.extend({
        $_veeValidate: {
            validator: 'new'
        },
        components: {},
        data() {
            return {
                isUpdate: false,
                thuePhong: {} as ThuePhong,
                loading: false,
                searchParamsThuePhong: {} as ThuePhongApiSearchParams,
            }
        },
        watch: {
        },
        mounted() {
            if (this.$route.name === 'suaThuePhong') {
                this.isUpdate = true;
                let id = parseInt(this.$route.params.id, 10);
                this.getDataFromApi(id);
            } else {
                this.isUpdate = false;
            }
        },
        methods: {
            getDataFromApi(id: number): void {
                ThuePhongApi.detail(id).then(res => {
                    this.thuePhong = res;
                });
            },
            save(): void {
                this.$validator.validateAll('frmAddEdit').then((res) => {
                   if (res) {
                        this.thuePhong.BangGia = undefined;
                        this.thuePhong.HoaDon = undefined;
                        this.thuePhong.Phong = undefined;
                        if (this.isUpdate) {
                            let id = parseInt(this.$route.params.id, 10);
                            this.loading = true;
                            ThuePhongApi.update(id, this.thuePhong).then(res => {
                                this.loading = false;
                                this.$snotify.success('Cập nhật thành công!');
                            }).catch(res => {
                                this.loading = false;
                                this.$snotify.error('Cập nhật thất bại!');
                            });
                        } else {
                            this.loading = true;
                            ThuePhongApi.insert(this.thuePhong).then(res => {
                                this.$router.push('/thuephong/' + res.ThuePhongID);
                                this.thuePhong = res;
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

