package com.dt.module.ops.controller;


import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.dt.core.annotion.Acl;
import com.dt.core.common.base.BaseController;
import com.dt.core.common.base.R;
import com.dt.core.dao.Rcd;
import com.dt.core.tool.util.ConvertUtil;
import com.dt.core.tool.util.DbUtil;
import com.dt.core.tool.util.ToolUtil;
import com.dt.module.ops.entity.OpsNodegroup;
import com.dt.module.ops.service.IOpsNodegroupService;
import com.dt.module.ops.service.impl.OpsNodegroupService;
import com.dt.module.zc.service.impl.AssetsConstant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * <p>
 *  前端控制器
 * </p>
 *
 * @author lank
 * @since 2021-06-05
 */
@Controller
@RequestMapping("/api/ops/opsNodegroup/ext")
public class OpsNodegroupExtController extends BaseController {


	@Autowired
	OpsNodegroupService opsNodegroupService;

	@Autowired
	IOpsNodegroupService OpsNodegroupServiceImpl;

	@ResponseBody
	@Acl(info = "查询所有,无分页", value = Acl.ACL_USER)
	@RequestMapping(value = "/selectList.do")
	public R selectList() {
		return R.SUCCESS_OPER(OpsNodegroupServiceImpl.list(null));
	}

	@ResponseBody
	@Acl(info = "更新节点", value = Acl.ACL_USER)
	@RequestMapping(value = "/queryGroupIdsBySystemId.do")
	public R queryGroupIdsBySystemId(String id) {
		return opsNodegroupService.queryGroupIdsBySystemId(id);
	}

	@ResponseBody
	@Acl(info = "更新节点", value = Acl.ACL_USER)
	@RequestMapping(value = "/queryGroupIdByHostId.do")
	public R queryGroupIdByHostId(String id) {
		return opsNodegroupService.queryGroupIdByHostId(id);
	}

	@ResponseBody
	@Acl(info = "更新节点", value = Acl.ACL_USER)
	@RequestMapping(value = "/queryTpDataByGroupIds.do")
	public R queryTpDataByGroupIds(String ids) {
		return opsNodegroupService.queryTpDataByGroupIds(ids);
	}

	@ResponseBody
	@Acl(info = "更新节点", value = Acl.ACL_ALLOW)
	@RequestMapping(value = "/queryTpDataByGroupId.do")
	public R queryTpDataByGroupId(String groupid) {
		String sql2="select * from ops_nodegroup where dr='0' and id=?";
		Rcd rs=db.uniqueRecord(sql2,groupid);
		if(rs==null){
			return R.FAILURE_NO_DATA();
		}
		JSONObject res=new JSONObject();
		res= ConvertUtil.OtherJSONObjectToFastJSONObject( rs.toJsonObject());
		String sql = "select i.fnode ,i.id nodemapitemid," + AssetsConstant.resSqlbody + " t.*,(select name from sys_dict_item where dr='0' and dict_item_id=t.type) nodetypename from res t ,ops_nodegroup_item i where i.itemid=t.id and t.dr='0' and i.dr='0' and i.groupid=? order by fnode";
		res.put("nodes",ConvertUtil.OtherJSONObjectToFastJSONArray(db.query(sql,groupid).toJsonArrayWithJsonObject()));
		return R.SUCCESS_OPER(res);
	}


}

