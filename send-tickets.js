const { Resend } = require('resend');
const fs = require('fs');
const path = require('path');

// ─────────────────────────────────────────────
//  CONFIG — fill these in before sending
// ─────────────────────────────────────────────
const RESEND_API_KEY = process.env.RESEND_API_KEY || 'YOUR_RESEND_API_KEY';
const FROM_EMAIL     = 'DRAG <info@drag-the-movie.com>';   // must match a verified domain in Resend
const REPLY_TO       = 'info@jersey2ndave.com';
const SUBJECT        = 'Your Tickets Are Reserved — DRAG World Premiere · March 13';

// ─────────────────────────────────────────────
//  DRY RUN — set to false when ready to send
// ─────────────────────────────────────────────
const DRY_RUN = true;

// ─────────────────────────────────────────────
//  DELAY between sends (ms) — avoids rate limits
// ─────────────────────────────────────────────
const DELAY_MS = 500;

// ─────────────────────────────────────────────────────────────────
const resend   = new Resend(RESEND_API_KEY);
const template = fs.readFileSync(path.join(__dirname, 'email-ticket-reservation.html'), 'utf8');

function buildHtml(names, ticketCount) {
  const ticketWord = parseInt(ticketCount) === 1 ? 'ticket' : 'tickets';
  return template
    .replaceAll('{{NAMES}}',        names)
    .replaceAll('{{TICKET_COUNT}}', String(ticketCount))
    .replaceAll('{{TICKET_WORD}}',  ticketWord);
}

function parseCSV(filePath) {
  const lines = fs.readFileSync(filePath, 'utf8').trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(line => {
    // Handle commas inside quoted fields
    const cols = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || [];
    const row = {};
    headers.forEach((h, i) => {
      row[h] = (cols[i] || '').replace(/^"|"$/g, '').trim();
    });
    return row;
  }).filter(row => row.email);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  const guests = parseCSV(path.join(__dirname, 'guests.csv'));

  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log(`║  DRAG Ticket Emails — ${DRY_RUN ? '🔍 DRY RUN MODE' : '🚀 LIVE SEND'}              ║`);
  console.log('╚══════════════════════════════════════════════════╝');
  console.log(`  ${guests.length} recipient${guests.length !== 1 ? 's' : ''} found in guests.csv\n`);

  let sent = 0;
  let failed = 0;

  for (const [i, guest] of guests.entries()) {
    const { email, names, ticket_count } = guest;
    const ticketWord = parseInt(ticket_count) === 1 ? 'ticket' : 'tickets';
    const html = buildHtml(names, ticket_count);

    const preview = `  [${i + 1}/${guests.length}]  ${email.padEnd(35)} │  ${names.padEnd(25)} │  ${ticket_count} ${ticketWord}`;

    if (DRY_RUN) {
      console.log(`✓ DRY  ${preview}`);

      // Write preview file for the first guest so you can inspect the HTML
      if (i === 0) {
        const previewPath = path.join(__dirname, '_email_preview.html');
        fs.writeFileSync(previewPath, html);
        console.log(`\n  📄 Preview HTML written to: _email_preview.html\n`);
      }
    } else {
      try {
        await resend.emails.send({
          from:     FROM_EMAIL,
          to:       email,
          replyTo:  REPLY_TO,
          subject:  SUBJECT,
          html:     html,
        });
        console.log(`✓ SENT ${preview}`);
        sent++;
        await sleep(DELAY_MS);
      } catch (err) {
        console.error(`✗ FAIL ${preview}`);
        console.error(`       ${err.message}`);
        failed++;
      }
    }
  }

  console.log('\n──────────────────────────────────────────────────');
  if (DRY_RUN) {
    console.log(`  Dry run complete. ${guests.length} email${guests.length !== 1 ? 's' : ''} would be sent.`);
    console.log(`  Open _email_preview.html in a browser to check the layout.`);
    console.log(`  When ready, set DRY_RUN = false in send-tickets.js and run again.\n`);
  } else {
    console.log(`  Done. ${sent} sent, ${failed} failed.\n`);
  }
}

run().catch(err => {
  console.error('\n❌ Fatal error:', err.message);
  process.exit(1);
});
