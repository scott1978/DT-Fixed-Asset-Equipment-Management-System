package com.dt.module.ops.controller;


import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.UpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.dt.core.annotion.Acl;
import com.dt.core.common.base.BaseController;
import com.dt.core.common.base.R;
import com.dt.core.dao.Rcd;
import com.dt.core.tool.util.ConvertUtil;
import com.dt.core.tool.util.DbUtil;
import com.dt.core.tool.util.ToolUtil;
import com.dt.module.base.busenum.CategoryEnum;
import com.dt.module.base.entity.SysParams;
import com.dt.module.base.service.ISysParamsService;
import com.dt.module.ops.entity.OpsNodegroupItem;
import com.dt.module.ops.service.IOpsNodegroupItemService;
import com.dt.module.ops.service.impl.OpsNodegroupService;
import com.dt.module.zc.service.impl.AssetsConstant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.List;

/**
 * <p>
 *  前端控制器
 * </p>
 *
 * @author lank
 * @since 2021-06-05
 */
@Controller
@RequestMapping("/api/ops/opsNodegroupItem/ext")
public class OpsNodegroupItemExtController extends BaseController {



	@Autowired
	IOpsNodegroupItemService OpsNodegroupItemServiceImpl;

	@Autowired
	ISysParamsService SysParamsServiceImpl;

	@ResponseBody
	@Acl(info = "查询当前组内节点", value = Acl.ACL_USER)
	@RequestMapping(value = "/queryNodeByGroupId.do")
	public R queryNodeByGroupId(@RequestParam(value = "groupid", required = true, defaultValue = "") String groupid) {
		String sql = "select i.fnode ,i.id nodemapitemid," + AssetsConstant.resSqlbody + " t.*,(select name from sys_dict_item where dr='0' and dict_item_id=t.type) nodetypename from res t ,ops_nodegroup_item i where i.itemid=t.id and t.dr='0' and i.dr='0' and i.groupid=? order by fnode";
		return R.SUCCESS_OPER(db.query(sql,groupid).toJsonArrayWithJsonObject());
	}

	@ResponseBody
	@Acl(info = "新增查询节点，过滤已有的节点数据", value = Acl.ACL_USER)
	@RequestMapping(value = "/queryNodes.do")
	public R queryNodes(@RequestParam(value = "groupid", required = true, defaultValue = "") String groupid) {
		SysParams v=SysParamsServiceImpl.getById("opsnodegroup");
		if(v==null||v.getValue()==null||"".equals(v.getValue())){
			return R.FAILURE_NO_DATA();
		}
		String sql = "select " + AssetsConstant.resSqlbody + " t.* from res t where category='" + CategoryEnum.CATEGORY_ASSETS.getValue() + "' and t.dr='0' and id not in (select itemid from ops_nodegroup_item where dr='0' and groupid=? )";

		String[] cats_arr=v.getValue().split(",");
		String subsql="";
		for(int i=0;i<cats_arr.length;i++){
			 if (i==0){
				 subsql=subsql+ " (concat('-',route) like '%-"+cats_arr[i]+"-%' or id="+cats_arr[i]+") ";
			 }else{
				 subsql=subsql+ " or (concat('-',route) like '%-"+cats_arr[i]+"-%' or id="+cats_arr[i]+") ";
			 }
		}
		if(cats_arr.length>0){
			sql=sql+" and class_id in ( select id from ct_category where dr='0' and ("+subsql+"))";
		}
		System.out.println(sql);
		return R.SUCCESS_OPER(db.query(sql,groupid).toJsonArrayWithJsonObject());
	}

	@ResponseBody
	@Acl(info = "更新节点，上联，下联", value = Acl.ACL_USER)
	@RequestMapping(value = "/updateNodes.do")
	public R updateNodes(@RequestParam(value = "ids", required = true, defaultValue = "") String ids,String groupid,String fnode) {
//		if(ToolUtil.isOneEmpty(ids,groupid,fnode)){
//			return R.SUCCESS_NO_DATA();
//		}
//		JSONArray ids_arr=JSONArray.parseArray(ids);
//		JSONArray fnode_arr=JSONArray.parseArray(fnode);
//		if(ids_arr.size()==0||fnode_arr.size()==0){
//			return R.SUCCESS_NO_DATA();
//		}
//		List<OpsNodegroupItem> lists=new ArrayList<>();
//		for(int i=0;i<ids_arr.size();i++){
//			OpsNodegroupItem e=new OpsNodegroupItem();
//			e.setGroupid(groupid);
//			e.setFnodeid(fnode);
//			e.setItemid(ids_arr.getString(i));
//			lists.add(e);
//		}
		return R.SUCCESS_OPER();
	}


	@ResponseBody
	@Acl(info = "更新节点", value = Acl.ACL_USER)
	@RequestMapping(value = "/addNodes.do")
	public R addNodes(@RequestParam(value = "ids", required = true, defaultValue = "") String ids,String groupid) {
		if(ToolUtil.isOneEmpty(ids,groupid)){
			return R.SUCCESS_NO_DATA();
		}
		JSONArray ids_arr=JSONArray.parseArray(ids);
		List<OpsNodegroupItem> lists=new ArrayList<>();
		for(int i=0;i<ids_arr.size();i++){
			OpsNodegroupItem e=new OpsNodegroupItem();
			e.setGroupid(groupid);
			e.setFnode("[{\"id\":\"0\",\"name\":\"根节点\"}]");
			e.setItemid(ids_arr.getString(i));
			lists.add(e);
		}
		OpsNodegroupItemServiceImpl.saveBatch(lists);
		return R.SUCCESS_OPER();
	}

	@ResponseBody
	@Acl(info = "更新节点", value = Acl.ACL_USER)
	@RequestMapping(value = "/updateFNodes.do")
	public R updateFNodes(@RequestParam(value = "ids", required = true, defaultValue = "") String ids,String fnode) {
		if(ToolUtil.isOneEmpty(ids,fnode)){
			return R.SUCCESS_NO_DATA();
		}
		JSONArray ids_arr=JSONArray.parseArray(ids);
		for(int i=0;i<ids_arr.size();i++){
			String id=ids_arr.getString(i);
			UpdateWrapper<OpsNodegroupItem> ups=new UpdateWrapper<>();
			ups.set("fnode",fnode);
			ups.eq("id",id);
			OpsNodegroupItemServiceImpl.update(ups);
		}
		return R.SUCCESS_OPER();
	}

	@ResponseBody
	@Acl(info = "删除", value = Acl.ACL_USER)
	@RequestMapping(value = "/deleteById.do")
	public R deleteById(String id) {
		QueryWrapper<OpsNodegroupItem> q=new QueryWrapper<>();
		q.like("fnode",id);
		if(OpsNodegroupItemServiceImpl.list(q).size()>0){
			return R.FAILURE("请先删除下联节点");
		}
//		UpdateWrapper<OpsNodegroupItem> ups=new UpdateWrapper<OpsNodegroupItem>();
//		ups.set("fnode","[{\"id\":\"0\",\"name\":\"根节点\"}]");
//		ups.like("fnode",id);
//		OpsNodegroupItemServiceImpl.update(ups);
		OpsNodegroupItemServiceImpl.removeById(id);
		return R.SUCCESS_OPER();
	}


}

