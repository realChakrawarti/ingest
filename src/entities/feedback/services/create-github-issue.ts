import { Octokit } from "octokit";

const octokit = new Octokit({
  auth: process.env.OCTOKIT_API,
});

export async function createGitHubIssue(title: string, description: string) {
  const result = await octokit.request("POST /repos/{owner}/{repo}/issues", {
    body: description,
    owner: "realChakrawarti",
    repo: "ingest",
    title: title,
  });

  return result.data.html_url;
}
