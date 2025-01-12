let authToken: string;

beforeAll(async () => {
  const response = await fetch(`http://localhost:3000/auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email: "teste6@gmail.com", password: "123456" }),
  });
  const data: { token: string } = await response.json();

  authToken = data.token;
});

describe('Integration Tests', () => {
  it('should return 200 OK on the root endpoint', async () => {
    const res = await fetch('http://localhost:3000/');
    expect(res.ok).toBe(true);

    const data = await res.json();
    expect(data.message).toBeDefined();
  });

  it('should retrieve all dictionary entries', async () => {
    const res = await fetch('http://localhost:3000/entries/en', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    expect(res.ok).toBe(true);

    const data = await res.json();
    expect(Array.isArray(data.results)).toBe(true);
  });

  it('should fetch a specific dictionary entry', async () => {
    const res = await fetch('http://localhost:3000/entries/en/integration', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    expect(res.ok).toBe(true);

    const data = await res.json();
    expect(data.word).toBe('integration');
  });

  it('should add a word to favorites', async () => {
    const res = await fetch('http://localhost:3000/entries/en/banana/favorite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    });
    expect(res.ok).toBe(true);
  });

  it('should remove a word from favorites', async () => {
    const res = await fetch('http://localhost:3000/entries/en/banana/unfavorite', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    });
    expect(res.ok).toBe(true);
  });

  it('should return 401 for unauthorized access to entries', async () => {
    const res = await fetch('http://localhost:3000/entries/en/word', {
      method: 'GET',
      headers: {
        Authorization: `Bearer -1`,
      },
    });
    expect(res.status).toBe(400);
  });

  it('should return 404 for a non-existent dictionary entry', async () => {
    const res = await fetch('http://localhost:3000/entries/en/nonexistentword', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    expect(res.status).toBe(400);
  });

  it('should handle adding an already favorited word gracefully', async () => {
    await fetch('http://localhost:3000/entries/en/apple/favorite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    });

    const res = await fetch('http://localhost:3000/entries/en/apple/favorite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    });

    expect(res.ok).toBe(false);
    expect(res.status).toBe(400);
  });

  it('should handle an already removed word from favorites gracefully', async () => {
    await fetch('http://localhost:3000/entries/en/apple/favorite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    });

    await fetch('http://localhost:3000/entries/en/apple/unfavorite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    });

    const res = await fetch('http://localhost:3000/entries/en/apple/unfavorite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    });

    expect(res.ok).toBe(false);
    expect(res.status).toBe(404);
  });

  it('should fail to fetch profile with invalid token', async () => {
    const res = await fetch('http://localhost:3000/user/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer invalidToken`,
      },
    });
    expect(res.status).toBe(404);
  });
});
