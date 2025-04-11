import Country from '../models/countryModel.js';
import State from '../models/stateModel.js';
import District from '../models/districtModel.js';
import Category from '../models/categoryModel.js';
import Product from '../models/productModel.js';
import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;
// Add Country Data
export const addCountryData = async (req, res) => {
  try {
    const country = new Country(req.body);
    await country.save();
    res.status(201).json({ message: 'Country data added successfully', country });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

// Add District to State
export const addDistrictToState = async (req, res) => {
  const { stateId } = req.params;
  const { name } = req.body;

  try {
    const state = await State.findById(stateId);
    if (!state) {
      return res.status(404).json({ message: 'State not found' });
    }

    const newDistrict = new District({ name, stateId });
    await newDistrict.save();

    res.status(201).json({ message: 'District added successfully', district: newDistrict });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add Country
export const addCountry = async (req, res) => {
  const { name } = req.body;

  try {
    const existingCountry = await Country.findOne({ name });
    if (existingCountry) {
      return res.status(400).json({ message: 'Country already exists' });
    }

    const newCountry = new Country({ name });
    await newCountry.save();

    res.status(201).json({ message: 'Country added successfully', country: newCountry });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProductsByState = async (req, res) => {
  
  const { stateName } = req.query;

  try {
    const state = await State.findOne({ name: stateName });
    
    if (!state) {
      return res.status(404).json({ message: 'State not found' });
    }
    const districts = await District.find({ stateId: state._id });
    
    if (districts.length === 0) {
      return res.status(404).json({ message: 'No districts found for this state' });
    }

    const districtIds = districts.map(d => d._id);
    const categories = await Category.find({ districtId: { $in: districtIds } });

    if (categories.length === 0) {
      return res.status(404).json({ message: 'No categories found for the districts in this state' });
    }

    const categoryIds = categories.map(c => c._id);
    const products = await Product.find({ categoryId: { $in: categoryIds } });
    res.status(200).json({ products });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const getAllProductsByCategory = async (req, res) => {
  const { stateName, categoryName } = req.query;
  try {
    const state = await State.findOne({ name: stateName });
    if (!state) {
      return res.status(404).json({ message: 'State not found' });
    }

    const districts = await District.find({ stateId: state._id });

    // Fetching all categories if categoryName is not provided, otherwise filter by categoryName
    const categoryFilter = categoryName ? { name: categoryName } : {};
    const categories = await Category.find({ ...categoryFilter, districtId: { $in: districts.map(d => d._id) } });

    // Fetching products based on categories found
    const categoryIds = categories.map(c => c._id);
    const products = await Product.find({ categoryId: { $in: categoryIds } });

    res.status(200).json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const getAllProductsByDistrict = async (req, res) => {
  const { stateName, districtName } = req.query;

  try {
    const state = await State.findOne({ name: stateName });
    if (!state) {
      return res.status(404).json({ message: 'State not found' });
    }

    const district = await District.findOne({ name: districtName, stateId: state._id });
    if (!district) {
      return res.status(404).json({ message: 'District not found' });
    }

    const categories = await Category.find({ districtId: district._id });
    const categoryIds = categories.map(cat => cat._id);
    const products = await Product.find({ categoryId: { $in: categoryIds } });

    res.status(200).json({ products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const getProductById = async (req, res) => {
  const { productId } = req.params;
  

  try {
    const product = await Product.findById(productId).populate({
      path: 'categoryId',
      populate: {
        path: 'districtId',
        populate: {
          path: 'stateId',
          populate: {
            path: 'countryId'
          }
        }
      }
    }); 

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllProductsByCategoryAndDistrict = async (req, res) => {
  const { stateName, countryName, districtName, categoryName } = req.query;

  try {
    if (districtName && categoryName) {
      

      const district = await District.findOne({ name: districtName });
      

      if (!district) {
        return res.status(404).json({ message: 'District not found' });
      }

      const category = await Category.findOne({ name: categoryName, districtId: district._id });
      

      if (!category) {
        return res.status(404).json({ message: 'Category not found in the specified district' });
      }

      const products = await Product.find({ categoryId: category._id });
      res.status(200).json({ products });

    } else if (districtName) {
      

      const state = await State.findOne({ name: stateName });
      

      if (!state) {
        return res.status(404).json({ message: 'State not found' });
      }

      const district = await District.findOne({ name: districtName, stateId:state._id });
      

      if (!district) {
        return res.status(404).json({ message: 'District not found' });
      }

      const categories = await Category.find({ districtId: district._id });
      const categoryIds = categories.map(cat => cat._id);
      const products = await Product.find({ categoryId: { $in: categoryIds } });

      res.status(200).json({ products });

    } else if (categoryName) {
      

      const state = await State.findOne({ name: stateName });
      

      if (!state) {
        return res.status(404).json({ message: 'State not found' });
      }

      const districts = await District.find({ stateId: state._id});

      const categoryFilter = categoryName ? { name: categoryName } : {};
      const categories = await Category.find({ ...categoryFilter, districtId: { $in: districts.map(d => new ObjectId(d._id)) } });

      const categoryIds = categories.map(c => c._id);
      const products = await Product.find({ categoryId: { $in: categoryIds } });

      res.status(200).json({ products });
    }
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

export const getNearestProducts = async (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ message: 'Latitude and Longitude are required' });
  }

  try {
    // Fetch all products with location data
    const validProducts = await Product.find({
      'location.lat': { $exists: true },
      'location.long': { $exists: true }
    });

    // Calculate distance and sort products based on distance
    validProducts.forEach(product => {
      const dist = Math.sqrt((product.location.lat - parseFloat(latitude)) ** 2 + (product.location.long - parseFloat(longitude)) ** 2);
      product.distance = dist; // Adding distance property to each product
    });

    validProducts.sort((a, b) => a.distance - b.distance);

    // Return the nearest two products
    res.json(validProducts.slice(0, 2));
  } catch (error) {
    console.error('Error fetching nearby products:', error);
    res.status(500).json({ message: 'Error fetching nearby products', error });
  }
};

export const getDistrictByState=async (req,res)=>{
  const {stateName,countryName}=req.query;
  try{
    const country=await Country.findOne({name:countryName});
    if (!country) {
      return res.status(404).json({ message: 'Country not found' });
    }
    const state=await State.findOne({name:stateName})
    if (!state) {
      return res.status(404).json({ message: 'State not found' });
    }
    const districts = await District.find({ stateId: state._id });
    if(!districts){
      return res.status(404).json({ message: 'Districts not found' });
    }
    
    res.status(200).json(districts);

  }
  catch(err){
    res.status(404).json({message:'error occured'})
  }
}

export const getCurrentLocationProducts=async(req,res)=>{
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ message: 'Latitude and Longitude are required' });
  }

  try {
    const validProducts = await Product.find({
      'location.lat': { $exists: true },
      'location.long': { $exists: true }
    });
    validProducts.forEach(product => {
      const dist = Math.sqrt((product.location.lat - parseFloat(latitude)) ** 2 + (product.location.long - parseFloat(longitude)) ** 2);
      product.distance = dist;
    });

    validProducts.sort((a, b) => a.distance - b.distance);
    res.json(validProducts.slice(0, 4));
  } catch (error) {
    console.error('Error fetching nearby products:', error);
    res.status(500).json({ message: 'Error fetching nearby products', error });
  }

}


