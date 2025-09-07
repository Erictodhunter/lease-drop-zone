import { put } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { filename, fileData } = req.body;
    
    const buffer = Buffer.from(fileData, 'base64');
    
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:]/g, '');
    const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueFilename = `lease_${timestamp}_${cleanFilename}`;
    
    const blob = await put(uniqueFilename, buffer, {
      access: 'public',
      contentType: 'application/pdf'
    });
    
    return res.status(200).json({
      success: true,
      url: blob.url,
      filename: uniqueFilename,
      size: buffer.length,
      uploadedAt: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}
