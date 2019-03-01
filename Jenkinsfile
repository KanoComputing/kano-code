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
        stage('docs') {
            steps {
                script {
                    if (env.BRANCH_NAME !== "master") {
                        return;
                    }
                    def version = get_npm_package_version();
                    docker.image('node:8-alpine').inside {
                        sh "yarn docs"
                    }
                    docker.image('ughly/alpine-aws-cli').inside {
                        withCredentials([[$class: 'AmazonWebServicesCredentialsBinding', accessKeyVariable: 'AWS_ACCESS_KEY_ID', credentialsId: 'kart', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY']]) {
                            // Clean previous docs
                            sh "aws s3 rm s3://code-docs.kano.me/${version} --recursive"
                            // Upload files
                            sh "aws s3 cp ./docs/ s3://code-docs.kano.me/${version} --recursive"
                        }
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

/**
 * Reads the coverage report and post it on a potential github PR
 */
def updatePR() {
    def idFile = '.gh-comment-id'
    try {
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
            comment = null
        }
    } catch(Exception e) {
        // Delete the file in case of errors
        sh "rm ${idFile}"
    }
}