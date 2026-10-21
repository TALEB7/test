/** Upload one image to the backend `/uploads/:folder` route and return its URL. */
export async function uploadImage(file: File | Blob, folder: 'avatars' | 'covers', filename = 'image.jpg'): Promise<string> {
  if (file.size > 5 * 1024 * 1024) throw new Error("L'image est trop volumineuse (max 5 Mo)");
  if (file.type && !file.type.startsWith('image/')) throw new Error('Veuillez sélectionner une image valide');

  const formData = new FormData();
  formData.append('files', file, file instanceof File ? file.name : filename);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';
  const res = await fetch(`${apiUrl}/uploads/${folder}`, { method: 'POST', body: formData });
  if (!res.ok) throw new Error(`Upload échoué (${res.status})`);

  const data = await res.json();
  const url: string = data.urls?.[0] ?? data.url ?? '';
  if (!url) throw new Error('Upload échoué');
  return url;
}
