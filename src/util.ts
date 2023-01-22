import { BuildStatus } from "./types";

export function stringToBuildStatus(status: string) {
  switch (status) {
    case "pending":
      return BuildStatus.Pending;
    case "failure":
      return BuildStatus.Failure;
    case "success":
      return BuildStatus.Success;
    default:
      return BuildStatus.Unknown;
  }
}
