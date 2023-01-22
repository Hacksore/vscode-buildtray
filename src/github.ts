import got from "got";

export function getLatestBuildStatus() {
  return got("https://api.github.com/repos/hacksore/test").json();
}
