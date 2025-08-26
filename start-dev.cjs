const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting LeaseHub Suite Development Environment...\n');

// Start backend server
console.log('📡 Starting backend server on port 3001...');
const backend = spawn('node', ['server/server.js'], {
  cwd: __dirname,
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'development' }
});

// Wait a moment for backend to start, then start frontend
setTimeout(() => {
  console.log('🌐 Starting frontend server on port 8080...');
  const frontend = spawn('npm', ['run', 'dev'], {
    cwd: __dirname,
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'development' }
  });

  // Handle frontend process exit
  frontend.on('close', (code) => {
    console.log(`\n🌐 Frontend server exited with code ${code}`);
    backend.kill();
    process.exit(code);
  });
}, 2000);

// Handle backend process exit
backend.on('close', (code) => {
  console.log(`\n📡 Backend server exited with code ${code}`);
  process.exit(code);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down servers...');
  backend.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down servers...');
  backend.kill();
  process.exit(0);
});
