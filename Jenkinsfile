#!groovy
@Library('kanolib') _

pipeline {
    agent any

    stages {
        stage('check environment') {
            steps {
                script {
                    if (env.BRANCH_NAME=="master" || env.BRANCH_NAME=="jenkins" || env.BRANCH_NAME=="lightboard" || env.BRANCH_NAME=="lightboard-rc") {
                        env.DEV_ENV = "staging"
                    } else if (env.BRANCH_NAME=="prod" || env.BRANCH_NAME=="prod-lightboard" || env.BRANCH_NAME=="pre-release") {
                        env.DEV_ENV = "production"
                    }
                    env.NODE_ENV = "${env.DEV_ENV}"
                }
            }
        }

        stage('checkout') {
            steps {
                checkout scm
            }
        }

        stage('clean') {
            steps {
                sh "rm -rf app/bower_components"
                sh "bower cache clean"
            }
        }

        stage('install dependencies') {
            steps {
                sh "npm install --ignore-scripts"
                sh "bower install"
            }
        }

        stage('test') {
            steps {
                sh "gulp validate-challenges"
                sh "mkdir -p test-results"
                sh "xvfb-run --auto-servernum gulp wct"
                junit allowEmptyResults: true, testResults: 'test-results/wct.xml'
                cucumber 'test-results/cucumber.json'
                // Remove the test folder
                sh "rm -rf www test-results"
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
                    } else if (env.BRANCH_NAME == "prod-lightboard") {
                        bucket = 'apps-lightboard.kano.me'
                        deploy('./www', bucket)
                        archive(bucket)
                    } else if (env.BRANCH_NAME == "lightboard") {
                        bucket = 'apps-lightboard-staging.kano.me'
                        deploy('./www', bucket)
                        archive(bucket)
                    } else if (env.NODE_ENV=="staging") {
                        bucket = 'make-apps-staging-site.kano.me'
                        deploy('./www', bucket)
                        archive(bucket)
                        sh 'gulp doc'
                        deploy('./www-doc', 'make-apps-doc')
                    } else if (env.NODE_ENV=="production") {
                        bucket = 'make-apps-prod-site.kano.me'
                        deploy('./www', bucket)
                        archive(bucket)
                        // Rebuild the config of the index with the kit's target env
                        env.TARGET = "osonline"
                        sh 'gulp copy-index'
                        deploy('./www', 'make-apps-kit-site.kano.me')
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
            release_archive(env)
        }
    }
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
