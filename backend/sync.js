import axios from 'axios';

export const syncToWP = async (req, res) => {
  const { wpUrl, token, pageTitle, pageContent } = req.body;

  try {
    const mutation = `
      mutation {
        createPage(input: {
          title: "${pageTitle}",
          content: "${pageContent.replace(/"/g, '\\"')}"
        }) {
          page {
            id
            title
          }
        }
      }
    `;

    const response = await axios.post(`${wpUrl}/graphql`, {
      query: mutation
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
