function sbpzSaveCtl(DTOptionsBuilder,DTColumnBuilder,$compile,$timeout, $localStorage, notify, $log, $uibModal,
                          $uibModalInstance, $scope, meta, $http, $rootScope) {
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.item={};

    $scope.dtOptions = DTOptionsBuilder.fromFnPromise().withDataProp('data')
        .withPaginationType('full_numbers').withDisplayLength(50)
        .withOption("ordering", false).withOption("responsive", false)
        .withOption("searching", true).withOption('scrollY', 600)
        .withOption('scrollX', true).withOption('bAutoWidth', true)
        .withOption('scrollCollapse', true).withOption('paging', true)
        .withOption('bStateSave', true).withOption('bProcessing', false)
        .withOption('bFilter', false).withOption('bInfo', true)
        .withOption('serverSide', false).withOption('createdRow', function (row) {
            $compile(angular.element(row).contents())($scope);
        }).withOption(
            'headerCallback',
            function (header) {
                if ((!angular.isDefined($scope.headerCompiled))
                    || $scope.headerCompiled) {
                    $scope.headerCompiled = true;
                    $compile(angular.element(header).contents())
                    ($scope);
                }
            }).withOption("select", {
            style: 'multi',
            selector: 'td:first-child'
        })
    $scope.dtInstance = {}

    $scope.selectCheckBoxAll = function (selected) {
        if (selected) {
            $scope.dtInstance.DataTable.rows().select();
        } else {
            $scope.dtInstance.DataTable.rows().deselect();
        }
    }
    $scope.dtOptions.aaData = [];
    $scope.dtInstance = {}
    var dtColumns = [];

    dtColumns.push(DTColumnBuilder.newColumn('id').withTitle('操作').withOption(
        'sDefaultContent', '').withOption("width", '100').renderWith(renderZCAction));
    dtColumns.push(DTColumnBuilder.newColumn('ip').withTitle('IP').withOption(
        'sDefaultContent', '').withOption("width", '30'));
    dtColumns.push(DTColumnBuilder.newColumn('uuid').withTitle('资产编号').withOption(
        'sDefaultContent', '').withOption("width", '30'));
    dtColumns.push(DTColumnBuilder.newColumn('classfullname').withTitle('资产类别').withOption(
        'sDefaultContent', '').withOption("width", '30'));
    dtColumns.push(DTColumnBuilder.newColumn('model').withTitle('规格型号').withOption(
        'sDefaultContent', '').withOption('width', '50'));
    dtColumns.push(DTColumnBuilder.newColumn('recyclestr').withTitle('资产状态').withOption(
        'sDefaultContent', '').withOption('width', '30').renderWith(renderZcRecycle));
    dtColumns.push(DTColumnBuilder.newColumn('supplierstr').withTitle('供应商').withOption(
        'sDefaultContent', '').withOption("width", '30'));
    dtColumns.push(DTColumnBuilder.newColumn('sn').withTitle('序列').withOption(
        'sDefaultContent', ''));
    dtColumns.push(DTColumnBuilder.newColumn('confdesc').withTitle('配置描述').withOption(
        'sDefaultContent', ''));
    dtColumns.push(DTColumnBuilder.newColumn('belongcomp_name').withTitle($rootScope.BELONGCOMP).withOption(
        'sDefaultContent', '').renderWith(renderDTFontColoPurpleH));
    dtColumns.push(DTColumnBuilder.newColumn('part_fullname').withTitle($rootScope.USEDPART).withOption(
        'sDefaultContent', '').renderWith(renderDTFontColoPurpleH));
    dtColumns.push(DTColumnBuilder.newColumn('used_username').withTitle($rootScope.USEDUSER).withOption(
        'sDefaultContent', '').renderWith(renderDTFontColoPurpleH));
    dtColumns.push(DTColumnBuilder.newColumn('locstr').withTitle('存放区域').withOption(
        'sDefaultContent', '').renderWith(renderDTFontColoPurpleH));
    dtColumns.push(DTColumnBuilder.newColumn('locdtl').withTitle('位置').withOption(
        'sDefaultContent', '').renderWith(renderZcLoc));
    dtColumns.push(DTColumnBuilder.newColumn('mark').withTitle('备注').withOption(
        'sDefaultContent', ''));
    $scope.dtColumns=dtColumns;

    function renderZCAction(data, type, full) {
        var acthtml = " <div class=\"btn-group\"> ";
        acthtml = acthtml + " <span ng-click=\"delitem('"
            + full.id
            + "')\" class=\"btn-white btn btn-xs\">删除</span>   ";

        acthtml = acthtml + "</div>"
        return acthtml;
    }

    $scope.delitem = function (id) {
        var del = 0;
        for (var i = 0; i < $scope.dtOptions.aaData.length; i++) {
            if ($scope.dtOptions.aaData[i].id == id) {
                del = i;
                break;
            }
        }
        $scope.dtOptions.aaData.splice(del, 1);
    }



    $scope.review = function () {
        var mdata = {};
        mdata.id = "";
        mdata.type = "many";
        mdata.datarange = "SBPZ";
        mdata.showusefullife = "true";
        var modalInstance = $uibModal.open({
            backdrop: true,
            templateUrl: 'views/cmdb/modal_common_zclist.html',
            controller: modal_common_ZcListCtl,
            size: 'blg',
            resolve: {
                data: function () {
                    return mdata
                }
            }
        });
        modalInstance.result.then(function (result) {
            $scope.dtOptions.aaData = result;
        }, function (reason) {
            $log.log("reason", reason)
        });
    }

    $scope.sure = function () {
        if($scope.dtOptions.aaData.length==0){
            alert("请选择设备");
            return;
        }
        $scope.item.items=angular.toJson($scope.dtOptions.aaData);
        $http.post($rootScope.project + "/api/zc/resVoucher/ext/batchUpdate.do", $scope.item)
            .success(function (res) {
                if (res.success) {
                    $uibModalInstance.close('OK');
                } else {
                    notify({
                        message: res.message
                    });
                }
            })

    };
}


