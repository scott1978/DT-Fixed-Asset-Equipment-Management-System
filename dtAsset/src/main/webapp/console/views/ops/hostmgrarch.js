
function syshostmgrArchCtl(DTOptionsBuilder, DTColumnBuilder, $compile, $confirm,
                       $log, notify, $scope, $http, $rootScope, $uibModal, $window, $state) {
    var pbtns = $rootScope.curMemuBtns;
    var gdicts = {};

    var setTabHeight=getDtTabHeight(500,450);
    var dicts = "nodebak,sysstatus,sysdb,sysdbdtl,sysenv,sysexecenv,syslevel,sysloc,sysmid,sysmonitor,sysos,sysosdtl,syspwdstrategy,systype";
    $http.post($rootScope.project + "/api/zc/queryDictFast.do", {
        dicts: dicts,
        uid: "hostmgr"
    }).success(function (res) {
        if (res.success) {
            gdicts = res.data;
            flush();
        } else {
            notify({
                message: res.message
            });
        }
    })
    $scope.dtOptions = DTOptionsBuilder.fromFnPromise().withDataProp('data')
        .withDOM('frtlpi').withPaginationType('full_numbers')
        .withDisplayLength(50).withOption("ordering", false).withOption(
            "responsive", false).withOption("searching", true)
        .withOption('scrollY', setTabHeight).withOption('scrollX', true)
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
        }).withButtons([{
            extend: 'colvis',
            text: '显示/隐藏列',
            columns: ':gt(0)',
            columnText: function (dt, idx, title) {
                return (idx ) + ': ' + title;
            }
        }, {
            extend: 'csv',
            text: 'Excel(当前页)',
            exportOptions: {
                columns: ':visible',
                trim: true,
                modifier: {
                    page: 'current'
                }
            }
        }, {
            extend: 'print',
            text: '打印',
            exportOptions: {
                columns: ':visible',
                stripHtml: false,
                columns: ':visible',
                modifier: {
                    page: 'current'
                }
            }
        }]);

    function stateChange(iColumn, bVisible) {
    }

    $scope.dtInstance = {}
    $scope.selectCheckBoxAll = function (selected) {
        if (selected) {
            $scope.dtInstance.DataTable.rows().select();
        } else {
            $scope.dtInstance.DataTable.rows().deselect();
        }
    }

    function statusRender(data, type, full) {
        if (angular.isDefined(data)) {
            if (data == "在线") {
                return "<span style='color:green'>" + data + "</span>"
            } else if (data == "下线") {
                return "<span style='color:red'>" + data + "</span>"
            } else {
                return data;
            }
        } else {
            return data;
        }
    }

    var ckHtml = '<input ng-model="selectCheckBoxValue" ng-click="selectCheckBoxAll(selectCheckBoxValue)" type="checkbox">';
    $scope.dtColumns = [];
    $scope.dtColumns.push(DTColumnBuilder.newColumn(null).withTitle(ckHtml)
        .withClass('select-checkbox checkbox_center').renderWith(
            function () {
                return ""
            }));
    $scope.dtColumns.push(DTColumnBuilder.newColumn('name').withTitle('名称')
        .withOption('sDefaultContent', '').withOption("width", '30'));
    $scope.dtColumns.push(DTColumnBuilder.newColumn('ip').withTitle('IP')
        .withOption('sDefaultContent', '').withOption("width", '30'));
    $scope.dtColumns.push(DTColumnBuilder.newColumn('systypestr').withTitle(
        '系统类型').withOption('sDefaultContent', ''));
    $scope.dtColumns.push(DTColumnBuilder.newColumn('statusstr')
        .withTitle('状态').withOption('sDefaultContent', '').renderWith(statusRender));
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
    $scope.dtColumns.push(DTColumnBuilder.newColumn('syspwdstrategystr')
        .withTitle('改密策略').withOption('sDefaultContent', ''));
    $scope.dtColumns.push(DTColumnBuilder.newColumn('leader').withTitle('负责人')
        .withOption('sDefaultContent', ''));
    $scope.dtColumns.push(DTColumnBuilder.newColumn('nodebackupstr').withTitle(
        '节点备份类型').withOption('sDefaultContent', ''));
    $scope.dtColumns.push(DTColumnBuilder.newColumn('nodebackupdtl').withTitle(
        '节点备份详情').withOption('sDefaultContent', ''));
    $scope.dtColumns.push(DTColumnBuilder.newColumn('sysexecenvstr').withTitle(
        '执行环境').withOption('sDefaultContent', ''));
    $scope.dtColumns.push(DTColumnBuilder.newColumn('syslevelstr').withTitle(
        '风险等级').withOption('sDefaultContent', ''));
    $scope.dtColumns.push(DTColumnBuilder.newColumn('sysenvstr').withTitle(
        '运行环境').withOption('sDefaultContent', ''));
    $scope.dtColumns.push(DTColumnBuilder.newColumn('label1').withTitle('标签1')
        .withOption('sDefaultContent', ''));
    $scope.dtColumns.push(DTColumnBuilder.newColumn('mark').withTitle('备注')
        .withOption('sDefaultContent', ''));
    $scope.dtColumns.push(DTColumnBuilder.newColumn('useradmin').withTitle(
        '系统用户').withOption('sDefaultContent', ''));
    $scope.dtColumns.push(DTColumnBuilder.newColumn('userops')
        .withTitle('运维用户').withOption('sDefaultContent', ''));
    $scope.dtColumns.push(DTColumnBuilder.newColumn('userapp')
        .withTitle('应用用户').withOption('sDefaultContent', ''));
    $scope.dtColumns.push(DTColumnBuilder.newColumn('userdb').withTitle(
        '数据库安装用户').withOption('sDefaultContent', ''));
    $scope.dtColumns.push(DTColumnBuilder.newColumn('userdbused').withTitle(
        '数据库使用用户').withOption('sDefaultContent', ''));
    $scope.dtColumns.push(DTColumnBuilder.newColumn('usermid').withTitle(
        '中间件用户').withOption('sDefaultContent', ''));
    $scope.dtColumns.push(DTColumnBuilder.newColumn('userother').withTitle(
        '其他用户').withOption('sDefaultContent', ''));
    $scope.dtColumns.push(DTColumnBuilder.newColumn('usernologin').withTitle(
        '未登陆用户').withOption('sDefaultContent', ''));
    $scope.query = function () {
        flush();
    }

    $scope.dtOptions.createdRow=function(nRow,aData,iDataIndex){
        if(aData.statusstr=='下线'){
            $(nRow).css("background-color", "#F78181"); //设置背景
        }
        $compile(angular.element(nRow).contents())($scope);
    }

    var meta = {
        tablehide: false,
        toolsbtn: [
            {
                id: "btn",
                label: "",
                type: "btn",
                show: true,
                template: ' <button ng-click="query()" class="btn btn-sm btn-primary" type="submit">查询</button>'
            }
            ],
        tools: [
            {
            id: "input",
            show: true,
            label: "内容",
            placeholder: "输入名称、IP",
            type: "input",
            ct: ""
        }

        ]
    };
    $scope.meta = meta;
    privNormalCompute($scope.meta.toolsbtn, pbtns);

    function flush() {
        var ps = {}
        ps.search = $scope.meta.tools[0].ct;
        $http.post($rootScope.project + "/api/ops/opsNode/ext/selectArchList.do",
            ps).success(function (res) {
            if (res.success) {
                $scope.dtOptions.aaData = res.data;
            } else {
                notify({
                    message: res.message
                });
            }
        })
    }





    $scope.detail = function () {
        var id = "";
        var selrow = getSelectRow();
        if (angular.isDefined(selrow)) {
            id = selrow.id;
        } else {
            return;
        }
        var ps = {};
        ps.id = id;
        var modalInstance = $uibModal.open({
            backdrop: true,
            templateUrl: 'views/cmdb/modal_dtl.html',
            controller: modalcmdbdtlCtl,
            size: 'blg',
            resolve: {
                meta: function () {
                    return ps;
                }
            }
        });
        modalInstance.result.then(function (result) {
            if (result == "OK") {
            }
        }, function (reason) {
        });
    }

    function getSelectRow() {
        var data = $scope.dtInstance.DataTable.rows({
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
            return $scope.dtOptions.aaData[data[0]];
        }
    }


};
app.register.controller('syshostmgrArchCtl', syshostmgrArchCtl);