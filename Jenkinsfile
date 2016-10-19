#!groovy
node {
    stage('check environment') {
        if (env.BRANCH_NAME=="master" || env.BRANCH_NAME=="jenkins") {
            env.DEV_ENV = "staging"
        } else if (env.BRANCH_NAME=="prod" || env.BRANCH_NAME=="pre-release") {
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

    stage('test') {
        sh "gulp build-dev"
        sh "xvfb-run --auto-servernum gulp wct"
        // Remove the test folder
        sh "rm -rf www"
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
            deploy_doc()
        } else if (env.BRANCH_NAME=="pre-release") {
            deploy_pre_release()
        } else if (env.NODE_ENV=="production") {
            deploy_prod()
        }
    }

    stage('pwa') {
        parallel(
            'lighthouse report': {
                def report_file = 'index.html'
                def report_folder = './lighthouse-report/'
                def deployed_url = ''
                if (env.NODE_ENV=="staging") {
                    deployed_url = "https://apps-staging.kano.me"
                } else if (env.NODE_ENV=="production") {
                    deployed_url = "https://apps.kano.me"
                }
                env.DISPLAY = ':99.0'
                env.LIGHTHOUSE_CHROMIUM_PATH = '/usr/bin/google-chrome-stable'
                sh "rm -rf ${report_folder}"
                sh "mkdir ${report_folder}"
                
                sh "timeout 20000 xvfb-run  --auto-servernum lighthouse ${deployed_url} --output html --output-path=${report_folder}${report_file} --quiet || echo 'Lighthouse timedout'"
                
                publishHTML (target: [
                    keepAll: true,
                    reportDir: report_folder,
                    reportFiles: report_file,
                    reportName: "Lighthouse report"
                ])
            },
            'archive': {
                def version = getVersion()
                def filename = "kano-code-v${version}-build-${env.BUILD_NUMBER}.tar.gz"
                sh "tar -czf ${filename} ./www"
                archiveArtifacts filename
            }
        )
    }
}

def deploy_doc() {
    sh 'gulp doc'
    sh 'aws s3 sync ./www-doc s3://make-apps-doc --region eu-west-1 --cache-control "max-age=600" --only-show-errors'
}

def deploy_staging() {
    sh 'aws s3 sync ./www s3://make-apps-staging-site.kano.me --region eu-west-1 --cache-control "max-age=600" --only-show-errors'
}

def deploy_pre_release() {
    sh 'aws s3 sync ./www s3://apps-pre-release.kano.me --region eu-west-1 --cache-control "max-age=600" --only-show-errors'
}

def deploy_prod() {
    sh 'aws s3 sync ./www s3://make-apps-prod-site.kano.me --region us-west-1 --cache-control "max-age=600" --only-show-errors'
    // Rebuild the config of the index with the kit's target env
    env.TARGET = "osonline"
    sh 'gulp copy-index'
    // Upload the modified version to the kit's bucket
    sh 'aws s3 sync ./www s3://make-apps-kit-site.kano.me --region eu-west-1 --cache-control "max-age=600" --only-show-errors'
}

def getVersion() {
    def packageJsonString = readFile('./package.json')
    def packageJson = new groovy.json.JsonSlurper().parseText(packageJsonString)
    return packageJson.version
}