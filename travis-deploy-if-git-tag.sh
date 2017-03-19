#!/bin/bash
set -ev

#
# DEPLOY dist.zip TO GITHUB PAGES IF TAG
#
if [ -z ${TRAVIS_TAG+x} ]; then
  cd dist
  zip $TRAVIS_TAG.zip $(find . -mindepth 1 -not -iwholename "*.git*")
  mkdir deploy
  mv $TRAVIS_TAG.zip deploy/
	ndes ndes deployToGitHubPages \
	     as "codeclou-ci" \
	     withEmail "codeclou-ci@codeclou.io" \
	     withGitHubAuthUsername $GITHUB_AUTH_USERNAME \
	     withGitHubAuthToken $GITHUB_AUTH_TOKEN \
	     toRepository https://github.com/codeclou/kartoffelstampf-client.git \
	     fromSource deploy \
	     intoSubdirectory repo/$TRAVIS_TAG/
else
  echo "not a tag. doing nothing";
fi
