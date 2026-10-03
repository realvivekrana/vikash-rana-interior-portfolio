import deleteImage from '../utils/deleteImage.js';

// imageFields: model ke wo fields jo image hain, e.g. ['backgroundImage'] ya ['photo']
const makeSingletonController = (Model, imageFields = []) => ({
  get: async (req, res) => {
    let doc = await Model.findOne();
    if (!doc) doc = await Model.create({});
    res.json({ success: true, data: doc });
  },

  update: async (req, res) => {
    let doc = await Model.findOne();
    if (!doc) doc = new Model();

    const body = { ...req.body };
    // Nested/array fields JSON string ke roop mein aate hain (FormData se)
    for (const key of Object.keys(body)) {
      if (typeof body[key] === 'string' && /^[\[{]/.test(body[key])) {
        try { body[key] = JSON.parse(body[key]); } catch { /* normal string rehne do */ }
      }
    }
    doc.set(body);

    for (const field of imageFields) {
      const file = req.files?.[field]?.[0];
      if (file) {
        await deleteImage(doc[field]?.public_id);
        doc[field] = { url: file.path, public_id: file.filename };
      }
    }

    await doc.save();
    res.json({ success: true, data: doc });
  },
});

export default makeSingletonController;