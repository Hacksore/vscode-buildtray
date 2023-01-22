// @ts-ignore
// See: https://github.com/microsoft/vscode/issues/130367
import got, { Response } from "got";
import { BuildStatus, GithubBuild } from "./types";
// import { stringToBuildStatus } from "./util";

const GH_API_URL = "https://api.github.com";

export function getRepoMetadata({
  owner,
  repo,
}: {
  owner: string;
  repo: string;
}) {
  return got(`https://api.github.com/repos/${owner}/${repo}`).json();
}

export async function getBuildStatus({
  owner,
  repo,
  commit,
}: {
  owner: string;
  repo: string;
  commit: string;
}): Promise<{
  status: BuildStatus;
  builds: GithubBuild[];
}> {
  const url = `${GH_API_URL}/repos/${owner}/${repo}/commits/${commit}/status`;
  const response: GithubBuild = await got(url).json();

  console.log(response.state);

  const status: BuildStatus = BuildStatus.Pending;
  const builds: GithubBuild[] = [];
  return Promise.resolve({ status, builds });

}
