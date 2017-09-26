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

        stage('test') {
            steps {
                node('win-test') {
                    prepare_env()
                    checkout scm
                    install_dep()
                    sh "./node_modules/.bin/gulp validate-challenges"
                    run_tests()
                }
            }
        }

        stage('build') {
            steps {
                sh "gulp build"
            }
        }

        stage('deploy') {
            steps {
                script {
                    def bucket = ''
                    if (env.BRANCH_NAME == "jenkins") {
                        echo 'deploy skipped'
                    } else if (env.BRANCH_NAME == "prod") {
                        bucket = 'make-apps-prod-site.kano.me'
                        deploy('./www', bucket)
                        archive(bucket)
                        // Rebuild the config of the index with the kit's target env
                        env.TARGET = "osonline"
                        sh 'gulp copy-index'
                        deploy('./www', 'make-apps-kit-site.kano.me')
                    } else if (env.BRANCH_NAME == "rc") {
                        bucket = 'apps-rc.kano.me'
                        deploy('./www', bucket)
                        archive(bucket)
                    } else if (env.NODE_ENV=="staging") {
                        bucket = 'make-apps-staging-site.kano.me'
                        deploy('./www', bucket)
                        archive(bucket)
                        sh 'gulp doc'
                        deploy('./www-doc', 'make-apps-doc')
                    }
                }
            }
        }
    }

    post {
        failure {
            notify_failure_to_committers()
        }
        success {
            script {
                if (env.BRANCH_NAME == "jenkins") {
                    echo 'archive skipped'
                } else {
                    release_archive(env)
                }
            }
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

def release_archive (env) {
    def rev = env.NODE_ENV == 'production' ? null : env.BUILD_NUMBER
    publish_to_releases {
        dir = './www'
        repo = 'kano-code'
        channel = env.NODE_ENV
        version = get_npm_package_version()
        revision = rev
    }
}

def archive(bucket) {
    def filename = "kc-build-latest.tar.gz"
    sh "tar -czf ${filename} ./www"
    sh "aws s3 cp ${filename} s3://${bucket} --region eu-west-1"
}

def deploy(dir, bucket) {
    sh "aws s3 sync ${dir} s3://${bucket} --region eu-west-1 --cache-control \"max-age=600\" --only-show-errors"
}
