pipeline {
  agent any
  stages {
    stage('Test stage') {
      steps {
        echo 'Hi there!'
      }
    }
    stage('git pull') {
      steps {
        git(url: 'git@github.com:MeForo/marketplace_frontend.git', credentialsId: '19395f5f-bd11-46bd-ba53-984808656fb5')
      }
    }
    stage('build') {
      steps {
        sh 'cat ./Dockerfile'
      }
    }
  }
}