import { generateSeed, deriveKeypair, deriveAddress } from "ripple-keypairs";
import { toXorArr, buffer2hex } from "./utils";

const enc = new TextEncoder("utf-8");

const timeTaken = document.querySelector('#timeTaken');

async function genEntropy(key, salt) {
  timeTaken.innerHTML = 'Timing...'
  const tstart = performance.now();
  const baseKey = await window.crypto.subtle.importKey("raw", enc.encode(key), "PBKDF2", false, ["deriveBits"]);
  const s1 = await deriveBits(baseKey, salt);
  const s2 = await deriveBits(baseKey, buffer2hex(s1) + salt);
  const entropy = toXorArr(s1, s2);
  const tend = performance.now();
  timeTaken.innerHTML = `Took ${Math.round(tend - tstart)} ms`;
  return entropy;
}

async function deriveBits(key, salt) {
  const algo = {
    name: "PBKDF2",
    salt: enc.encode(salt),
    iterations: Math.pow(2, 21),
    hash: "sha-256"
  }
  const bitLen = 512;

  return window.crypto.subtle.deriveBits(algo, key, bitLen);
}

const button = document.querySelector('button');

async function buttonGenerating(active = false) {
  button.innerHTML = active ? 'Generating..' : 'Generate again';
  button.disabled = active ? true : false;
  button.className = active ? 'generating' : '';
}

const passphrase = document.querySelector('#passphrase');
const salt = document.querySelector('#salt');

document.querySelector('button').addEventListener('click', () => {
  if (passphrase.value !== '' && salt.value !== '') {
    buttonGenerating(true);
    genEntropy(passphrase.value, salt.value)
    .then(entropy => {
      const secret = generateSeed({ entropy });
      const keypair = deriveKeypair(secret);
      const address = deriveAddress(keypair.publicKey);
      document.querySelector('#address').value = address;
      document.querySelector('#privatekey').value = secret;

      buttonGenerating(false)
    });
  }
});
