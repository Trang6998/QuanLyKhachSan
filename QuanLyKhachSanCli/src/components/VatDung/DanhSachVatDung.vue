<template>
        <v-card width="100%" style="padding: 20px">
            <v-layout row wrap>
                <v-layout row wrap>
                    <v-flex xs12>
                        <h3>Danh sách vật dụng</h3>
                    </v-flex>
                    <v-flex xs12>
                        <v-layout norwap>
                            <v-flex xs6 md4>
                                <v-text-field label="Tìm kiếm"
                                              append-icon="search"
                                              ma-0 pa-0 hide-details
                                              style="padding-top: 0px"
                                              v-model="searchParamsVatDung.tenVatDung"
                                              @input="getDataFromApi(searchParamsVatDung)">

                                </v-text-field>
                            </v-flex>
                            <v-spacer></v-spacer>
                            <v-btn small @click="showModalThemSua(false,{})" style="margin-top: auto" color="primary">+ Thêm mới</v-btn>
                        </v-layout>
                    </v-flex>
                    <v-flex xs12>
                        <v-data-table :headers="tableHeader"
                                      :items="dsVatDung"
                                      @update:pagination="getDataFromApi" :pagination.sync="searchParamsVatDung"
                                      :total-items="searchParamsVatDung.totalItems"
                                      :loading="loadingTable"
                                      class="table-border table">
                            <template slot="items" slot-scope="props">
                                <td class="text-xs-center">{{ props.index + 1 }}</td>
                                <td class="text-xs-center">{{ props.item.TenVatDung }}</td>
                                <td class="text-xs-center">{{ props.item.SoLuongKho }}</td>
                                <td class="text-xs-center">{{ props.item.MoTa }}</td>
                                <td class="text-xs-center" style="width:80px;">
                                    <v-btn flat icon small @click="showModalThemSua(true, props.item)" class="ma-0">
                                        <v-icon small>edit</v-icon>
                                    </v-btn>
                                    <v-btn flat color="red" icon small class="ma-0" @click="confirmDelete(props.item)">
                                        <v-icon small>delete</v-icon>
                                    </v-btn>
                                </td>
                            </template>
                        </v-data-table>
                    </v-flex>
                </v-layout>
                <v-dialog v-model="dialogConfirmDelete" max-width="290">
                    <v-card>
                        <v-card-title class="headline">Xác nhận xóa</v-card-title>
                        <v-card-text class="pt-3">Bạn có chắc chắn muốn xóa?</v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn @click.native="dialogConfirmDelete=false" flat>Hủy</v-btn>
                            <v-btn color="red darken-1" @click.native="deleteVatDung" flat>Xác Nhận</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <them-sua-vat-dung ref="themSuaVatDung" @getLaiDanhSach="getDataFromApi(searchParamsVatDung)"></them-sua-vat-dung>
            </v-layout>
        </v-card>
</template>
<script lang="ts">
    import { Vue } from 'vue-property-decorator';
    import VatDungApi, { VatDungApiSearchParams } from '@/apiResources/VatDungApi';
    import { VatDung } from '@/models/VatDung';
    import ThemSuaVatDung from './ThemSuaVatDung.vue';

    export default Vue.extend({
        components: {
           ThemSuaVatDung
        },
        data() {
            return {
                dsVatDung: [] as VatDung[],
                tableHeader: [
                    { text: 'STT', value: 'VatDungID', align: 'center', sortable: true },
                    { text: 'Tên vật dụng', value: 'TenVatDung', align: 'center', sortable: true },
                    { text: 'Số lượng kho', value: 'SoLuongKho', align: 'center', sortable: true },
                    { text: 'Mô tả', value: 'MoTa', align: 'center', sortable: true },
                    { text: 'Thao tác', value: '#', align: 'center', sortable: false },
                ],
                searchParamsVatDung: { includeEntities: true, rowsPerPage: 10 } as VatDungApiSearchParams,
                loadingTable: false,
                selectedVatDung: {} as VatDung,
                dialogConfirmDelete: false,
            }
        },
        watch: {
        },
        created() {
            this.getDataFromApi(this.searchParamsVatDung);
        },
        methods: {
            getDataFromApi(searchParamsVatDung: VatDungApiSearchParams): void {
                this.loadingTable = true;
                VatDungApi.search(searchParamsVatDung).then(res => {
                    this.dsVatDung = res.Data;
                    this.searchParamsVatDung.totalItems = res.Pagination.totalItems;
                    this.loadingTable = false;
                });
            },

            showModalThemSua(isUpdate: boolean, item: any) { // refs gọi từ cha -=> con 
                (this.$refs.themSuaVatDung as any).show(isUpdate, item); // gọi đến hàm show bên modal con
            },

            confirmDelete(vatDung: VatDung): void {
                this.selectedVatDung = vatDung;
                this.dialogConfirmDelete = true;
            },
            deleteVatDung(): void {
                VatDungApi.delete(this.selectedVatDung.VatDungID).then(res => {
                    this.$snotify.success('Xóa thành công!');
                    this.getDataFromApi(this.searchParamsVatDung);
                    this.dialogConfirmDelete = false;
                }).catch(res => {
                    this.$snotify.error('Xóa thất bại!');
                });
            },
        }
    });
</script>

