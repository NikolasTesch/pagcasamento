function crc16(str) {
  let crc = 0xFFFF;
  const bytes = new TextEncoder().encode(str);
  for (const byte of bytes) {
    crc ^= byte << 8;
    for (let i = 0; i < 8; i++) {
      crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1);
    }
    crc &= 0xFFFF;
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function buildTLV(id, value) {
  return id + value.length.toString().padStart(2, '0') + value;
}

function generatePixPayload(pixConfig, amount) {
  const name = pixConfig.receiverName.substring(0, 25).toUpperCase();
  const city = pixConfig.city.substring(0, 15).toUpperCase();
  const amountStr = Number(amount).toFixed(2);

  const merchantAccountInfo = buildTLV('26',
    buildTLV('00', 'br.gov.bcb.pix') +
    buildTLV('01', pixConfig.key)
  );

  const additionalData = buildTLV('62', buildTLV('05', '***'));

  const payload =
    buildTLV('00', '01') +
    merchantAccountInfo +
    buildTLV('52', '0000') +
    buildTLV('53', '986') +
    buildTLV('54', amountStr) +
    buildTLV('58', 'BR') +
    buildTLV('59', name) +
    buildTLV('60', city) +
    additionalData +
    '6304';

  return payload + crc16(payload);
}

function renderQRCode(payload, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  try {
    const qr = qrcode(0, 'M');
    qr.addData(payload);
    qr.make();
    container.innerHTML = qr.createSvgTag(4, 0);
  } catch (e) {
    container.innerHTML = '<p style="color:#888;font-size:0.85rem;">QR Code indisponível.<br>Use a chave Pix abaixo.</p>';
  }
}
