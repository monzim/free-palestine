import { v1, v4 } from "uuid";

export function formatUtcDateToPartitionKey(date: Date): string {
  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
  const day = date.getUTCDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export const CURRENTUTCPERTITIONKEY = formatUtcDateToPartitionKey(
  new Date()
  // Date.now() - 24 * 60 * 60 * 1000 * 1 // 2 days ago
);

export function generateRowKey(): string {
  return v1();
}

export function generateRowKeyWithGroup(groupId: string | null): string {
  const timeUuid = v1();

  if (groupId) {
    return `${groupId}_${timeUuid}`;
  }

  return timeUuid;
}

export function generateGroupId(): string {
  var uuid = v4().replace(/-/g, "");
  return uuid.slice(0, 10);
}