function sbpzCtl($window,DTOptionsBuilder, DTColumnBuilder, $compile,
                      $confirm, $log, notify, $scope, $http, $rootScope, $uibModal, $state) {
    var setTabHeight=getDtTabHeight(500,350);
    var meta = {
        tablehide: false,
        tools: [
            {
                id: "input",
                show: true,
                label: "内容",
                placeholder: "输入型号、编号、序列号",
                type: "input",
                ct: ""
            },
            {

                id: "btn",
                label: "",
                type: "btn",
                show: true,
                priv: "select",
                template: ' <button ng-click="query()" class="btn btn-sm btn-primary" type="submit">查询</button>'
            },

            {
                id: "btn3",
                label: "",
                type: "btn",
                show: true,
                priv: "insert",
                template: ' <button ng-click="save()" class="btn btn-sm btn-primary" type="submit">编辑</button>'
            } ]
    }
    $scope.meta = meta;

    $scope.URL = $rootScope.project + "/api/zc/resVoucher/ext/selectPages.do";
    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withOption('ajax', {
            url: $scope.URL,
            type: 'POST',
            data: {classroot: "-1", start: 0, category: 3}
        })
        .withDataProp('data').withDataProp('data').withDOM('frtlpi').withPaginationType('full_numbers')
        .withDisplayLength(50)
        .withOption("ordering", false).withOption("responsive", false)
        .withOption("searching", false).withOption('scrollY', setTabHeight)
        .withOption('scrollX', true).withOption('bAutoWidth', true)
        .withOption('scrollCollapse', true).withOption('paging', true)
        .withOption('bStateSave', false).withOption('bProcessing', true)
        .withOption('bFilter', false).withOption('bInfo', true)
        .withOption('serverSide', true).withOption('createdRow', function (row) {
            $compile(angular.element(row).contents())($scope);
        }).withOption(
            'headerCallback',
            function (header) {
                if ((!angular.isDefined($scope.headerCompiled))
                    || $scope.headerCompiled) {
                    $scope.headerCompiled = true;
                    $compile(angular.element(header).contents())
                    ($scope);
                }
            });



    $scope.dtColumns = [
        DTColumnBuilder.newColumn('ip').withTitle('IP').withOption(
            'sDefaultContent', ''),
        DTColumnBuilder.newColumn('uuid').withTitle('资产编号').withOption(
            'sDefaultContent', '').withOption("width", '30'),
        DTColumnBuilder.newColumn('recyclestr').withTitle('资产状态').withOption(
            'sDefaultContent', '').withOption('width', '30').renderWith(renderZcRecycle),
        DTColumnBuilder.newColumn('classfullname').withTitle('资产类别').withOption(
            'sDefaultContent', '').withOption("width", '30'),
        DTColumnBuilder.newColumn('name').withTitle('资产名称').withOption(
            'sDefaultContent', '').withOption("width", '30'),
        DTColumnBuilder.newColumn('voucher').withTitle('凭证').withOption(
            'sDefaultContent', '').withOption("width", '30'),
        DTColumnBuilder.newColumn('vouchermark').withTitle('凭证备注').withOption(
            'sDefaultContent', '').withOption("width", '30'),
        DTColumnBuilder.newColumn('model').withTitle('规格型号').withOption(
            'sDefaultContent', '').withOption('width', '50'),
        DTColumnBuilder.newColumn('sn').withTitle('序列').withOption(
            'sDefaultContent', '').withOption('width', '50'),
        DTColumnBuilder.newColumn('supplierstr').withTitle('供应商').withOption(
                'sDefaultContent', '').withOption("width", '30'),
        DTColumnBuilder.newColumn('confdesc').withTitle('配置描述').withOption(
            'sDefaultContent', ''),
        DTColumnBuilder.newColumn('mark').withTitle('备注').withOption(
            'sDefaultContent', '')

    ]
    $scope.query = function () {
        flush();
    }


    function flush() {
        var ps = {}
        var time = new Date().getTime();
        ps.search = $scope.meta.tools[0].ct;
        ps.time = time;
        ps.category = 3;
        $scope.dtOptions.ajax.data = ps;
    }



    $scope.save = function () {
        var meta = {};
        var modalInstance = $uibModal.open({
            backdrop: true,
            templateUrl: 'views/cmdb/infrastructure/modal_sbpzSave.html',
            controller:sbpzSaveCtl ,
            size: 'lg',
            resolve: {
                meta: function () {
                    return "";
                }
            }
        });
        modalInstance.result.then(function (result) {
            flush();
        }, function (reason) {
        });
    }






};
app.register.controller('sbpzCtl', sbpzCtl);
