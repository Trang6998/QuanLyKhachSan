<template>
    <v-flex xs12>
        <v-breadcrumbs divider="/" class="pa-0">
            <v-icon slot="divider">chevron_right</v-icon>
            <v-breadcrumbs-item>
                <v-btn flat class="ma-0" @click="$router.go(-1)" small><v-icon>arrow_back</v-icon> Quay lại</v-btn>
            </v-breadcrumbs-item>
            <v-breadcrumbs-item to="/vatdung" exact>VatDung</v-breadcrumbs-item>
        </v-breadcrumbs>
        <v-card>
            <v-card-text>
                <v-layout row wrap>
                    <v-flex xs12>
                    <v-data-table :headers="tableHeader"
                                :items="dsVatDung"
                                @update:pagination="getDataFromApi" :pagination.sync="searchParamsVatDung"
                                :total-items="searchParamsVatDung.totalItems"
                                :loading="loadingTable"
                                class="table-border table">
                        <template slot="items" slot-scope="props">
                    <td>{{ props.item.VatDungID }}</td>
                    <td>{{ props.item.TenVatDung }}</td>
                    <td>{{ props.item.SoLuongKho }}</td>
                    <td>{{ props.item.MoTa }}</td>
                    <td class="text-xs-center" style="width:80px;">
                        <v-btn flat icon small :to="'/vatdung/'+props.item.VatDungID" class="ma-0">
                            <v-icon small>edit</v-icon>
                        </v-btn>
                        <v-btn flat color="red" icon small class="ma-0" @click="confirmDelete(props.item)">
                            <v-icon small>delete</v-icon>
                        </v-btn>
                    </td>
                            </template>
                        </v-data-table>
                    </v-flex xs12>
                </v-layout>
            </v-card-text>
        </v-card>
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
    </v-flex>
</template>
<script lang="ts">
    import { Vue } from 'vue-property-decorator';
    import VatDungApi, { VatDungApiSearchParams } from '@/apiResources/VatDungApi';
    import { VatDung } from '@/models/VatDung';

    export default Vue.extend({
        components: {},
        data() {
            return {
                dsVatDung: [] as VatDung[],
                tableHeader: [
                    { text: 'VatDungID', value: 'VatDungID', align: 'center', sortable: true },
                    { text: 'TenVatDung', value: 'TenVatDung', align: 'center', sortable: true },
                    { text: 'SoLuongKho', value: 'SoLuongKho', align: 'center', sortable: true },
                    { text: 'MoTa', value: 'MoTa', align: 'center', sortable: true },
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

