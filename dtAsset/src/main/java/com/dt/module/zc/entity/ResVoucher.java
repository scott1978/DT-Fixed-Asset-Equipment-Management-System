package com.dt.module.zc.entity;

import java.io.Serializable;
import com.baomidou.mybatisplus.annotation.TableName;
import com.dt.core.common.base.BaseModel;
import com.baomidou.mybatisplus.extension.activerecord.Model;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableField;

/**
 * <p>
 * 凭证
 * </p>
 *
 * @author lank
 * @since 2021-07-22
 */
 
@TableName("res_voucher")
 
public class ResVoucher extends BaseModel<ResVoucher> {

    private static final long serialVersionUID = 1L;

    /**
     * 主键
     */
    @TableId("id")
    private String id;
    @TableField("userid")
    private String userid;
    @TableField("name")
    private String name;
    @TableField("type")
    private String type;
    @TableField("category")
    private String category;
    @TableField("voucher")
    private String voucher;
    /**
     * 备注
     */
    @TableField("vouchermark")
    private String vouchermark;


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserid() {
        return userid;
    }

    public void setUserid(String userid) {
        this.userid = userid;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getVoucher() {
        return voucher;
    }

    public void setVoucher(String voucher) {
        this.voucher = voucher;
    }

    public String getVouchermark() {
        return vouchermark;
    }

    public void setVouchermark(String vouchermark) {
        this.vouchermark = vouchermark;
    }

    @Override
    protected Serializable pkVal() {
        return this.id;
    }

    @Override
    public String toString() {
        return "ResVoucher{" +
        "id=" + id +
        ", userid=" + userid +
        ", name=" + name +
        ", type=" + type +
        ", category=" + category +
        ", voucher=" + voucher +
        ", vouchermark=" + vouchermark +
        "}";
    }
}
