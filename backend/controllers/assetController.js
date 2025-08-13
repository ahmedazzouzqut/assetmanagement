const Asset = require('../models/Asset'); 
// Get all assets for a user
const getAssets = async (req, res) => {
     try {
         const assets = await Asset.find({ userId: req.user.id });
         res.json(assets);
     } catch (error) {
         res.status(500).json({ message: error.message });
     }
};
const addAsset = async (req, res) => {
    const { name, description, manufacturer, acquisitiondate } = req.body;
    try {
        const asset = await Asset.create({ userId: req.user.id, name, description, manufacturer, acquisitiondate });
        res.status(201).json(asset);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const updateAsset = async (req, res) => {
    const { name, description, manufacturer, acquisitiondate } = req.body;
    try {
        const asset = await Asset.findById(req.params.id);
        if (!asset) return res.status(404).json({ message: 'Asset not found' });
        asset.name = name || asset.name;
        asset.description = description || asset.description;
        asset.manufacturer = manufacturer || asset.manufacturer;
        asset.acquisitiondate = acquisitiondate || asset.acquisitiondate;
        const updatedAsset = await asset.save();
        res.json(updatedAsset);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const deleteAsset = async (req, res) => {
    try {
        const asset = await Asset.findById(req.params.id);
        if (!asset) return res.status(404).json({ message: 'Asset not found' });
        await asset.remove();
        res.json({ message: 'Asset deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
module.exports = { getAssets, addAsset, updateAsset, deleteAsset };
