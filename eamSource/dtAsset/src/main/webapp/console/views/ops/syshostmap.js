
function syshostmapSaveCtl($confirm,$compile,DTColumnBuilder,DTOptionsBuilder,$timeout, $localStorage, notify, $log, $uibModal,
                           $uibModalInstance, $scope, meta, $http, $rootScope) {
    $scope.item = {};
    $scope.dtOptions = DTOptionsBuilder.fromFnPromise().withDataProp('data')
        .withDOM('frtlpi').withPaginationType('full_numbers')
        .withDisplayLength(50).withOption("ordering", false).withOption(
            "responsive", false).withOption("searching", true)
        .withOption('scrollY', 500).withOption('scrollX', true)
        .withOption('bAutoWidth', true).withOption('scrollCollapse', true)
        .withOption('paging', true).withOption('bStateSave', true).withOption('bProcessing', true)
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
        });

    function stateChange(iColumn, bVisible) {
    }
    $scope.dtInstance = {}
    $scope.dtColumns = [];
    var ckHtml = '<input ng-model="selectCheckBoxValue" ng-click="selectCheckBoxAll(selectCheckBoxValue)" type="checkbox">';
    $scope.dtColumns.push(DTColumnBuilder.newColumn(null).withTitle(ckHtml)
        .withClass('select-checkbox checkbox_center').renderWith(
            function () {
                return ""
            }));
    $scope.dtColumns.push(DTColumnBuilder.newColumn('name').withTitle('名称')
        .withOption('sDefaultContent', '').withOption("width", '30'));
    $scope.dtColumns.push(DTColumnBuilder.newColumn('ip').withTitle('IP')
        .withOption('sDefaultContent', '').withOption("width", '30'));
    $scope.dtColumns.push(DTColumnBuilder.newColumn('syslocstr')
        .withTitle('位置').withOption('sDefaultContent', ''));
    $scope.dtColumns.push(DTColumnBuilder.newColumn('sysmonitorstr').withTitle(
        '监控部署').withOption('sDefaultContent', ''));
    $scope.dtColumns.push(DTColumnBuilder.newColumn('sysosdtlstr').withTitle(
        '操作系统').withOption('sDefaultContent', ''));
    $scope.dtColumns.push(DTColumnBuilder.newColumn('sysdbdtlstr').withTitle(
        '数据库').withOption('sDefaultContent', ''));
    $scope.dtColumns.push(DTColumnBuilder.newColumn('middlewarestr').withTitle(
        '中间件').withOption('sDefaultContent', ''));


    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    function getSelectRows() {
        var data = $scope.dtInstance.DataTable.rows({
            selected: true
        })[0];
        if (data.length == 0) {
            notify({
                message: "请至少选择一项"
            });
            return;
        } else if (data.length > 1000) {
            notify({
                message: "不允许超过1000个"
            });
            return;
        } else {
            var res = [];
            for (var i = 0; i < data.length; i++) {
                res.push($scope.dtOptions.aaData[data[i]].id)
            }
            return angular.toJson(res);
        }
    }

    var ps={};
    ps.id=meta.id;
    $http.post($rootScope.project + "/api/ops/opsNodeSyshostmap/ext/selectNodeList.do", ps)
        .success(function (res) {
            if (res.success) {
                $scope.dtOptions.aaData =res.data;
            } else {
                notify({
                    message: res.message
                });
            }

        })



    $scope.sure = function () {
        var selrows = getSelectRows();
        if (angular.isDefined(selrows)) {
            $confirm({
                text: '是否添加?'
            }).then(
                function () {
                    $http.post(
                        $rootScope.project
                        + "/api/ops/opsNodeSyshostmap/ext/actionHostmap.do", {
                            id:meta.id,
                            items: selrows
                        }).success(function (res) {
                        if (res.success) {
                            $uibModalInstance.close("OK");
                        }
                        notify({
                            message: res.message
                        });
                    });
                });
        } else {
            return;
        }

    };
}

