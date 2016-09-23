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
        if (env.BRANCH_NAME == "jenkins") {
            echo 'deploy skipped'
        } else if (env.NODE_ENV=="staging") {
            deploy_staging()
        } else if (env.NODE_ENV=="production") {
            deploy_prod()
        }
    }

    stage('pwa') {
        parallel(
            'lighthouse report': {
                def report_path = 'lighthouse-report.html'
                def deployed_url = ''
                if (env.NODE_ENV=="staging") {
                    deployed_url = "https://apps-staging.kano.me"
                } else if (env.NODE_ENV=="production") {
                    deployed_url = "https://apps.kano.me"
                }
                env.DISPLAY = ':99.0'
                env.LIGHTHOUSE_CHROMIUM_PATH = '/usr/bin/google-chrome-stable'
                sh "xvfb-run lighthouse ${deployed_url} --output html --output-path=${report_path} --quiet"

                publishHTML (target: [
                    allowMissing: false,
                    alwaysLinkToLastBuild: false,
                    keepAll: true,
                    reportDir: './',
                    reportFiles: report_path,
                    reportName: "Lighthouse report"
                ])
            },
            'archive': {
                def version = getVersion()
                def filename = "kano-code-v${version}-build-${env.BUILD_NUMBER}.tar.gz"
                sh "tar -czv ${filename} ./www"
                archiveArtifacts filename
            }
        )
    }
}

def deploy_staging() {
    sh 'aws s3 sync ./www s3://make-apps-staging-site.kano.me --region eu-west-1 --cache-control "max-age=600"'
}

def deploy_prod() {
    sh 'aws s3 sync ./www s3://make-apps-prod-site.kano.me --region us-west-1 --cache-control "max-age=600"'
}

def getVersion() {
    def packageJsonString = readFile('./package.json')
    def packageJson = new groovy.json.JsonSlurper().parseText(packageJsonString)
    return packageJson.version
}