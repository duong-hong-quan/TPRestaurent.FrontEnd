import { message } from "antd";
import moment from "moment-timezone";
function formatPrice(gia) {
  /**
   * Định dạng giá tiền Việt Nam từ số nguyên thành chuỗi có dấu phân cách và ký tự đồng.
   *
   * @param {number} gia - Giá tiền cần định dạng.
   * @returns {string} - Chuỗi đã định dạng giá tiền.
   */
  if (gia !== null && gia !== undefined) {
    return gia.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  } else {
    return "0";
  }
}

function formatDateTime(ngayGio) {
  /**
   * Định dạng thời gian thành chuỗi dd/mm/yyyy hh/mm/ss.
   *
   * @param {Date} ngayGio - Thời gian cần định dạng.
   * @returns {string} - Chuỗi đã định dạng thời gian.
   */
  var date = new Date(ngayGio);
  var ngay = date.getDate();
  var thang = date.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0
  var nam = date.getFullYear();
  var gio = date.getHours();
  var phut = date.getMinutes();
  var giay = date.getSeconds();

  // Thêm số 0 vào trước nếu số chỉ có 1 chữ số
  if (ngay < 10) ngay = "0" + ngay;
  if (thang < 10) thang = "0" + thang;
  if (gio < 10) gio = "0" + gio;
  if (phut < 10) phut = "0" + phut;
  if (giay < 10) giay = "0" + giay;

  return ngay + "/" + thang + "/" + nam + " " + gio + ":" + phut + ":" + giay;
}

