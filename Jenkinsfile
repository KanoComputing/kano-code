#!groovy
@Library('kanolib') _

pipeline {
    agent {
        label 'ubuntu_18.04_with_docker'
    }
    stages {
        stage('checkout') {
            steps {
                checkout scm
            }
        }
        stage('install dependencies') {
            steps {
                script {
                    docker.image('node:8-alpine').inside('-u root') {
                        sh "apk update && apk upgrade && apk add --no-cache bash git openssh"
                        sh "mkdir -p ~/.ssh && ssh-keyscan github.com >> ~/.ssh/known_hosts"
                        sshagent(['read-only-github']) {
                            sh "yarn"
                            sh "yarn tsc"
                        }
                    }
                }
            }
        }
        stage('test') {
            steps {
                script {
                    // Use puppeteer enabled docker image
                    docker.image('kanocomputing/puppeteer').inside('--cap-add=SYS_ADMIN') {
                        // Run the Unit test
                        sh "yarn test-ci"
                        sh "yarn coverage-ci"
                    }
                }
            }
        }
    }
    post {
        always {
            junit allowEmptyResults: true, testResults: 'test-results.xml'
            cobertura coberturaReportFile: 'coverage/cobertura-coverage.xml'
            updatePR()
        }
        regression {
            notify_culprits currentBuild.result
        }
    }
    options {
        buildDiscarder(logRotator(numToKeepStr: '20'))
        timeout(time: 60, unit: 'MINUTES')
    }
}

def updatePR() {
    sh "cat .gh-comment-id"
    def idFile = '.gh-comment-id'
    if (!env.CHANGE_ID) {
        return;
    }
    def markdown
    try {
        markdown = readFile 'coverage/coverage-summary.md'
    } catch(Exception e) {
        return;
    }
    def commentId
    try {
        commentId = readFile(idFile) as Long
    } catch (Exception e) {}
    if (commentId) {
        pullRequest.editComment(commentId, markdown)
    } else {
        def comment = pullRequest.comment(markdown)
        writeFile file: idFile, text: comment.id.toString()
    }
}