/**
 * @description 校验车牌号
 * @param {string} v
 * @returns {boolean}
 */

export const isLicensePlateNumber = (v: string) => {
  if (!v) {
    return false;
  }

  return /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DABCEFGHJK]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/.test(
    v,
  );
};

/**
 * 校验手机号
 * @param {string} v
 * @returns {boolean}
 */
export const isPhoneNumber = (v: string) => /^1[3456789]\d{9}$/.test(v);
