import nodemailer from 'nodemailer'

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const user = process.env.EMAIL_USER
  const pass = process.env.EMAIL_PASS

  if (!user || !pass) {
    throw new Error('EMAIL_USER alebo EMAIL_PASS nie sú nastavené.')
  }

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user, pass },
  })

  const html = `
  <div style="background-color:#030712;padding:32px 0;font-family:Arial,Helvetica,sans-serif;">
    <div style="max-width:480px;margin:0 auto;background-color:#052e16;border:1px solid #14532d;border-radius:16px;padding:32px;">
      <div style="text-align:center;font-size:48px;margin-bottom:8px;">&#127919;</div>
      <h1 style="color:#facc15;text-align:center;font-size:24px;margin:0 0 8px;">Obnovenie hesla</h1>
      <p style="color:#86efac;text-align:center;margin:0 0 24px;font-size:14px;">&#352;&iacute;pkov&eacute; turnaje</p>
      <p style="color:#d1d5db;font-size:15px;line-height:1.6;">
        Dostali sme &#382;iados&#357; o obnovenie hesla k v&aacute;&#353;mu klubov&eacute;mu &uacute;&#269;tu. Kliknite na tla&#269;idlo ni&#382;&#353;ie a nastavte si nov&eacute; heslo.
      </p>
      <div style="text-align:center;margin:28px 0;">
        <a href="${resetUrl}" style="display:inline-block;background-color:#eab308;color:#052e16;font-weight:bold;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:15px;">
          Nastavi&#357; nov&eacute; heslo
        </a>
      </div>
      <p style="color:#9ca3af;font-size:13px;line-height:1.6;">
        Odkaz je platn&yacute; <strong style="color:#d1d5db;">1 hodinu</strong>. Ak ste o obnovenie hesla ne&#382;iadali, tento e-mail m&ocirc;&#382;ete ignorova&#357; &ndash; va&#353;e heslo zostane nezmenen&eacute;.
      </p>
      <p style="color:#6b7280;font-size:12px;line-height:1.6;word-break:break-all;margin-top:20px;">
        Ak tla&#269;idlo nefunguje, skop&iacute;rujte do preh&#316;iada&#269;a tento odkaz:<br>
        <a href="${resetUrl}" style="color:#facc15;">${resetUrl}</a>
      </p>
    </div>
    <p style="color:#4b5563;text-align:center;font-size:12px;margin-top:16px;">&copy; &#352;&iacute;pkov&eacute; turnaje &middot; Port&aacute;l pre &#353;&iacute;pkov&eacute; kluby</p>
  </div>
  `

  const text = `Obnovenie hesla - Sipkove turnaje

Dostali sme ziadost o obnovenie hesla k vasmu klubovemu uctu. Otvorte tento odkaz a nastavte si nove heslo (platny 1 hodinu):

${resetUrl}

Ak ste o obnovenie hesla neziadali, tento e-mail ignorujte - vase heslo zostane nezmenene.`

  await transporter.sendMail({
    from: `"Šípkové turnaje" <${user}>`,
    to,
    subject: 'Obnovenie hesla – Šípkové turnaje',
    html,
    text,
  })
}
