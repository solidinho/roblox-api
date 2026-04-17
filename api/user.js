export default async function handler(req, res) {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: "Username obrigatório" });
  }

  try {
    // 🔹 username → ID
    const response = await fetch("https://users.roblox.com/v1/usernames/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        usernames: [username],
        excludeBannedUsers: true
      })
    });

    const data = await response.json();
    const userId = data.data[0]?.id;

    if (!userId) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // 🔹 ID → avatar
    const avatarRes = await fetch(
      `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=420x420&format=Png&isCircular=false`
    );

    const avatarData = await avatarRes.json();
    const imageUrl = avatarData.data[0].imageUrl;

    // 🔥 resposta final
    res.status(200).json({
      userId,
      imageUrl
    });

  } catch (err) {
    res.status(500).json({ error: "Erro interno" });
  }
}
