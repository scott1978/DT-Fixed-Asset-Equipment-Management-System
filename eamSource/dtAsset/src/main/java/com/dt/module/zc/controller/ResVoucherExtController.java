package com.dt.module.zc.controller;


import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.dt.core.annotion.Acl;
import com.dt.core.common.base.BaseController;
import com.dt.core.common.base.R;
import com.dt.core.dao.Rcd;
import com.dt.core.dao.util.TypedHashMap;
import com.dt.core.tool.util.ConvertUtil;
import com.dt.core.tool.util.DbUtil;
import com.dt.core.tool.util.ToolUtil;
import com.dt.core.tool.util.support.HttpKit;
import com.dt.module.base.entity.SysParams;
import com.dt.module.base.service.ISysParamsService;
import com.dt.module.ops.service.IOpsNodegroupItemService;
import com.dt.module.zc.entity.ResVoucher;
import com.dt.module.zc.service.IResVoucherService;
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
 * 资产登录凭证 前端控制器
 * </p>
 *
 * @author lank
 * @since 2021-07-21
 */
@Controller
@RequestMapping("/api/zc/resVoucher/ext")
public class ResVoucherExtController extends BaseController {


	@Autowired
	IResVoucherService ResVoucherServiceImpl;

	@Autowired
	ISysParamsService SysParamsServiceImpl;

	@ResponseBody
	@Acl(info = "查询所有,有分页", value = Acl.ACL_USER)
	@RequestMapping(value = "/batchUpdate.do")
	public R batchUpdate(String items,String voucher,String vouchermark) {
		if(ToolUtil.isEmpty(items)){
			return R.FAILURE_REQ_PARAM_ERROR();
		}
		JSONArray items_arr=JSONArray.parseArray(items);
		List<ResVoucher> lists=new ArrayList<>();
		for(int i=0;i<items_arr.size();i++){
			JSONObject item=items_arr.getJSONObject(i);
			ResVoucher obj=new  ResVoucher();
			obj.setId(item.getString("id"));
			obj.setVouchermark(vouchermark);
			obj.setVoucher(voucher);
			obj.setType("assets");
			lists.add(obj);
		}
		if(lists.size()>0){
			ResVoucherServiceImpl.saveOrUpdateBatch(lists);
		}
		return R.SUCCESS_OPER();
	}

	/**
	 * @Description:查询我到所有资产
	 */
	@ResponseBody
	@Acl(info = "查询Res", value = Acl.ACL_USER)
	@RequestMapping(value = "/selectPages.do")
	public R queryPageResAllByClass(String start, String length, @RequestParam(value = "pageSize", required = true, defaultValue = "10") String pageSize, @RequestParam(value = "pageIndex", required = true, defaultValue = "1") String pageIndex) {
		TypedHashMap<String, Object> ps = HttpKit.getRequestParameters();
		String search=ps.getString("search");
		JSONObject respar = DbUtil.formatPageParameter(start, length, pageSize, pageIndex);
		if (ToolUtil.isEmpty(respar)) {
			return R.FAILURE_REQ_PARAM_ERROR();
		}
		int pagesize = respar.getIntValue("pagesize");
		int pageindex = respar.getIntValue("pageindex");


		SysParams v=SysParamsServiceImpl.getById("opsnodegroup");
		String subsql="";
		String[] cats_arr=v.getValue().split(",");
		for(int i=0;i<cats_arr.length;i++){
			if (i==0){
				subsql=subsql+ " (concat('-',route) like '%-"+cats_arr[i]+"-%' or id="+cats_arr[i]+") ";
			}else{
				subsql=subsql+ " or (concat('-',route) like '%-"+cats_arr[i]+"-%' or id="+cats_arr[i]+") ";
			}
		}
		ps.putIfAbsent("used_userid", this.getUserId());
		String asql = "select "+ AssetsConstant.resSqlbody + " t.*,(select voucher from res_voucher where id=t.id)voucher,(select vouchermark from res_voucher where id=t.id)vouchermark from res t where category='3' and dr=0 and ishandle='0' ";
		if(cats_arr.length>0){
			asql=asql+" and class_id in ( select id from ct_category where dr='0' and ("+subsql+"))";
		}
		String esql="";
		if (ToolUtil.isNotEmpty(search)){
			esql= "select * from ("+asql+")stab  where  (classfullname like '%" + search + "%' or rack like '%" + search + "%' or fs1 like '%" + search + "%' or mark like '%" + search + "%' or name like '%"+search+"%' or uuid like '%" + search + "%' or model like '%" + search + "%'  or  sn like '%" + search + "%'  or locstr like '%" + search + "%' or  supplierstr like '%" + search + "%' or ip like '%" + search + "%')";
		}else{
			esql=asql;
		}

		String sqlcnt = "select count(1) value from (" + esql + ") tab";
		int count = db.uniqueRecord(sqlcnt).getInteger("value");
		JSONObject retrunObject = new JSONObject();
		retrunObject.put("iTotalRecords", count);
		retrunObject.put("iTotalDisplayRecords", count);
		retrunObject.put("success", true);
		retrunObject.put("code", 200);
		retrunObject.put("data", ConvertUtil.OtherJSONObjectToFastJSONArray(
				db.query(DbUtil.getDBPageSql(db.getDBType(), esql, pagesize, pageindex)).toJsonArrayWithJsonObject()));
		return R.clearAttachDirect(retrunObject);
	}


	@ResponseBody
	@Acl(info = "根据Id查询", value = Acl.ACL_USER)
	@RequestMapping(value = "/selectById.do")
	public R selectById(@RequestParam(value = "id", required = true, defaultValue = "") String id) {
		return R.SUCCESS_OPER(ResVoucherServiceImpl.getById(id));
	}



	@ResponseBody
	@Acl(info = "根据Id删除", value = Acl.ACL_USER)
	@RequestMapping(value = "/deleteById.do")
	public R deleteById(@RequestParam(value = "id", required = true, defaultValue = "") String id) {
		return R.SUCCESS_OPER(ResVoucherServiceImpl.removeById(id));
	}

	@ResponseBody
	@Acl(info = "存在则更新,否则插入", value = Acl.ACL_USER)
	@RequestMapping(value = "/customInsertOrUpdate.do")
	public R insertOrUpdate(ResVoucher entity) {
		entity.setType("custom");
		return R.SUCCESS_OPER(ResVoucherServiceImpl.saveOrUpdate(entity));
	}

	@ResponseBody
	@Acl(info = "查询所有,无分页", value = Acl.ACL_USER)
	@RequestMapping(value = "/customSelectList.do")
	public R selectList() {
		QueryWrapper q=new QueryWrapper();
		q.eq("type","custom");
		return R.SUCCESS_OPER(ResVoucherServiceImpl.list(q));
	}


}

