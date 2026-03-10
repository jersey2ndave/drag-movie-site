// ─────────────────────────────────────────────────────────────
//  DRAG — Premiere Ticket Email Sender
//  Google Apps Script · Paste into script.google.com
// ─────────────────────────────────────────────────────────────

// ── CONFIG ───────────────────────────────────────────────────
var DRY_RUN       = true;                      // ← flip to false when ready to send live
var FROM_NAME     = "DRAG";
var FROM_EMAIL    = "info@jersey2ndave.com";   // ← must be a verified alias in Gmail settings
var SUBJECT       = "Your Tickets Are Reserved — DRAG World Premiere · March 13";
var PREVIEW_EMAIL = "jake@jersey2ndave.com";   // ← dry run sends one preview here
var RSVP_YES_SUBJECT = "RSVP \u2014 DRAG Premiere \u00B7 March 13";
var RSVP_NO_SUBJECT  = "Unable to Attend \u2014 DRAG Premiere \u00B7 March 13";
// ─────────────────────────────────────────────────────────────


function sendTicketEmails() {
  var sheet     = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data      = sheet.getDataRange().getValues();
  var headers   = data[0];                     // first row = column names
  var rows      = data.slice(1);               // rest = guest rows

  // Find column indexes by header name (case-insensitive)
  var col = {};
  headers.forEach(function(h, i) { col[h.toString().toLowerCase().trim()] = i; });

  var sent   = 0;
  var failed = 0;
  var log    = [];

  log.push("═══════════════════════════════════════════════════");
  log.push("  DRAG Ticket Emails — " + (DRY_RUN ? "🔍 DRY RUN" : "🚀 LIVE SEND"));
  log.push("  " + rows.length + " recipient(s) found");
  log.push("═══════════════════════════════════════════════════");

  rows.forEach(function(row, i) {
    var email       = row[col["email"]]        ? row[col["email"]].toString().trim()        : "";
    var names       = row[col["names"]]        ? row[col["names"]].toString().trim()        : "";
    var ticketCount = row[col["ticket_count"]] ? row[col["ticket_count"]].toString().trim() : "1";

    if (!email || !names) {
      log.push("  [" + (i+1) + "] SKIP — missing email or name");
      return;
    }

    var ticketWord = parseInt(ticketCount) === 1 ? "ticket" : "tickets";
    var html       = buildEmail(names, ticketCount, ticketWord);
    var entry      = "  [" + (i+1) + "/" + rows.length + "]  " + email + "  │  " + names + "  │  " + ticketCount + " " + ticketWord;

    if (DRY_RUN) {
      log.push("✓ DRY  " + entry);
    } else {
      try {
        GmailApp.sendEmail(email, SUBJECT, "", {
          htmlBody: html,
          name:     FROM_NAME,
          from:     FROM_EMAIL,
        });
        log.push("✓ SENT " + entry);
        sent++;
        Utilities.sleep(300); // small delay between sends
      } catch(e) {
        log.push("✗ FAIL " + entry);
        log.push("       " + e.message);
        failed++;
      }
    }
  });

  log.push("───────────────────────────────────────────────────");

  if (DRY_RUN) {
    // Send one real preview email to yourself so you can see the actual render
    var previewHtml = buildEmail("Jake", "2", "tickets");
    GmailApp.sendEmail(PREVIEW_EMAIL, "[ PREVIEW ] " + SUBJECT, "", {
      htmlBody: previewHtml,
      name:     FROM_NAME,
      from:     FROM_EMAIL,
    });
    log.push("  Dry run complete — " + rows.length + " email(s) would be sent.");
    log.push("  A preview email has been sent to: " + PREVIEW_EMAIL);
    log.push("  When ready → set DRY_RUN = false and run again.");
  } else {
    log.push("  Done. " + sent + " sent, " + failed + " failed.");
  }

  log.push("═══════════════════════════════════════════════════");
  Logger.log(log.join("\n"));
}


// ─────────────────────────────────────────────────────────────
//  Encode the pre-filled RSVP email body
// ─────────────────────────────────────────────────────────────
function encodeRsvpBody(names, ticketCount) {
  var body = "Hi,\n\nI am confirming my attendance for the DRAG World Premiere on March 13.\n\nName: " + names + "\nTickets: " + ticketCount + "\n\nSee you there!";
  return encodeURIComponent(body);
}

