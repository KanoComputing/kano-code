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

        // stage('install dependencies') {
        //     steps {
        //         install_dep()
        //     }
        // }

        // stage('test') {
        //     steps {
        //         node('win-test') {
        //             prepare_env()
        //             checkout scm
        //             install_dep()
        //             sh "./node_modules/.bin/gulp validate-challenges"
        //             run_tests()
        //         }
        //     }
        // }

        // stage('build') {
        //     steps {
        //         sh "gulp build"
        //     }
        // }

        // stage('deploy') {
        //     steps {
        //         script {
        //             def bucket = ''
        //             if (env.BRANCH_NAME == "jenkins") {
        //                 echo 'deploy skipped'
        //             } else if (env.BRANCH_NAME == "prod") {
        //                 deploy("production", false)

        //                 // Rebuild the config of the index with the kit's target env
        //                 env.TARGET = "osonline"
        //                 sh "gulp copy-index"
        //                 deploy("production-kit", false)
        //             } else if (env.BRANCH_NAME == "rc") {
        //                 deploy("rc", true)
        //             } else if (env.NODE_ENV=="staging") {
        //                 deploy("staging", true)

        //                 sh "gulp doc"
        //                 sh "./node_modules/.bin/kart archive ./www-doc -a releases.kano.me -r . --name kano-code-doc --channel main --release"
        //             }
        //         }
        //     }
        // }
    }

    post {
        failure {
            notify_failure_to_committers()
        }
        always {
            updateGithubCommitStatus('Just testing https://localhost:50000')
            sleep 20
        }
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '20'))

        timeout(time: 60, unit: 'MINUTES')
    }
}

def prepare_env () {
    if (env.BRANCH_NAME=="master" || env.BRANCH_NAME=="jenkins" || env.BRANCH_NAME=="rc") {
        env.DEV_ENV = "staging"
    } else if (env.BRANCH_NAME=="prod") {
        env.DEV_ENV = "production"
    }
    env.NODE_ENV = "${env.DEV_ENV}"
}

def install_dep () {
    sh "npm install --ignore-scripts"
    sh "rm -rf app/bower_components"
    sh "./node_modules/.bin/bower cache clean"
    sh "./node_modules/.bin/bower install"
}

def run_tests () {
    sh "mkdir -p test-results"
    sh "./node_modules/.bin/gulp wct"
    sh "./node_modules/.bin/cucumberjs tests --format=json > test-results/cucumber.json"
    junit allowEmptyResults: true, testResults: 'test-results/wct.xml'
    cucumber 'test-results/cucumber.json'
    sh "rm -rf www test-results"
}

def deploy(branch, release) {
    def cmd = "./node_modules/.bin/kart archive ./www -a releases.kano.me -r . --channel ${branch}"

    if (release) {
        cmd = cmd + " --release"
    }

    sh cmd
}
 
def updateGithubCommitStatus(message) {
 
  step([
    $class: 'GitHubCommitStatusSetter',
    reposSource: [$class: "ManuallyEnteredRepositorySource", url: "https://github.com/KanoComputing/kano-codes"],
    errorHandlers: [[$class: 'ShallowAnyErrorHandler']],
    statusResultSource: [
      $class: 'ConditionalStatusResultSource',
      results: [
        [$class: 'AnyBuildResult', result: 'SUCCESS', state: 'SUCCESS', message: message]
      ]
    ]
  ])
}
