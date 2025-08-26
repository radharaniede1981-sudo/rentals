const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Setting up LeaseHub Suite Notification System...\n');

try {
  // Install frontend dependencies
  console.log('📦 Installing frontend dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  // Install server dependencies
  console.log('📦 Installing server dependencies...');
  const serverPackageJson = path.join(__dirname, 'server', 'package.json');
  if (fs.existsSync(serverPackageJson)) {
    execSync('npm install', { cwd: path.join(__dirname, 'server'), stdio: 'inherit' });
  } else {
    console.log('⚠️  Server package.json not found, creating it...');
    const serverDeps = {
      "name": "leasehub-notification-server",
      "version": "1.0.0",
      "description": "Backend server for LeaseHub Suite notification management system",
      "main": "server.js",
      "scripts": {
        "start": "node server.js",
        "dev": "nodemon server.js"
      },
      "dependencies": {
        "express": "^4.18.2",
        "cors": "^2.8.5",
        "dotenv": "^16.3.1",
        "@sendgrid/mail": "^7.7.0",
        "twilio": "^4.19.0",
        "socket.io": "^4.7.2"
      },
      "devDependencies": {
        "nodemon": "^3.0.1"
      }
    };
    
    fs.writeFileSync(serverPackageJson, JSON.stringify(serverDeps, null, 2));
    execSync('npm install', { cwd: path.join(__dirname, 'server'), stdio: 'inherit' });
  }

  // Create .env file if it doesn't exist
  const envFile = path.join(__dirname, 'server', '.env');
  const envExample = path.join(__dirname, 'server', 'env.example');
  
  if (!fs.existsSync(envFile) && fs.existsSync(envExample)) {
    console.log('📝 Creating .env file from template...');
    fs.copyFileSync(envExample, envFile);
    console.log('✅ .env file created. Please update it with your API keys.');
  }

  console.log('\n✅ Setup complete!');
  console.log('\n🚀 To start the development environment:');
  console.log('   npm run dev:full');
  console.log('\n📡 To start only the backend server:');
  console.log('   npm run server:dev');
  console.log('\n🌐 To start only the frontend:');
  console.log('   npm run dev');
  console.log('\n📖 Visit http://localhost:8080/notifications to access the notification settings');

} catch (error) {
  console.error('❌ Setup failed:', error.message);
  process.exit(1);
}
