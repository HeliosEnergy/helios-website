import { exec } from 'child_process';
import { promisify } from 'util';
import { mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import { resolve } from 'path';

const execAsync = promisify(exec);

/**
 * Generates a self-signed SSL certificate using OpenSSL
 * @param certPath Directory to store the generated certificates
 */
export async function generateSelfSignedCert(certPath: string): Promise<void> {
  try {
    console.log(`Creating certificate directory: ${certPath}`);
    // Ensure certificate directory exists
    if (!existsSync(certPath)) {
      await mkdir(certPath, { recursive: true });
    }

    const keyFile = resolve(certPath, 'key.pem');
    const certFile = resolve(certPath, 'cert.pem');
    
    console.log(`Generating private key: ${keyFile}`);
    // Generate a private key
    await execAsync(`openssl genrsa -out "${keyFile}" 2048`);
    
    console.log(`Generating certificate: ${certFile}`);
    // Generate a self-signed certificate (valid for 365 days)
    await execAsync(
      `openssl req -new -x509 -key "${keyFile}" -out "${certFile}" -days 365 -subj "/CN=localhost" -addext "subjectAltName = DNS:localhost"`
    );
    
    console.log(`Self-signed certificate generated successfully at ${certPath}`);
  } catch (error) {
    console.error('Failed to generate self-signed certificate:', error);
    throw error;
  }
} 