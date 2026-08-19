require("dotenv").config();          // load .env
const path = require("path");
const express = require("express");
const axios = require("axios");      // for API calls

const app = express();

app.use(express.static(path.join(__dirname, "../public")));

// fetch clan members
app.get("/clan-members", async (req, res) => {
  const { clanTag } = req.query;

  if (!clanTag) {
    return res.status(400).json({ message: "clanTag is required" });
  }

const encodedClanTag = `%23${clanTag}`;

  try {
    const response = await axios.get(
      `https://api.clashofclans.com/v1/clans/${encodedClanTag}/members`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CLASH_API_TOKEN}`,
          Accept: "application/json",
        },
      }
    );

    const members = response.data.items.map(m => ({
      tag: m.tag,
      name: m.name,
      role: m.role,
      townHallLevel: m.townHallLevel,
      trophies: m.trophies,
    }));

    res.json(members);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching clan members",
      error: error.response?.data || error.message,
    });
  }
});

// fetch lifetime war stars from every clan member's profile
app.get("/clan-war-members", async (req, res) => {
  const { clanTag } = req.query;

  if (!clanTag) {
    return res.status(400).json({ message: "clanTag is required" });
  }

  const encodedClanTag = `%23${clanTag}`;
  const headers = {
    Authorization: `Bearer ${process.env.CLASH_API_TOKEN}`,
    Accept: "application/json",
  };

  try {
    const [clanResponse, membersResponse] = await Promise.all([
      axios.get(`https://api.clashofclans.com/v1/clans/${encodedClanTag}`, { headers }),
      axios.get(`https://api.clashofclans.com/v1/clans/${encodedClanTag}/members`, { headers }),
    ]);

    const members = await Promise.all(membersResponse.data.items.map(async (member) => {
      const encodedPlayerTag = `%23${member.tag.replace(/^#/, "")}`;
      const profileResponse = await axios.get(
        `https://api.clashofclans.com/v1/players/${encodedPlayerTag}`,
        { headers }
      );

      return {
      tag: member.tag,
      name: member.name,
      role: member.role,
      townHallLevel: member.townHallLevel,
      trophies: member.trophies,
      warStars: profileResponse.data.warStars || 0,
      };
    }));

    res.json({
      clan: {
        name: clanResponse.data.name,
        tag: clanResponse.data.tag,
      },
      members,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching member profiles",
      error: error.response?.data || error.message,
    });
  }
});


if (require.main === module) {
  const PORT = process.env.PORT || 3000;

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;
