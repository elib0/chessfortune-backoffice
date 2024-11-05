import { CalendarDate } from "@internationalized/date";

const getCalenderDateValue = (value: Date) => {
  const date = new Date(value);

  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return new CalendarDate(year, month, day);
};

export default getCalenderDateValue;
