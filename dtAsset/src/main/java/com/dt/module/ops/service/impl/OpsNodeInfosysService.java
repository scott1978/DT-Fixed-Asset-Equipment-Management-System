package com.dt.module.ops.service.impl;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.dt.core.common.base.BaseService;
import com.dt.core.common.base.R;
import com.dt.core.dao.Rcd;
import com.dt.core.dao.RcdSet;
import com.dt.core.tool.util.ConvertUtil;
import com.dt.core.tool.util.ToolUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 服务实现类
 * </p>
 *
 * @author lank
 * @since 2020-03-06
 */
@Service
public class OpsNodeInfosysService extends BaseService {

    @Autowired
    OpsNodeService opsNodeService;
    public static String sql = "select  "
            + "(select name from sys_dict_item where dr='0' and dict_item_id=t.type and dict_id = 'sysinfotype' ) typestr,  "
            + "(select name from sys_dict_item where dr='0' and dict_item_id=t.opsmethod and dict_id = 'sysinfoops' )   opsmethodstr,  "
            + "(select name from sys_dict_item where dr='0' and dict_item_id=t.devmethod and dict_id = 'sysinfodev' ) devmethodstr,  "
            + "(select name from sys_dict_item where dr='0' and dict_item_id=t.grade and dict_id = 'sysinfograde' ) gradestr,  "
            + "t.* from ops_node_infosys t where dr=0 ";

    /**
     * @Description:搜索Ops数据
     * @param search
     */
    public R selectList(String search) {
        String sql = OpsNodeInfosysService.sql;
        if (ToolUtil.isNotEmpty(search)) {
            sql=sql+" and t.name like '%"+search+"%'";
        }
        sql = sql + " order by name";
        return R.SUCCESS_OPER(db.query(sql).toJsonArrayWithJsonObject());
    }

    /**
     * @Description:搜索Ops数据
     * @param id
     */
    public R queryTpData(String id) {
        String sql = OpsNodeInfosysService.sql;
        sql=sql+" and t.id=?";
        JSONObject res=new JSONObject();
        Rcd rs=db.uniqueRecord(sql,id);
        if(rs!=null){
            res=ConvertUtil.OtherJSONObjectToFastJSONObject(rs.toJsonObject());
            //获取主机
            String sql2 = OpsNodeService.sql;
            sql2=sql2+" and t.id in (select nodeid from ops_node_syshostmap where dr='0' and sysid=?) order by name";
            System.out.println(sql2);
            RcdSet host_rs=db.query(sql2,id);
            if(host_rs.size()>0){
                JSONArray host_arr=new JSONArray();
                for(int i=0;i<host_rs.size();i++){
                    JSONObject host=ConvertUtil.OtherJSONObjectToFastJSONObject(host_rs.getRcd(i).toJsonObject());
                    //查询中间件
                    String midstr=host_rs.getRcd(i).getString("middlewarestr");
                    if(midstr!=null&&midstr.length()>0){
                        String [] midarr=midstr.split(",");
                        JSONArray mid_arr=new JSONArray();
                        for(int j=0;j<midarr.length;j++){
                            JSONObject e=new JSONObject();
                            e.put("id",j);
                            e.put("name",midarr[j]);
                            mid_arr.add(e);
                        }
                        host.put("mid",mid_arr);
                    }
                    //查询数据库实例
                    String dbdtl=host_rs.getRcd(i).getString("sysdbdtlstr");
                    if(dbdtl!=null&&dbdtl.length()>0){
                        R dbdata=opsNodeService.selectDBList(null,host_rs.getRcd(i).getString("id"));
                        JSONArray dbarr=dbdata.queryDataToJSONArray();
                        host.put("dbinstance",dbarr);
                    }
                    host_arr.add(host);
                }
                res.put("hosts",host_arr);
            }
        }
        return R.SUCCESS_OPER(res);
    }


}
