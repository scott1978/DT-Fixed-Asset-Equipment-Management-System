function pzdjSaveCtl($compile,$timeout, $localStorage, notify, $log, $uibModal,
                          $uibModalInstance, $scope, meta, $http, $rootScope) {
    console.log(meta);
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.item={};
    if(angular.isDefined(meta.id)){
        $http.post($rootScope.project + "/api/zc/resVoucher/ext/selectById.do", {id:meta.id})
            .success(function (res) {
                if (res.success) {
                   $scope.item=res.data;
                } else {
                    notify({
                        message: res.message
                    });
                }
            })
    }
    $scope.sure = function () {
        $http.post($rootScope.project + "/api/zc/resVoucher/ext/customInsertOrUpdate.do", $scope.item)
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


function pzdjCtl($window,DTOptionsBuilder, DTColumnBuilder, $compile,
                      $confirm, $log, notify, $scope, $http, $rootScope, $uibModal, $state) {
    var setTabHeight=getDtTabHeight(500,350);
    var meta = {
        tablehide: false,
        tools: [

            {

                id: "btn",
                label: "",
                type: "btn",
                show: true,
                priv: "select",
                template: ' <button ng-click="query()" class="btn btn-sm btn-primary" type="submit">刷新</button>'
            },
            {
                id: "btn3",
                label: "",
                type: "btn",
                show: true,
                priv: "insert",
                template: ' <button ng-click="save()" class="btn btn-sm btn-primary" type="submit">新增</button>'
            } ]
    }
    $scope.meta = meta;

    $scope.dtOptions = DTOptionsBuilder.fromFnPromise().withDataProp('data')
        .withPaginationType('full_numbers').withDisplayLength(50)
        .withOption("ordering", false).withOption("responsive", false)
        .withOption("searching", true)
        .withOption('scrollX', true).withOption('bAutoWidth', true)
        .withOption('scrollCollapse', true).withOption('paging', true)
        .withOption('bStateSave', true).withOption('bProcessing', false)
        .withOption('bFilter', false).withOption('bInfo', true)
        .withOption('serverSide', false).withOption('createdRow', function (row) {
            $compile(angular.element(row).contents())($scope);
        })

    $scope.dtInstance = {}

    function renderAction(data, type, full) {
        var acthtml = " <div class=\"btn-group\"> ";
        acthtml = acthtml + " <button ng-click=\"save('" + full.id
            + "')\" class=\"btn-white btn btn-xs\">更新</button> ";
        acthtml = acthtml + " <button ng-click=\"row_del('" + full.id
            + "')\" class=\"btn-white btn btn-xs\">删除</button>";
        acthtml = acthtml + "</div>";
        return acthtml;
    }

    $scope.dtColumns = [
        DTColumnBuilder.newColumn('name').withTitle('名称').withOption(
            'sDefaultContent', ''),
        DTColumnBuilder.newColumn('category').withTitle('分类').withOption(
            'sDefaultContent', ''),
        DTColumnBuilder.newColumn('voucher').withTitle('凭证').withOption(
            'sDefaultContent', ''),
        DTColumnBuilder.newColumn('vouchermark').withTitle('凭证备注').withOption(
            'sDefaultContent', ''),
        DTColumnBuilder.newColumn('id').withTitle('操作').withOption(
            'sDefaultContent', '').withOption("width", '100').renderWith(renderAction)]



    $scope.query = function () {
        flush();
    }


    function flush() {
        $http.post($rootScope.project + "/api/zc/resVoucher/ext/customSelectList.do",
            {}).success(function (res) {
            if (res.success) {
                $scope.dtOptions.aaData = res.data;
            } else {
                notify({
                    message: res.message
                });
            }
        })
    }
    flush();

    $scope.row_del = function (id) {
        $confirm({
            text: '是否删除?'
        }).then(function () {
            $http.post($rootScope.project + "/api/zc/resVoucher/ext/deleteById.do", {
                id: id
            }).success(function (res) {
                if (res.success) {
                    flush();
                }
                notify({
                    message: res.message
                });
            })
        });
    }

    $scope.save = function (id) {
        var meta = {};
        var modalInstance = $uibModal.open({
            backdrop: true,
            templateUrl: 'views/cmdb/infrastructure/modal_pzdjSave.html',
            controller:pzdjSaveCtl ,
            size: 'lg',
            resolve: {
                meta: function () {
                    return {id:id};
                }
            }
        });
        modalInstance.result.then(function (result) {
            flush();
        }, function (reason) {
        });
    }
};
app.register.controller('pzdjCtl', pzdjCtl);
