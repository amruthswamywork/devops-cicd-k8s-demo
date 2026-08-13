pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "amruth1docker/devops-cicd-k8s-demo"
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                    docker build \
                      -t ${DOCKER_IMAGE}:${BUILD_NUMBER} \
                      -t ${DOCKER_IMAGE}:latest \
                      .
                '''
            }
        }

        stage('Test Docker Image') {
            steps {
                sh '''
                    docker rm -f devops-test || true

                    docker run -d \
                      --name devops-test \
                      -p 3001:3000 \
                      ${DOCKER_IMAGE}:${BUILD_NUMBER}

                    sleep 5

                    curl -f http://localhost:3001/health

                    docker rm -f devops-test
                '''
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
                ]) {
                    sh '''
                        echo "$DOCKER_PASSWORD" | docker login \
                          -u "$DOCKER_USERNAME" \
                          --password-stdin

                        docker push ${DOCKER_IMAGE}:${BUILD_NUMBER}
                        docker push ${DOCKER_IMAGE}:latest

                        docker logout
                    '''
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    kubectl set image deployment/devops-webapp \
                      webapp=${DOCKER_IMAGE}:${BUILD_NUMBER}

                    kubectl rollout status deployment/devops-webapp
                '''
            }
        }
    }

    post {
        always {
            sh 'docker rm -f devops-test || true'
        }

        success {
            echo 'CI/CD pipeline completed successfully.'
        }

        failure {
            echo 'CI/CD pipeline failed.'
        }
    }
}
