import { TimestampType } from "@/types";

const convertFirestoreTimestampToDate = (timestamp: TimestampType): Date =>
  new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000);

export default convertFirestoreTimestampToDate;
