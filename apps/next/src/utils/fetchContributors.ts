import { Octokit } from "@octokit/rest";

export interface ContributorType {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
  name: string;
  bio: string;
}

export async function fetchContributors(owner: string, repo: string) {
  const octokit = new Octokit();
  let page = 1;
  let hasNextPage = true;
  let baseContributors: any[] = [];

  while (hasNextPage) {
    const { data } = await octokit.rest.repos.listContributors({
      owner,
      repo,
      anon: "true",
      per_page: 100,
      page,
    });

    baseContributors = baseContributors.concat(data);
    hasNextPage = data.length === 100;
    page++;
  }

  // Filter out bots and anonymous users first
  const filteredContributors = baseContributors.filter(
    (contributor) =>
      contributor.type !== "Bot" &&
      contributor.type !== "Anonymous"
  );

  // Fetch detailed info for each contributor
  let detailedContributors: ContributorType[] = await Promise.all(
    filteredContributors.map(async (contributor) => {
      const { data: userDetails } = await octokit.rest.users.getByUsername({
        username: contributor.login,
      });
      return {
        ...contributor,
        name: userDetails.name,
        bio: userDetails.bio,
      };
    })
  );

  detailedContributors.sort((a, b) => {
    if (a.contributions > b.contributions)
      return -1;
    else if (a.contributions < b.contributions)
      return 1;
    else if (a.name < b.name)
      return -1;

    return 1;
  })

  return detailedContributors;
}