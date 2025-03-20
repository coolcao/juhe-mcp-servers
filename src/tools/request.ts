const USER_AGENT = 'juhe-mcp-servers/1.0';

async function postForm<T>(url: string, formData: FormData) {
  const headers = {
    'User-Agent': USER_AGENT,
    'Accept': 'application/json',
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`Request failed:${response.status}`);
    }

    const data: T = await response.json();

    return data;

  } catch (error) {
    throw error;
  }

}

export {
  postForm
}