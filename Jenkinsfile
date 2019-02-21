#!groovy
@Library('kanolib') _

pipeline {
    agent {
        label 'ubuntu_18.04_with_docker'
    }
    stages {
        stage('check environment') {
            steps {
                prepare_env()
            }
        }
        stage('checkout') {
            steps {
                checkout scm
            }
        }
        stage('install dependencies') {
            steps {
                script {
                    docker.image('node:8-alpine').inside('-u root') {
                        withCredentials([string(credentialsId: 'npm-read-only', variable: 'NPM_TOKEN')]) {
                            sh "apk update && apk upgrade && apk add --no-cache bash git openssh"
                            sh "mkdir -p ~/.ssh && ssh-keyscan github.com >> ~/.ssh/known_hosts"
                            sh "echo \"//registry.npmjs.org/:_authToken=${NPM_TOKEN}\" > ~/.npmrc"
                            sshagent(['read-only-github']) {
                                sh "yarn"
                            }
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