function syshostmapCtl(DTOptionsBuilder, DTColumnBuilder, $compile, $confirm,
                        $log, notify, $scope, $http, $rootScope, $uibModal, $stateParams,
                        $window) {
    // var dicts = "dbbktype,dbbkstatus,dbbkmethod,dbbkarchtype";
    // var gdicts = {};
    // $http.post($rootScope.project + "/api/zc/queryDictFast.do", {
    //     dicts: dicts,
    //     uid: "dbbackup"
    // }).success(function (res) {
    //     if (res.success) {
    //         gdicts = res.data;
    //     } else {
    //         notify({
    //             message: res.message
    //         });
    //     }
    // })
    var pbtns = $rootScope.curMemuBtns;
    var meta = {
        tablehide: false,
        toolsbtn: [],
        tools: [
            {
                id: "btn2",
                label: "",
                type: "btn",
                show: true,
                priv: "update",
                template: ' <button ng-click="save(0)" class="btn btn-sm btn-primary" type="submit">新增主机</button>'
            }
           ]
    };
    $scope.meta = meta;
    privNormalCompute($scope.meta.tools, pbtns);
    $scope.dtOptions = DTOptionsBuilder.fromFnPromise().withDataProp('data')
        .withPaginationType('full_numbers').withDisplayLength(50)
        .withOption("ordering", false).withOption("responsive", false)
        .withOption("searching", false).withOption('scrollX', true)
        .withOption('bAutoWidth', false).withOption('scrollCollapse', true)
        .withOption('paging', false).withOption('bStateSave', false)
        .withOption('bProcessing', false).withOption('bFilter', false)
        .withOption('bInfo', false).withOption('serverSide', false)
        .withOption('rowCallback', rowCallback).withOption('createdRow',
            function (row) {
                // Recompiling so we can bind Angular,directive to the
                $compile(angular.element(row).contents())($scope);
            }).withOption("select", {
            style: 'single'
        });
    $scope.dtInstance = {}

    function rowCallback(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
        // Unbind first in order to avoid any duplicate handler
        // (see https://github.com/l-lin/angular-datatables/issues/87)
        $('td', nRow).unbind('click');
        $('td', nRow).bind('click', function () {
            $scope.$apply(function () {
                someClickHandler(aData);
            });
        });
        return nRow;
    }

    var gid = ""

    function someClickHandler(data) {
        gid = data.id;
        flushSubtab(data.id);
    }

    $scope.dtColumns = [DTColumnBuilder.newColumn('name').withTitle('系统名称')
        .withOption('sDefaultContent', '')]

    function flush() {
        var ps = {};
        $http.post(
            $rootScope.project
            + "/api/ops/opsNodeInfosys/ext/selectList.do", ps)
            .success(function (res) {
                if (res.success) {
                    $scope.dtOptions.aaData = res.data;
                    $scope.dtItemOptions.aaData = [];
                } else {
                    notify({
                        message: res.message
                    });
                }
            })
    }
    flush();
    function getSelectId() {
        var data = $scope.dtInstance.DataTable.rows({
            selected: true
        })[0];
        // 没有选择,或选择多行都返回错误
        if (data.length == 0 || data.length > 1) {
            return;
        } else {
            return $scope.dtOptions.aaData[data[0]];
        }
    }

    /** ********************子表******************* */
    $scope.dtItemOptions = DTOptionsBuilder.fromFnPromise()
        .withDataProp('data').withDOM('frtlpi').withPaginationType(
            'full_numbers').withDisplayLength(50).withOption(
            "ordering", false).withOption("responsive", false)
        .withOption("searching", true).withOption('scrollY', 400)
        .withOption('scrollX', true).withOption('bAutoWidth', false)
        .withOption('scrollCollapse', true).withOption('paging', false)
        .withOption('bStateSave', false).withOption('bProcessing', false)
        .withOption('bFilter', false).withOption('bInfo', true)
        .withOption('serverSide', false).withOption('createdRow',
            function (row) {
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
        });
    $scope.dtItemInstance = {}
    $scope.selectCheckBoxAll = function (selected) {
        if (selected) {
            $scope.dtItemInstance.DataTable.rows().select();
        } else {
            $scope.dtItemInstance.DataTable.rows().deselect();
        }
    }
    var ckHtml = '<input ng-model="selectCheckBoxValue" ng-click="selectCheckBoxAll(selectCheckBoxValue)" type="checkbox">';

    function ColWidthRender(data, type, full) {
        // return "<span style=\"white-space:normal;word-break:break-all;\">"
        // + data + "</span>";
        return data;
    }

    function ColWidthHHRender(data, type, full) {
        return "<span style=\"white-space:normal!important;word-break:break-all!important;\">"
            + data + "</span>";
    }


    $scope.dtItemColumns = [];
    var ckHtml = '<input ng-model="selectCheckBoxValue" ng-click="selectCheckBoxAll(selectCheckBoxValue)" type="checkbox">';
    $scope.dtItemColumns.push(DTColumnBuilder.newColumn(null).withTitle(ckHtml)
        .withClass('select-checkbox checkbox_center').renderWith(
            function () {
                return ""
            }));
    $scope.dtItemColumns.push(DTColumnBuilder.newColumn('name').withTitle('名称')
        .withOption('sDefaultContent', '').withOption("width", '30'));
    $scope.dtItemColumns.push(DTColumnBuilder.newColumn('ip').withTitle('IP')
        .withOption('sDefaultContent', '').withOption("width", '30'));
    $scope.dtItemColumns.push(DTColumnBuilder.newColumn('syslocstr')
        .withTitle('位置').withOption('sDefaultContent', ''));
    $scope.dtItemColumns.push(DTColumnBuilder.newColumn('sysmonitorstr').withTitle(
        '监控部署').withOption('sDefaultContent', ''));
    $scope.dtItemColumns.push(DTColumnBuilder.newColumn('sysosdtlstr').withTitle(
        '操作系统').withOption('sDefaultContent', ''));
    $scope.dtItemColumns.push(DTColumnBuilder.newColumn('sysdbdtlstr').withTitle(
        '数据库').withOption('sDefaultContent', ''));
    $scope.dtItemColumns.push(DTColumnBuilder.newColumn('middlewarestr').withTitle(
        '中间件').withOption('sDefaultContent', ''));


    function flushSubtab(id) {
        var ps = {
            id: id
        };
        // id不存在,则尝试从select中获取
        if (!angular.isDefined(id)) {
            var node = getSelectId();
            ps.id = node.id;
        }
        // 如果还是不存在则报错
        if (!angular.isDefined(ps.id)) {
            notify({
                message: "ID不存在"
            });
            return;
        }
        $http.post($rootScope.project + "/api/ops/opsNodeSyshostmap/ext//selectSelectNodeList.do",
            ps).success(function (res) {
            if (res.success) {
                $scope.dtItemOptions.aaData = res.data;
            } else {
                notify({
                    message: res.message
                });
            }
        })
    }

    function getSelectRowSubTab() {
        var data = $scope.dtItemInstance.DataTable.rows({
            selected: true
        })[0];
        if (data.length == 0) {
            notify({
                message: "请至少选择一项"
            });
            return;
        } else if (data.length > 1) {
            notify({
                message: "请最多选择一项"
            });
            return;
        } else {
            return $scope.dtItemOptions.aaData[data[0]];
        }
    }

    $scope.query = function () {
        $http.post($rootScope.project + "/api/ops/opsNode/ext/selectDBList.do",
            {}).success(function (res) {
            if (res.success) {
                $scope.dtItemOptions.aaData = res.data;
            } else {
                notify({
                    message: res.message
                });
            }
        })
    }
    $scope.itemquery = function () {
        flushSubtab();
    }
    $scope.save = function (type) {
        var ps = {};
        if (type == "1") {
            var node = getSelectRowSubTab();
            if (!angular.isDefined(node)) {
                return;
            }
            ps = node;
        } else {
            var node = getSelectId();
            if (!angular.isDefined(node)) {
                notify({
                    message: "请先选择系统"
                });
                return;
            }
            ps.id = node.id;
        }
        var modalInstance = $uibModal.open({
            backdrop: true,
            templateUrl: 'views/ops/modal_syshostmapSave.html',
            controller: syshostmapSaveCtl,
            size: 'lg',
            resolve: {
                meta: function () {
                    return ps;
                }
            }
        });
        modalInstance.result.then(function (result) {
            if (result == "OK") {
                flushSubtab();
            }
        }, function (reason) {
        });
    }

    $scope.itemdel = function () {
        var node = getSelectRowSubTab();
        if (!angular.isDefined(node)) {
            return;
        }
        var ps={};
        var ids=[];
        ids.push(node.id);
        ps.ids=angular.toJson(ids);

        var node = getSelectId();
        if (!angular.isDefined(node)) {
            notify({
                message: "请先选择系统"
            });
            return;
        }
        ps.id = node.id;
        $confirm({
            text: '是否删除?'
        }).then(
            function () {
                $http.post(
                    $rootScope.project
                    + "/api/ops/opsNodeSyshostmap/ext/deleteHostmaps.do", ps).success(function (res) {
                    if (res.success) {
                        flushSubtab();
                    }
                    notify({
                        message: res.message
                    });
                })
            });
    }
};
app.register.controller('syshostmapCtl', syshostmapCtl);