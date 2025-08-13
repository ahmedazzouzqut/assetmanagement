
const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server'); 
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const sinon = require('sinon');
const Asset = require('../models/Asset');
const { updateAsset,getAssets,addAsset,deleteAsset } = require('../controllers/assetController');
const { expect } = chai;

chai.use(chaiHttp);
let server;
let port;


describe('AddAsset Function Test', () => {

  it('should create a new asset successfully', async () => {
    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { name : "New Asset", description: "Asset description", manufacturer: "Asset Manufacturer", acquisitiondate : "2025-12-31" }
    };

    // Mock asset that would be created
    const createdAsset = { _id: new mongoose.Types.ObjectId(), ...req.body, userId: req.user.id };

    // Stub Asset.create to return the createdAsset
    const createStub = sinon.stub(Asset, 'create').resolves(createdAsset);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await addAsset(req, res);

    // Assertions
    expect(createStub.calledOnceWith({ userId: req.user.id, ...req.body })).to.be.true;
    expect(res.status.calledWith(201)).to.be.true;
    expect(res.json.calledWith(createdAsset)).to.be.true;

    // Restore stubbed methods
    createStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Asset.create to throw an error
    const createStub = sinon.stub(Asset, 'create').throws(new Error('DB Error'));

    // Mock request data
    const req = {
      user: { id: new mongoose.Types.ObjectId() },
      body: { name: "New Asset", description: "Asset description", manufacturer: "Asset Manufacturer", acquisitiondate : "2025-12-31" }
    };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await addAsset(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    createStub.restore();
  });

});


describe('Update Function Test', () => {

  it('should update asset successfully', async () => {
    // Mock asset data
    const assetId = new mongoose.Types.ObjectId();
    const existingAsset = {
      _id: assetId,
      name: "Old Asset",
      description: "Old Description",
      manufacturer: "Old Manufacturer",
      acquisitiondate : new Date(),
      
      save: sinon.stub().resolvesThis(), // Mock save method
    };
    // Stub Asset.findById to return mock asset
    const findByIdStub = sinon.stub(Asset, 'findById').resolves(existingAsset);

    // Mock request & response
    const req = {
      params: { id: assetId },
      body: { name: "New Asset", description: "Asset description", manufacturer: "New Manufacturer", acquisitiondate: "2025-12-31" }
    };
    const res = {
      json: sinon.spy(), 
      status: sinon.stub().returnsThis()
    };

    // Call function
    await updateAsset(req, res);

    // Assertions
    expect(existingAsset.name).to.equal("New Asset");
    expect(existingAsset.description).to.equal("Asset description");
    expect(existingAsset.manufacturer).to.equal("New Manufacturer");
    expect(existingAsset.acquisitiondate).to.equal("2025-12-31");
    expect(res.status.called).to.be.false; // No error status should be set
    expect(res.json.calledOnce).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });


  it('should return 404 if asset is not found', async () => {
    const findByIdStub = sinon.stub(Asset, 'findById').resolves(null);

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updateAsset(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Asset not found' })).to.be.true;

    findByIdStub.restore();
  });

  it('should return 500 on error', async () => {
    const findByIdStub = sinon.stub(Asset, 'findById').throws(new Error('DB Error'));

    const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    await updateAsset(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.called).to.be.true;

    findByIdStub.restore();
  });



});



describe('GetAsset Function Test', () => {

  it('should return assets for the given user', async () => {
    // Mock user ID
    const userId = new mongoose.Types.ObjectId();

    // Mock asset data
    const assets = [
      { _id: new mongoose.Types.ObjectId(), name: "Asset 1", userId },
      { _id: new mongoose.Types.ObjectId(), name: "Asset 2", userId }
    ];

    // Stub Asset.find to return mock assets
    const findStub = sinon.stub(Asset, 'find').resolves(assets);

    // Mock request & response
    const req = { user: { id: userId } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getAssets(req, res);

    // Assertions
    expect(findStub.calledOnceWith({ userId })).to.be.true;
    expect(res.json.calledWith(assets)).to.be.true;
    expect(res.status.called).to.be.false; // No error status should be set

    // Restore stubbed methods
    findStub.restore();
  });

  it('should return 500 on error', async () => {
    // Stub Asset.find to throw an error
    const findStub = sinon.stub(Asset, 'find').throws(new Error('DB Error'));

    // Mock request & response
    const req = { user: { id: new mongoose.Types.ObjectId() } };
    const res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis()
    };

    // Call function
    await getAssets(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findStub.restore();
  });

});



describe('DeleteAsset Function Test', () => {

  it('should delete a asset successfully', async () => {
    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock asset found in the database
    const asset = { remove: sinon.stub().resolves() };

    // Stub Asset.findById to return the mock asset
    const findByIdStub = sinon.stub(Asset, 'findById').resolves(asset);

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteAsset(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(asset.remove.calledOnce).to.be.true;
    expect(res.json.calledWith({ message: 'Asset deleted' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 404 if asset is not found', async () => {
    // Stub Asset.findById to return null
    const findByIdStub = sinon.stub(Asset, 'findById').resolves(null);

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteAsset(req, res);

    // Assertions
    expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
    expect(res.status.calledWith(404)).to.be.true;
    expect(res.json.calledWith({ message: 'Asset not found' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

  it('should return 500 if an error occurs', async () => {
    // Stub Asset.findById to throw an error
    const findByIdStub = sinon.stub(Asset, 'findById').throws(new Error('DB Error'));

    // Mock request data
    const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

    // Mock response object
    const res = {
      status: sinon.stub().returnsThis(),
      json: sinon.spy()
    };

    // Call function
    await deleteAsset(req, res);

    // Assertions
    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    // Restore stubbed methods
    findByIdStub.restore();
  });

});