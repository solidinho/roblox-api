export default async function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "Username obrigatório" });
  }

  try {
    const response = await fetch("https://users.roblox.com/v1/usernames/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        usernames: [username]
      })
    });

    const data = await response.json();

    const user = data.data[0];
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const userId = user.id;
    const displayName = user.displayName;
    const name = user.name;

    const avatarRes = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=420x420&format=Png&isCircular=false`
    );

    const avatarData = await avatarRes.json();

    res.status(200).json({
      userId,
      username: name,
      displayName,
      imageUrl: avatarData.data[0].imageUrl
    });

  } catch (err) {
    res.status(500).json({ error: "Erro interno" });
  }
}
