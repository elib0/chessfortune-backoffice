import { Timestamp } from "@firebase/firestore";

const getMilliseconds = (timestamp: Timestamp | Date | null) =>
  timestamp instanceof Timestamp
    ? timestamp.toMillis()
    : timestamp instanceof Date
    ? timestamp.getTime()
    : null;

export default getMilliseconds;
