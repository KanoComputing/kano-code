#!groovy
@Library('kanolib') _

pipeline {
    agent any

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
                install_dep()
            }
        }
    }
    post {
        failure {
            notify_failure_to_committers()
        }
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '20'))
        timeout(time: 60, unit: 'MINUTES')
    }
}

def prepare_env () {
    if (env.BRANCH_NAME=="master" || env.BRANCH_NAME=="jenkins") {
        env.DEV_ENV = "staging"
    } else if (env.BRANCH_NAME=="rc") {
        env.DEV_ENV = "rc"
    } else if (env.BRANCH_NAME=="prod") {
        env.DEV_ENV = "production"
    }
    env.NODE_ENV = "${env.DEV_ENV}"
}

def install_dep () {
    sh "yarn --production=false"
}
