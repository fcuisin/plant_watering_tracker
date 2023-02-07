export async function fetchAPI(
  url: string,
  req: { method: "GET" | "POST" | "PUT" | "DELETE"; body?: string }
) {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  try {
    const res = await fetch(url, {
      headers,
      ...req,
    });
    return res.json();
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch API");
  }
}
