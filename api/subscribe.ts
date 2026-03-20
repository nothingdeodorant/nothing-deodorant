export default async function handler(req: any, res: any) {
  const { email } = req.body;
  const response = await fetch(
    `https://api.beehiiv.com/v2/publications/pub_700a1fc9-fe95-4bca-9282-511ed29f5233/subscriptions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer 6PNqelHbE8KaycGWaACn4MPIJiptcMMjyc7ejsvxOzYdVD4VJue4sDQgQoNmjsTS`,
      },
      body: JSON.stringify({ email, reactivate_existing: true, send_welcome_email: false }),
    }
  );
  res.status(response.ok ? 200 : 400).json({ ok: response.ok });
}
