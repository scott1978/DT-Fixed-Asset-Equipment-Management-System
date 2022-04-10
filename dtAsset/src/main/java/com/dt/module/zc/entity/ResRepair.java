package com.dt.module.zc.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.dt.core.common.base.BaseModel;

import java.io.Serializable;
import java.util.Date;

/**
 * <p>
 *
 * </p>
 *
 * @author lank
 * @since 2020-04-19
 */

@TableName("res_repair")

public class ResRepair extends BaseModel<ResRepair> {

    private static final long serialVersionUID = 1L;

    @TableId("id")
    private String id;
    /**
     * 原因
     */
    @TableField("freason")
    private String freason;
    /**
     * 备注
     */
    @TableField("fmark")
    private String fmark;
    @TableField("foper_user")
    private String foperUser;
    @TableField("fopertime")
    private Date fopertime;
    /**
     * 单据号
     */
    @TableField("fuuid")
    private String fuuid;
    /**
     * 维护人
     */
    @TableField("fprocessuser")
    private String fprocessuser;
    /**
     * 维护时间
     */
    @TableField("fprocesstime")
    private String fprocesstime;
    /**
     * wait|finish
     */
    @TableField("fstatus")
    private String fstatus;
    /**
     * 报修等级
     */
    @TableField("flevel")
    private String flevel;
    /**
     * 报修类型
     */
    @TableField("frepairtype")
    private String frepairtype;
    /**
     * 费用
     */
    @TableField("fmoney")
    private String fmoney;

    @TableField("pinst")
    private String pinst;

    public String getPinst() {
        return pinst;
    }

    public void setPinst(String pinst) {
        this.pinst = pinst;
    }


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFreason() {
        return freason;
    }

    public void setFreason(String freason) {
        this.freason = freason;
    }

    public String getFmark() {
        return fmark;
    }

    public void setFmark(String fmark) {
        this.fmark = fmark;
    }

    public String getFoperUser() {
        return foperUser;
    }

    public void setFoperUser(String foperUser) {
        this.foperUser = foperUser;
    }

    public Date getFopertime() {
        return fopertime;
    }

    public void setFopertime(Date fopertime) {
        this.fopertime = fopertime;
    }

    public String getFuuid() {
        return fuuid;
    }

    public void setFuuid(String fuuid) {
        this.fuuid = fuuid;
    }

    public String getFprocessuser() {
        return fprocessuser;
    }

    public void setFprocessuser(String fprocessuser) {
        this.fprocessuser = fprocessuser;
    }

    public String getFprocesstime() {
        return fprocesstime;
    }

    public void setFprocesstime(String fprocesstime) {
        this.fprocesstime = fprocesstime;
    }

    public String getFstatus() {
        return fstatus;
    }

    public void setFstatus(String fstatus) {
        this.fstatus = fstatus;
    }

    public String getFlevel() {
        return flevel;
    }

    public void setFlevel(String flevel) {
        this.flevel = flevel;
    }

    public String getFrepairtype() {
        return frepairtype;
    }

    public void setFrepairtype(String frepairtype) {
        this.frepairtype = frepairtype;
    }

    public String getFmoney() {
        return fmoney;
    }

    public void setFmoney(String fmoney) {
        this.fmoney = fmoney;
    }

    @Override
    protected Serializable pkVal() {
        return this.id;
    }

    @Override
    public String toString() {
        return "ResRepair{" +
                "id=" + id +
                ", freason=" + freason +
                ", fmark=" + fmark +
                ", foperUser=" + foperUser +
                ", fopertime=" + fopertime +
                ", fuuid=" + fuuid +
                ", fprocessuser=" + fprocessuser +
                ", fprocesstime=" + fprocesstime +
                ", fstatus=" + fstatus +
                ", flevel=" + flevel +
                ", frepairtype=" + frepairtype +
                ", fmoney=" + fmoney +
                "}";
    }
}
