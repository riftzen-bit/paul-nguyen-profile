# Paul Nguyen Profile

Personal profile website for Paul Nguyen, built with Next.js, TypeScript, Tailwind CSS, GSAP, and Bun.

## Features

- Editorial dark profile homepage with GSAP scroll motion.
- Interactive brief builder that can prefill the contact form.
- Live code console for quick local code audits.
- GitHub projects explorer for `riftzen-bit`, with live polling and pagination.
- Backend contact form that sends email through free SMTP, such as Gmail App Password SMTP.
- Production-ready CI using GitHub Actions.

## Stack

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS
- GSAP
- Bun
- Nodemailer SMTP

## Local Development

```bash
bun install
bun run dev
```

Open `http://localhost:3000`.

## Checks

```bash
bun run typecheck
bun run build
```

or:

```bash
bun run check
```

## Contact Email Setup

Create `.env.local`:

```env
CONTACT_TO_EMAIL=your-email@gmail.com
CONTACT_FROM_EMAIL="Paul Nguyen <your-email@gmail.com>"
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-google-app-password-without-spaces
```

For Gmail, `SMTP_PASS` must be a Google App Password, not your normal Gmail password.

## License

MIT
