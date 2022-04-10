


function nodegroupSaveCtl($compile,$timeout, $localStorage, notify, $log, $uibModal,
                         $uibModalInstance, $scope, meta, $http, $rootScope) {
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.item={};

    if(angular.isDefined(meta.id)){
        $http.post($rootScope.project + "/api/ops/opsNodegroup/selectById.do", {id:meta.id})
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
        $http.post($rootScope.project + "/api/ops/opsNodegroup/insertOrUpdate.do", $scope.item)
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


function nodegroupCtl($window,DTOptionsBuilder, DTColumnBuilder, $compile,
                     $confirm, $log, notify, $scope, $http, $rootScope, $uibModal, $state) {

    var meta = {
        tablehide: false,
        tools: [
            // {
            //     id: "input",
            //     show: true,
            //     label: "内容",
            //     placeholder: "输入搜索内容",
            //     type: "input",
            //     ct: ""
            // },
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
                template: ' <button ng-click="save()" class="btn btn-sm btn-primary" type="submit">新增</button>'
            } ]
    }
    $scope.meta = meta;

    $scope.dtOptions = DTOptionsBuilder.fromFnPromise().withDataProp('data')
        .withPaginationType('full_numbers').withDisplayLength(50)
        .withOption("ordering", false).withOption("responsive", false)
        .withOption("searching", true).withOption('scrollY', 600)
        .withOption('scrollX', false).withOption('bAutoWidth', true)
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
            + "')\" class=\"btn-white btn btn-xs\">删除</button>   ";
        acthtml = acthtml + " <button ng-click=\"tp('" + full.id
            + "')\" class=\"btn-white btn btn-xs\">拓扑</button>   ";
        acthtml = acthtml + "</div>"
        return acthtml;
    }



    $scope.dtColumns = [
        DTColumnBuilder.newColumn('name').withTitle('名称').withOption(
            'sDefaultContent', ''),
        DTColumnBuilder.newColumn('busname').withTitle('业务说明').withOption(
            'sDefaultContent', ''),
        DTColumnBuilder.newColumn('ip').withTitle('IP').withOption(
            'sDefaultContent', ''),
        DTColumnBuilder.newColumn('mark').withTitle('备注').withOption(
            'sDefaultContent', ''),
        DTColumnBuilder.newColumn('id').withTitle('操作').withOption(
            'sDefaultContent', '').renderWith(renderAction)
    ]
    $scope.query = function () {
        flush();
    }


    function flush(){
        var ps={}
        ps.search = $scope.meta.tools[0].ct;
        $http.post(
            $rootScope.project
            + "/api/ops/opsNodegroup/selectList.do", ps)
            .success(function (res) {
                if (res.success) {
                    $scope.dtOptions.aaData=res.data;
                } else {
                    notify({
                        message: res.message
                    });
                }
            })

    }

    flush()


    $scope.save = function (id) {
        var meta = {};
        meta.id=id;
        var modalInstance = $uibModal.open({
            backdrop: true,
            templateUrl: 'views/cmdb/infrastructure/modal_nodegroupsave.html',
            controller:nodegroupSaveCtl ,
            size: 'lg',
            resolve: {
                meta: function () {
                    return meta;
                }
            }
        });
        modalInstance.result.then(function (result) {
            flush();
        }, function (reason) {
        });
    }

    $scope.tp = function (id) {
        $window.open($rootScope.project+"/console/views/cmdb/infrastructure/nodegroupview.html?id="+id);
    }


    $scope.row_del = function (id) {

        $confirm({
            text: '是否删除?'
        })
            .then(
                function () {
                    $http
                        .post(
                            $rootScope.project
                            + "/api/ops/opsNodegroup/deleteById.do",
                            {
                                id: id
                            })
                        .success(
                            function (res) {
                                flush()
                            })
                });
    }


};
app.register.controller('nodegroupCtl', nodegroupCtl);
