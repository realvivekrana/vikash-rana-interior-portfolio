import deleteImage from '../utils/deleteImage.js';

// imageFields : image wale fields, e.g. ['backgroundImage']
// allowedFields: sirf yehi fields update ho sakti hain (baaki body ignore)
const makeSingletonController = (Model, imageFields = [], allowedFields = []) => ({
  get: async (req, res) => {
    let doc = await Model.findOne();
    if (!doc) doc = await Model.create({});
    res.json({ success: true, data: doc });
  },

  update: async (req, res) => {
    let doc = await Model.findOne();
    if (!doc) doc = new Model();

    const body = {};
    for (const key of allowedFields) {
      if (req.body[key] === undefined) continue;
      let val = req.body[key];
      // Nested/array fields FormData se JSON string ban ke aate hain
      if (typeof val === 'string' && /^[[{]/.test(val)) {
        try { val = JSON.parse(val); } catch { /* normal string rehne do */ }
      }
      body[key] = val;
    }
    doc.set(body);

    const uploaded = [];
    for (const field of imageFields) {
      const file = req.files?.[field]?.[0];
      if (file) {
        uploaded.push(file.filename);
        const oldId = doc[field]?.public_id;
        doc[field] = { url: file.path, public_id: file.filename };
        doc.$locals = { ...(doc.$locals || {}), oldIds: [...(doc.$locals?.oldIds || []), oldId] };
      }
    }

    try {
      await doc.save();
    } catch (err) {
      // Save fail hua to naya upload hua image Cloudinary se hata do
      for (const id of uploaded) await deleteImage(id);
      throw err;
    }
    // Save safal hone ke baad hi purani image delete karo
    for (const id of doc.$locals?.oldIds || []) await deleteImage(id);

    res.json({ success: true, data: doc });
  },
});

export default makeSingletonController;