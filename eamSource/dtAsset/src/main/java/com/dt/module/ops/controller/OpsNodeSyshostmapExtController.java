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
import com.dt.core.tool.util.DbUtil;
import com.dt.core.tool.util.ToolUtil;
import com.dt.module.ops.entity.OpsNodeSyshostmap;
import com.dt.module.ops.service.IOpsNodeSyshostmapService;
import com.dt.module.ops.service.impl.OpsNodeSyshostmapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * <p>
 * 系统主机映射 前端控制器
 * </p>
 *
 * @author lank
 * @since 2021-04-30
 */
@Controller
@RequestMapping("/api/ops/opsNodeSyshostmap/ext")
public class OpsNodeSyshostmapExtController extends BaseController {


	@Autowired
	IOpsNodeSyshostmapService OpsNodeSyshostmapServiceImpl;

	@Autowired
	OpsNodeSyshostmapService opsNodeSyshostmapService;

	@ResponseBody
	@Acl(info = "查询所有,无分页", value = Acl.ACL_USER)
	@RequestMapping(value = "/selectNodeList.do")
	public R selectNodeList(String id) {
		return opsNodeSyshostmapService.selectNodeList(id);
	}

	@ResponseBody
	@Acl(info = "查询所有,无分页", value = Acl.ACL_USER)
	@RequestMapping(value = "/selectSelectNodeList.do")
	public R selectSelectNodeList(String id) {
		return opsNodeSyshostmapService.selectSelectNodeList(id);
	}

	@ResponseBody
	@Acl(info = "查询所有,无分页", value = Acl.ACL_USER)
	@RequestMapping(value = "/actionHostmap.do")
	public R actionHostmap(String id,String items) {
		return opsNodeSyshostmapService.actionHostmap(id,items);
	}

	@ResponseBody
	@Acl(info = "查询所有,无分页", value = Acl.ACL_USER)
	@RequestMapping(value = "/deleteHostmaps.do")
	public R deleteHostmaps(String id,String ids) {
		return opsNodeSyshostmapService.deleteHostmaps(id,ids);
	}

	@ResponseBody
	@Acl(info = "查询所有,无分页", value = Acl.ACL_USER)
	@RequestMapping(value = "/querySysIdByHostId.do")
	public R querySysIdByHostId(String id) {
		return opsNodeSyshostmapService.querySysIdByHostId(id);
	}




}

