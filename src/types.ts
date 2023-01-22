/* eslint-disable @typescript-eslint/naming-convention */
export interface GithubBuild {
  url: string;
  id: number;
  state: BuildStatus;
  description: string;
  target_url: string;
  context: string;
  created_at: Date;
  updated_at: Date;
}

export enum BuildStatus {
  Pending,
  Failure,
  Success,
  Unknown,
}
