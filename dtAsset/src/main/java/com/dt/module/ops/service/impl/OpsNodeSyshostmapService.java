package com.dt.module.ops.service.impl;

import com.alibaba.fastjson.JSONArray;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.dt.core.common.base.BaseService;
import com.dt.core.common.base.R;
import com.dt.core.dao.Rcd;
import com.dt.core.dao.sql.Delete;
import com.dt.core.dao.sql.Insert;
import com.dt.core.tool.util.ToolUtil;
import com.dt.module.ops.entity.OpsNodeSyshostmap;
import com.dt.module.ops.mapper.OpsNodeSyshostmapMapper;
import com.dt.module.ops.service.IOpsNodeSyshostmapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * <p>
 * 系统主机映射 服务实现类
 * </p>
 *
 * @author lank
 * @since 2021-04-30
 */
@Service
public class OpsNodeSyshostmapService extends BaseService {

    @Autowired
    IOpsNodeSyshostmapService OpsNodeSyshostmapServiceImpl;

    public R selectNodeList(String id) {
        String sql = OpsNodeService.sql;
        sql=sql+" and t.id not in (select nodeid from ops_node_syshostmap where dr='0' and sysid=?) order by name";
        return R.SUCCESS_OPER(db.query(sql,id).toJsonArrayWithJsonObject());
    }

    public R selectSelectNodeList(String id) {
        String sql = OpsNodeService.sql;
        sql=sql+" and t.id in (select nodeid from ops_node_syshostmap where dr='0' and sysid=?) order by name";
        return R.SUCCESS_OPER(db.query(sql,id).toJsonArrayWithJsonObject());
    }

    public R actionHostmap(String sysid,String items) {
        JSONArray ids_arr=JSONArray.parseArray(items);
        for(int i=0;i<ids_arr.size();i++){
            Insert ins=new Insert("ops_node_syshostmap");
            ins.set("dr","0");
            ins.setIf("nodeid",ids_arr.getString(i));
            ins.setIf("sysid",sysid);
            ins.set("id",db.getUUID());
            db.execute(ins);
        }
        return R.SUCCESS_OPER();
    }

    public R deleteHostmaps(String id,String ids) {
        JSONArray ids_arr=JSONArray.parseArray(ids);
        for(int i=0;i<ids_arr.size();i++){
            Delete dls=new Delete("ops_node_syshostmap");
            dls.where().and("nodeid=?",ids_arr.getString(i)).and("sysid=?",id);
            db.execute(dls);
        }
        return R.SUCCESS_OPER();
    }

    public R querySysIdByHostId(String id) {
        Rcd rs=db.uniqueRecord("select * from ops_node_syshostmap where nodeid=?",id);
        if(rs==null){
            return R.FAILURE_NO_DATA();
        }
        return R.SUCCESS_OPER(rs.toJsonObject());
    }
}