function encodeCancelBody(names, ticketCount) {
  var body = "Hi,\n\nUnfortunately I won't be able to make it to the DRAG World Premiere on March 13.\n\nName: " + names + "\nTickets: " + ticketCount + "\n\nSorry to miss it and congratulations on the premiere!";
  return encodeURIComponent(body);
}

// ─────────────────────────────────────────────────────────────
//  Build the personalized HTML email
// ─────────────────────────────────────────────────────────────
function buildEmail(names, ticketCount, ticketWord) {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="x-apple-disable-message-reformatting">
<title>DRAG — Your Tickets Are Reserved</title>
<link href="https://fonts.googleapis.com/css2?family=Anton&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
  table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
  img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
  body { margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #EFEFEF; }
  * { box-sizing: border-box; }
  .font-display { font-family: 'Anton', Impact, 'Arial Black', sans-serif !important; }
  .font-body    { font-family: 'Inter', Arial, Helvetica, sans-serif !important; }
  @media only screen and (max-width: 620px) {
    .email-container { width: 100% !important; }
    .hero-image      { width: 100% !important; height: auto !important; }
    .stack-column    { display: block !important; width: 100% !important; padding-right: 0 !important; }
    .mobile-pad      { padding: 24px 20px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background-color:#EFEFEF;">

  <!-- Preheader -->
  <div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:#EFEFEF;mso-hide:all;">
    ${names} — your ${ticketCount} ${ticketWord} for the World Premiere of DRAG at The State Theatre are confirmed.
    &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
  </div>

  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color:#EFEFEF;">
    <tr><td align="center" style="padding:20px 10px;">

      <table class="email-container" role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;background-color:#FFFFFF;">

        <!-- TOP GOLD BAR -->
        <tr><td style="background:linear-gradient(90deg,#c07f0f,#f3ab23,#c07f0f);height:5px;font-size:0;line-height:0;">&nbsp;</td></tr>

        <!-- HEADER -->
        <tr>
          <td style="padding:48px 48px 36px;text-align:center;background-color:#FFFFFF;">
            <span class="font-display" style="font-family:'Anton',Impact,'Arial Black',sans-serif;font-size:72px;letter-spacing:20px;color:#f3ab23;line-height:1;display:block;">DRAG</span>
            <span class="font-body" style="font-family:'Inter',Arial,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:3px;color:#AAAAAA;display:block;margin-top:8px;">A Jersey Films 2nd Avenue Production</span>
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:28px auto;">
              <tr>
                <td style="width:40px;height:1px;background-color:rgba(243,171,35,0.3);font-size:0;line-height:0;">&nbsp;</td>
                <td style="width:80px;height:2px;background-color:#f3ab23;font-size:0;line-height:0;">&nbsp;</td>
                <td style="width:40px;height:1px;background-color:rgba(243,171,35,0.3);font-size:0;line-height:0;">&nbsp;</td>
              </tr>
            </table>
            <span class="font-body" style="font-family:'Inter',Arial,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:4px;color:#f3ab23;display:block;margin-bottom:16px;">World Premiere · SXSW 2026</span>
            <h1 class="font-display" style="font-family:'Anton',Impact,'Arial Black',sans-serif;font-size:36px;letter-spacing:4px;text-transform:uppercase;color:#0A0A0A;margin:0;line-height:1.15;">Your Tickets Are Reserved</h1>
          </td>
        </tr>

        <!-- HERO IMAGE -->
        <tr>
          <td style="padding:0;line-height:0;font-size:0;">
            <img class="hero-image" src="https://www.drag-the-movie.com/images/drag%20with%20title%20right%20wp%20laurel.jpg" alt="DRAG — SXSW 2026 World Premiere" width="600" style="display:block;width:100%;max-width:600px;height:auto;">
          </td>
        </tr>

        <!-- GOLD DIVIDER -->
        <tr><td style="background:linear-gradient(90deg,#c07f0f,#f3ab23,#c07f0f);height:4px;font-size:0;line-height:0;">&nbsp;</td></tr>

        <!-- GREETING -->
        <tr>
          <td class="mobile-pad" style="padding:52px 48px 0;background-color:#FFFFFF;">
            <p class="font-body" style="font-family:'Inter',Arial,sans-serif;font-size:17px;line-height:1.8;color:#0A0A0A;margin:0 0 16px;">
              Dear <strong>${names}</strong>,
            </p>
            <p class="font-body" style="font-family:'Inter',Arial,sans-serif;font-size:16px;line-height:1.9;color:rgba(0,0,0,0.75);margin:0;">
              We're thrilled to let you know that your ${ticketCount} ${ticketWord} for the <strong style="color:#0A0A0A;">World Premiere of DRAG</strong> at SXSW 2026 have been reserved. We can't wait to see you there.
            </p>
          </td>
        </tr>

        <!-- RESERVATION DETAILS -->
        <tr>
          <td class="mobile-pad" style="padding:32px 48px;background-color:#FFFFFF;">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-left:4px solid #f3ab23;background-color:rgba(243,171,35,0.06);">
              <tr>
                <td style="padding:32px 36px;">
                  <span class="font-display" style="font-family:'Anton',Impact,'Arial Black',sans-serif;font-size:13px;letter-spacing:3px;text-transform:uppercase;color:#8a6200;display:block;margin-bottom:24px;">Reservation Details</span>
                  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                    <tr>
                      <td class="stack-column" width="50%" style="padding-right:16px;vertical-align:top;padding-bottom:20px;">
                        <span class="font-body" style="font-family:'Inter',Arial,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#8a6200;display:block;margin-bottom:8px;">Reserved For</span>
                        <span class="font-body" style="font-family:'Inter',Arial,sans-serif;font-size:18px;color:#0A0A0A;font-weight:600;display:block;">${names}</span>
                      </td>
                      <td class="stack-column" width="50%" style="vertical-align:top;padding-bottom:20px;">
                        <span class="font-body" style="font-family:'Inter',Arial,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#8a6200;display:block;margin-bottom:8px;">Tickets</span>
                        <span class="font-body" style="font-family:'Inter',Arial,sans-serif;font-size:18px;color:#0A0A0A;font-weight:600;display:block;">${ticketCount} ${ticketWord}</span>
                      </td>
                    </tr>
                    <tr><td colspan="2" style="border-top:1px solid rgba(243,171,35,0.3);font-size:0;line-height:0;padding-bottom:20px;">&nbsp;</td></tr>
                    <tr>
                      <td class="stack-column" width="50%" style="padding-right:16px;vertical-align:top;padding-bottom:20px;">
                        <span class="font-body" style="font-family:'Inter',Arial,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#8a6200;display:block;margin-bottom:8px;">Ticket Pickup &amp; Party</span>
                        <span class="font-body" style="font-family:'Inter',Arial,sans-serif;font-size:18px;color:#0A0A0A;font-weight:600;display:block;">Friday, March 13</span>
                        <span class="font-body" style="font-family:'Inter',Arial,sans-serif;font-size:15px;color:rgba(0,0,0,0.55);display:block;">7:00 – 9:00 PM</span>
                      </td>
                      <td class="stack-column" width="50%" style="vertical-align:top;padding-bottom:20px;">
                        <span class="font-body" style="font-family:'Inter',Arial,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#8a6200;display:block;margin-bottom:8px;">Location</span>
                        <span class="font-body" style="font-family:'Inter',Arial,sans-serif;font-size:18px;color:#0A0A0A;font-weight:600;display:block;">The Driskill</span>
                        <span class="font-body" style="font-family:'Inter',Arial,sans-serif;font-size:15px;color:rgba(0,0,0,0.55);display:block;">604 Brazos St (Mezzanine)</span>
                      </td>
                    </tr>
                    <tr><td colspan="2" style="border-top:1px solid rgba(243,171,35,0.3);font-size:0;line-height:0;padding-bottom:20px;">&nbsp;</td></tr>
                    <tr>
                      <td class="stack-column" width="50%" style="padding-right:16px;vertical-align:top;">
                        <span class="font-body" style="font-family:'Inter',Arial,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#8a6200;display:block;margin-bottom:8px;">Screening Date &amp; Time</span>
                        <span class="font-body" style="font-family:'Inter',Arial,sans-serif;font-size:18px;color:#0A0A0A;font-weight:600;display:block;">Friday, March 13</span>
                        <span class="font-body" style="font-family:'Inter',Arial,sans-serif;font-size:15px;color:rgba(0,0,0,0.55);display:block;">10:15 PM</span>
                      </td>
                      <td class="stack-column" width="50%" style="vertical-align:top;">
                        <span class="font-body" style="font-family:'Inter',Arial,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#8a6200;display:block;margin-bottom:8px;">Venue</span>
                        <span class="font-body" style="font-family:'Inter',Arial,sans-serif;font-size:18px;color:#0A0A0A;font-weight:600;display:block;">The State Theatre</span>
                        <span class="font-body" style="font-family:'Inter',Arial,sans-serif;font-size:15px;color:rgba(0,0,0,0.55);display:block;">719 Congress Ave, Austin, TX</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- INSTRUCTIONS -->
        <tr>
          <td class="mobile-pad" style="padding:0 48px 40px;background-color:#FFFFFF;">
            <p class="font-body" style="font-family:'Inter',Arial,sans-serif;font-size:18px;line-height:1.8;color:rgba(0,0,0,0.75);margin:0 0 16px;">
              <strong>It is VERY IMPORTANT that all guests pick up their tickets when they check in at the pre-reception at The Driskill. Please bring a valid photo ID.</strong>
            </p>
            <p class="font-body" style="font-family:'Inter',Arial,sans-serif;font-size:18px;line-height:1.8;color:rgba(0,0,0,0.75);margin:0 0 20px;">
              <strong>If you are unable to make it to the pre-reception, please contact <a href="mailto:Joss@jersey2ndave.com" style="color:#f3ab23;text-decoration:none;border-bottom:1px solid rgba(243,171,35,0.5);">Joss Utting</a> who will coordinate getting your tickets to you near the theater.</strong>
            </p>
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-left:3px solid rgba(243,171,35,0.4);background-color:rgba(243,171,35,0.04);">
              <tr>
                <td style="padding:16px 20px;">
                  <span class="font-body" style="font-family:'Inter',Arial,sans-serif;font-size:13px;font-weight:600;color:#0A0A0A;display:block;margin-bottom:4px;">Joss Utting</span>
                  <a href="mailto:Joss@jersey2ndave.com" style="font-family:'Inter',Arial,sans-serif;font-size:13px;color:#f3ab23;text-decoration:none;display:block;margin-bottom:2px;">Joss@jersey2ndave.com</a>
                  <a href="tel:3104354709" style="font-family:'Inter',Arial,sans-serif;font-size:13px;color:rgba(0,0,0,0.5);text-decoration:none;">(310) 435-4709</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- RSVP -->
        <tr>
          <td style="padding:0 48px 48px;text-align:center;background-color:#FFFFFF;">
            <p class="font-body" style="font-family:'Inter',Arial,sans-serif;font-size:13px;text-transform:uppercase;letter-spacing:3px;color:#8a6200;margin:0 0 16px;font-weight:600;">Please Confirm Your Attendance</p>
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center">
              <tr>
                <td style="padding:0 8px;">
                  <a href="mailto:info@jersey2ndave.com?subject=RSVP%20%E2%80%94%20DRAG%20Premiere%20%C2%B7%20March%2013&body=${encodeRsvpBody(names, ticketCount)}" style="display:inline-block;padding:18px 44px;background-color:#f3ab23;color:#FFFFFF;text-decoration:none;font-family:'Inter',Arial,sans-serif;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:3px;">I'll Be There</a>
                </td>
                <td style="padding:0 8px;">
                  <a href="mailto:info@jersey2ndave.com?subject=Unable%20to%20Attend%20%E2%80%94%20DRAG%20Premiere%20%C2%B7%20March%2013&body=${encodeCancelBody(names, ticketCount)}" style="display:inline-block;padding:18px 44px;background-color:transparent;color:#0A0A0A;text-decoration:none;font-family:'Inter',Arial,sans-serif;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:3px;border:2px solid #0A0A0A;">Can't Make It</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- GOLD DIVIDER -->
        <tr><td style="background:linear-gradient(90deg,#c07f0f,#f3ab23,#c07f0f);height:4px;font-size:0;line-height:0;">&nbsp;</td></tr>

        <!-- PREMIERE PARTY -->
        <tr>
          <td class="mobile-pad" style="padding:40px 48px;background-color:#0A0A0A;text-align:center;">
            <span class="font-body" style="font-family:'Inter',Arial,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:4px;color:#f3ab23;display:block;margin-bottom:14px;">Before the Screening</span>
            <h2 class="font-display" style="font-family:'Anton',Impact,'Arial Black',sans-serif;font-size:26px;letter-spacing:4px;text-transform:uppercase;color:#FAFAFA;margin:0 0 16px;line-height:1.2;">Premiere Party &amp; Special Performance</h2>
            <p class="font-body" style="font-family:'Inter',Arial,sans-serif;font-size:15px;line-height:1.8;color:rgba(255,255,255,0.65);margin:0 0 20px;">
              Join us beforehand for a pre-screening reception and a live performance by <strong style="color:#FAFAFA;">The Bonzo Drag Band</strong> featuring special guests.
            </p>
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="border-left:4px solid #f3ab23;background-color:rgba(243,171,35,0.08);text-align:left;">
              <tr>
                <td style="padding:20px 24px;">
                  <span class="font-body" style="font-family:'Inter',Arial,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#f3ab23;display:block;margin-bottom:6px;">Friday, March 13 &nbsp;·&nbsp; 7:00 – 9:00 PM</span>
                  <span class="font-body" style="font-family:'Inter',Arial,sans-serif;font-size:17px;font-weight:600;color:#FAFAFA;display:block;margin-bottom:2px;">The Driskill</span>
                  <span class="font-body" style="font-family:'Inter',Arial,sans-serif;font-size:13px;color:rgba(255,255,255,0.45);">604 Brazos St, Austin, TX (Mezzanine)</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- GOLD DIVIDER -->
        <tr><td style="background:linear-gradient(90deg,#c07f0f,#f3ab23,#c07f0f);height:4px;font-size:0;line-height:0;">&nbsp;</td></tr>

        <!-- TAGLINE -->
        <tr>
          <td style="padding:32px 48px;text-align:center;background-color:#F9F7F2;">
            <p class="font-body" style="font-family:'Inter',Arial,sans-serif;font-size:15px;text-transform:uppercase;letter-spacing:4px;color:#AAAAAA;margin:0;">Back pain. It's all in your head.</p>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background-color:#FFFFFF;border-top:1px solid rgba(243,171,35,0.2);padding:48px 40px 32px;text-align:center;">
            <span class="font-display" style="font-family:'Anton',Impact,'Arial Black',sans-serif;font-size:40px;letter-spacing:12px;color:#f3ab23;display:block;margin-bottom:8px;">DRAG</span>
            <span class="font-body" style="font-family:'Inter',Arial,sans-serif;font-size:12px;color:#AAAAAA;letter-spacing:1px;display:block;margin-bottom:32px;">A Jersey Films 2nd Avenue Production</span>
            <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin-bottom:32px;">
              <tr>
                <td style="padding:0 8px;white-space:nowrap;"><a href="https://www.drag-the-movie.com" target="_blank" style="font-family:'Inter',Arial,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#1A1A1A;text-decoration:none;border-bottom:1px solid #f3ab23;padding-bottom:3px;white-space:nowrap;">Website</a></td>
                <td style="padding:0 8px;color:#CCCCCC;font-size:11px;">|</td>
                <td style="padding:0 8px;white-space:nowrap;"><a href="https://schedule.sxsw.com/films/2241467" target="_blank" style="font-family:'Inter',Arial,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#1A1A1A;text-decoration:none;border-bottom:1px solid #f3ab23;padding-bottom:3px;white-space:nowrap;">SXSW Listing</a></td>
                <td style="padding:0 8px;color:#CCCCCC;font-size:11px;">|</td>
                <td style="padding:0 8px;white-space:nowrap;"><a href="https://www.instagram.com/dragthemovie/" target="_blank" style="font-family:'Inter',Arial,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#1A1A1A;text-decoration:none;border-bottom:1px solid #f3ab23;padding-bottom:3px;white-space:nowrap;">Instagram</a></td>
                <td style="padding:0 8px;color:#CCCCCC;font-size:11px;">|</td>
                <td style="padding:0 8px;white-space:nowrap;"><a href="https://www.imdb.com/title/tt35893068/" target="_blank" style="font-family:'Inter',Arial,sans-serif;font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#1A1A1A;text-decoration:none;border-bottom:1px solid #f3ab23;padding-bottom:3px;white-space:nowrap;">IMDb</a></td>
              </tr>
            </table>
            <p class="font-body" style="font-family:'Inter',Arial,sans-serif;font-size:11px;color:rgba(0,0,0,0.35);margin:0;line-height:1.7;">
              You're receiving this email because you're on the DRAG premiere guest list.<br>
              &copy; 2026 Jersey Films 2nd Avenue. All rights reserved.
            </p>
          </td>
        </tr>

        <!-- BOTTOM GOLD BAR -->
        <tr><td style="background:linear-gradient(90deg,#c07f0f,#f3ab23,#c07f0f);height:3px;font-size:0;line-height:0;">&nbsp;</td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}


// ─────────────────────────────────────────────────────────────
//  RSVP Checker — scans inbox and updates sheet
//  Run manually or let the trigger call it automatically
// ─────────────────────────────────────────────────────────────
function checkRsvps() {
  var sheet   = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data    = sheet.getDataRange().getValues();
  var headers = data[0].map(function(h) { return h.toString().toLowerCase().trim(); });

  // Add rsvp_status column if it doesn't exist yet
  var rsvpCol = headers.indexOf('rsvp_status');
  if (rsvpCol === -1) {
    rsvpCol = headers.length;
    sheet.getRange(1, rsvpCol + 1).setValue('rsvp_status');
  }

  // Use header lookup for email column (same as sendTicketEmails), fall back to col 0
  var emailColIndex = headers.indexOf('email');
  if (emailColIndex === -1) emailColIndex = 0;

  // Build a map of email → sheet row number (1-indexed, accounting for header)
  var emailToRow = {};
  data.slice(1).forEach(function(row, i) {
    var addr = row[emailColIndex] ? row[emailColIndex].toString().toLowerCase().trim() : '';
    if (addr) emailToRow[addr] = i + 2;
  });

  var updated = 0;

  // Use keyword-based search (no quotes) so minor subject changes still match
  var yesThreads = GmailApp.search('to:' + FROM_EMAIL + ' subject:(RSVP DRAG Premiere March 13) -subject:Party');
  yesThreads.forEach(function(thread) {
    var from = thread.getMessages()[0].getFrom();
    var senderEmail = (from.match(/<(.+)>/) || [null, from])[1].toLowerCase().trim();
    if (emailToRow[senderEmail] !== undefined) {
      sheet.getRange(emailToRow[senderEmail], rsvpCol + 1).setValue('✓ Yes');
      updated++;
    }
  });

  // Search for NO replies
  var noThreads = GmailApp.search('to:' + FROM_EMAIL + ' subject:(Unable Attend DRAG Premiere March 13)');
  noThreads.forEach(function(thread) {
    var from = thread.getMessages()[0].getFrom();
    var senderEmail = (from.match(/<(.+)>/) || [null, from])[1].toLowerCase().trim();
    if (emailToRow[senderEmail] !== undefined) {
      sheet.getRange(emailToRow[senderEmail], rsvpCol + 1).setValue('✗ No');
      updated++;
    }
  });

  Logger.log('RSVP check complete. ' + updated + ' row(s) updated.');
}


// ─────────────────────────────────────────────────────────────
//  Create Trigger — run this ONCE to schedule checkRsvps
//  every 10 minutes automatically. Never run it twice.
// ─────────────────────────────────────────────────────────────
function createRsvpTrigger() {
  // Delete any existing trigger for checkRsvps first
  ScriptApp.getProjectTriggers().forEach(function(trigger) {
    if (trigger.getHandlerFunction() === 'checkRsvps') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  // Create a new trigger every 10 minutes
  ScriptApp.newTrigger('checkRsvps')
    .timeBased()
    .everyMinutes(10)
    .create();

  Logger.log('Trigger created — checkRsvps will run every 10 minutes.');
}
