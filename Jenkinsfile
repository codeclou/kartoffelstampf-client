#!groovy

// Licensed under MIT
// © 2017 Bernhard Grünewaldt
// https://github.com/codeclou/kartoffelstampf-client

node {

  currentBuild.result = 'SUCCESS'

  def do_cleanup = {
    sh 'if [ -f "${WORKSPACE}/npm-debug.log" ]; then rm -f "${WORKSPACE}/npm-debug.log"; fi'
    sh 'if [ -d "${WORKSPACE}/node_modules/" ]; then rm -rf "${WORKSPACE}/node_modules/"; fi'
    sh 'if [ -d "${WORKSPACE}/dist/" ]; then rm -rf "${WORKSPACE}/dist/"; fi'
    sh 'chmod -R g+w ${WORKSPACE}'
    sh 'chgrp -R dockerworker ${WORKSPACE}'
  }

  try {

    stage('Checkout') {
      git branch: 'master', credentialsId: 'github', url: 'https://github.com/codeclou/kartoffelstampf-client.git'
      gitBranch = sh(returnStdout: true, script: 'git rev-parse --abbrev-ref HEAD').trim()
      gitCommit = sh(returnStdout: true, script: 'git rev-parse HEAD').trim()
      sh "echo ${gitCommit}"
      sh "echo ${gitBranch}"
    }


    stage('npm-prerequisites') {
      do_cleanup()
    }

    stage('npm-install') {
      sh 'docker run --rm --tty -v $(pwd)/:/opt/npm -e NPM_REGISTRY_MIRROR="http://nopar.codeclou.io/" codeclou/docker-node-deploy-essentials:latest npm install'
    }

    stage('Build') {
      sh "sed -i -e 's/___COMMIT___/${gitCommit}/g' ./src/app/app.component.ts"
      sh 'docker run --rm --tty -v $(pwd)/:/opt/npm codeclou/docker-node-deploy-essentials:latest npm run build'
      dir ('dist') {
        // Create zip without .git but with e.g. .htaccess
        sh 'zip dist.zip $(find . -mindepth 1 -not -iwholename "*.git*")'
      }
      archiveArtifacts artifacts: 'dist/dist.zip', fingerprint: true
    }

    stage('Cleanup') {
      do_cleanup()
    }


  } catch (err) {
    do_cleanup()
    currentBuild.result = "FAILURE"

    throw err
  }

}
