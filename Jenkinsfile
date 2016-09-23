node {
    stage('check environment') {
        if (env.BRANCH_NAME==="staging") {
            env.DEV_ENV = "staging"
        } else if (env.BRANCH_NAME==="jenkins") {
            env.DEV_ENV = "staging"
        }
        env.NODE_ENV = "${env.DEV_ENV}"
    }

    stage('checkout') {
        checkout scm
    }

    stage('install dependencies') {
        sh "rm -rf app/bower_components"
        sh "bower cache clean"
        sh "npm install"
    }

    stage('compress') {
        sh "gulp compress"
    }

    stage('deploy') {
        if (env.NODE_ENV==="staging") {
            deploy_staging()
        } else if (env.NODE_ENV==="production") {
            deploy_prod()
        }
    }
}

def deploy_staging() {
    sh 'aws s3 sync ./www s3://make-apps-staging-site.kano.me --region eu-west-1 --cache-control "max-age=600"'
}

def deploy_prod() {
    sh 'aws s3 sync ./www s3://make-apps-prod-site.kano.me --region us-west-1 --cache-control "max-age=600"'
}