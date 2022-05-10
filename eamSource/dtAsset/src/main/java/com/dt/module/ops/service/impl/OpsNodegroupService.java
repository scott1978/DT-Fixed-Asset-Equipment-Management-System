package com.dt.module.ops.service.impl;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.dt.core.common.base.BaseService;
import com.dt.core.common.base.R;
import com.dt.core.dao.Rcd;
import com.dt.core.dao.RcdSet;
import com.dt.core.tool.util.ConvertUtil;
import com.dt.core.tool.util.ToolUtil;
import com.dt.module.ops.entity.OpsNodegroup;
import com.dt.module.ops.mapper.OpsNodegroupMapper;
import com.dt.module.ops.service.IOpsNodegroupService;
import com.dt.module.zc.service.impl.AssetsConstant;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * <p>
 *  服务实现类
 * </p>
 *
 * @author lank
 * @since 2021-06-05
 */
@Service
public class OpsNodegroupService extends BaseService {


    private static Logger log = LoggerFactory.getLogger(OpsNodegroupService.class);

    public R queryTpDataByGroupIds(String ids) {
        if(ToolUtil.isOneEmpty(ids)){
            return R.FAILURE_NO_DATA();
        }
        String[] ids_arr=ids.split(",");
        JSONArray res=new JSONArray();
        for(int i=0;i<ids_arr.length;i++){
            String groupid=ids_arr[i];
            String sql2="select * from ops_nodegroup where dr='0' and id=?";
            Rcd rs=db.uniqueRecord(sql2,groupid);
            if(rs==null){
                return R.FAILURE_NO_DATA();
            }
            JSONObject obj=new JSONObject();
            obj= ConvertUtil.OtherJSONObjectToFastJSONObject( rs.toJsonObject());
            String sql = "select i.fnode ,i.id nodemapitemid," + AssetsConstant.resSqlbody + " t.*,(select name from sys_dict_item where dr='0' and dict_item_id=t.type) nodetypename from res t ,ops_nodegroup_item i where i.itemid=t.id and t.dr='0' and i.dr='0' and i.groupid=? order by fnode";
            obj.put("nodes",ConvertUtil.OtherJSONObjectToFastJSONArray(db.query(sql,groupid).toJsonArrayWithJsonObject()));
            res.add(obj);
        }
       return R.SUCCESS_OPER(res);
    }

    public R queryTpDataByGroupId(String id) {
        return queryTpDataByGroupIds(id);
    }

    public R queryGroupIdsBySystemId(String id) {
        String res="";
        RcdSet rs = db.query("select distinct loc from ops_node_infosys a, ops_node_syshostmap b,ops_node c where a.dr='0' and b.dr='0' and c.dr='0' and a.id=b.sysid and b.nodeid=c.id and a.id=?",id);
        for(int i=0;i<rs.size();i++){
            if(i==0){
                res=res+rs.getRcd(i).getString("loc");
            }else{
                res=res+","+rs.getRcd(i).getString("loc");
            }
        }
        return R.SUCCESS_OPER(res);
    }

    public R queryGroupIdByHostId(String id) {
        String res="";
        Rcd rs = db.uniqueRecord("select * from ops_node c where dr='0' and c.id=?",id);
        if(rs!=null){
            res=rs.getString("loc");
        }
        return R.SUCCESS_OPER(res);
    }

}