import forge from 'node-forge';

export const getPasswordHash = (password: string) =>
  forge.util.encode64(forge.pkcs5.pbkdf2(password, '', 7000, 64, forge.md.sha512.create()));

export const getEncryptKey = (masterPasswordHash: string) =>
  forge.util.encode64(forge.pkcs5.pbkdf2(masterPasswordHash, 'master-encrypt-key', 1542, 32, forge.md.sha512.create()));

export const getIv = (masterPasswordHash: string) =>
  forge.util.encode64(forge.pkcs5.pbkdf2(masterPasswordHash, 'master-iv', 1007, 32, forge.md.sha512.create()));

export const encryptData = (data: string, key: string, iv: string) => {
  const cipher = forge.cipher.createCipher('AES-CBC', key);
  cipher.start({ iv: iv });
  cipher.update(forge.util.createBuffer(data));
  cipher.finish();
  return forge.util.encode64(cipher.output.toHex());
};

export const decryptData = (encryptedData: string, key: string, iv: string) => {
  const decipher = forge.cipher.createDecipher('AES-CBC', key);
  decipher.start({ iv: iv });
  decipher.update(forge.util.createBuffer(forge.util.hexToBytes(forge.util.decode64(encryptedData))));
  decipher.finish()
  return decipher.output.data;
};
