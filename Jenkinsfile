#!groovy
node {
    stage('check environment') {
        if (env.BRANCH_NAME=="master" || env.BRANCH_NAME=="jenkins" || env.BRANCH_NAME=="lightboard") {
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
        sh "gulp validate-challenges"
        try {
            sh "xvfb-run --auto-servernum gulp wct"
        } catch (Exception err) {
            slackSend color: '#ff0000', message: 'Kano Code build failed to pass tests on staging. Deploy canceled'
            currentBuild.result = 'FAILURE'
        }
        // Remove the test folder
        sh "rm -rf www"
    }

    stage('build') {
        sh "gulp build"
    }

    stage('deploy') {
        def bucket = ''
        if (env.BRANCH_NAME == "jenkins") {
            echo 'deploy skipped'
        } else if (env.BRANCH_NAME == "lightboard") {
            bucket = 'apps-lightboard.kano.me'
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

def archive(bucket) {
    def filename = "kc-build-latest.tar.gz"
    sh "tar -czf ${filename} ./www"
    sh "aws s3 cp ${filename} s3://${bucket} --region eu-west-1"
}

def deploy(dir, bucket) {
    sh "aws s3 sync ${dir} s3://${bucket} --region eu-west-1 --cache-control \"max-age=600\" --only-show-errors"
}

def getVersion() {
    def packageJsonString = readFile('./package.json')
    def packageJson = new groovy.json.JsonSlurper().parseText(packageJsonString)
    return packageJson.version
}
