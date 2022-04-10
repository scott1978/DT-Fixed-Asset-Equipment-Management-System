package com.dt.module.ops.entity;

import java.io.Serializable;
import com.baomidou.mybatisplus.annotation.TableName;
import com.dt.core.common.base.BaseModel;
import com.baomidou.mybatisplus.extension.activerecord.Model;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableField;

/**
 * <p>
 * 
 * </p>
 *
 * @author lank
 * @since 2021-06-05
 */
 
@TableName("ops_nodegroup_item")
 
public class OpsNodegroupItem extends BaseModel<OpsNodegroupItem> {

    private static final long serialVersionUID = 1L;

    @TableId("id")
    private String id;
    @TableField("groupid")
    private String groupid;
    @TableField("itemid")
    private String itemid;
    @TableField("type")
    private String type;
    @TableField("fnode")
    private String fnode;
    @TableField("bnode")
    private String bnode;
    /**
     * 备注
     */
    @TableField("mark")
    private String mark;


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getGroupid() {
        return groupid;
    }

    public void setGroupid(String groupid) {
        this.groupid = groupid;
    }

    public String getItemid() {
        return itemid;
    }

    public void setItemid(String itemid) {
        this.itemid = itemid;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getFnode() {
        return fnode;
    }

    public void setFnode(String fnode) {
        this.fnode = fnode;
    }

    public String getBnode() {
        return bnode;
    }

    public void setBnode(String bnode) {
        this.bnode = bnode;
    }

    public String getMark() {
        return mark;
    }

    public void setMark(String mark) {
        this.mark = mark;
    }

    @Override
    protected Serializable pkVal() {
        return this.id;
    }

    @Override
    public String toString() {
        return "OpsNodegroupItem{" +
        "id=" + id +
        ", groupid=" + groupid +
        ", itemid=" + itemid +
        ", type=" + type +
        ", fnode=" + fnode +
        ", bnode=" + bnode +
        ", mark=" + mark +
        "}";
    }
}
