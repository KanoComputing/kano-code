#!groovy
node {
    stage('check environment') {
        if (env.BRANCH_NAME=="master" || env.BRANCH_NAME=="jenkins") {
            env.DEV_ENV = "staging"
        } else if (env.BRANCH_NAME=="prod") {
            env.DEV_ENV = "production"
        }
        env.NODE_ENV = "${env.DEV_ENV}"
    }

    stage('checkout') {
        checkout scm
    }

    stage('clean') {
        sh "rm -rf app/bower_components"
        sh "bower cache clean"
    }

    stage('install dependencies') {
        sh "npm install --ignore-scripts"
        sh "bower install"
    }

    stage('build') {
        sh "gulp build"
    }

    stage('compress') {
        sh "gulp compress"
    }

    stage('deploy') {
        if (env.NODE_ENV=="staging") {
            deploy_staging()
        } else if (env.NODE_ENV=="production") {
            deploy_prod()
        }
    }

    stage('pwa') {
        def report_path = './lighthouse-results.json'
        if (env.NODE_ENV=="staging") {
            def deployed_url = 'https://apps-staging.kano.me'
        } else if (env.NODE_ENV=="production") {
            def deployed_url = 'https://apps.kano.me'
        }
        env.DISPLAY = ':99.0'
        env.LIGHTHOUSE_CHROMIUM_PATH = '/usr/bin/google-chrome-stable'
        sh 'xvfb-run lighthouse ${deployed_url} --output json --output-path=${report_path}'

        def result = readFile(report_path).trim()

        slackSend channel: 'test_github', color: 'good', message: result
    }
}

def deploy_staging() {
    sh 'aws s3 sync ./www s3://make-apps-staging-site.kano.me --region eu-west-1 --cache-control "max-age=600"'
}

def deploy_prod() {
    sh 'aws s3 sync ./www s3://make-apps-prod-site.kano.me --region us-west-1 --cache-control "max-age=600"'
}