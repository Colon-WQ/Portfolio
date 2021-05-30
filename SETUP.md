# Setup workflow for development

The following details the workflow for development of Portfolio.

## Create PRs via own fork

Enabled forking of private repository under org -> settings -> member privileges

Fork this repository to your own Github account by clicking the fork button on the top right

Create a branch named `add-{your name}-info` e.g. `add-John-info` in your local repository

Add a file `yourName.md` into the members directory containing some info about you into that branch

Push that branch to your fork

Create a PR *Pull Request* from the `add-{your name}-info` to the main branch of the *forked repository* first. Then create another PR from the main branch of the *forked repository* to a branch in the *team repository*

Creating a PR is simple, just go to Pull Requests in Github. Then, specify the repository and branch name of the two branches that you wish to merge.

Any Team members would be able to review the PR and merge PR after resolving conflicts.

## For each PR: review, update & merge

[A team member (not the PR author)] Review the PR by adding comments.

[PR author] Update the PR by pushing more commits to it, to simulate updating the PR based on review comments.

[Another team member] Approve and merge the PR using the GitHub interface.

[All members] After merging PR, remember to sync your local repo (and your fork) with upstream repo. In this case, your upstream repo is the repo in your team org.

## Merging Conflicting PRs

[Optional] A member can inform the PR author (by posting a comment) that there is a conflict in the PR.

[PR author] Resolve the conflict locally:

* Pull the master branch from the repo in your team org.

* Merge the pulled master branch to your PR branch.

* Resolve the merge conflict that crops up during the merge.

* Push the updated PR branch to your fork.

[Another member or the PR author]: Merge the de-conflicted PR: When GitHub does not indicate a conflict anymore, you can go ahead and merge the PR.

## Creating local clone of fork

cd to a directory where you want the forked repository to be cloned. Then run:

```
git clone https://github.com/YOUR-USERNAME/REPO-NAME
```

## Configure Git to sync your fork with the team repository

run: `git remote -v` to see the currently configured remote repositories for your fork

run: `git remote add upstream TEAM-REPO-URL`, then verify by running `git remote -v` again

You may then pull from team repository, then push to forked repository in your own github account to sync your fork

**Note**: Pulling from repository is essentially `git fetch` and `git merge`. However, there may be conflicts that have to be resolved.