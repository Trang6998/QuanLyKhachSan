<template>
    <v-flex xs12>
        <v-breadcrumbs divider="/" class="pa-0">
            <v-icon slot="divider">chevron_right</v-icon>
            <v-breadcrumbs-item>
                <v-btn flat class="ma-0" @click="$router.go(-1)" small><v-icon>arrow_back</v-icon> Quay lại</v-btn>
            </v-breadcrumbs-item>
            <v-breadcrumbs-item to="/chitietkiemke" exact>ChiTietKiemKe</v-breadcrumbs-item>
        </v-breadcrumbs>
        <v-card>
            <v-card-text>
                <v-layout row wrap>
                    <v-flex xs12>
                    <v-data-table :headers="tableHeader"
                                :items="dsChiTietKiemKe"
                                @update:pagination="getDataFromApi" :pagination.sync="searchParamsChiTietKiemKe"
                                :total-items="searchParamsChiTietKiemKe.totalItems"
                                :loading="loadingTable"
                                class="table-border table">
                        <template slot="items" slot-scope="props">
                    <td>{{ props.item.ChiTietKiemKeID }}</td>
                            <td>{{ props.item.KiemKe.KiemKeID }}</td>
                            <td>{{ props.item.VatDungPhong.VatDungPhongID }}</td>
                    <td>{{ props.item.SoLuongKiemKe }}</td>
                    <td>{{ props.item.GhiChu }}</td>
                    <td class="text-xs-center" style="width:80px;">
                        <v-btn flat icon small :to="'/chitietkiemke/'+props.item.ChiTietKiemKeID" class="ma-0">
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
                    <v-btn color="red darken-1" @click.native="deleteChiTietKiemKe" flat>Xác Nhận</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-flex>
</template>
<script lang="ts">
    import { Vue } from 'vue-property-decorator';
    import ChiTietKiemKeApi, { ChiTietKiemKeApiSearchParams } from '@/apiResources/ChiTietKiemKeApi';
    import { ChiTietKiemKe } from '@/models/ChiTietKiemKe';

    export default Vue.extend({
        components: {},
        data() {
            return {
                dsChiTietKiemKe: [] as ChiTietKiemKe[],
                tableHeader: [
                    { text: 'ChiTietKiemKeID', value: 'ChiTietKiemKeID', align: 'center', sortable: true },
                    { text: 'KiemKeID', value: 'KiemKe.KiemKeID', align: 'center', sortable: true },
                    { text: 'VatDungPhongID', value: 'VatDungPhong.VatDungPhongID', align: 'center', sortable: true },
                    { text: 'SoLuongKiemKe', value: 'SoLuongKiemKe', align: 'center', sortable: true },
                    { text: 'GhiChu', value: 'GhiChu', align: 'center', sortable: true },
                    { text: 'Thao tác', value: '#', align: 'center', sortable: false },
                ],
                searchParamsChiTietKiemKe: { includeEntities: true, rowsPerPage: 10 } as ChiTietKiemKeApiSearchParams,
                loadingTable: false,
                selectedChiTietKiemKe: {} as ChiTietKiemKe,
                dialogConfirmDelete: false,
            }
        },
        watch: {
        },
        created() {
            this.getDataFromApi(this.searchParamsChiTietKiemKe);
        },
        methods: {
            getDataFromApi(searchParamsChiTietKiemKe: ChiTietKiemKeApiSearchParams): void {
                this.loadingTable = true;
                ChiTietKiemKeApi.search(searchParamsChiTietKiemKe).then(res => {
                    this.dsChiTietKiemKe = res.Data;
                    this.searchParamsChiTietKiemKe.totalItems = res.Pagination.totalItems;
                    this.loadingTable = false;
                });
            },
            confirmDelete(chiTietKiemKe: ChiTietKiemKe): void {
                this.selectedChiTietKiemKe = chiTietKiemKe;
                this.dialogConfirmDelete = true;
            },
            deleteChiTietKiemKe(): void {
                ChiTietKiemKeApi.delete(this.selectedChiTietKiemKe.ChiTietKiemKeID).then(res => {
                    this.$snotify.success('Xóa thành công!');
                    this.getDataFromApi(this.searchParamsChiTietKiemKe);
                    this.dialogConfirmDelete = false;
                }).catch(res => {
                    this.$snotify.error('Xóa thất bại!');
                });
            },
        }
    });
</script>

