function nodemapsaveCtl($confirm,DTColumnBuilder,DTOptionsBuilder,$timeout, $localStorage, notify, $log, $uibModal,
                            $uibModalInstance, $scope, meta, $http, $rootScope,$compile) {

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

    $scope.dtColumns = [
        DTColumnBuilder.newColumn(null).withTitle(ckHtml)
            .withClass('select-checkbox checkbox_center').renderWith(
            function () {
                return ""
            }),
        DTColumnBuilder.newColumn('classfullname').withTitle('资产类型').withOption(
            'sDefaultContent', ''),
        DTColumnBuilder.newColumn('name').withTitle('名称').withOption(
            'sDefaultContent', ''),
        DTColumnBuilder.newColumn('uuid').withTitle('资产编号').withOption(
            'sDefaultContent', ''),
        DTColumnBuilder.newColumn('model').withTitle('型号').withOption(
            'sDefaultContent', ''),
        DTColumnBuilder.newColumn('ip').withTitle('IP').withOption(
            'sDefaultContent', ''),
        DTColumnBuilder.newColumn('confdesc').withTitle('配置描述').withOption(
            'sDefaultContent', ''),
        DTColumnBuilder.newColumn('mark').withTitle('备注').withOption(
            'sDefaultContent', '')]
        ;


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
    ps.groupid=meta.groupid;
    $http.post($rootScope.project + "/api/ops/opsNodegroupItem/ext/queryNodes.do", ps)
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
                        + "/api/ops/opsNodegroupItem/ext/addNodes.do", {
                            groupid:meta.groupid,
                            ids: selrows
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

function nodemapmetaupdateCtl($confirm,DTColumnBuilder,DTOptionsBuilder,$timeout, $localStorage, notify, $log, $uibModal,
                        $uibModalInstance, $scope, meta, $http, $rootScope,$compile) {

    console.log(meta);

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    $scope.fnodeOpt=[];
    $scope.fnodeSel=[];
    var ps={};
    ps.groupid=meta.groupid;
    var tmp=[];
    $http.post(
        $rootScope.project
        + "/api/ops/opsNodegroupItem/ext/queryNodeByGroupId.do", ps)
        .success(function (res) {
            if (res.success) {
                var e={id:"0",name:"根节点"};
                $scope.fnodeOpt.push(e);
                for(var i=0;i<res.data.length;i++){
                    var e={id:res.data[i].nodemapitemid,name:res.data[i].name+"_"+res.data[i].model+"_"+res.data[i].ip};
                    $scope.fnodeOpt.push(e);
                }
                $scope.fnodeSel.push($scope.fnodeOpt[0]);
            } else {
                notify({
                    message: res.message
                });
            }
        })

    $scope.sure = function () {
        var ps={};
        ps.ids=meta.ids;
        ps.fnode=angular.toJson( $scope.fnodeSel);
        $http.post(
            $rootScope.project
            + "/api/ops/opsNodegroupItem/ext/updateFNodes.do", ps).success(function (res) {
            if (res.success) {
                $uibModalInstance.close("OK");
            }
            notify({
                message: res.message
            });
        });
    };
}



function nodemapCtl($window,DTOptionsBuilder, DTColumnBuilder, $compile,
                        $confirm, $log, notify, $scope, $http, $rootScope, $uibModal,
                        $stateParams) {


    $scope.dtOptions = DTOptionsBuilder.fromFnPromise().withPaginationType(
        'full_numbers').withDisplayLength(50)
        .withOption("ordering", false).withOption("responsive", false)
        .withOption("searching", false).withOption("paging", false)
        .withOption('bStateSave', true).withOption('bProcessing', false)
        .withOption('bFilter', false).withOption('bInfo', false)
        .withOption('serverSide', false).withOption('bAutoWidth', true)
        .withOption('rowCallback', rowCallback).withOption('createdRow',
            function (row) {
                // Recompiling so we can bind Angular,directive to the
                $compile(angular.element(row).contents())($scope);
            }).withOption("select", {
            style: 'single'
        });

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

    function someClickHandler(data) {
        flushSubtab(data.id);
    }

    function renderMType(data, type, full) {
        if (data == "system") {
            return "系统";
        } else if (data == "biz") {
            return "业务";
        } else {
            return data;
        }
    }

    function renderMStatus(data, type, full) {
        if (data == "Y") {
            return "有效";
        } else if (data == "N") {
            return "无效";
        } else {
            return data;
        }
    }

    $scope.dtColumns = [
        DTColumnBuilder.newColumn('name').withTitle('设备组').withOption(
            'sDefaultContent', '')]
    $scope.dtInstance = {}

    function flush() {
        var ps = {};
        $http.post($rootScope.project + "/api/ops/opsNodegroup/selectList.do", ps)
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


    $scope.update = function () {
        var id = getSelectId();
        if (angular.isDefined(id)) {
            save(id)
        } else {
            notify({
                message: "请选择一行"
            });
        }
    }

    function getSelectId() {
        var data = $scope.dtInstance.DataTable.rows({
            selected: true
        })[0];
        // 没有选择,或选择多行都返回错误
        if (data.length == 0 || data.length > 1) {
            return;
        } else {
            return $scope.dtOptions.aaData[data[0]].id;
        }
    }

    /** ********************子表******************* */
    $scope.dtItemOptions = DTOptionsBuilder.fromFnPromise().withDataProp('data').withDOM('frtlpi')
        .withPaginationType('full_numbers').withDisplayLength(50)
        .withOption("ordering", false).withOption("responsive", false)
        .withOption("searching", true).withOption('scrollY', 500)
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
        });
    // $scope.dtItemOptions = DTOptionsBuilder.fromFnPromise().withPaginationType(
    //     'full_numbers').withDisplayLength(25).withOption("ordering", false)
    //     .withOption("responsive", false).withOption("searching", false)
    //     .withOption("paging", false).withOption('bStateSave', true)
    //     .withOption('bProcessing', true).withOption('bFilter', false)
    //     .withOption('bInfo', true).withOption('serverSide', false)
    //     .withOption('bAutoWidth', false).withOption('createdRow',
    //         function (row) {
    //             // Recompiling so we can bind Angular,directive to the
    //             $compile(angular.element(row).contents())($scope);
    //         }).withOption(
    //     'headerCallback',
    //     function (header) {
    //         if ((!angular.isDefined($scope.headerCompiled))
    //             || $scope.headerCompiled) {
    //             $scope.headerCompiled = true;
    //             $compile(angular.element(header).contents())
    //             ($scope);
    //         }
    //     }).withOption("select", {
    //     style: 'multi',
    //     selector: 'td:first-child'
    // });
    $scope.dtItemInstance = {}

    function renderAction(data, type, full) {
        var acthtml = " <div class=\"btn-group\"> ";

        // acthtml = acthtml + " <button ng-click=\"row_update('"
        //     + full.id
        //     + "')\" class=\"btn-white btn btn-xs\">更新</button>   ";

        acthtml = acthtml + " <button ng-click=\"row_dtl('"
            + full.nodemapitemid
            + "')\" class=\"btn-white btn btn-xs\">删除</button> ";

        acthtml = acthtml + "</div>"
        return acthtml;
    }
    function renderFnode(data, type, full) {
        var html="";
        var d=angular.fromJson(data);
        for(var i=0;i<d.length;i++){
            if(i==0){
                html=d[i].name;
            }else {
                html = html + "," + d[i].name;
            }
        }
        return html;
    }


    function getSelectItemRows() {
        var data = $scope.dtItemInstance.DataTable.rows({
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
                res.push($scope.dtItemOptions.aaData[data[i]].nodemapitemid)
            }
            return angular.toJson(res);
        }
    }

    var ckHtml = '<input ng-model="selectCheckBoxValue" ng-click="selectCheckBoxAll(selectCheckBoxValue)" type="checkbox">';

    $scope.dtItemColumns = [
        // DTColumnBuilder.newColumn('nodetypename').withTitle('设备类型').withOption(
        //     'sDefaultContent', ''),
        DTColumnBuilder.newColumn(null).withTitle(ckHtml)
            .withClass('select-checkbox checkbox_center').renderWith(
            function () {
                return ""
            }),
        DTColumnBuilder.newColumn('uuid').withTitle('资产编号').withOption(
            'sDefaultContent', ''),
        DTColumnBuilder.newColumn('classfullname').withTitle('资产类型').withOption(
            'sDefaultContent', ''),
        DTColumnBuilder.newColumn('name').withTitle('名称').withOption(
            'sDefaultContent', ''),
        DTColumnBuilder.newColumn('model').withTitle('型号').withOption(
            'sDefaultContent', ''),
        DTColumnBuilder.newColumn('ip').withTitle('IP').withOption(
            'sDefaultContent', ''),
        DTColumnBuilder.newColumn('fnode').withTitle('上联设备').withOption(
            'sDefaultContent', '').renderWith(renderFnode),
        DTColumnBuilder.newColumn('confdesc').withTitle('配置描述').withOption(
            'sDefaultContent', ''),
        // DTColumnBuilder.newColumn('bnodename').withTitle('下联设备').withOption(
        //     'sDefaultContent', ''),
        DTColumnBuilder.newColumn('id').withTitle('操作').withOption(
            'sDefaultContent', '').renderWith(renderAction)]
    function flushSubtab(id) {
        var ps = {
            groupid: id
        };
        // id不存在,则尝试从select中获取
        if (!angular.isDefined(id)) {
            ps.groupid = getSelectId();
        }
        // 如果还是不存在则报错
        if (!angular.isDefined(ps.groupid)) {
            notify({
                message: "ID不存在"
            });
            return;
        }
        $http.post(
            $rootScope.project
            + "/api/ops/opsNodegroupItem/ext/queryNodeByGroupId.do", ps)
            .success(function (res) {
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

    $scope.tp = function () {
        var id=getSelectId()
        if (!angular.isDefined(id)) {
            notify({
                message: "ID不存在"
            });
            return;
        }
        $window.open($rootScope.project+"/console/views/cmdb/infrastructure/nodegroupview.html?id="+id);
    }


    $scope.row_add = function () {
        var ps = {};
        var id=getSelectId()
        ps.groupid = id;
        if (!angular.isDefined(ps.groupid)) {
            notify({
                message: "ID不存在"
            });
            return;
        }
        var modalInstance = $uibModal.open({
            backdrop: true,
            templateUrl: 'views/cmdb/infrastructure/modal_nodemap.html',
            controller: nodemapsaveCtl,
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
    $scope.row_update = function () {
        var ps = {};
        var id=getSelectId()
        ps.groupid = id;
        if (!angular.isDefined(ps.groupid)) {
            notify({
                message: "ID不存在"
            });
            return;
        }
        //
        ps.ids=getSelectItemRows();
        if (!angular.isDefined(ps.ids)) {
            return;
        }
        var modalInstance = $uibModal.open({
            backdrop: true,
            templateUrl: 'views/cmdb/infrastructure/modal_nodemapUpdate.html',
            controller: nodemapmetaupdateCtl,
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
    $scope.row_dtl = function (id) {
        $confirm({
            text: '是否删除?'
        }).then(function () {
            $http.post($rootScope.project + "/api/ops/opsNodegroupItem/ext/deleteById.do", {
                id: id
            }).success(function (res) {
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
app.register.controller('nodemapCtl', nodemapCtl);