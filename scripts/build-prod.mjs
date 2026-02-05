#!/usr/bin/env node
/**
 * Build de Produção - Limpa e cria pacotes para Chrome e Firefox
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const distDir = path.join(rootDir, 'dist');
const releaseDir = path.join(rootDir, 'release');

const ensureDir = (dir) => fs.mkdirSync(dir, { recursive: true });
const cleanDir = (dir) => {
  fs.rmSync(dir, { recursive: true, force: true });
  ensureDir(dir);
};

const copyFile = (src, dest) => {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
};

const copyDir = (src, dest) => {
  if (!fs.existsSync(src)) return;
  ensureDir(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });
  entries.forEach((entry) => {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  });
};

const removeSourceMaps = (dir) => {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  entries.forEach((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      removeSourceMaps(fullPath);
    } else if (entry.name.endsWith('.map')) {
      fs.unlinkSync(fullPath);
      console.log(`  🗑️  Removido: ${fullPath.replace(rootDir, '')}`);
    }
  });
};

const removeTests = (dir) => {
  const testsDir = path.join(dir, 'tests');
  if (fs.existsSync(testsDir)) {
    fs.rmSync(testsDir, { recursive: true, force: true });
    console.log(`  🗑️  Removido: /tests`);
  }
};

const createZip = (sourceDir, zipPath) => {
  // Zipa o CONTEÚDO da pasta, não a pasta em si
  const files = fs.readdirSync(sourceDir);
  const fileArgs = files.map(f => path.join(sourceDir, f));
  
  // Usar zip command (Linux/Mac) ou powershell (Windows)
  try {
    execSync(`cd "${sourceDir}" && zip -r "${zipPath}" . -x "*.map"`, { stdio: 'inherit' });
  } catch {
    // Fallback para Node.js
    console.log('  ⚠️  Usando fallback para criar zip...');
  }
};

const createFirefoxManifest = (chromeManifest) => {
  // Converte Manifest V3 para V2 (Firefox)
  const firefoxManifest = { ...chromeManifest };
  
  firefoxManifest.manifest_version = 2;
  firefoxManifest.browser_specific_settings = {
    gecko: {
      id: 'parchi@extension.local',
      strict_min_version: '109.0'
    }
  };
  
  // Converter background service worker para scripts
  if (chromeManifest.background?.service_worker) {
    firefoxManifest.background = {
      scripts: [chromeManifest.background.service_worker],
      persistent: false
    };
  }
  
  // Converter action para browser_action
  if (chromeManifest.action) {
    firefoxManifest.browser_action = chromeManifest.action;
    delete firefoxManifest.action;
  }
  
  // Ajustar permissões (remover declarativeNetRequest, sidePanel)
  firefoxManifest.permissions = (chromeManifest.permissions || []).filter(
    p => !['declarativeNetRequest', 'sidePanel'].includes(p)
  );
  
  // Adicionar permissões específicas do Firefox
  if (!firefoxManifest.permissions.includes('activeTab')) {
    firefoxManifest.permissions.push('activeTab');
  }
  
  // Content scripts permanecem iguais
  // Host permissions vão para permissions no V2
  if (chromeManifest.host_permissions) {
    firefoxManifest.permissions.push(...chromeManifest.host_permissions);
    delete firefoxManifest.host_permissions;
  }
  
  // Remover side_panel (Firefox não suporta)
  delete firefoxManifest.side_panel;
  
  return firefoxManifest;
};

const run = async () => {
  console.log('🚀 Build de Produção - Parchi Extension\n');
  
  // 1. Limpar release/
  console.log('📁 Limpando pasta release/...');
  cleanDir(releaseDir);
  
  // 2. Build completo
  console.log('\n🔨 Executando build completo...');
  execSync('npm run build', { stdio: 'inherit', cwd: rootDir });
  
  // 3. Verificar se dist/ existe
  if (!fs.existsSync(distDir)) {
    console.error('❌ Erro: Pasta dist/ não encontrada!');
    process.exit(1);
  }
  
  // ============================================
  // CHROME VERSION
  // ============================================
  console.log('\n📦 Preparando versão Chrome...');
  const chromeDir = path.join(releaseDir, 'chrome');
  copyDir(distDir, chromeDir);
  
  // Remover source maps
  console.log('  🧹 Removendo source maps...');
  removeSourceMaps(chromeDir);
  
  // Remover tests
  console.log('  🧹 Removendo arquivos de teste...');
  removeTests(chromeDir);
  
  // Criar zip (conteúdo na raiz)
  const chromeZip = path.join(releaseDir, 'ai-browser-chrome-v0.2.0.zip');
  console.log(`  📦 Criando ${path.basename(chromeZip)}...`);
  
  try {
    execSync(`cd "${chromeDir}" && zip -r "${chromeZip}" .`, { stdio: 'ignore' });
    const chromeSize = (fs.statSync(chromeZip).size / 1024 / 1024).toFixed(2);
    console.log(`  ✅ Chrome: ${chromeSize} MB`);
  } catch (error) {
    console.error('  ❌ Erro ao criar zip do Chrome:', error.message);
  }
  
  // ============================================
  // FIREFOX VERSION
  // ============================================
  console.log('\n🦊 Preparando versão Firefox...');
  const firefoxDir = path.join(releaseDir, 'firefox');
  copyDir(distDir, firefoxDir);
  
  // Converter manifest
  console.log('  📝 Convertendo manifest para V2...');
  const chromeManifestPath = path.join(distDir, 'manifest.json');
  const chromeManifest = JSON.parse(fs.readFileSync(chromeManifestPath, 'utf8'));
  const firefoxManifest = createFirefoxManifest(chromeManifest);
  
  const firefoxManifestPath = path.join(firefoxDir, 'manifest.json');
  fs.writeFileSync(firefoxManifestPath, JSON.stringify(firefoxManifest, null, 2));
  
  // Remover source maps
  console.log('  🧹 Removendo source maps...');
  removeSourceMaps(firefoxDir);
  
  // Remover tests
  console.log('  🧹 Removendo arquivos de teste...');
  removeTests(firefoxDir);
  
  // Criar zip
  const firefoxZip = path.join(releaseDir, 'ai-browser-firefox-v0.2.0.zip');
  console.log(`  📦 Criando ${path.basename(firefoxZip)}...`);
  
  try {
    execSync(`cd "${firefoxDir}" && zip -r "${firefoxZip}" .`, { stdio: 'ignore' });
    const firefoxSize = (fs.statSync(firefoxZip).size / 1024 / 1024).toFixed(2);
    console.log(`  ✅ Firefox: ${firefoxSize} MB`);
  } catch (error) {
    console.error('  ❌ Erro ao criar zip do Firefox:', error.message);
  }
  
  // ============================================
  // RESUMO
  // ============================================
  console.log('\n' + '='.repeat(50));
  console.log('✅ Build de Produção Completo!');
  console.log('='.repeat(50));
  console.log(`\n📁 Arquivos em: ${releaseDir}/`);
  console.log('  📦 ai-browser-chrome-v0.2.0.zip  → Chrome Web Store');
  console.log('  📦 ai-browser-firefox-v0.2.0.zip → Firefox Add-ons');
  console.log('\n📂 Pastas para teste:');
  console.log('  📁 release/chrome/  → Carregar em chrome://extensions');
  console.log('  📁 release/firefox/ → Carregar em about:debugging');
  console.log('');
};

run().catch((error) => {
  console.error('\n❌ Erro no build:', error);
  process.exit(1);
});