function formatDate(ngayGio) {
  /**
   * Định dạng thời gian thành chuỗi dd/mm/yyyy hh:mm:ss.
   *
   * @param {Date} ngayGio - Thời gian cần định dạng.
   * @returns {string} - Chuỗi đã định dạng thời gian.
   */
  var date = new Date(ngayGio);
  var ngay = String(date.getDate()).padStart(2, "0");
  var thang = String(date.getMonth() + 1).padStart(2, "0"); // Tháng trong JavaScript bắt đầu từ 0
  var nam = date.getFullYear();

  return `${ngay}/${thang}/${nam}`;
}
function differenceInDays(ngayGio1, ngayGio2) {
  var date1 = new Date(ngayGio1);
  var date2 = new Date(ngayGio2);

  // Lấy số mili giây của mỗi ngày
  var oneDay = 24 * 60 * 60 * 1000;

  // Chuyển đổi thời điểm thành số mili giây
  var time1 = date1.getTime();
  var time2 = date2.getTime();

  // Tính hiệu số ngày giữa hai thời điểm và làm tròn kết quả
  var difference = Math.round(Math.abs((time1 - time2) / oneDay));

  return difference;
}
function secondsToHours(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "Vui lòng nhập số giây hợp lệ (lớn hơn hoặc bằng 0)";
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  const roundedSeconds = Math.round(seconds % 60);

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${roundedSeconds.toString().padStart(2, "0")}`;
}
function metersToKilometers(meters) {
  if (isNaN(meters) || meters < 0) {
    return "Vui lòng nhập số mét hợp lệ (lớn hơn hoặc bằng 0)";
  }

  const kilometers = Math.round(meters / 1000);

  return `${kilometers} km`;
}
function getTimePeriod(dateTimeString) {
  const dateTime = new Date(dateTimeString);
  const hours = dateTime.getHours();
  if (hours < 10) {
    return "Sáng";
  } else if (hours >= 10 && hours < 14) {
    return "Trưa";
  } else if (hours >= 14) {
    return "Tối";
  } else {
    return "";
  }
}

function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}

function formatDateToISOString(date) {
  return moment(date).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
}
function calculateDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const days = differenceInDays(end, start) + 1;
  const nights = days - 1;

  return `${days} ngày ${nights} đêm`;
}
function calculateTimeDifference(startDateString, endDateString) {
  // Tạo đối tượng Date từ các chuỗi đầu vào
  const startDate = new Date(startDateString);
  const endDate = new Date(endDateString);

  // Tính khoảng cách giữa hai ngày (trong mili giây)
  const differenceInMilliseconds = endDate - startDate;

  // Chuyển đổi khoảng cách từ mili giây sang các đơn vị khác
  const millisecondsInSecond = 1000;
  const secondsInMinute = 60;
  const minutesInHour = 60;
  const hoursInDay = 24;

  const totalSeconds = Math.floor(
    differenceInMilliseconds / millisecondsInSecond
  );
  const totalMinutes = Math.floor(totalSeconds / secondsInMinute);
  const totalHours = Math.floor(totalMinutes / minutesInHour);
  const totalDays = Math.floor(totalHours / hoursInDay);

  const remainingSeconds = totalSeconds % secondsInMinute;
  const remainingMinutes = totalMinutes % minutesInHour;
  const remainingHours = totalHours % hoursInDay;

  return {
    days: totalDays,
    hours: remainingHours,
    minutes: remainingMinutes,
    seconds: remainingSeconds,
  };
}
function mergeCartData(cartReservation, cartCombos, options = {}) {
  // Default values or from options
  const {
    reservationDate = options.reservationDate,
    numberOfPeople = options.numberOfPeople,
    endTime = options.endTime,
    customerInfoId = options.customerInfoId,
    deposit = options.deposit,
  } = options;

  const reservationDishDtos = [];

  // Process cart reservation data
  cartReservation.forEach((item) => {
    reservationDishDtos.push({
      dishSizeDetailId: item.size.dishSizeDetailId, // Using dishId for this example
      combo: null,
      quantity: item.quantity,
      note: `${item.dish.name} - ${item.size}`, // Combine name and size for note
    });
  });
  // Process cart combos data
  cartCombos?.items?.forEach((comboOrigin) => {
    const dishComboIds = [];

    comboOrigin.selectedDishes.forEach((dishes) => {
      dishComboIds.push(dishes.dishComboId);
    });

    reservationDishDtos.push({
      combo: {
        comboId: comboOrigin.combo.comboId,
        dishComboIds,
      },
      quantity: comboOrigin.quantity,
    });
  });

  return {
    reservationDate,
    numberOfPeople,
    endTime,
    customerInfoId,
    deposit,
    reservationDishDtos,
  };
}
export const getKeyByValue = (obj, value) => {
  return Object.keys(obj).find((key) => obj[key] === value);
};

function formatPhoneNumber(phoneNumber) {
  // Remove any non-digit characters
  const cleaned = ("" + phoneNumber).replace(/\D/g, "");

  // Match and format the phone number
  let match;
  if (cleaned.length === 9) {
    match = cleaned.match(/^(\d{3})(\d{3})(\d{3})$/);
    if (match) {
      return `${match[1]} ${match[2]} ${match[3]}`;
    }
  } else if (cleaned.length === 10) {
    match = cleaned.match(/^(\d{4})(\d{3})(\d{3})$/);
    if (match) {
      return `${match[1]} ${match[2]} ${match[3]}`;
    }
  }

  return phoneNumber;
}

function showError(errors) {
  if (Array.isArray(errors) && errors.length > 0) {
    const errorMessage = errors.join(", ");
    message.error(errorMessage);
  }
}
const padZero = (num) => (num < 10 ? `0${num}` : num);

export const formatDateRange = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const day = padZero(startDate.getDate());
  const month = padZero(startDate.getMonth() + 1); // Months are zero-based
  const year = startDate.getFullYear();

  const startHours = padZero(startDate.getHours());
  const startMinutes = padZero(startDate.getMinutes());

  const endHours = padZero(endDate.getHours());
  const endMinutes = padZero(endDate.getMinutes());

  return `${day}/${month}/${year} ${startHours}:${startMinutes} - ${endHours}:${endMinutes}`;
};
export {
  formatPrice,
  formatDateTime,
  formatDate,
  differenceInDays,
  secondsToHours,
  metersToKilometers,
  getTimePeriod,
  isEmptyObject,
  formatDateToISOString,
  calculateDuration,
  mergeCartData,
  calculateTimeDifference,
  formatPhoneNumber,
  showError,
};
