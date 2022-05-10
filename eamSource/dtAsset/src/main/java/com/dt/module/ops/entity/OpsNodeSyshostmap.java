package com.dt.module.ops.entity;

import java.io.Serializable;
import com.baomidou.mybatisplus.annotation.TableName;
import com.dt.core.common.base.BaseModel;
import com.baomidou.mybatisplus.extension.activerecord.Model;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableField;

/**
 * <p>
 * 系统主机映射
 * </p>
 *
 * @author lank
 * @since 2021-04-30
 */
 
@TableName("ops_node_syshostmap")
 
public class OpsNodeSyshostmap extends BaseModel<OpsNodeSyshostmap> {

    private static final long serialVersionUID = 1L;

    /**
     * 主键
     */
    @TableId("id")
    private String id;
    /**
     * 节点id
     */
    @TableField("nodeid")
    private String nodeid;
    /**
     * 系统id
     */
    @TableField("sysid")
    private String sysid;


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNodeid() {
        return nodeid;
    }

    public void setNodeid(String nodeid) {
        this.nodeid = nodeid;
    }

    public String getSysid() {
        return sysid;
    }

    public void setSysid(String sysid) {
        this.sysid = sysid;
    }

    @Override
    protected Serializable pkVal() {
        return this.id;
    }

    @Override
    public String toString() {
        return "OpsNodeSyshostmap{" +
        "id=" + id +
        ", nodeid=" + nodeid +
        ", sysid=" + sysid +
        "}";
    }
}
