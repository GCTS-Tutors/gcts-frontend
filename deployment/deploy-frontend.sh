#!/bin/bash

#######################################################################
# GCTS Frontend - Deployment Script
# This script deploys the Next.js frontend application
#######################################################################

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_DIR="/home/ubuntu/gcts"
FRONTEND_DIR="$PROJECT_DIR/frontend"
BACKUP_DIR="$PROJECT_DIR/backups/frontend"
LOG_DIR="$PROJECT_DIR/logs"

# Logging functions
log() {
    echo -e "${GREEN}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

# Check if running as correct user
check_user() {
    if [ "$USER" != "ubuntu" ]; then
        warning "This script should be run as the ubuntu user"
    fi
}

# Pre-deployment checks
pre_deployment_checks() {
    log "Running pre-deployment checks..."

    # Check if Node.js is installed
    if ! command -v node &> /dev/null; then
        error "Node.js is not installed. Please run the initial setup script first."
    fi

    # Check if PM2 is installed
    if ! command -v pm2 &> /dev/null; then
        error "PM2 is not installed. Please run: npm install -g pm2"
    fi

    # Check if frontend directory exists
    if [ ! -d "$FRONTEND_DIR" ]; then
        error "Frontend directory not found at $FRONTEND_DIR"
    fi

    # Check Node.js version
    NODE_VERSION=$(node -v)
    info "Node.js version: $NODE_VERSION"

    # Check if git is available
    if ! command -v git &> /dev/null; then
        error "Git is not installed"
    fi

    log "Pre-deployment checks completed."
}

# Create backup
create_backup() {
    log "Creating backup..."

    # Create backup directory
    sudo mkdir -p $BACKUP_DIR
    BACKUP_TIMESTAMP=$(date +%Y%m%d_%H%M%S)
    BACKUP_PATH="$BACKUP_DIR/backup_$BACKUP_TIMESTAMP"

    # Backup frontend build
    if [ -d "$FRONTEND_DIR/.next" ]; then
        log "Backing up previous build..."
        sudo mkdir -p $BACKUP_PATH
        sudo cp -r $FRONTEND_DIR/.next $BACKUP_PATH/
        log "Backup created at $BACKUP_PATH"
    else
        info "No previous build found, skipping backup"
    fi

    # Keep only last 5 backups
    BACKUP_COUNT=$(ls -1 $BACKUP_DIR | wc -l)
    if [ $BACKUP_COUNT -gt 5 ]; then
        log "Cleaning old backups..."
        cd $BACKUP_DIR
        ls -t | tail -n +6 | xargs sudo rm -rf
    fi
}

# Pull latest code
pull_code() {
    log "Pulling latest code from repository..."

    cd $FRONTEND_DIR

    # Store current commit
    CURRENT_COMMIT=$(git rev-parse HEAD)
    info "Current commit: $CURRENT_COMMIT"

    # Pull latest changes
    git fetch origin
    git pull origin develop

    # Get new commit
    NEW_COMMIT=$(git rev-parse HEAD)
    COMMIT_MESSAGE=$(git log -1 --pretty=%B)

    if [ "$CURRENT_COMMIT" == "$NEW_COMMIT" ]; then
        info "No new changes to deploy"
    else
        log "Deployed commit: $NEW_COMMIT"
        info "Commit message: $COMMIT_MESSAGE"
    fi
}

# Install dependencies
install_dependencies() {
    log "Installing dependencies..."

    cd $FRONTEND_DIR

    # Clean install for production
    if [ "${CLEAN_INSTALL:-false}" == "true" ]; then
        log "Performing clean install..."
        rm -rf node_modules package-lock.json
    fi

    npm install --production=false

    log "Dependencies installed."
}

# Build application
build_application() {
    log "Building Next.js application..."

    cd $FRONTEND_DIR

    # Set production environment
    export NODE_ENV=production

    # Build the application
    npm run build

    if [ $? -eq 0 ]; then
        log "Build completed successfully"
    else
        error "Build failed"
    fi
}

# Restart PM2 service
restart_service() {
    log "Restarting frontend service..."

    cd $FRONTEND_DIR

    # Check if PM2 process exists
    if pm2 list | grep -q "gcts-frontend"; then
        log "Reloading existing PM2 process..."
        pm2 reload ecosystem.config.js --env production
    else
        log "Starting new PM2 process..."
        pm2 start ecosystem.config.js --env production
    fi

    # Save PM2 configuration
    pm2 save

    log "Frontend service restarted."
}

# Health check
health_check() {
    log "Performing health check..."

    # Wait for service to start
    sleep 5

    # Check if PM2 process is running
    if pm2 list | grep -q "gcts-frontend.*online"; then
        log "Frontend service is running"
    else
        error "Frontend service failed to start"
    fi

    # Check if port 3000 is listening
    if netstat -tuln | grep -q ":3000"; then
        log "Frontend is listening on port 3000"
    else
        warning "Port 3000 is not listening. Check PM2 logs: pm2 logs gcts-frontend"
    fi

    log "Health check completed."
}

# View logs
view_logs() {
    log "Recent logs from PM2:"
    pm2 logs gcts-frontend --lines 50 --nostream
}

# Rollback to previous version
rollback() {
    log "Rolling back to previous version..."

    cd $FRONTEND_DIR
    PREVIOUS_COMMIT=$(git log --oneline -n 2 | tail -1 | cut -d' ' -f1)

    if [ -n "$PREVIOUS_COMMIT" ]; then
        git checkout $PREVIOUS_COMMIT
        install_dependencies
        build_application
        restart_service
        health_check
        log "Rollback to $PREVIOUS_COMMIT completed."
    else
        error "Could not determine previous commit"
    fi
}

# Main deployment function
deploy() {
    log "Starting frontend deployment..."

    check_user
    pre_deployment_checks

    if [ "${SKIP_BACKUP:-false}" != "true" ]; then
        create_backup
    fi

    pull_code
    install_dependencies
    build_application
    restart_service
    health_check

    log "Frontend deployment completed successfully!"
    info "Application is running at http://localhost:3000"
    info "View logs with: pm2 logs gcts-frontend"
}

# Parse command line arguments
case "${1:-deploy}" in
    deploy)
        deploy
        ;;
    rollback)
        rollback
        ;;
    logs)
        view_logs
        ;;
    restart)
        restart_service
        health_check
        ;;
    *)
        echo "Usage: $0 {deploy|rollback|logs|restart}"
        echo ""
        echo "Commands:"
        echo "  deploy   - Deploy latest version from develop branch (default)"
        echo "  rollback - Rollback to previous version"
        echo "  logs     - View recent logs"
        echo "  restart  - Restart the service"
        echo ""
        echo "Environment variables:"
        echo "  SKIP_BACKUP=true    - Skip backup creation"
        echo "  CLEAN_INSTALL=true  - Perform clean npm install"
        exit 1
        ;;
esac
