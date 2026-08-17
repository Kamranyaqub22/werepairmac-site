/**
 * Publishes a case study by committing to the repo through the GitHub API.
 *
 * Why a commit rather than a database: the rest of the site's content already
 * lives in git, so a published repair is versioned, diffable and revertible by
 * the same means as everything else, and local dev renders it without needing
 * remote state. The cost is a Vercel rebuild (~2 min) between publish and live,
 * which is an acceptable trade for content published a few times a month.
 *
 * All files go up in ONE commit via the git data API (blobs → tree → commit).
 * Committing the photos and the JSON entry separately would leave a window
 * where an entry references images that do not exist yet — and since the JSON
 * is validated at load, that window is a dropped case study, not an error
 * anyone would notice.
 */

const API = 'https://api.github.com';
const DATA_PATH = 'lib/case-studies.json';

export class PublishError extends Error {}

interface RepoConfig {
  owner: string;
  repo: string;
  branch: string;
  token: string;
}

function config(): RepoConfig {
  const token = process.env.GITHUB_TOKEN;
  const slug = process.env.GITHUB_REPO;

  if (!token) {
    throw new PublishError(
      'GITHUB_TOKEN is not set. Create a fine-grained token with Contents: Read and write on this repo.'
    );
  }
  if (!slug || !slug.includes('/')) {
    throw new PublishError('GITHUB_REPO is not set. Expected the form "owner/repo".');
  }

  const [owner, repo] = slug.split('/');
  return { owner, repo, branch: process.env.GITHUB_BRANCH || 'main', token };
}

async function gh<T>(
  cfg: RepoConfig,
  path: string,
  init?: { method?: string; body?: unknown }
): Promise<T> {
  const res = await fetch(`${API}/repos/${cfg.owner}/${cfg.repo}${path}`, {
    method: init?.method ?? 'GET',
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    },
    body: init?.body ? JSON.stringify(init.body) : undefined,
    cache: 'no-store',
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new PublishError(
      `GitHub ${init?.method ?? 'GET'} ${path} failed (${res.status}). ${detail.slice(0, 300)}`
    );
  }
  return res.json() as Promise<T>;
}

export interface PublishFile {
  /** Repo-relative path, e.g. public/images/repairs/foo-1.jpg */
  path: string;
  /** Base64 for binary, utf-8 string for text. */
  content: string;
  encoding: 'base64' | 'utf-8';
}

/** Reads the current case-studies JSON from the branch tip. */
export async function fetchCaseStudiesJson(): Promise<unknown[]> {
  const cfg = config();
  const file = await gh<{ content: string; encoding: string }>(
    cfg,
    `/contents/${DATA_PATH}?ref=${cfg.branch}`
  );
  const decoded = Buffer.from(file.content, 'base64').toString('utf-8');
  const parsed = JSON.parse(decoded);
  if (!Array.isArray(parsed)) {
    throw new PublishError(`${DATA_PATH} is not a JSON array.`);
  }
  return parsed;
}

/**
 * Commits every file in one go and returns the commit URL.
 *
 * Reads the branch tip immediately before writing and passes it as the parent,
 * so a concurrent push is rejected by GitHub rather than silently overwritten.
 */
export async function commitFiles(
  files: PublishFile[],
  message: string
): Promise<{ commitUrl: string; sha: string }> {
  const cfg = config();

  const ref = await gh<{ object: { sha: string } }>(
    cfg,
    `/git/ref/heads/${cfg.branch}`
  );
  const parentSha = ref.object.sha;

  const parentCommit = await gh<{ tree: { sha: string } }>(
    cfg,
    `/git/commits/${parentSha}`
  );

  // Blobs first: the tree references them by sha.
  const blobs = await Promise.all(
    files.map(async (file) => {
      const blob = await gh<{ sha: string }>(cfg, '/git/blobs', {
        method: 'POST',
        body: { content: file.content, encoding: file.encoding },
      });
      return { path: file.path, mode: '100644' as const, type: 'blob' as const, sha: blob.sha };
    })
  );

  const tree = await gh<{ sha: string }>(cfg, '/git/trees', {
    method: 'POST',
    body: { base_tree: parentCommit.tree.sha, tree: blobs },
  });

  const commit = await gh<{ sha: string; html_url: string }>(cfg, '/git/commits', {
    method: 'POST',
    body: { message, tree: tree.sha, parents: [parentSha] },
  });

  // force stays false: if someone pushed between our read and this write, we
  // want the 422 rather than a lost commit.
  await gh(cfg, `/git/refs/heads/${cfg.branch}`, {
    method: 'PATCH',
    body: { sha: commit.sha, force: false },
  });

  return { commitUrl: commit.html_url, sha: commit.sha };
}
